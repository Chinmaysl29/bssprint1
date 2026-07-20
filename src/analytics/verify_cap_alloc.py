import os
import pandas as pd
import sqlite3

def get_database_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, "db", "nifty100.db")

def verify_capital_allocation():
    print("=== Capital Allocation Verification ===")
    
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    csv_path = os.path.join(base_dir, "output", "capital_allocation.csv")
    
    if not os.path.exists(csv_path):
        print(f"[FAIL] File not found: {csv_path}")
        print("Please run cashflow_kpis.py first to generate the file.")
        return
        
    df = pd.read_csv(csv_path)
    
    # 1. All companies present
    conn = sqlite3.connect(get_database_path())
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(id) FROM companies")
    total_db_companies = cursor.fetchone()[0]
    conn.close()
    
    unique_companies = df['company_id'].nunique()
    if unique_companies == total_db_companies:
        print(f"[PASS] All {total_db_companies} companies are present.")
    else:
        print(f"[FAIL] Company count mismatch. DB has {total_db_companies}, but CSV has {unique_companies}.")
        
    # 2. All years available
    unique_years = df['year'].nunique()
    min_year = df['year'].min()
    max_year = df['year'].max()
    print(f"[INFO] Years found: {unique_years} (From {min_year} to {max_year})")
    
    # If a company is missing a year, they won't have 13 records (assuming 2012-2024)
    year_counts = df.groupby('company_id')['year'].count()
    companies_with_missing_years = year_counts[year_counts < unique_years]
    
    if companies_with_missing_years.empty:
        print(f"[PASS] All companies have data for all {unique_years} years available.")
    else:
        print(f"[WARN] Some companies do not have data for all {unique_years} years available.")

    # 3. No missing allocation labels
    missing_labels = df['pattern_label'].isna().sum()
    if missing_labels == 0:
        print("[PASS] No missing allocation labels.")
    else:
        print(f"[FAIL] Found {missing_labels} missing allocation labels.")
        print(df[df['pattern_label'].isna()])

if __name__ == "__main__":
    verify_capital_allocation()
