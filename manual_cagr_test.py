
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

df_pl = pd.read_sql("SELECT company_id, year, sales, net_profit FROM profitandloss WHERE company_id = 'HDFCBANK' AND year != 'TTM' ORDER BY year", conn)
print("=== HDFCBANK P&L (no TTM):")
print(df_pl)
print("\nNumber of rows:", len(df_pl))

print("\n--- Let's calculate 3-year CAGR manually:")
if len(df_pl)>=4:
    start_3 = df_pl['sales'].iloc[-4]
    end_3 = df_pl['sales'].iloc[-1]
    print(f"Start (3yr): {start_3}, End: {end_3}")
    cagr_3 = ((end_3 / start_3) ** (1/3)) - 1
    print(f"3yr CAGR: {cagr_3 * 100:.2f}%")

print("\n--- 5-year CAGR:")
if len(df_pl)>=6:
    start_5 = df_pl['sales'].iloc[-6]
    end_5 = df_pl['sales'].iloc[-1]
    print(f"Start (5yr): {start_5}, End: {end_5}")
    cagr_5 = ((end_5 / start_5) ** (1/5)) - 1
    print(f"5yr CAGR: {cagr_5 * 100:.2f}%")

print("\n--- 10-year CAGR:")
if len(df_pl)>=11:
    start_10 = df_pl['sales'].iloc[-11]
    end_10 = df_pl['sales'].iloc[-1]
    print(f"Start (10yr): {start_10}, End: {end_10}")
    cagr_10 = ((end_10 / start_10) ** (1/10)) - 1
    print(f"10yr CAGR: {cagr_10 * 100:.2f}%")
else:
    print(f"Only {len(df_pl)} rows, can't calculate 10yr CAGR (needs at least 11)")

conn.close()
