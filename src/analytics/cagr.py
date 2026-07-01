import sqlite3
import os
import pandas as pd


def get_database_path():
    """Get path to nifty100.db"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, "db", "nifty100.db")
    return db_path


def get_analysis_cagr():
    """Get pre-existing CAGR data from the analysis table"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
        SELECT 
            a.id,
            a.company_id,
            c.company_name,
            a.compounded_sales_growth,
            a.compounded_profit_growth,
            a.stock_price_cagr,
            a.roe
        FROM analysis a
        JOIN companies c ON a.company_id = c.id
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def calculate_cagr(start_value, end_value, periods):
    """Calculate CAGR given start value, end value, and number of periods"""
    if (
        pd.isna(start_value) 
        or pd.isna(end_value) 
        or pd.isna(periods) 
        or start_value <= 0 
        or end_value <= 0 
        or periods <= 0
    ):
        return None
    try:
        return round(((end_value / start_value) ** (1 / periods)) - 1, 4)
    except (ZeroDivisionError, ValueError):
        return None


def calculate_cagr_for_metric(df, metric_col, period_years=None, company_id_col='company_id', year_col='year', company_name_col='company_name'):
    """Generic function to calculate CAGR for any metric
    
    Args:
        df: DataFrame containing company_id, year, and the metric
        metric_col: Name of column containing the metric to calculate CAGR for
        period_years: Number of years for CAGR (e.g., 3, 5, 10) - if None, uses all available data
        company_id_col: Name of company ID column
        year_col: Name of year column
        company_name_col: Name of company name column
        
    Returns:
        DataFrame with calculated CAGR and availability flag
    """
    cagr_list = []
    for company_id in df[company_id_col].unique():
        company_df = df[df[company_id_col] == company_id].copy()
        company_df = company_df.dropna(subset=[metric_col]).sort_values(year_col)
        
        if len(company_df) >= 2:
            company_name = company_df[company_name_col].iloc[0]
            cagr = None  # Initialize cagr
            
            if period_years:
                # Take the last N+1 periods (since we need N periods between them)
                if len(company_df) >= period_years + 1:
                    start_value = company_df[metric_col].iloc[-(period_years + 1)]
                    end_value = company_df[metric_col].iloc[-1]
                    periods = period_years
                    start_year = company_df[year_col].iloc[-(period_years + 1)]
                    end_year = company_df[year_col].iloc[-1]
                else:
                    # Case 6: Insufficient Years
                    start_value = None
                    end_value = None
                    periods = None
                    start_year = None
                    end_year = None
                    flag = 'INSUFFICIENT'
                    cagr = None
            else:
                # Use all available data
                start_value = company_df[metric_col].iloc[0]
                end_value = company_df[metric_col].iloc[-1]
                periods = len(company_df) - 1
                start_year = company_df[year_col].iloc[0]
                end_year = company_df[year_col].iloc[-1]
            
            if 'flag' not in locals():  # if flag not set yet (not Case 6)
                # Check other cases
                if start_value == 0:
                    # Case 5: Zero Base
                    flag = 'ZERO_BASE'
                    cagr = None
                elif start_value > 0 and end_value > 0:
                    # Case 1: Positive → Positive
                    flag = 'OK'
                    try:
                        cagr = round(((end_value / start_value) ** (1 / periods)) - 1, 4)
                    except:
                        cagr = None
                elif start_value > 0 and end_value < 0:
                    # Case 2: Positive → Negative
                    flag = 'DECLINE_TO_LOSS'
                    cagr = None
                elif start_value < 0 and end_value > 0:
                    # Case 3: Negative → Positive
                    flag = 'TURNAROUND'
                    cagr = None
                elif start_value < 0 and end_value < 0:
                    # Case 4: Negative → Negative
                    flag = 'BOTH_NEGATIVE'
                    cagr = None
                else:
                    flag = 'UNDEFINED'
                    cagr = None
            
            cagr_list.append({
                company_id_col: company_id,
                company_name_col: company_name,
                'start_year': start_year,
                'end_year': end_year,
                'periods': periods,
                'period_years': period_years,
                f'start_{metric_col}': start_value,
                f'end_{metric_col}': end_value,
                f'{metric_col}_cagr_pct': round(cagr * 100, 2) if cagr is not None else None,
                'flag': flag
            })
    
    return pd.DataFrame(cagr_list)


def calculate_multiyear_cagr_for_metric(metric_col, period_list=[3,5,10], company_id_col='company_id', year_col='year', company_name_col='company_name'):
    """Calculate CAGR for multiple periods (3,5,10 years)
    
    Args:
        metric_col: Name of metric column to calculate CAGR for (from profitandloss)
        period_list: List of years for CAGR (default [3,5,10])
        company_id_col: Name of company ID column
        year_col: Name of year column
        company_name_col: Name of company name column
        
    Returns:
        DataFrame with all requested period CAGRs
    """
    conn = sqlite3.connect(get_database_path())
    
    query = f"""
        SELECT 
            p.company_id,
            c.company_name,
            p.year,
            p.{metric_col}
        FROM profitandloss p
        JOIN companies c ON p.company_id = c.id
        ORDER BY p.company_id, p.year
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    all_cagr = []
    for period in period_list:
        period_df = calculate_cagr_for_metric(df, metric_col, period_years=period, 
                                              company_id_col=company_id_col, 
                                              year_col=year_col, 
                                              company_name_col=company_name_col)
        period_df['period_name'] = f'{period}-Year'
        all_cagr.append(period_df)
    
    return pd.concat(all_cagr, ignore_index=True)


def calculate_multiyear_sales_cagr(period_list=[3,5,10]):
    """Calculate 3/5/10-Year Sales CAGR
    
    Args:
        period_list: List of years for CAGR (default [3,5,10])
        
    Returns:
        DataFrame with 3/5/10-Year CAGRs and flags
    """
    return calculate_multiyear_cagr_for_metric('sales', period_list=period_list)


def calculate_multiyear_profit_cagr(period_list=[3,5,10]):
    """Calculate 3/5/10-Year Net Profit CAGR
    
    Args:
        period_list: List of years for CAGR (default [3,5,10])
        
    Returns:
        DataFrame with 3/5/10-Year CAGRs and flags
    """
    return calculate_multiyear_cagr_for_metric('net_profit', period_list=period_list)


def calculate_multiyear_eps_cagr(period_list=[3,5,10]):
    """Calculate 3/5/10-Year EPS CAGR
    
    Args:
        period_list: List of years for CAGR (default [3,5,10])
        
    Returns:
        DataFrame with 3/5/10-Year CAGRs and flags
    """
    return calculate_multiyear_cagr_for_metric('eps', period_list=period_list)


def pivot_multiyear_cagr(multiyear_df, metric_col):
    """Pivot multiyear CAGR DataFrame so each period is a separate column
    
    Args:
        multiyear_df: DataFrame from calculate_multiyear_cagr_for_metric
        metric_col: Name of the metric used in calculation
        
    Returns:
        Pivoted DataFrame with columns for 3/5/10-Year CAGR and flags
    """
    # Keep only necessary columns
    pivot_df = multiyear_df[[
        'company_id', 'company_name', 
        'period_name', 
        f'{metric_col}_cagr_pct', 
        'flag'
    ]].copy()
    
    # Pivot
    pivot_df = pivot_df.pivot_table(
        index=['company_id', 'company_name'],
        columns='period_name',
        values=[f'{metric_col}_cagr_pct', 'flag'],
        aggfunc='first'
    )
    
    # Flatten the column names to make them cleaner
    new_columns = []
    for (value_col, period_name) in pivot_df.columns:
        if value_col == f'{metric_col}_cagr_pct':
            new_columns.append(f'{period_name}_cagr_pct')
        elif value_col == 'flag':
            new_columns.append(f'{period_name}_flag')
        else:
            new_columns.append(value_col)
    
    pivot_df.columns = new_columns
    pivot_df = pivot_df.reset_index()
    
    return pivot_df


def calculate_sales_cagr():
    """Calculate sales CAGR using data from profitandloss (uses generic CAGR function)"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
        SELECT 
            p.company_id,
            c.company_name,
            p.year,
            p.sales
        FROM profitandloss p
        JOIN companies c ON p.company_id = c.id
        ORDER BY p.company_id, p.year
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return calculate_cagr_for_metric(df, 'sales')


def calculate_profit_cagr():
    """Calculate net profit CAGR using data from profitandloss (uses generic CAGR function)"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
        SELECT 
            p.company_id,
            c.company_name,
            p.year,
            p.net_profit
        FROM profitandloss p
        JOIN companies c ON p.company_id = c.id
        ORDER BY p.company_id, p.year
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return calculate_cagr_for_metric(df, 'net_profit')


if __name__ == "__main__":
    print("=== CAGR from Analysis Table ===")
    analysis_df = get_analysis_cagr()
    print(analysis_df.head())
    
    print("\n=== 3/5/10-Year Sales CAGR ===")
    sales_multiyear = calculate_multiyear_sales_cagr()
    print(sales_multiyear.head(15))
    
    print("\n=== 3/5/10-Year Net Profit CAGR ===")
    profit_multiyear = calculate_multiyear_profit_cagr()
    print(profit_multiyear.head(15))
    
    print("\n=== 3/5/10-Year EPS CAGR ===")
    eps_multiyear = calculate_multiyear_eps_cagr()
    print(eps_multiyear.head(15))
    
    print("\n=== Pivoted 3/5/10-Year Sales CAGR ===")
    sales_pivot = pivot_multiyear_cagr(sales_multiyear, 'sales')
    print(sales_pivot.head(10))
    
    print("\n=== Pivoted 3/5/10-Year Net Profit CAGR ===")
    profit_pivot = pivot_multiyear_cagr(profit_multiyear, 'net_profit')
    print(profit_pivot.head(10))
    
    print("\n=== Pivoted 3/5/10-Year EPS CAGR ===")
    eps_pivot = pivot_multiyear_cagr(eps_multiyear, 'eps')
    print(eps_pivot.head(10))
