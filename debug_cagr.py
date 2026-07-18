
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from analytics.cagr import calculate_multiyear_sales_cagr

sales_cagr = calculate_multiyear_sales_cagr()
print("=== All sales_cagr data:")
print(sales_cagr)

print("\n=== HDFCBANK sales_cagr:")
print(sales_cagr[sales_cagr['company_id'] == 'HDFCBANK'])
