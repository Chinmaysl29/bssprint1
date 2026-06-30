
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
