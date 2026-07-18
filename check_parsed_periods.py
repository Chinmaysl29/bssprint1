
import pandas as pd
import os

csv_path = os.path.join(os.path.dirname(__file__), 'output', 'analysis_parsed.csv')
df = pd.read_csv(csv_path)
print("=== Parsed data:")
print(df.head(40))

print("\n=== Period years in parsed data:")
print(df['period_years'].value_counts(dropna=False))

print("\n=== HDFCBANK data:")
print(df[df['company_id'] == 'HDFCBANK'])
