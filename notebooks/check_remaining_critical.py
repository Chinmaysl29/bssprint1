
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

profit_loss = pd.read_excel(os.path.join(raw_dir, 'profitandloss.xlsx'), header=1)

print("=== DQ06: Sales <=0 ===")
dq06_failure = profit_loss[profit_loss['sales'] <= 0]
print(dq06_failure[['id', 'company_id', 'year', 'sales']])

print("\n=== DQ14: EPS sign mismatch ===")
# Check EPS and net_profit signs
mask = (
    profit_loss['eps'].notna() & 
    profit_loss['net_profit'].notna() & 
    (
        ((profit_loss['eps'] > 0) & (profit_loss['net_profit'] < 0)) | 
        ((profit_loss['eps'] < 0) & (profit_loss['net_profit'] > 0))
    )
)
dq14_failures = profit_loss[mask]
print(dq14_failures[['id', 'company_id', 'year', 'eps', 'net_profit']])
