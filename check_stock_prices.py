
import pandas as pd
import os

file_path = os.path.join(os.path.dirname(__file__), 'data', 'supporting', 'stock_prices.xlsx')
df = pd.read_excel(file_path, header=1)
print("Stock prices file row count:", len(df))
print("First few rows:")
print(df.head())
print("\nLast few rows:")
print(df.tail())
