
import pandas as pd
import os

file_path = os.path.join(os.path.dirname(__file__), 'data', 'supporting', 'stock_prices.xlsx')
df_all = pd.read_excel(file_path, header=None)
print("First 3 rows of stock_prices.xlsx (raw):")
print(df_all.head(3))
print("\nNumber of rows total (including header):", len(df_all))
