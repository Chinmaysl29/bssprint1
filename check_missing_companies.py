
import pandas as pd
import os

base_dir = os.path.join(os.path.dirname(__file__))
raw_dir = os.path.join(base_dir, 'data', 'raw')
supporting_dir = os.path.join(base_dir, 'data', 'supporting')

# Get companies from companies.xlsx
companies_df = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=1)
companies_in_file = set(companies_df['id'].apply(lambda x: str(x).strip().upper()))
print("Companies in companies.xlsx:", len(companies_in_file))

# Collect all company IDs from all tables
all_company_ids = set()
tables_config = [
    ('profitandloss', os.path.join(raw_dir, 'profitandloss.xlsx'), 1),
    ('balancesheet', os.path.join(raw_dir, 'balancesheet.xlsx'), 1),
    ('cashflow', os.path.join(raw_dir, 'cashflow.xlsx'), 1),
    ('analysis', os.path.join(raw_dir, 'analysis.xlsx'), 1),
    ('documents', os.path.join(raw_dir, 'documents.xlsx'), 1),
    ('prosandcons', os.path.join(raw_dir, 'prosandcons.xlsx'), 1),
    ('sectors', os.path.join(supporting_dir, 'sectors.xlsx'), 0),
    ('stock_prices', os.path.join(supporting_dir, 'stock_prices.xlsx'), 0),
    ('market_cap', os.path.join(supporting_dir, 'market_cap.xlsx'), 0),
    ('financial_ratios', os.path.join(supporting_dir, 'financial_ratios.xlsx'), 0),
    ('peer_groups', os.path.join(supporting_dir, 'peer_groups.xlsx'), 0)
]

for table_name, file_path, header_row in tables_config:
    try:
        df = pd.read_excel(file_path, header=header_row)
        if 'company_id' in df.columns:
            ids = df['company_id'].dropna().apply(lambda x: str(x).strip().upper())
            all_company_ids.update(ids)
    except Exception as e:
        print(f"Warning: Could not load {table_name}")

missing = all_company_ids - companies_in_file
print("\nMissing company IDs in companies.xlsx:", sorted(missing))
print("\nNumber of missing companies:", len(missing))
