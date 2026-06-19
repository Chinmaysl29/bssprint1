
import sqlite3
import pandas as pd
import os

def run_exploratory_queries():
    base_dir = os.path.join(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    
    conn = sqlite3.connect(db_path)
    
    # List of queries
    queries = [
        ("1. Top 10 companies by ROE",
         "SELECT id, company_name, roe_percentage FROM companies WHERE roe_percentage IS NOT NULL ORDER BY roe_percentage DESC LIMIT 10"),
        
        ("2. Debt-free companies (borrowings = 0)",
         "SELECT DISTINCT c.id, c.company_name FROM companies c JOIN balancesheet bs ON c.id = bs.company_id WHERE bs.borrowings = 0"),
        
        ("3. Sector count",
         "SELECT sector, COUNT(DISTINCT company_id) AS company_count FROM sectors GROUP BY sector ORDER BY company_count DESC"),
        
        ("4. Free Cash Flow (FCF) positive companies",
         "SELECT DISTINCT company_id, ROUND(operating_activity + investing_activity, 2) AS fcf FROM cashflow WHERE (operating_activity + investing_activity) > 0 ORDER BY fcf DESC LIMIT 20"),
        
        ("5. Peer group counts",
         "SELECT group_name, COUNT(company_id) AS company_count FROM peer_groups GROUP BY group_name ORDER BY company_count DESC"),
        
        ("6. Null values in companies table",
         "SELECT SUM(CASE WHEN company_logo IS NULL THEN 1 ELSE 0 END) as null_logo, SUM(CASE WHEN website IS NULL THEN 1 ELSE 0 END) as null_website FROM companies"),
        
        ("7. Year distribution in P&L",
         "SELECT year, COUNT(*) as record_count FROM profitandloss GROUP BY year ORDER BY year"),
        
        ("8. Interest coverage < 1 (warning)",
         "SELECT p.company_id, p.year, CASE WHEN p.interest > 0 THEN ROUND(p.profit_before_tax / p.interest, 2) ELSE NULL END AS interest_coverage FROM profitandloss p WHERE p.interest > 0 AND p.profit_before_tax / p.interest < 1 ORDER BY interest_coverage ASC"),
        
        ("9. Latest entries per company",
         "SELECT c.id, c.company_name, pl.year as latest_pl_year, bs.year as latest_bs_year, cf.year as latest_cf_year FROM companies c LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM profitandloss GROUP BY company_id) pl_max ON c.id = pl_max.company_id LEFT JOIN profitandloss pl ON pl_max.company_id = pl.company_id AND pl_max.latest_id = pl.id LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM balancesheet GROUP BY company_id) bs_max ON c.id = bs_max.company_id LEFT JOIN balancesheet bs ON bs_max.company_id = bs.company_id AND bs_max.latest_id = bs.id LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM cashflow GROUP BY company_id) cf_max ON c.id = cf_max.company_id LEFT JOIN cashflow cf ON cf_max.company_id = cf.company_id AND cf_max.latest_id = cf.id ORDER BY c.id"),
        
        ("10. Companies with missing document URLs",
         "SELECT DISTINCT d.company_id, c.company_name FROM documents d JOIN companies c ON d.company_id = c.id WHERE d.Annual_Report IS NULL OR d.Annual_Report = 'Null' OR d.Annual_Report = ''")
    ]
    
    for name, query in queries:
        print("=" * 80)
        print(f"=== {name} ===")
        print("=" * 80)
        try:
            df = pd.read_sql(query, conn)
            if not df.empty:
                print(df.to_string(index=False))
            else:
                print("No results.")
        except Exception as e:
            print(f"ERROR: {e}")
        print("\n" * 2)
    
    conn.close()

if __name__ == "__main__":
    run_exploratory_queries()
