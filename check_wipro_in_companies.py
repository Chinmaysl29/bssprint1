
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

df_companies = pd.read_sql("SELECT * FROM companies", conn)
print("=== All companies ===")
print(df_companies['id'].tolist())

print("\n=== WIPRO in companies? ===")
print('WIPRO' in df_companies['id'].values)

conn.close()
