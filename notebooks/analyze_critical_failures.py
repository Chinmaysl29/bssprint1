
import pandas as pd
import os

# Set up paths - let's use absolute paths for reliability
nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
data_dir = os.path.join(nifty100_dir, 'data', 'raw')
output_dir = os.path.join(nifty100_dir, 'output')

# Load validation failures
failures = pd.read_csv(os.path.join(output_dir, 'validation_failures.csv'))

# Define CRITICAL rules
critical_rules = ['DQ03', 'DQ06', 'DQ08', 'DQ14', 'DQ15']

print("=== CRITICAL FAILURES OVERVIEW ===")
print(failures[failures['rule'].isin(critical_rules)]['rule'].value_counts())

print("\n\n=== DETAILS BY RULE ===")

for rule in critical_rules:
    print(f"\n--- {rule} ---")
    rule_failures = failures[failures['rule'] == rule]
    if len(rule_failures) > 0:
        print(rule_failures.head(20))
    else:
        print("No failures")

# Now let's check the source data to understand the issues
print("\n\n=== CHECKING COMPANIES TABLE ===")
companies = pd.read_excel(os.path.join(data_dir, 'companies.xlsx'), header=1)
print("Companies columns:", companies.columns.tolist())
print("\nCompanies id sample:", companies['id'].head(20).tolist())
print("\nAll unique company IDs:", sorted(companies['id'].unique()))

print("\n\n=== CHECKING BALANCE SHEET EXAMPLE FOR DQ03 ===")
balance_sheet = pd.read_excel(os.path.join(data_dir, 'balancesheet.xlsx'), header=1)
dq03_failure_ids = failures[(failures['rule'] == 'DQ03') & (failures['table'] == 'balancesheet')]['record_id'].head(5).tolist()
print("Sample DQ03 failures:", dq03_failure_ids)

# Let's check if those IDs exist and what their company_id is
for rec_id in dq03_failure_ids:
    print(f"\nChecking balance sheet record {rec_id}")
    record = balance_sheet[balance_sheet['id'] == int(rec_id)]
    if len(record) > 0:
        print(record[['id', 'company_id', 'year']])

print("\n\n=== CHECKING DQ08 FAILURES (TICKER FORMAT) ===")
dq08_failures = failures[failures['rule'] == 'DQ08']
for idx, failure in dq08_failures.iterrows():
    print(failure)
    # Find in companies table
    comp = companies[companies['id'] == failure['record_id']]
    if len(comp) > 0:
        print(comp)
