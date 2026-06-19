import pandas as pd

file_path = '../data/raw/companies.xlsx'
df = pd.read_excel(file_path)

print("=== DataFrame Columns ===")
print(df.columns)
print("\n=== DataFrame Info ===")
df.info()
print("\n=== Missing Values Count ===")
print(df.isnull().sum())
print("\n=== Duplicated Rows ===")
print(df.duplicated().sum())

if 'company_id' in df.columns:
    print("\n=== Company IDs ===")
    print(df['company_id'].head())

if 'year' in df.columns:
    print("\n=== Years ===")
    print(df['year'].unique())
