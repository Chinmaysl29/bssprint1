
import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)
analysis_companies = ['HDFCBANK','INFY','SBILIFE','TCS','WIPRO']

for company in analysis_companies:
    df = pd.read_sql("SELECT year, sales, net_profit FROM profitandloss WHERE company_id = ? AND year != 'TTM' ORDER BY year", conn, params=(company,))
    print(f"\n=== {company} ({len(df)} rows")
    print(df)
    if len(df)>=1:
        print("\nSample sales values:", df['sales'].tolist())

conn.close()
