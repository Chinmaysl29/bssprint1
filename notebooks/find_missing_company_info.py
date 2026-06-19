
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

companies = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=1)
balance_sheet = pd.read_excel(os.path.join(raw_dir, 'balancesheet.xlsx'), header=1)

missing_ids = ['AGTL', 'ULTRACEMCO', 'UNIONBANK', 'UNITDSPR', 'VBL', 'VEDL', 'WIPRO', 'ZOMATO', 'ZYDUSLIFE']

print("=== Checking if missing companies are in any other table's company_name-like fields ===")

# Let's look at all tables
for file in os.listdir(raw_dir):
    print(f"\n--- {file} ---")
    df = pd.read_excel(os.path.join(raw_dir, file), header=1)
    print(df.columns.tolist())
