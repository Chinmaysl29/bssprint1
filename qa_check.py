import os
import sqlite3
import pandas as pd
import glob
from pathlib import Path

def get_base_dir():
    return os.path.dirname(os.path.abspath(__file__))

def run_qa():
    base_dir = get_base_dir()
    output_dir = os.path.join(base_dir, 'output')
    
    print("="*50)
    print("FINAL QUALITY ASSURANCE")
    print("="*50)
    
    # 1. Dataset Validation
    print("\n1. Dataset Validation")
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        comp_count = pd.read_sql("SELECT COUNT(*) as count FROM companies", conn).iloc[0]['count']
        print(f"  - Companies in Database: {comp_count} / 92")
        conn.close()
    else:
        print("  - Database missing!")
        
    tearsheets_dir = os.path.join(output_dir, 'reports', 'tearsheets')
    if os.path.exists(tearsheets_dir):
        pdfs = glob.glob(os.path.join(tearsheets_dir, "*.pdf"))
        print(f"  - Tearsheet PDFs generated: {len(pdfs)} / 92")
    else:
        print("  - Tearsheets directory missing!")
        
    skipped_csv = os.path.join(output_dir, 'skipped_tearsheets.csv')
    if os.path.exists(skipped_csv):
        skipped_df = pd.read_csv(skipped_csv)
        print(f"  - Skipped tearsheets (due to missing data): {len(skipped_df)}")
        for _, row in skipped_df.iterrows():
            print(f"    * {row['Company']}: {row['Reason']}")
            
    # 2. NLP Validation
    print("\n2. NLP Validation")
    pros_cons_path = os.path.join(output_dir, 'pros_and_cons.csv')
    if os.path.exists(pros_cons_path):
        nlp_df = pd.read_csv(pros_cons_path)
        companies_with_pros = nlp_df['pros'].notna().sum()
        companies_with_cons = nlp_df['cons'].notna().sum()
        conf_above_60 = (nlp_df['confidence'] > 60).sum()
        print(f"  - Companies with Pros: {companies_with_pros} / {len(nlp_df)}")
        print(f"  - Companies with Cons: {companies_with_cons} / {len(nlp_df)}")
        print(f"  - Companies with Confidence > 60%: {conf_above_60} / {len(nlp_df)}")
    else:
        print("  - pros_and_cons.csv missing!")
        
    # 3. Financial Validation
    print("\n3. Financial Validation")
    val_csv = os.path.join(output_dir, 'valuation_summary.csv')
    alloc_csv = os.path.join(output_dir, 'capital_allocation.csv')
    if os.path.exists(val_csv):
        val_df = pd.read_csv(val_csv)
        missing_fcf = val_df['free_cash_flow_cr'].isna().sum()
        print(f"  - Valuation Summary: Missing FCF values = {missing_fcf}")
    if os.path.exists(alloc_csv):
        alloc_df = pd.read_csv(alloc_csv)
        print(f"  - Capital Allocation: Processed {alloc_df['company_id'].nunique()} companies")
        
    # 5. Sector Validation
    print("\n5. Sector Validation")
    sector_dir = os.path.join(output_dir, 'reports', 'sector')
    if os.path.exists(sector_dir):
        sector_pdfs = glob.glob(os.path.join(sector_dir, "*Sector_Report.pdf"))
        print(f"  - Sector PDFs generated: {len(sector_pdfs)} / 11")
    else:
        print("  - Sector reports directory missing!")

    print("\n="*50)
    print("ACTION REQUIRED: PDF VISUAL VALIDATION")
    print("="*50)
    print("Please randomly open 10 Company Reports from output/reports/tearsheets/ and visually verify:")
    print("  [ ] Charts display correctly")
    print("  [ ] Fonts render correctly")
    print("  [ ] No blank pages")
    print("  [ ] Images fit / Margins consistent")
    print("  [ ] No text overflow")

if __name__ == "__main__":
    run_qa()
