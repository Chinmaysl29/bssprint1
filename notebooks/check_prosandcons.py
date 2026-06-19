
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')

prosandcons = pd.read_excel(os.path.join(raw_dir, 'prosandcons.xlsx'), header=1)
print("prosandcons columns:", prosandcons.columns.tolist())
print("\nAll company_ids in prosandcons:")
print(sorted(prosandcons['company_id'].unique()))

analysis = pd.read_excel(os.path.join(raw_dir, 'analysis.xlsx'), header=1)
print("\nanalysis columns:", analysis.columns.tolist())
print("\nAll company_ids in analysis:")
print(sorted(analysis['company_id'].unique()))
