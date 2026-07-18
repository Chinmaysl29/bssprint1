
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from src.analytics.cagr import calculate_multiyear_sales_cagr
import pandas as pd

sales_cagr = calculate_multiyear_sales_cagr()

# Filter to only INFY and HDFCBANK
print("=== sales_cagr for HDFCBANK and INFY ===")
print(sales_cagr[sales_cagr['company_id'].isin(['HDFCBANK', 'INFY'])].to_string())
