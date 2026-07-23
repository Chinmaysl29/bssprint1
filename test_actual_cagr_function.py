
import pandas as pd
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Copy calculate_cagr EXACTLY as it appears in cagr.py!
def calculate_cagr(start_value, end_value, periods):
    """Calculate CAGR given start value, end value, and number of periods"""
    if (
        pd.isna(start_value) 
        or pd.isna(end_value) 
        or pd.isna(periods) 
        or start_value <= 0 
        or end_value <= 0 
        or periods <= 0
    ):
        return None
    try:
        return round(((end_value / start_value) ** (1 / periods)) - 1, 4)
    except (ZeroDivisionError, ValueError):
        return None

# Test case 1: HDFCBANK 3yr
print("=== HDFCBANK ===")
start_hdfc = 128552
end_hdfc = 283649
cagr_hdfc = calculate_cagr(start_hdfc, end_hdfc, 3)
print("start:", start_hdfc, "end:", end_hdfc, "cagr:", cagr_hdfc)
print("cagr percent:", cagr_hdfc*100 if cagr_hdfc else None)

# Test case2: INFY 3yr
print("\n=== INFY ===")
start_infy = 100472
end_infy = 153670
cagr_infy = calculate_cagr(start_infy, end_infy, 3)
print("start:", start_infy, "end:", end_infy, "cagr:", cagr_infy)
print("cagr percent:", cagr_infy*100 if cagr_infy else None)

# Test case3: let's get exactly the values from sales_cagr
import sqlite3
db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)
query = "SELECT company_id,year,sales FROM profitandloss WHERE company_id='INFY' ORDER BY year"
df_infy_pl = pd.read_sql(query, conn)
print("\n=== INFY PL data from DB ===")
print(df_infy_pl)

conn.close()

print("\n=== Let's get start_value and end_value as per calculate_cagr_for_metric ===")
company_df = df_infy_pl.dropna(subset=['sales']).sort_values('year').copy()
print("len(company_df):", len(company_df))
if len(company_df)>=4:
    start_value_db = company_df['sales'].iloc[-4]
    end_value_db = company_df['sales'].iloc[-1]
    print("db start:", start_value_db, type(start_value_db))
    print("db end:", end_value_db, type(end_value_db))
    
    cagr_db = calculate_cagr(start_value_db, end_value_db, 3)
    print("cagr_db:", cagr_db)
