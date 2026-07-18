
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

analysis_companies = ["HDFCBANK", "INFY", "SBILIFE", "TCS", "WIPRO"]

print("=== Checking if analysis companies are in profitandloss:")
df_pl = pd.read_sql("SELECT DISTINCT company_id FROM profitandloss", conn)
print(df_pl[df_pl['company_id'].isin(analysis_companies)])

print("\n=== Checking data for HDFCBANK in profitandloss:")
df_hdfc = pd.read_sql("SELECT * FROM profitandloss WHERE company_id='HDFCBANK'", conn)
print(df_hdfc.head(10))

conn.close()
