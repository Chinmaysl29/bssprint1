
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

df_wipro = pd.read_sql("SELECT year,sales,net_profit FROM profitandloss WHERE company_id='WIPRO' ORDER BY year", conn)
print("=== WIPRO PL data ===")
print(df_wipro)
print("\nNumber of rows (excl TTM):", len(df_wipro[df_wipro['year']!='TTM']))
conn.close()
