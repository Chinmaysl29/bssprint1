
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

companies = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=1)
print("All company IDs in companies.xlsx:")
for idx, cid in enumerate(sorted(companies['id'].unique()), 1):
    print(f"{idx}. {cid}")
print(f"\nTotal companies: {len(companies)}")
