
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

# Load companies.xlsx without any header
companies_raw = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=None)
print("Companies raw first 10 rows:")
print(companies_raw.head(10))
print("\nShape:", companies_raw.shape)
