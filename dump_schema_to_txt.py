import sqlite3

db_path = "data/nifty100.db"
conn = sqlite3.connect(db_path)
schema = conn.execute("SELECT sql FROM sqlite_master WHERE type='table';").fetchall()
with open("schema.txt", "w") as f:
    for row in schema:
        f.write(str(row[0]) + "\n\n")
