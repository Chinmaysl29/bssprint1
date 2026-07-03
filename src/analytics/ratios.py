
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


def calculate_net_profit_margin():
    """Calculate Net Profit Margin = (Net Profit / Sales) * 100"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.sales,
        p.net_profit,
        CASE 
            WHEN p.sales > 0 THEN ROUND((p.net_profit / p.sales) * 100, 2)
            ELSE NULL
        END as net_profit_margin_percent
    FROM profitandloss p
    JOIN companies c ON p.company_id = c.id
    WHERE p.sales IS NOT NULL AND p.sales > 0
    ORDER BY net_profit_margin_percent DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_operating_margin():
    """Calculate Operating Margin = (Operating Profit / Sales) * 100 and cross-check with opm_percentage"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.sales,
        p.operating_profit,
        p.opm_percentage
    FROM profitandloss p
    JOIN companies c ON p.company_id = c.id
    WHERE p.sales IS NOT NULL AND p.sales > 0
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    # Calculate using formula
    df['calculated_operating_margin'] = df.apply(
        lambda row: round((row['operating_profit'] / row['sales']) * 100, 2) 
        if row['sales'] > 0 else None,
        axis=1
    )
    
    # Cross-check with opm_percentage
    for idx, row in df.iterrows():
        if pd.notna(row['opm_percentage']) and pd.notna(row['calculated_operating_margin']):
            difference = abs(row['calculated_operating_margin'] - row['opm_percentage'])
            if difference > 1:
                logger.warning(
                    f"OPM mismatch! Company: {row['company_name']} ({row['company_id']}), Year: {row['year']} | "
                    f"Calculated: {row['calculated_operating_margin']:.2f}%, Database: {row['opm_percentage']:.2f}% | "
                    f"Difference: {difference:.2f}%"
                )
    
    # Rename to operating_margin_percent for output
    df = df.rename(columns={'calculated_operating_margin': 'operating_margin_percent'})
    df = df.drop(columns=['opm_percentage'])
    
    # Sort descending
    df = df.sort_values(by='operating_margin_percent', ascending=False)
    
    return df


def calculate_roe():
    """Calculate Return on Equity (ROE) from companies table"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        id as company_id,
        company_name,
        roe_percentage as roe
    FROM companies
    WHERE roe_percentage IS NOT NULL
    ORDER BY roe_percentage DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_roce():
    """Calculate Return on Capital Employed (ROCE) from companies table"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        id as company_id,
        company_name,
        roce_percentage as roce
    FROM companies
    WHERE roce_percentage IS NOT NULL
    ORDER BY roce_percentage DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_roa():
    """Calculate Return on Assets (ROA) using Balancesheet and Profit and Loss"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        bs.total_assets,
        p.net_profit,
        CASE 
            WHEN bs.total_assets IS NOT NULL AND bs.total_assets > 0 
            THEN ROUND((p.net_profit / bs.total_assets) * 100, 2)
            ELSE NULL
        END as roa_percent
    FROM profitandloss p
    JOIN balancesheet bs ON p.company_id = bs.company_id AND p.year = bs.year
    JOIN companies c ON p.company_id = c.id
    WHERE bs.total_assets IS NOT NULL AND bs.total_assets > 0
    ORDER BY roa_percent DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_pat_to_equity_reserve():
    """Calculate PAT to Equity + Reserve Ratio = (PAT / (Equity + Reserve)) * 100. Returns None if Equity + Reserve <= 0"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.net_profit as pat,
        bs.equity_capital as equity,
        bs.reserves,
        CASE 
            WHEN (bs.equity_capital + bs.reserves) > 0 
            THEN ROUND((p.net_profit / (bs.equity_capital + bs.reserves)) * 100, 2)
            ELSE NULL
        END as pat_to_equity_reserve_percent
    FROM profitandloss p
    JOIN balancesheet bs ON p.company_id = bs.company_id AND p.year = bs.year
    JOIN companies c ON p.company_id = c.id
    ORDER BY pat_to_equity_reserve_percent DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_ebit_to_equity_reserve_borrowings():
    """Calculate EBIT to (Equity + Reserve + Borrowings) ratio = (EBIT / (Equity + Reserve + Borrowings)) * 100. 
    EBIT = Operating Profit + Other Income. For Financials sector, only calculate ratio - no benchmark comparison."""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        s.sector,
        (p.operating_profit + p.other_income) as ebit,
        bs.equity_capital as equity,
        bs.reserves,
        bs.borrowings,
        (bs.equity_capital + bs.reserves + bs.borrowings) as denominator,
        CASE 
            WHEN (bs.equity_capital + bs.reserves + bs.borrowings) > 0 
            THEN ROUND(((p.operating_profit + p.other_income) / (bs.equity_capital + bs.reserves + bs.borrowings)) * 100, 2)
            ELSE NULL
        END as ebit_to_eq_res_borr_percent
    FROM profitandloss p
    JOIN balancesheet bs ON p.company_id = bs.company_id AND p.year = bs.year
    JOIN companies c ON p.company_id = c.id
    JOIN sectors s ON p.company_id = s.company_id
    ORDER BY ebit_to_eq_res_borr_percent DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_pat_to_assets():
    """Calculate PAT to Assets ratio = (PAT / Assets) * 100. Returns None if Assets == 0"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.net_profit as pat,
        bs.total_assets as assets,
        CASE 
            WHEN bs.total_assets IS NOT NULL AND bs.total_assets > 0 
            THEN ROUND((p.net_profit / bs.total_assets) * 100, 2)
            ELSE NULL
        END as pat_to_assets_percent
    FROM profitandloss p
    JOIN balancesheet bs ON p.company_id = bs.company_id AND p.year = bs.year
    JOIN companies c ON p.company_id = c.id
    ORDER BY pat_to_assets_percent DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_debt_to_equity():
    """Calculate Debt-to-Equity ratio = Borrowings / (Equity Capital + Reserves)
    Rules:
    - If Borrowings == 0, return 0
    - If Equity + Reserves <= 0, return None"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        bs.company_id,
        c.company_name,
        bs.year,
        bs.equity_capital,
        bs.reserves,
        bs.borrowings,
        CASE 
            WHEN bs.borrowings = 0 THEN 0
            WHEN (bs.equity_capital + bs.reserves) > 0 
            THEN ROUND(bs.borrowings / (bs.equity_capital + bs.reserves), 2)
            ELSE NULL
        END as debt_to_equity_ratio
    FROM balancesheet bs
    JOIN companies c ON bs.company_id = c.id
    ORDER BY debt_to_equity_ratio ASC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_interest_coverage_ratio():
    """Calculate Interest Coverage Ratio = (Operating Profit + Other Income) / Interest
    Edge Case:
    - If Interest == 0, return None for ratio and 'Debt Free' as icr_label
    - Otherwise, 'Normal' as icr_label"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        (p.operating_profit + p.other_income) as ebit,
        p.interest,
        CASE 
            WHEN p.interest > 0 
            THEN ROUND((p.operating_profit + p.other_income) / p.interest, 2)
            ELSE NULL
        END as interest_coverage_ratio,
        CASE 
            WHEN p.interest = 0 
            THEN 'Debt Free'
            ELSE 'Normal'
        END as icr_label
    FROM profitandloss p
    JOIN companies c ON p.company_id = c.id
    ORDER BY interest_coverage_ratio DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_net_debt():
    """Calculate Net Debt = Borrowings - Investments
    Negative values are allowed, no extra checks required"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        bs.company_id,
        c.company_name,
        bs.year,
        bs.borrowings,
        bs.investments,
        (bs.borrowings - bs.investments) as net_debt
    FROM balancesheet bs
    JOIN companies c ON bs.company_id = c.id
    ORDER BY net_debt DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_asset_turnover():
    """Calculate Asset Turnover = Sales / Total Assets
    If Assets ==0 → return None"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.sales,
        bs.total_assets,
        CASE 
            WHEN bs.total_assets > 0 
            THEN ROUND(p.sales / bs.total_assets, 2)
            ELSE NULL
        END as asset_turnover
    FROM profitandloss p
    JOIN balancesheet bs ON p.company_id = bs.company_id AND p.year = bs.year
    JOIN companies c ON p.company_id = c.id
    ORDER BY asset_turnover DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def get_leverage_labels():
    """Get High Leverage Flag and Debt Free Label for each company and year
    Rules for High Leverage Flag:
    - High Leverage = True if:
        - Debt-to-Equity >5 AND Company is NOT Financials
    - Otherwise False"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        bs.company_id,
        c.company_name,
        bs.year,
        s.sector,
        bs.equity_capital,
        bs.reserves,
        bs.borrowings,
        CASE 
            WHEN bs.borrowings = 0 THEN 'Yes'
            ELSE 'No'
        END as debt_free_label,
        CASE 
            WHEN (bs.equity_capital + bs.reserves) > 0 
                 AND (bs.borrowings / (bs.equity_capital + bs.reserves)) > 5 
                 AND s.sector != 'Financials' THEN 'Yes'
            ELSE 'No'
        END as high_leverage_flag
    FROM balancesheet bs
    JOIN companies c ON bs.company_id = c.id
    JOIN sectors s ON bs.company_id = s.company_id
    ORDER BY bs.company_id, bs.year DESC
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def cross_check_roce(clear_log_first=True):
    """
    Cross Check Calculated ROCE vs Source ROCE (companies.roce_percentage)
    Rules:
        - If absolute difference >5%, log to ratio_edge_cases.log
        - Categorize:
            - DATA_SOURCE_ISSUE: Scale mismatch (source*100 or similar matches calculated)
            - FORMULA_DIFFERENCE: Source is constant across all years for this company
            - VERSION_DIFFERENCE: All other differences
        - ROCE = EBIT / (Equity + Reserves + Borrowings)
        - EBIT = Operating Profit + Other Income
    """
    from .edge_case_logger import log_edge_case, clear_log

    if clear_log_first:
        clear_log()

    conn = sqlite3.connect(get_database_path())

    query = """
    SELECT 
        c.id as company_id,
        c.company_name,
        p.year,
        c.roce_percentage as source_roce,
        (p.operating_profit + p.other_income) as ebit,
        bs.equity_capital as equity,
        bs.reserves,
        bs.borrowings,
        (bs.equity_capital + bs.reserves + bs.borrowings) as capital_employed
    FROM companies c
    JOIN profitandloss p ON c.id = p.company_id
    JOIN balancesheet bs ON c.id = bs.company_id AND p.year = bs.year
    ORDER BY c.id, p.year DESC
    """

    df = pd.read_sql(query, conn)
    conn.close()

    # Calculate ROCE
    df['calculated_roce'] = df.apply(
        lambda row: round((row['ebit'] / row['capital_employed']) * 100, 2) 
        if pd.notna(row['ebit']) and pd.notna(row['capital_employed']) and row['capital_employed'] > 0 
        else None,
        axis=1
    )

    # For each company, check if source is constant
    company_constant_source = {}
    for company_id in df['company_id'].unique():
        company_rows = df[df['company_id'] == company_id]
        source_values = company_rows['source_roce'].dropna().unique()
        company_constant_source[company_id] = len(source_values) == 1

    # Calculate difference and log edge cases
    logged_count = 0
    for idx, row in df.iterrows():
        if pd.notna(row['calculated_roce']) and pd.notna(row['source_roce']):
            calculated = row['calculated_roce']
            source = row['source_roce']
            difference = abs(calculated - source)
            
            # Check for scale mismatch (e.g., source is 0.52 vs 52)
            scale_mismatch = False
            for scale in [100, 10, 1/10, 1/100]:
                scaled_source = source * scale
                if scaled_source != 0:
                    relative_diff = abs(calculated - scaled_source) / abs(scaled_source)
                    if relative_diff < 0.5:  # within 50% of scaled source
                        scale_mismatch = True
                        break
            
            if difference > 5:
                if scale_mismatch:
                    category = 'DATA_SOURCE_ISSUE'
                    explanation = 'Source scale mismatch'
                elif company_constant_source[row['company_id']]:
                    category = 'FORMULA_DIFFERENCE'
                    explanation = 'Different calculation method (constant source value across years)'
                else:
                    category = 'VERSION_DIFFERENCE'
                    explanation = f"Calculated ROCE ({calculated:.2f}%) differs from source ({source:.2f}%) by {difference:.2f}%"
                
                log_edge_case(
                    company_id=row['company_id'],
                    year=row['year'],
                    ratio_name='ROCE',
                    calculated_value=calculated,
                    source_value=source,
                    difference=difference,
                    category=category,
                    explanation=explanation
                )
                logged_count +=1

    print(f"ROCE cross-check complete! Logged {logged_count} ROCE edge cases to ratio_edge_cases.log")
    return df


def cross_check_roe(clear_log_first=False):
    """
    Cross Check Calculated ROE vs Source ROE (companies.roe_percentage)
    Rules:
        - If absolute difference >5%, log to ratio_edge_cases.log
        - Categorize:
            - DATA_SOURCE_ISSUE: Scale mismatch (source*100 or similar matches calculated)
            - FORMULA_DIFFERENCE: Source is constant across all years for this company
            - VERSION_DIFFERENCE: All other differences
        - ROE = Net Profit / (Equity + Reserves) * 100
    """
    from .edge_case_logger import log_edge_case

    conn = sqlite3.connect(get_database_path())

    query = """
    SELECT 
        c.id as company_id,
        c.company_name,
        p.year,
        c.roe_percentage as source_roe,
        p.net_profit,
        bs.equity_capital as equity,
        bs.reserves,
        (bs.equity_capital + bs.reserves) as equity_reserves
    FROM companies c
    JOIN profitandloss p ON c.id = p.company_id
    JOIN balancesheet bs ON c.id = bs.company_id AND p.year = bs.year
    ORDER BY c.id, p.year DESC
    """

    df = pd.read_sql(query, conn)
    conn.close()

    # Calculate ROE
    df['calculated_roe'] = df.apply(
        lambda row: round((row['net_profit'] / row['equity_reserves']) * 100, 2) 
        if pd.notna(row['net_profit']) and pd.notna(row['equity_reserves']) and row['equity_reserves'] > 0 
        else None,
        axis=1
    )

    # For each company, check if source is constant
    company_constant_source = {}
    for company_id in df['company_id'].unique():
        company_rows = df[df['company_id'] == company_id]
        source_values = company_rows['source_roe'].dropna().unique()
        company_constant_source[company_id] = len(source_values) == 1

    # Calculate difference and log edge cases
    logged_count = 0
    for idx, row in df.iterrows():
        if pd.notna(row['calculated_roe']) and pd.notna(row['source_roe']):
            calculated = row['calculated_roe']
            source = row['source_roe']
            difference = abs(calculated - source)
            
            # Check for scale mismatch (e.g., source is 0.52 vs 52)
            scale_mismatch = False
            for scale in [100, 10, 1/10, 1/100]:
                scaled_source = source * scale
                if scaled_source != 0:
                    relative_diff = abs(calculated - scaled_source) / abs(scaled_source)
                    if relative_diff < 0.5:  # within 50% of scaled source
                        scale_mismatch = True
                        break
            
            if difference > 5:
                if scale_mismatch:
                    category = 'DATA_SOURCE_ISSUE'
                    explanation = 'Source scale mismatch'
                elif company_constant_source[row['company_id']]:
                    category = 'FORMULA_DIFFERENCE'
                    explanation = 'Different calculation method (constant source value across years)'
                else:
                    category = 'VERSION_DIFFERENCE'
                    explanation = f"Calculated ROE ({calculated:.2f}%) differs from source ({source:.2f}%) by {difference:.2f}%"
                
                log_edge_case(
                    company_id=row['company_id'],
                    year=row['year'],
                    ratio_name='ROE',
                    calculated_value=calculated,
                    source_value=source,
                    difference=difference,
                    category=category,
                    explanation=explanation
                )
                logged_count +=1

    print(f"ROE cross-check complete! Logged {logged_count} ROE edge cases to ratio_edge_cases.log")
    return df


if __name__ == "__main__":
    print("=== Net Profit Margin ===")
    npm_df = calculate_net_profit_margin()
    print(npm_df.head(10))
    
    print("\n=== Operating Margin ===")
    om_df = calculate_operating_margin()
    print(om_df.head(10))
    
    print("\n=== Top 10 ROE Companies ===")
    roe_df = calculate_roe()
    print(roe_df.head(10))
    
    print("\n=== Top 10 ROCE Companies ===")
    roce_df = calculate_roce()
    print(roce_df.head(10))
    
    print("\n=== Top 10 ROA Companies ===")
    roa_df = calculate_roa()
    print(roa_df.head(10))
    
    print("\n=== Top 10 PAT to Equity + Reserve Ratios ===")
    pat_eq_res_df = calculate_pat_to_equity_reserve()
    print(pat_eq_res_df.head(10))
    
    print("\n=== Top 10 EBIT to Equity + Reserve + Borrowings Ratios ===")
    ebit_eq_res_borr_df = calculate_ebit_to_equity_reserve_borrowings()
    print(ebit_eq_res_borr_df.head(10))
    
    print("\n=== Financials Sector Companies (Only Calculated, No Benchmark) ===")
    financials_df = ebit_eq_res_borr_df[ebit_eq_res_borr_df['sector'] == 'Financials']
    print(financials_df.head(10))
    
    print("\n=== Top 10 PAT to Assets Ratios ===")
    pat_to_assets_df = calculate_pat_to_assets()
    print(pat_to_assets_df.head(10))
    
    print("\n=== Debt-to-Equity Ratios (Lowest First) ===")
    dte_df = calculate_debt_to_equity()
    print(dte_df.head(10))
    
    print("\n=== Interest Coverage Ratios (Highest First) ===")
    icr_df = calculate_interest_coverage_ratio()
    print(icr_df.head(10))
    
    print("\n=== Net Debt (Highest First) ===")
    net_debt_df = calculate_net_debt()
    print(net_debt_df.head(10))
    
    print("\n=== Asset Turnover (Highest First) ===")
    asset_turnover_df = calculate_asset_turnover()
    print(asset_turnover_df.head(10))
    
    print("\n=== Leverage Labels ===")
    leverage_labels_df = get_leverage_labels()
    print(leverage_labels_df.head(20))
    
    print("\n=== ROCE Cross Check ===")
    roce_cross_check_df = cross_check_roce()
    print(roce_cross_check_df.head(20))
