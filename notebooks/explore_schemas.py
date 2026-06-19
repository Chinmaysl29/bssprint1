
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
raw_dir = os.path.join(nifty100_dir, 'data', 'raw')
supporting_dir = os.path.join(nifty100_dir, 'data', 'supporting')

print("=== Raw Data Files ===")
for filename in os.listdir(raw_dir):
    if filename.endswith('.xlsx'):
        filepath = os.path.join(raw_dir, filename)
        df = pd.read_excel(filepath, header=1)
        print(f"\n{filename}:")
        print(df.head())
        print(f"\nColumns: {list(df.columns)}")
        print(f"\nData Types:")
        print(df.dtypes)

print("\n\n=== Supporting Data Files ===")
for filename in os.listdir(supporting_dir):
    if filename.endswith('.xlsx'):
        filepath = os.path.join(supporting_dir, filename)
        df = pd.read_excel(filepath, header=1)
        print(f"\n{filename}:")
        print(df.head())
        print(f"\nColumns: {list(df.columns)}")
        print(f"\nData Types:")
        print(df.dtypes)
