import pandas as pd
import os

data_dir = '../data/raw/'
files = ['companies.xlsx', 'balancesheet.xlsx', 'profitandloss.xlsx', 'cashflow.xlsx']

for file in files:
    print(f"\n{'='*80}")
    print(f"Processing: {file}")
    print('='*80)
    
    file_path = os.path.join(data_dir, file)
    df = pd.read_excel(file_path, header=1)
    
    print("\n=== DataFrame Columns ===")
    print(df.columns.tolist())
    
    print("\n=== DataFrame Info ===")
    df.info()
    
    print("\n=== Missing Values Count ===")
    print(df.isnull().sum())
    
    print("\n=== Duplicated Rows ===")
    print(f"Total duplicated rows: {df.duplicated().sum()}")
    
    if 'company_id' in df.columns:
        print("\n=== Company IDs (first 5) ===")
        print(df['company_id'].head())
    
    if 'year' in df.columns:
        print("\n=== Unique Years ===")
        print(sorted(df['year'].unique()))
