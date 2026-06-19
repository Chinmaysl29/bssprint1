import pandas as pd
import os

data_dir = '../data/raw/'

# Check documents columns
docs_df = pd.read_excel(f'{data_dir}/documents.xlsx', header=1)
print("Documents columns:")
print(docs_df.columns.tolist())
print("\nFirst 5 rows:")
print(docs_df.head())

# Check balance sheet
bs_df = pd.read_excel(f'{data_dir}/balancesheet.xlsx', header=1)
print("\n\nBalance sheet - check balance:")
print("Total liabilities vs Total assets:")
print((bs_df['total_liabilities'] - bs_df['total_assets']).abs().describe())

# Check if documents have company_id
print("\n\nDoes documents have company_id?", 'company_id' in docs_df.columns)
