
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)
df_ratios = pd.read_sql("SELECT * FROM financial_ratios", conn)
print("=== financial_ratios columns:")
print(df_ratios.columns.tolist())
print("\n=== financial_ratios head:")
print(df_ratios.head(20))
print("\n=== HDFCBANK in financial_ratios:")
print(df_ratios[df_ratios['company_id'] == 'HDFCBANK'])
conn.close()
