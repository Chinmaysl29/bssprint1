
import sqlite3
import pandas as pd
import os

def review_companies():
    base_dir = os.path.join(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    conn = sqlite3.connect(db_path)
    
    target_companies = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'SBIN']
    
    for comp_id in target_companies:
        print("=" * 80)
        print(f"=== REVIEWING: {comp_id} ===")
        print("=" * 80)
        
        # Companies table
        print("\n--- Companies Table: ---")
        comp_df = pd.read_sql("SELECT * FROM companies WHERE id = ?", conn, params=(comp_id,))
        if not comp_df.empty:
            print(comp_df.T.to_string(header=False))
        
        # P&L
        print("\n--- Profit & Loss (Last 5 entries): ---")
        pnl_df = pd.read_sql("SELECT * FROM profitandloss WHERE company_id = ? ORDER BY id DESC LIMIT 5", 
                             conn, params=(comp_id,))
        if not pnl_df.empty:
            print(pnl_df[['year', 'sales', 'operating_profit', 'net_profit']].to_string(index=False))
        
        # Balance Sheet
        print("\n--- Balance Sheet (Last 5 entries): ---")
        bs_df = pd.read_sql("SELECT * FROM balancesheet WHERE company_id = ? ORDER BY id DESC LIMIT 5", 
                           conn, params=(comp_id,))
        if not bs_df.empty:
            print(bs_df[['year', 'total_assets', 'total_liabilities']].to_string(index=False))
        
        # Cash Flow
        print("\n--- Cash Flow (Last 5 entries): ---")
        cf_df = pd.read_sql("SELECT * FROM cashflow WHERE company_id = ? ORDER BY id DESC LIMIT 5", 
                           conn, params=(comp_id,))
        if not cf_df.empty:
            print(cf_df[['year', 'operating_activity', 'investing_activity', 'financing_activity']].to_string(index=False))
        
        # Documents
        print("\n--- Documents (Last 5 entries): ---")
        docs_df = pd.read_sql("SELECT * FROM documents WHERE company_id = ? ORDER BY id DESC LIMIT 5", 
                             conn, params=(comp_id,))
        if not docs_df.empty:
            print(docs_df[['Year', 'Annual_Report']].to_string(index=False))
        
        # Stock Prices
        print("\n--- Stock Prices (Last 5 entries): ---")
        sp_df = pd.read_sql("SELECT * FROM stock_prices WHERE company_id = ? ORDER BY id DESC LIMIT 5", 
                          conn, params=(comp_id,))
        if not sp_df.empty:
            print(sp_df[['date', 'open_price', 'close_price', 'volume']].to_string(index=False))
        
        print("\n" * 2)
    
    conn.close()
    print("Review complete!")

if __name__ == "__main__":
    review_companies()
