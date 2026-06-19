
import pandas as pd
import os

base_dir = os.path.join(os.path.dirname(__file__))
raw_dir = os.path.join(base_dir, 'data', 'raw')
companies_df = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=1)
companies_df['id'] = companies_df['id'].apply(lambda x: str(x).strip().upper())
print("All company IDs in companies.xlsx:")
for idx, comp_id in enumerate(sorted(companies_df['id'].unique()), 1):
    print(f"{idx}. {comp_id}")
