
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

profit_loss = pd.read_excel(os.path.join(raw_dir, 'profitandloss.xlsx'), header=1)

print("=== DQ06 record ===")
print(profit_loss[profit_loss['id'] == 86].T)

print("\n=== DQ14 records ===")
for record_id in [881, 915, 1160]:
    print(f"\n--- id {record_id} ---")
    print(profit_loss[profit_loss['id'] == record_id].T)
