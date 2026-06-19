
import sqlite3
import os

def verify_counts():
    db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    queries = [
        ("companies", "SELECT COUNT(*) FROM companies"),
        ("profitandloss", "SELECT COUNT(*) FROM profitandloss"),
        ("balancesheet", "SELECT COUNT(*) FROM balancesheet"),
        ("cashflow", "SELECT COUNT(*) FROM cashflow"),
        ("stock_prices", "SELECT COUNT(*) FROM stock_prices")
    ]
    
    print("=== Verifying table counts:")
    print("-" * 40)
    for table_name, query in queries:
        cursor.execute(query)
        count = cursor.fetchone()[0]
        print(f"{table_name:<20} {count}")
    
    conn.close()

if __name__ == "__main__":
    verify_counts()
