
import pandas as pd
import os
import re

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

balance_sheet = pd.read_excel(os.path.join(raw_dir, 'balancesheet.xlsx'), header=1)
profit_loss = pd.read_excel(os.path.join(raw_dir, 'profitandloss.xlsx'), header=1)
cashflow = pd.read_excel(os.path.join(raw_dir, 'cashflow.xlsx'), header=1)

year_pattern = re.compile(r'^(Dec|Mar|Jun|Sep|TTM)\s*\d{4}(\.\d+)?(\s+\d+m)?$|^\d{4}(\.\d+)?$')

print("=== Checking all year values ===")
all_years = set()
for df, name in [(balance_sheet, 'balancesheet'), (profit_loss, 'profitandloss'), (cashflow, 'cashflow')]:
    years = df['year'].unique()
    print(f"\n{name} years:")
    for year in sorted(years):
        valid = year_pattern.match(str(year)) is not None
        all_years.add((str(year), valid))
        print(f"  {year}: {'VALID' if valid else 'INVALID'}")

print("\n=== All unique years with validity ===")
for year, valid in sorted(all_years):
    print(f"{year}: {'VALID' if valid else 'INVALID'}")
