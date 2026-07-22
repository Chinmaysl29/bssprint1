import os
import sqlite3
import pandas as pd
from tearsheet import generate_company_tearsheet, get_database_path

def generate_all_tearsheets():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = os.path.join(base_dir, "reports", "tearsheets")
    os.makedirs(out_dir, exist_ok=True)
    
    db_path = get_database_path()
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
        
    conn = sqlite3.connect(db_path)
    # Fetch all company IDs
    query = "SELECT id FROM companies ORDER BY id ASC"
    df = pd.read_sql(query, conn)
    conn.close()
    
    if df.empty:
        print("No companies found in the database.")
        return
        
    companies = df['id'].tolist()
    print(f"Found {len(companies)} companies. Starting batch generation...")
    
    success_count = 0
    skipped_list = []
    error_list = []
    
    for idx, company_id in enumerate(companies, 1):
        try:
            print(f"[{idx}/{len(companies)}] Processing {company_id}...")
            generate_company_tearsheet(company_id, out_dir=out_dir)
            success_count += 1
        except ValueError as ve:
            print(f"Skipped {company_id}: {ve}")
            skipped_list.append({"Company": company_id, "Reason": str(ve)})
        except Exception as e:
            print(f"Error generating tearsheet for {company_id}: {e}")
            error_list.append((company_id, str(e)))
            
    print("=" * 40)
    print("Batch Generation Complete")
    print(f"Successfully generated: {success_count}/{len(companies)}")
    
    if skipped_list:
        skipped_df = pd.DataFrame(skipped_list)
        skipped_csv = os.path.join(base_dir, "output", "skipped_tearsheets.csv")
        skipped_df.to_csv(skipped_csv, index=False)
        print(f"Skipped: {len(skipped_list)} (Saved to output/skipped_tearsheets.csv)")
        
    if error_list:
        print(f"Failed: {len(error_list)}")
        for comp, err in error_list:
            print(f"  - {comp}: {err}")

if __name__ == "__main__":
    generate_all_tearsheets()
