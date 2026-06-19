
import pandas as pd
import os

base_dir = os.path.join(os.path.dirname(__file__))
raw_dir = os.path.join(base_dir, 'data', 'raw')

# Check companies.xlsx
companies_path = os.path.join(raw_dir, 'companies.xlsx')
df = pd.read_excel(companies_path, header=0)
print("companies.xlsx columns:")
print(df.columns.tolist())
print("\nFirst 2 rows:")
print(df.head(2))

# Check stock_prices.xlsx
supporting_dir = os.path.join(base_dir, 'data', 'supporting')
sp_path = os.path.join(supporting_dir, 'stock_prices.xlsx')
sp_df = pd.read_excel(sp_path, header=0)
print("\nstock_prices.xlsx columns:")
print(sp_df.columns.tolist())
