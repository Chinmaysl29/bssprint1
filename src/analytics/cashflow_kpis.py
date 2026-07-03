
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
    """Calculate Capex Intensity = abs(Investing Activity) / Sales × 100
    Classification:
        - < 3%: Asset Light
        - 3–8%: Moderate
        - > 8%: Capital Intensive
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


def classify_capital_allocation():
    """Capital Allocation Classifier
    Determine signs of CFO, CFI, CFF, then classify
    Output Columns:
        cfo_sign, cfi_sign, cff_sign, pattern_label
    Note: Also includes CFO Quality info for "Shareholder Returns" classification"""
    conn = sqlite3.connect(get_database_path())
    
    # Get cashflow and CFO Quality Score - deduplicate each table first
    cf_query = """
    WITH cf_dedup AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) as rn
        FROM cashflow
    ),
    pl_dedup AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) as rn
        FROM profitandloss
    )
    SELECT 
        cf.company_id,
        c.company_name,
        cf.year,
        cf.operating_activity,
        cf.investing_activity,
        cf.financing_activity,
        p.net_profit as pat
    FROM cf_dedup cf
    JOIN pl_dedup p ON cf.company_id = p.company_id AND cf.year = p.year
    JOIN companies c ON cf.company_id = c.id
    WHERE cf.rn = 1 AND p.rn = 1
    ORDER BY cf.company_id, cf.year DESC
    """
    df = pd.read_sql(cf_query, conn)
    conn.close()
    
    # Calculate signs
    df['cfo_sign'] = df['operating_activity'].apply(lambda x: "+" if pd.notna(x) and x > 0 else "-" if pd.notna(x) and x < 0 else None)
    df['cfi_sign'] = df['investing_activity'].apply(lambda x: "+" if pd.notna(x) and x > 0 else "-" if pd.notna(x) and x < 0 else None)
    df['cff_sign'] = df['financing_activity'].apply(lambda x: "+" if pd.notna(x) and x > 0 else "-" if pd.notna(x) and x < 0 else None)
    
    # First, get company-level CFO Quality Score (avg CFO/PAT) to help classify Shareholder Returns
    # We'll use the same logic as calculate_cfo_quality_score, but per company
    cfo_quality_map = {}
    for company_id in df['company_id'].unique():
        company_df = df[df['company_id'] == company_id].copy()
        # Take last 5 years for company
        last_5 = company_df.head(5).copy()
        last_5['cfo_pat_ratio'] = last_5.apply(
            lambda row: row['operating_activity'] / row['pat'] 
            if pd.notna(row['pat']) and row['pat'] !=0 
            else None,
            axis=1
        )
        valid_ratios = last_5['cfo_pat_ratio'].dropna()
        if len(valid_ratios)>=1:
            avg_ratio = valid_ratios.mean()
            cfo_quality_map[company_id] = avg_ratio
        else:
            cfo_quality_map[company_id] = None
    
    # Apply classification
    def get_pattern(row):
        cfo = row['cfo_sign']
        cfi = row['cfi_sign']
        cff = row['cff_sign']
        
        if pd.isna(cfo) or pd.isna(cfi) or pd.isna(cff):
            return None
        
        # Check Shareholder Returns first: CFO +, CFI -, CFF - AND high CFO/PAT (avg >1.0)
        avg_cfo_pat = cfo_quality_map.get(row['company_id'])
        if cfo == "+" and cfi == "-" and cff == "-" and avg_cfo_pat is not None and avg_cfo_pat >1.0:
            return "Shareholder Returns"
        elif cfo == "+" and cfi == "-" and cff == "-":
            return "Reinvestor"
        elif cfo == "+" and cfi == "+" and cff == "-":
            return "Liquidating Assets"
        elif cfo == "-" and cfi == "+" and cff == "+":
            return "Distress Signal"
        elif cfo == "-" and cfi == "-" and cff == "+":
            return "Growth Funded by Debt"
        elif cfo == "+" and cfi == "+" and cff == "+":
            return "Cash Accumulator"
        elif cfo == "-" and cfi == "-" and cff == "-":
            return "Pre-Revenue"
        elif cfo == "+" and cfi == "-" and cff == "+":
            return "Mixed"
        else:
            return "Other"
    
    df['pattern_label'] = df.apply(get_pattern, axis=1)
    
    # Keep only relevant columns
    return df[[
        'company_id', 'company_name', 'year',
        'cfo_sign', 'cfi_sign', 'cff_sign', 'pattern_label'
    ]].copy()


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


if __name__ == "__main__":
    print("=== Generating capital_allocation.csv ===")
    cap_allocation_df = classify_capital_allocation()
    
    # Select only the required columns
    output_df = cap_allocation_df[[
        'company_id',
        'year',
        'cfo_sign',
        'cfi_sign',
        'cff_sign',
        'pattern_label'
    ]]
    
    # Save to CSV
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "output")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "capital_allocation.csv")
    output_df.to_csv(output_path, index=False)
    print(f"Successfully saved to {output_path}")
    print(f"Total rows: {len(output_df)}")
    print("\nSample data:")
    print(output_df.head(10))
