import sqlite3
import pandas as pd

conn = sqlite3.connect('d:/bssprint1/Nifty100/db/nifty100.db')
query = """
SELECT c.company_name, f.* 
FROM financial_ratios f 
JOIN companies c ON f.company_id = c.id 
LIMIT 5
"""
df = pd.read_sql(query, conn)
print("Financial Ratios:")
print(df.to_string())

query2 = """
SELECT * FROM companies LIMIT 2
"""
df2 = pd.read_sql(query2, conn)
print("\nCompanies:")
print(df2.to_string())
conn.close()
