
import sqlite3
import pandas as pd
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from src.analytics.cagr import calculate_cagr_for_metric

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
conn = sqlite3.connect(db_path)

df = pd.read_sql("""
    SELECT 
        p.company_id,
        c.company_name,
        p.year,
        p.sales
    FROM profitandloss p
    JOIN companies c ON p.company_id = c.id
    WHERE p.company_id = 'INFY' AND p.year != 'TTM'
    ORDER BY p.company_id, p.year
""", conn)

print("=== df['sales'].dtype ===")
print(df['sales'].dtype)
print("=== df['sales'].head() ===")
print(df['sales'].head())
print("=== df['sales'].isna().sum() ===")
print(df['sales'].isna().sum())

# Now let's copy calculate_cagr_for_metric but add prints!
def debug_calculate_cagr_for_metric(df, metric_col, period_years=None, company_id_col='company_id', year_col='year', company_name_col='company_name'):
    cagr_list = []
    for company_id in df[company_id_col].unique():
        company_df = df[df[company_id_col] == company_id].copy()
        company_df = company_df.dropna(subset=[metric_col]).sort_values(year_col)
        
        print(f"\n=== Company: {company_id} ===")
        print("company_df.columns:", company_df.columns.tolist())
        print(f"len(company_df): {len(company_df)}")
        
        if len(company_df)>=2:
            company_name = company_df[company_name_col].iloc[0]
            cagr = None
            
            if period_years:
                print(f"period_years = {period_years}")
                if len(company_df)>= period_years +1:
                    print(f"len(company_df) is {len(company_df)} >= {period_years +1}")
                    start_value = company_df[metric_col].iloc[-(period_years +1)]
                    end_value = company_df[metric_col].iloc[-1]
                    periods = period_years
                    start_year = company_df[year_col].iloc[-(period_years +1)]
                    end_year = company_df[year_col].iloc[-1]
                    
                    print(f"start_value: {repr(start_value)}, type: {type(start_value)}")
                    print(f"end_value: {repr(end_value)}, type: {type(end_value)}")
                    print(f"periods: {periods}")
                    
                    # Now import calculate_cagr directly!
                    from src.analytics.cagr import calculate_cagr
                    
                    print("Calling calculate_cagr...")
                    cagr = calculate_cagr(start_value, end_value, periods)
                    print(f"calculate_cagr returned: {cagr}, type: {type(cagr)}")
                    
                else:
                    print("len(company_df) too small!")
                    start_value = None
                    end_value = None
                    periods = None
                    start_year = None
                    end_year = None
                    flag = 'INSUFFICIENT'
                    cagr = None
            
            print(f"cagr is now: {cagr}")
            
            if 'flag' not in locals():
                print("Checking start and end values...")
                if start_value ==0:
                    flag = 'ZERO_BASE'
                    cagr = None
                elif start_value>0 and end_value>0:
                    flag = 'OK'
                    try:
                        print("Calculating cagr manually here too...")
                        cagr_manual = ((end_value/start_value) ** (1/periods)) -1 
                        print(f"cagr_manual: {cagr_manual}")
                    except Exception as e:
                        print("Exception in manual calculation:", e)
                        cagr = None
                else:
                    flag = 'OTHER'
                    cagr = None
            
            print(f"flag: {flag}")
            cagr_list.append({
                company_id_col: company_id,
                company_name_col: company_name,
                'start_year': start_year,
                'end_year': end_year,
                'periods': periods,
                'period_years': period_years,
                f'start_{metric_col}': start_value,
                f'end_{metric_col}': end_value,
                f'{metric_col}_cagr_pct': round(cagr*100,2) if cagr is not None else None,
                'flag': flag
            })
    
    return pd.DataFrame(cagr_list)

print("\n=== Calling debug_calculate_cagr_for_metric for INFY, sales, period_years=3 ===")
df_debug = debug_calculate_cagr_for_metric(df, 'sales', period_years=3)
print("=== df_debug ===")
print(df_debug)

conn.close()
