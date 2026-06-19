import pandas as pd
import os

data_dir = '../data/raw/'
files = os.listdir(data_dir)

for file in files:
    if file.endswith('.xlsx'):
        print(f"\n{'='*60}")
        print(f"File: {file}")
        print('='*60)
        file_path = os.path.join(data_dir, file)
        
        try:
            df = pd.read_excel(file_path, header=None)
            print("First 5 rows:")
            print(df.head())
            print(f"\nShape: {df.shape}")
        except Exception as e:
            print(f"Error reading file: {e}")
