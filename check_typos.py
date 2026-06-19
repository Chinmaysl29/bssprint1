
import pandas as pd
import os

base_dir = os.path.join(os.path.dirname(__file__))
raw_dir = os.path.join(base_dir, 'data', 'raw')
balance_path = os.path.join(raw_dir, 'balancesheet.xlsx')
df = pd.read_excel(balance_path, header=1)
df['company_id'] = df['company_id'].apply(lambda x: str(x).strip().upper())
print("Company IDs in balancesheet.xlsx (first 20):")
print(df['company_id'].head(20).tolist())
print("\nNumber of records with company_id = 'AGTL':", len(df[df['company_id'] == 'AGTL']))
print("Number with 'ATGL':", len(df[df['company_id'] == 'ATGL']))
