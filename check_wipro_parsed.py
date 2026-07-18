
import pandas as pd
import os

parsed_path = os.path.join(os.path.dirname(__file__), 'output', 'analysis_parsed.csv')
df_parsed = pd.read_csv(parsed_path)
print("=== analysis_parsed.csv ===\n", df_parsed.to_string())
print("\n=== WIPRO only ===\n", df_parsed[df_parsed['company_id'] == 'WIPRO'].to_string())
