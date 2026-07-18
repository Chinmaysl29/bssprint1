
import sqlite3
import pandas as pd
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from src.analytics.cagr import calculate_cagr_for_metric

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

# Let's get HDFCBANK and INFY data
df = pd.read_sql("""
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.sales,
        p.net_profit
    FROM profitandloss p
    JOIN companies c ON p.company_id = c.id
    WHERE p.company_id IN ('HDFCBANK','INFY') AND p.year != 'TTM'
    ORDER BY p.company_id, p.year
""", conn)

print("=== Data:")
print(df)

print("\n=== Calculating 3-year CAGR using calculate_cagr_for_metric:")
df3 = calculate_cagr_for_metric(df, 'sales', period_years=3)
print(df3)

print("\n=== Calculating 5-year CAGR:")
df5 = calculate_cagr_for_metric(df, 'sales', period_years=5)
print(df5)

print("\n=== What's calculate_cagr doing? Let's manually compute for INFY:")
infy_df = df[df['company_id'] == 'INFY'].copy()
print("INFY sorted df:", infy_df['year'].tolist())
print("INFY sales values:", infy_df['sales'].tolist())
# For 3-year CAGR, take last 4 entries
if len(infy_df)>=4:
    start_3 = infy_df['sales'].iloc[-4]
    end_3 = infy_df['sales'].iloc[-1]
    print(f"Start (3yr): {start_3}, End: {end_3}, periods=3")
    manual_cagr_3 = ((end_3 / start_3) ** (1/3)) -1 
    print(f"Manual CAGR 3yr: {manual_cagr_3*100:.2f}%")

conn.close()
