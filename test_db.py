
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'db', 'nifty100.db')

conn = sqlite3.connect(db_path)
conn.execute('PRAGMA foreign_keys = ON;')
cursor = conn.cursor()

print("=== Testing Database ===")

# Check companies count
cursor.execute('SELECT COUNT(*) FROM companies;')
companies_count = cursor.fetchone()[0]
print(f"Companies: {companies_count}")

# Check profit and loss count
cursor.execute('SELECT COUNT(*) FROM profitandloss;')
pnl_count = cursor.fetchone()[0]
print(f"Profit and Loss: {pnl_count}")

# Check for foreign key validity (should all pass)
print("\n=== Foreign Key Test ===")
cursor.execute('PRAGMA foreign_key_check;')
fk_errors = cursor.fetchall()
if len(fk_errors) == 0:
    print("✅ All foreign keys are valid!")
else:
    print("❌ Foreign key errors found!")
    print(fk_errors)

conn.close()
