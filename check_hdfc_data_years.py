
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

df_pl = pd.read_sql("SELECT company_id, year, sales, net_profit FROM profitandloss WHERE company_id='HDFCBANK'", conn)
print("=== HDFCBANK P&L data:")
print(df_pl)
print("\nNumber of rows:", len(df_pl))
print("Years:", df_pl['year'].tolist())

conn.close()
