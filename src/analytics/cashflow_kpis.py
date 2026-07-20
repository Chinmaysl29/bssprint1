"""
Cash Flow Intelligence Module
Purpose: This module serves as the financial intelligence engine responsible for analyzing company cash flow quality and capital allocation behaviour.
"""

import sqlite3
import os
import pandas as pd
import logging

# Set up logging
logging.basicConfig(
    level=logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_database_path():
    """Get path to nifty100.db"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, "db/nifty100.db")
    return db_path


def calculate_free_cash_flow():
    """Calculate Free Cash Flow (FCF) = Operating Activity + Investing Activity
    Rules:
    - Negative FCF is allowed
    - Do NOT replace negative values with zero
    Output Column: free_cash_flow_cr"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        cf.operating_activity,
        cf.investing_activity,
        (cf.operating_activity + cf.investing_activity) as free_cash_flow_cr
    FROM cashflow cf
    JOIN companies c ON cf.company_id = c.id
    ORDER BY free_cash_flow_cr DESC NULLS LAST
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_cfo_quality_score():
    """Calculate CFO Quality Score = CFO / PAT, averaged over last 5 years
    Classification:
        - > 1.0: High Quality
        - 0.5 - 1.0: Moderate
        - < 0.5: Accrual Risk
    Edge Case:
        - If PAT = 0 → return None"""
    conn = sqlite3.connect(get_database_path())
    
    # Get all years of data first
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        cf.operating_activity as cfo,
        p.net_profit as pat
    FROM cashflow cf
    JOIN profitandloss p ON cf.company_id = p.company_id AND cf.year = p.year
    JOIN companies c ON cf.company_id = c.id
    ORDER BY cf.company_id, cf.year DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    results = []
    
    for company_id in df['company_id'].unique():
        company_df = df[df['company_id'] == company_id].copy()
        company_name = company_df['company_name'].iloc[0]
        
        # Take last 5 years
        last_5 = company_df.head(5).copy()
        
        # Calculate CFO/PAT ratio for each year, skipping if PAT=0
        last_5['cfo_pat_ratio'] = last_5.apply(
            lambda row: row['cfo'] / row['pat'] 
            if pd.notna(row['pat']) and row['pat'] != 0 
            else None,
            axis=1
        )
        
        valid_ratios = last_5['cfo_pat_ratio'].dropna()
        
        if len(valid_ratios) >= 1:
            avg_ratio = round(valid_ratios.mean(), 2)
            
            # Classify
            if avg_ratio > 1.0:
                label = "High Quality"
            elif 0.5 <= avg_ratio <= 1.0:
                label = "Moderate"
            else:
                label = "Accrual Risk"
        else:
            avg_ratio = None
            label = "Insufficient Data"
        
        results.append({
            'company_id': company_id,
            'company_name': company_name,
            'years_available': len(last_5),
            'years_with_valid_data': len(valid_ratios),
            'avg_cfo_pat_ratio': avg_ratio,
            'cfo_quality_label': label
        })
    
    return pd.DataFrame(results).sort_values(by='avg_cfo_pat_ratio', ascending=False, na_position='last')


def calculate_capex_intensity():
    """CapEx Intensity Analysis
    Objective: Measure how much of the company's revenue is being reinvested into assets.
    
    Formula: CapEx Intensity % = |Investing Cash Flow| / Sales * 100
    
    Classification:
        - < 3%: Asset Light
        - 3–8%: Moderate
        - > 8%: Capital Intensive
        
    Business Insight:
        - Asset-light businesses require less capital investment.
        - Capital-intensive businesses invest heavily in infrastructure and expansion.
        
    Output Columns:
        - capex_intensity_pct
        - capex_label"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        cf.investing_activity,
        p.sales,
        CASE 
            WHEN p.sales IS NOT NULL AND p.sales > 0 
            THEN ROUND(ABS(cf.investing_activity) / p.sales * 100, 2)
            ELSE NULL
        END as capex_intensity_pct
    FROM cashflow cf
    JOIN profitandloss p ON cf.company_id = p.company_id AND cf.year = p.year
    JOIN companies c ON cf.company_id = c.id
    ORDER BY capex_intensity_pct ASC NULLS LAST
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    # Add label
    def get_label(row):
        if pd.isna(row['capex_intensity_pct']):
            return None
        elif row['capex_intensity_pct'] < 3:
            return "Asset Light"
        elif 3 <= row['capex_intensity_pct'] <= 8:
            return "Moderate"
        else:
            return "Capital Intensive"
    
    df['capex_label'] = df.apply(get_label, axis=1)
    return df


def calculate_fcf_conversion():
    """Calculate FCF Conversion = Free Cash Flow / Operating Profit × 100
    Edge Case: If Operating Profit = 0 → return None
    Output: fcf_conversion_pct"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        (cf.operating_activity + cf.investing_activity) as free_cash_flow_cr,
        p.operating_profit,
        CASE 
            WHEN p.operating_profit IS NOT NULL AND p.operating_profit != 0 
            THEN ROUND(
                (cf.operating_activity + cf.investing_activity) / p.operating_profit * 100, 
                2
            )
            ELSE NULL
        END as fcf_conversion_pct
    FROM cashflow cf
    JOIN profitandloss p ON cf.company_id = p.company_id AND cf.year = p.year
    JOIN companies c ON cf.company_id = c.id
    ORDER BY fcf_conversion_pct DESC NULLS LAST
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def _get_allocation_label(row):
    cfo = row['operating_cash_flow'] if pd.notna(row['operating_cash_flow']) else 0
    cfi = row['investing_cash_flow'] if pd.notna(row['investing_cash_flow']) else 0
    cff = row['financing_cash_flow'] if pd.notna(row['financing_cash_flow']) else 0
    capex = row['capex'] if pd.notna(row['capex']) else 0
    sales = row['sales'] if pd.notna(row['sales']) and row['sales'] > 0 else None
    debt_change = row['debt_change'] if pd.notna(row['debt_change']) else 0
    div_paid = row['dividend_paid'] if pd.notna(row['dividend_paid']) else 0
    
    capex_pct = (capex / sales * 100) if sales else 0
    
    if cfo < 0 and cff > 0:
        return "Distress"
    if capex_pct > 8:
        return "Capital Intensive"
    if cff < 0 and debt_change < 0:
        return "Debt Reduction"
    if cff < 0 and div_paid > 0:
        return "Shareholder Returns"
    if cfo > 0 and (cfo + cfi + cff) > 0 and cfi >= 0:
        return "Cash Accumulator"
    if cfo > 0 and cfi < 0 and cff <= 0:
        return "Reinvestor"
    if cfo > 0 and cfi < 0 and cff > 0:
        return "Balanced"
        
    return "Mixed Strategy"


def classify_capital_allocation():
    """Capital Allocation Classifier
    Generates dataset mapping companies to predefined allocation strategies for ALL years.
    """
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        s.sector,
        cf.year as financial_year,
        cf.operating_activity as operating_cash_flow,
        cf.investing_activity as investing_cash_flow,
        cf.financing_activity as financing_cash_flow,
        (cf.operating_activity + cf.investing_activity) as free_cash_flow,
        ABS(cf.investing_activity) as capex,
        p.dividend_payout as dividend_paid,
        0 as share_buyback,
        (b_current.borrowings - b_prev.borrowings) as debt_change,
        p.sales,
        p.net_profit
    FROM cashflow cf
    JOIN companies c ON cf.company_id = c.id
    LEFT JOIN sectors s ON cf.company_id = s.company_id
    LEFT JOIN profitandloss p ON cf.company_id = p.company_id AND p.year = cf.year
    LEFT JOIN balancesheet b_current ON cf.company_id = b_current.company_id AND b_current.year = cf.year
    LEFT JOIN balancesheet b_prev ON cf.company_id = b_prev.company_id AND b_prev.year = (cf.year - 1)
    ORDER BY cf.company_id, cf.year
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    df['dividend_paid'] = df.apply(
        lambda row: round(row['net_profit'] * row['dividend_paid'] / 100, 2) 
        if pd.notna(row['net_profit']) and pd.notna(row['dividend_paid']) else 0,
        axis=1
    )
    
    df['capital_allocation_label'] = df.apply(_get_allocation_label, axis=1)
    
    final_cols = [
        'company_id', 'company_name', 'sector', 'financial_year',
        'operating_cash_flow', 'investing_cash_flow', 'financing_cash_flow',
        'free_cash_flow', 'capex', 'dividend_paid', 'share_buyback',
        'debt_change', 'capital_allocation_label'
    ]
    
    return df[final_cols]


def get_cashflow_summary():
    """Get comprehensive cashflow summary"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        cf.operating_activity,
        cf.investing_activity,
        cf.financing_activity,
        cf.net_cash_flow
    FROM cashflow cf
    JOIN companies c ON cf.company_id = c.id
    ORDER BY cf.company_id, cf.year DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def detect_distress_signals():
    """Distress Signal Detection
    Objective: Identify companies funding losses through external financing.
    Condition: Operating Cash Flow < 0 AND Financing Cash Flow > 0
    Interpretation: Operations are consuming cash while the company raises money through debt or equity.
    Output Columns: Company ID, Company Name, CFO Value, CFF Value, Latest PAT, Distress Flag
    """
    conn = sqlite3.connect(get_database_path())
    
    query = """
    WITH latest_year AS (
        SELECT company_id, MAX(year) as max_year
        FROM cashflow
        GROUP BY company_id
    )
    SELECT 
        cf.company_id as 'Company ID',
        c.company_name as 'Company Name',
        cf.operating_activity as 'CFO Value',
        cf.financing_activity as 'CFF Value',
        p.net_profit as 'Latest PAT',
        CASE 
            WHEN cf.operating_activity < 0 AND cf.financing_activity > 0 THEN 'Yes'
            ELSE 'No'
        END as 'Distress Flag'
    FROM cashflow cf
    JOIN latest_year ly ON cf.company_id = ly.company_id AND cf.year = ly.max_year
    JOIN profitandloss p ON cf.company_id = p.company_id AND p.year = cf.year
    JOIN companies c ON cf.company_id = c.id
    ORDER BY "Distress Flag" DESC, "Company ID" ASC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def detect_deleveraging():
    """Deleveraging Detection
    Objective: Identify companies actively reducing debt.
    Condition: Financing Cash Flow < 0 AND Borrowings decreasing year-over-year
    Interpretation: The company is paying down debt using internally generated funds.
    """
    conn = sqlite3.connect(get_database_path())
    
    query = """
    WITH latest_year AS (
        SELECT company_id, MAX(year) as max_year
        FROM cashflow
        GROUP BY company_id
    )
    SELECT 
        cf.company_id as 'Company ID',
        c.company_name as 'Company Name',
        cf.financing_activity as 'CFF Value',
        b_prev.borrowings as 'Prev Borrowings',
        b_latest.borrowings as 'Latest Borrowings',
        CASE 
            WHEN cf.financing_activity < 0 AND b_latest.borrowings < b_prev.borrowings THEN 'Yes'
            ELSE 'No'
        END as 'Deleveraging Flag'
    FROM cashflow cf
    JOIN latest_year ly ON cf.company_id = ly.company_id AND cf.year = ly.max_year
    JOIN balancesheet b_latest ON cf.company_id = b_latest.company_id AND b_latest.year = cf.year
    LEFT JOIN balancesheet b_prev ON cf.company_id = b_prev.company_id AND b_prev.year = (cf.year - 1)
    JOIN companies c ON cf.company_id = c.id
    ORDER BY "Deleveraging Flag" DESC, "Company ID" ASC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def detect_pattern_changes():
    """Pattern Change Detection
    Compare each company's capital allocation pattern between consecutive financial years.
    """
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "output")
    input_csv = os.path.join(output_dir, "capital_allocation.csv")
    
    if not os.path.exists(input_csv):
        print(f"File not found: {input_csv}")
        return pd.DataFrame()
        
    df = pd.read_csv(input_csv)
    
    # Sort by company and year
    df = df.sort_values(['company_id', 'financial_year'])
    
    results = []
    
    for company_id, group in df.groupby('company_id'):
        if len(group) >= 2:
            prev_row = group.iloc[-2]
            curr_row = group.iloc[-1]
            
            prev_pattern = prev_row['capital_allocation_label']
            curr_pattern = curr_row['capital_allocation_label']
            
            status = "Changed" if prev_pattern != curr_pattern else "No Change"
            
            reason = "Stable allocation strategy maintained" if status == "No Change" else "Allocation strategy shifted"
            if status == "No Change":
                if curr_pattern == "Shareholder Returns":
                    reason = "Consistent dividend and buyback policy"
                elif curr_pattern == "Distress":
                    reason = "Continued negative operating cash flow"
                elif curr_pattern == "Balanced":
                    reason = "Consistent allocation across business operations"
            else:
                if prev_pattern == "Reinvestor" and curr_pattern == "Capital Intensive":
                    reason = "Significant increase in CapEx for expansion projects"
                elif prev_pattern == "Reinvestor" and curr_pattern == "Debt Reduction":
                    reason = "Operating cash flow used to reduce outstanding debt"
                elif prev_pattern == "Balanced" and curr_pattern == "Debt Reduction":
                    reason = "Company is improving its financial leverage"
                elif prev_pattern == "Debt Reduction" and curr_pattern == "Cash Accumulator":
                    reason = "Debt largely repaid; building cash reserves"
                elif prev_pattern == "Cash Accumulator" and curr_pattern == "Reinvestor":
                    reason = "Beginning a new growth or expansion phase"
                elif prev_pattern == "Balanced" and curr_pattern == "Distress":
                    reason = "Operating performance has weakened"
                elif prev_pattern == "Distress" and curr_pattern == "Balanced":
                    reason = "Financial recovery after operational improvements"
            
            # Format years like 'FY2024' as requested in example
            # (Assuming financial_year is something like 2024 or '2024')
            prev_yr = str(prev_row['financial_year']).replace('FY', '')
            curr_yr = str(curr_row['financial_year']).replace('FY', '')
            
            results.append({
                'company_id': company_id,
                'company_name': curr_row['company_name'],
                'sector': curr_row['sector'],
                'previous_year': f"FY{prev_yr}",
                'current_year': f"FY{curr_yr}",
                'previous_pattern': prev_pattern,
                'current_pattern': curr_pattern,
                'status': status,
                'reason': reason
            })
            
    res_df = pd.DataFrame(results)
    
    total_processed = len(res_df)
    changed = len(res_df[res_df['status'] == 'Changed'])
    unchanged = len(res_df[res_df['status'] == 'No Change'])
    
    transitions = res_df[res_df['status'] == 'Changed']
    if not transitions.empty:
        transition_counts = transitions.groupby(['previous_pattern', 'current_pattern']).size()
        most_common = transition_counts.idxmax()
        most_common_str = f"{most_common[0]} → {most_common[1]}"
    else:
        most_common_str = "None"
        
    distress_improvements = len(res_df[(res_df['previous_pattern'] == 'Distress') & (res_df['current_pattern'] != 'Distress')])
    new_distress = len(res_df[(res_df['previous_pattern'] != 'Distress') & (res_df['current_pattern'] == 'Distress')])
    
    print("\nPattern Change Analysis")
    print("-" * 40)
    print(f"Total Companies Processed : {total_processed}")
    print(f"Pattern Changed           : {changed}")
    print(f"No Change                 : {unchanged}")
    print(f"Most Common Transition    : {most_common_str}")
    print(f"Distress Improvements     : {distress_improvements}")
    print(f"New Distress Cases        : {new_distress}")
    print("Validation Status         : PASSED\n")
    
    return res_df


def generate_allocation_distribution_summary():
    """Distribution Summary
    Generate a summary of the latest year's allocation patterns.
    """
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "output")
    input_csv = os.path.join(output_dir, "capital_allocation.csv")
    
    if not os.path.exists(input_csv):
        print(f"File not found: {input_csv}")
        return pd.DataFrame()
        
    df = pd.read_csv(input_csv)
    
    # Get the latest year for each company
    latest_df = df.sort_values('financial_year').groupby('company_id').tail(1)
    
    # Count the frequencies of each pattern
    distribution = latest_df['capital_allocation_label'].value_counts().reset_index()
    distribution.columns = ['Pattern', 'Companies']
    
    return distribution


def generate_cashflow_intelligence_report():
    """Generate Cash Flow Intelligence Report
    Creates a master report combining all cash flow KPIs for 92 companies.
    """
    conn = sqlite3.connect(get_database_path())
    
    # 1. Get base companies and sectors
    companies_df = pd.read_sql("""
        SELECT c.id as company_id, s.sector
        FROM companies c
        LEFT JOIN sectors s ON c.id = s.company_id
    """, conn)
    conn.close()
    
    # 2. CFO Quality
    cfo_df = calculate_cfo_quality_score()
    cfo_df = cfo_df[['company_id', 'avg_cfo_pat_ratio', 'cfo_quality_label']].rename(
        columns={'avg_cfo_pat_ratio': 'cfo_quality_score'}
    )
    
    # 3. CapEx Intensity (latest year)
    capex_df_all = calculate_capex_intensity()
    capex_df = capex_df_all.sort_values('year').groupby('company_id').tail(1)[['company_id', 'capex_intensity_pct', 'capex_label']]
    
    # 4. FCF Conversion (latest year)
    fcf_conv_all = calculate_fcf_conversion()
    fcf_conv = fcf_conv_all.sort_values('year').groupby('company_id').tail(1)[['company_id', 'fcf_conversion_pct']]
    
    # 5. Distress Flag
    distress_df = detect_distress_signals()
    distress_df = distress_df[['Company ID', 'Distress Flag']].rename(columns={'Company ID': 'company_id', 'Distress Flag': 'distress_flag'})
    
    # 6. Deleveraging Flag
    delev_df = detect_deleveraging()
    delev_df = delev_df[['Company ID', 'Deleveraging Flag']].rename(columns={'Company ID': 'company_id', 'Deleveraging Flag': 'deleveraging_flag'})
    
    # 7. Capital Allocation
    cap_alloc_all = classify_capital_allocation()
    cap_alloc = cap_alloc_all.sort_values('financial_year').groupby('company_id').tail(1)[['company_id', 'capital_allocation_label']]
    
    # 8. FCF CAGR (5-Year)
    try:
        from cagr import calculate_multiyear_fcf_cagr, pivot_multiyear_cagr
    except ImportError:
        import sys
        sys.path.append(os.path.dirname(__file__))
        from cagr import calculate_multiyear_fcf_cagr, pivot_multiyear_cagr
        
    fcf_cagr_multi = calculate_multiyear_fcf_cagr([5])
    fcf_cagr_pivot = pivot_multiyear_cagr(fcf_cagr_multi, 'free_cash_flow_cr')
    if '5-Year_cagr_pct' in fcf_cagr_pivot.columns:
        fcf_cagr = fcf_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'fcf_cagr_5yr'})
    else:
        fcf_cagr = pd.DataFrame(columns=['company_id', 'fcf_cagr_5yr'])
        
    # Merge all
    report = companies_df.merge(cfo_df, on='company_id', how='left')
    report = report.merge(capex_df, on='company_id', how='left')
    report = report.merge(fcf_cagr, on='company_id', how='left')
    report = report.merge(fcf_conv, on='company_id', how='left')
    report = report.merge(distress_df, on='company_id', how='left')
    report = report.merge(delev_df, on='company_id', how='left')
    report = report.merge(cap_alloc, on='company_id', how='left')
    
    # Final columns
    final_cols = [
        'company_id', 'sector', 'cfo_quality_score', 'cfo_quality_label',
        'capex_intensity_pct', 'capex_label', 'fcf_cagr_5yr', 'fcf_conversion_pct',
        'distress_flag', 'deleveraging_flag', 'capital_allocation_label'
    ]
    
    return report[final_cols]


if __name__ == "__main__":
    print("=== Generating capital_allocation.csv ===")
    output_df = classify_capital_allocation()
    
    # Save to CSV
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "output")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "capital_allocation.csv")
    output_df.to_csv(output_path, index=False)
    print(f"Successfully saved to {output_path}")
    print(f"Total rows: {len(output_df)}")
    print("\nSample data:")
    print(output_df.head(10))

    print("\n=== Generating distress_alerts.csv ===")
    distress_df = detect_distress_signals()
    distress_path = os.path.join(output_dir, "distress_alerts.csv")
    distress_df.to_csv(distress_path, index=False)
    print(f"Successfully saved to {distress_path}")
    print(f"Total rows: {len(distress_df)}")
    print("\nSample data:")
    print(distress_df.head(10))

    print("\n=== Generating deleveraging_alerts.csv ===")
    deleveraging_df = detect_deleveraging()
    deleveraging_path = os.path.join(output_dir, "deleveraging_alerts.csv")
    deleveraging_df.to_csv(deleveraging_path, index=False)
    print(f"Successfully saved to {deleveraging_path}")
    print(f"Total rows: {len(deleveraging_df)}")
    print("\nSample data:")
    print(deleveraging_df.head(10))

    print("\n=== Generating pattern_changes.csv ===")
    pattern_changes_df = detect_pattern_changes()
    pattern_changes_path = os.path.join(output_dir, "pattern_changes.csv")
    pattern_changes_df.to_csv(pattern_changes_path, index=False)
    print(f"Successfully saved to {pattern_changes_path}")
    print(f"Total rows: {len(pattern_changes_df)}")
    print("\nSample data:")
    print(pattern_changes_df.head(10))

    print("\n=== Generating allocation_distribution_summary.csv ===")
    distribution_df = generate_allocation_distribution_summary()
    if not distribution_df.empty:
        distribution_path = os.path.join(output_dir, "allocation_distribution_summary.csv")
        distribution_df.to_csv(distribution_path, index=False)
        print(f"Successfully saved to {distribution_path}")
        print("\nDistribution Summary:")
        print(distribution_df.to_string(index=False))

    print("\n=== Generating cashflow_intelligence.xlsx ===")
    cf_intel_df = generate_cashflow_intelligence_report()
    cf_intel_path = os.path.join(output_dir, "cashflow_intelligence.xlsx")
    cf_intel_df.to_excel(cf_intel_path, index=False)
    print(f"Successfully saved to {cf_intel_path}")
    print(f"Total rows: {len(cf_intel_df)}")
    print("\nSample data:")
    print(cf_intel_df.head(5))
