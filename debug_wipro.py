
import sqlite3
import pandas as pd
import os

def calculate_cagr(start_value, end_value, periods):
    if (
        pd.isna(start_value)
        or pd.isna(end_value)
        or pd.isna(periods)
        or start_value <=0 
        or end_value <=0 
        or periods <=0
    ):
        return None
    try:
        return round(((end_value/start_value)**(1/periods)) - 1,4)
    except:
        return None

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)
df_pl = pd.read_sql("SELECT * FROM profitandloss WHERE company_id='WIPRO' AND year!='TTM' ORDER BY year", conn)
conn.close()

print("=== WIPRO df_pl ===")
print(df_pl)
print("\nsales values:", df_pl['sales'].tolist())
print("len(df_pl):", len(df_pl))

print("\n=== 3yr sales CAGR ===")
if len(df_pl)>=3+1:
    start_3 = df_pl['sales'].iloc[-(3+1)]
    end_3 = df_pl['sales'].iloc[-1]
    print("start_3:", start_3, "end_3:", end_3, "periods:", 3)
    cagr_3 = calculate_cagr(start_3, end_3,3)
    print("cagr:", cagr_3, "percent:", cagr_3*100 if cagr_3 else None)
