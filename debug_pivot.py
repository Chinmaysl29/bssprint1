
import sqlite3
import pandas as pd
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from src.analytics.cagr import calculate_multiyear_sales_cagr, pivot_multiyear_cagr

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')

# Let's calculate multiyear sales cagr only for our analysis companies!
def calculate_multiyear_sales_cagr_for_analysis():
    conn = sqlite3.connect(db_path)
    analysis_companies = pd.read_sql("SELECT DISTINCT company_id FROM analysis", conn)
    analysis_companies_list = analysis_companies['company_id'].tolist()
    
    placeholders = ','.join('?' for _ in analysis_companies_list)
    query = f"""
        SELECT 
            p.company_id,
            c.company_name,
            p.year,
            p.sales
        FROM profitandloss p
        JOIN companies c ON p.company_id = c.id
        WHERE p.company_id IN ({placeholders}) AND p.year != 'TTM'
        ORDER BY p.company_id, p.year
    """
    df_pl = pd.read_sql(query, conn, params=analysis_companies_list)
    conn.close()
    
    from src.analytics.cagr import calculate_cagr_for_metric
    
    all_cagr = []
    period_list = [3,5,10]
    for period in period_list:
        period_df = calculate_cagr_for_metric(df_pl, 'sales', period_years=period, company_id_col='company_id', year_col='year', company_name_col='company_name')
        period_df['period_name'] = f'{period}-Year'
        all_cagr.append(period_df)
    
    sales_cagr = pd.concat(all_cagr, ignore_index=True)
    print("=== sales_cagr ===")
    print(sales_cagr.to_string())
    print("\n=== sales_cagr.columns ===")
    print(sales_cagr.columns.tolist())
    
    return sales_cagr

sales_cagr = calculate_multiyear_sales_cagr_for_analysis()
sales_pivot = pivot_multiyear_cagr(sales_cagr, 'sales')

print("\n=== sales_pivot ===")
print(sales_pivot.to_string())

print("\n=== sales_pivot.columns ===")
print(sales_pivot.columns.tolist())

# Now let's try to do melt!
melted = sales_pivot.melt(
    id_vars=['company_id'],
    value_vars=['3-Year_cagr_pct', '5-Year_cagr_pct', '10-Year_cagr_pct'],
    var_name='period',
    value_name='computed'
)
print("\n=== melted ===")
print(melted.to_string())
