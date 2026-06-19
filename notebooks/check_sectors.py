
import pandas as pd
import os

nifty100_dir = os.path.join(os.path.dirname(__file__), '..')
supporting_dir = os.path.join(nifty100_dir, 'data', 'supporting')

# Load sectors with header=1
sectors = pd.read_excel(os.path.join(supporting_dir, 'sectors.xlsx'), header=1)
print("Sectors columns:", sectors.columns.tolist())
print("\nAll companies in sectors:")
print(sorted(sectors.iloc[:,1].unique()))
