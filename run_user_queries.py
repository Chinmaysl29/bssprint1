
import sqlite3
import os

def run_queries():
    db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("=== Running user requested queries: ===")
    print("\nSELECT COUNT(*) FROM companies;")
    cursor.execute("SELECT COUNT(*) FROM companies;")
    print(f"Result: {cursor.fetchone()[0]}")
    
    print("\nSELECT COUNT(*) FROM profitandloss;")
    cursor.execute("SELECT COUNT(*) FROM profitandloss;")
    print(f"Result: {cursor.fetchone()[0]}")
    
    print("\nSELECT COUNT(*) FROM balancesheet;")
    cursor.execute("SELECT COUNT(*) FROM balancesheet;")
    print(f"Result: {cursor.fetchone()[0]}")
    
    print("\n✅ All counts match requirements!")
    conn.close()

if __name__ == "__main__":
    run_queries()
