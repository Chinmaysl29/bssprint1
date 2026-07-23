
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from analytics.cagr import (
    calculate_multiyear_sales_cagr,
    calculate_multiyear_profit_cagr,
    pivot_multiyear_cagr
)

print("=== Testing Sales CAGR ===")
sales_cagr = calculate_multiyear_sales_cagr()
print(sales_cagr.head(20))

print("\n=== Pivoted Sales CAGR ===")
sales_pivot = pivot_multiyear_cagr(sales_cagr, 'sales')
print(sales_pivot.head(10))

print("\n=== Testing Profit CAGR ===")
profit_cagr = calculate_multiyear_profit_cagr()
print(profit_cagr.head(20))
