import sqlite3
import pandas as pd

with open('db_inspect_output.txt', 'w') as f:
    conn = sqlite3.connect('d:/bssprint1/Nifty100/db/nifty100.db')
    query = """
    SELECT c.company_name, f.* 
    FROM financial_ratios f 
    JOIN companies c ON f.company_id = c.id 
    LIMIT 5
    """
    df = pd.read_sql(query, conn)
    f.write("Financial Ratios:\n")
    f.write(df.to_string())

    query2 = """
    SELECT * FROM companies LIMIT 2
    """
    df2 = pd.read_sql(query2, conn)
    f.write("\n\nCompanies:\n")
    f.write(df2.to_string())
    
    query3 = """
    SELECT * FROM profitandloss LIMIT 1
    """
    df3 = pd.read_sql(query3, conn)
    f.write("\n\nProfit and Loss:\n")
    f.write(df3.to_string())
    
    conn.close()
