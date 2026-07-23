
import pandas as pd

def calculate_cagr(start_value, end_value, periods):
    """Calculate CAGR given start value, end value, and number of periods"""
    if (
        pd.isna(start_value) 
        or pd.isna(end_value) 
        or pd.isna(periods) 
        or start_value <=0 
        or end_value <=0 
        or periods <=0
    ):
        print("One of the conditions failed!")
        print("pd.isna(start_value):", pd.isna(start_value))
        print("pd.isna(end_value):", pd.isna(end_value))
        print("pd.isna(periods):", pd.isna(periods))
        print("start_value <=0:", start_value <=0)
        print("end_value <=0:", end_value <=0)
        print("periods <=0:", periods <=0)
        return None
    try:
        print("Calculating ((end/start)**(1/periods)) - 1")
        print(f"end/start: {end_value / start_value}")
        print(f"1/periods: {1/periods}")
        print(f"pow: { (end_value/start_value)**(1/periods) }")
        cagr_val = round(((end_value / start_value) ** (1 / periods)) - 1, 4)
        print(f"cagr_val: {cagr_val}")
        return cagr_val
    except (ZeroDivisionError, ValueError) as e:
        print(f"Exception: {type(e)} - {e}")
        return None


print("=== Testing with HDFCBANK values ===")
start_hdfc_3yr = 135936.0
end_hdfc_3yr = 329022.0
periods_hdfc_3yr = 3.0

cagr_hdfc = calculate_cagr(start_hdfc_3yr, end_hdfc_3yr, periods_hdfc_3yr)
print(f"cagr_hdfc: {cagr_hdfc}")
print(f"cagr_hdfc * 100: {cagr_hdfc * 100 if cagr_hdfc else None}")
