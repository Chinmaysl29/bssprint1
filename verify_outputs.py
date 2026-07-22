import os
import pandas as pd
import glob

output_dir = r"d:\bssprint1\Nifty100\output"

files_to_check = {
    "pros_cons_generated.csv": "csv",
    "cashflow_intelligence.xlsx": "xlsx",
    "capital_allocation.csv": "csv",
    "pattern_changes.csv": "csv",
    "valuation_summary.xlsx": "xlsx",
    "financial_ratios.csv": "csv"
}

print("=== VERIFYING FILES ===")
for fname, ftype in files_to_check.items():
    fpath = os.path.join(output_dir, fname)
    if os.path.exists(fpath):
        print(f"[OK] {fname} exists.")
        try:
            if ftype == "csv":
                df = pd.read_csv(fpath)
            else:
                df = pd.read_excel(fpath)
            
            company_col = None
            for col in ['Symbol', 'Company', 'Ticker', 'NSE_Symbol']:
                if col in df.columns:
                    company_col = col
                    break
            
            if company_col:
                unique_companies = df[company_col].nunique()
                print(f"     - Companies found ({company_col}): {unique_companies}")
            else:
                print(f"     - Could not find company identifier column. Columns: {list(df.columns)}")
                
            missing_vals = df.isnull().sum()
            total_missing = missing_vals.sum()
            if total_missing > 0:
                print(f"     - Missing values found! Total missing: {total_missing}")
                for col, missing in missing_vals.items():
                    if missing > 0:
                        print(f"       * {col}: {missing} missing")
            else:
                print(f"     - No missing values.")
                
            if fname == "pros_cons_generated.csv":
                if 'Pros' in df.columns and 'Cons' in df.columns:
                    empty_pros = df['Pros'].isnull().sum()
                    empty_cons = df['Cons'].isnull().sum()
                    print(f"     - Pros missing: {empty_pros}, Cons missing: {empty_cons}")
                else:
                    print(f"     - Pros/Cons columns not found: {list(df.columns)}")
            elif fname == "capital_allocation.csv":
                labels = [col for col in df.columns if 'label' in col.lower() or 'status' in col.lower() or 'allocation' in col.lower()]
                if labels:
                    print(f"     - Capital allocation label column(s) found: {labels}")
                else:
                    print(f"     - Cannot find capital allocation label column. Columns: {list(df.columns)}")
                
        except Exception as e:
            print(f"     - Error reading file: {e}")
    else:
        print(f"[FAIL] {fname} is MISSING.")
        found = glob.glob(r"d:\bssprint1\**\\" + fname, recursive=True)
        if found:
            print(f"     - Found in other locations: {found}")
