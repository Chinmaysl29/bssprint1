
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)
df_analysis_companies = pd.read_sql("SELECT DISTINCT company_id FROM analysis", conn)
print("=== Companies in analysis table:")
print(df_analysis_companies)

print("\n=== Companies in companies table:")
df_companies = pd.read_sql("SELECT id FROM companies", conn)
print(df_companies)
conn.close()
