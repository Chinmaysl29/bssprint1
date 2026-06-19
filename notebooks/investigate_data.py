
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
data_dir = os.path.join(nifty100_dir, 'data')
raw_dir = os.path.join(data_dir, 'raw')
supporting_dir = os.path.join(data_dir, 'supporting')

print("=== CHECKING SUPPORTING FILES ===")
for file in os.listdir(supporting_dir):
    print(f"\n--- {file} ---")
    df = pd.read_excel(os.path.join(supporting_dir, file), header=1)
    print(df.columns.tolist())
    print(df.head())

print("\n\n=== CHECKING ALL COMPANY IDS ACROSS ALL TABLES ===")

# Load all raw data
companies = pd.read_excel(os.path.join(raw_dir, 'companies.xlsx'), header=1)
balance_sheet = pd.read_excel(os.path.join(raw_dir, 'balancesheet.xlsx'), header=1)
profit_loss = pd.read_excel(os.path.join(raw_dir, 'profitandloss.xlsx'), header=1)
cashflow = pd.read_excel(os.path.join(raw_dir, 'cashflow.xlsx'), header=1)
documents = pd.read_excel(os.path.join(raw_dir, 'documents.xlsx'), header=1)

all_ids_in_companies = set(companies['id'].unique())

all_ids_in_other_tables = set()
for df, name in [(balance_sheet, 'balancesheet'), (profit_loss, 'profitandloss'), (cashflow, 'cashflow'), (documents, 'documents')]:
    if 'company_id' in df.columns:
        ids_in_df = set(df['company_id'].dropna().unique())
        all_ids_in_other_tables.update(ids_in_df)
        print(f"\n{name} unique company IDs: {sorted(ids_in_df)}")

print(f"\nIDs in companies table: {sorted(all_ids_in_companies)}")
print(f"\nIDs in other tables but NOT in companies: {sorted(all_ids_in_other_tables - all_ids_in_companies)}")
print(f"\nIDs in companies but NOT in other tables: {sorted(all_ids_in_companies - all_ids_in_other_tables)}")

# Check DQ15 - are negative reserves actually present and should they be allowed?
print("\n\n=== CHECKING DQ15 (NEGATIVE RESERVES) ===")
print("Reserves column description:")
print(balance_sheet['reserves'].describe())
print("\nNegative reserves records:")
negative_reserves = balance_sheet[balance_sheet['reserves'] < 0]
print(negative_reserves[['id', 'company_id', 'year', 'reserves']])
