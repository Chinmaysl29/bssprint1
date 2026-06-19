
import sqlite3
import pandas as pd
import os

def generate_html_report():
    base_dir = os.path.join(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    conn = sqlite3.connect(db_path)
    
    target_companies = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'SBIN']
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            h2 { color: #555; margin-top: 40px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .section { margin-bottom: 40px; }
        </style>
    </head>
    <body>
        <h1>Nifty 100 - Manual Review Report</h1>
        <h3>Companies: TCS, INFY, RELIANCE, HDFCBANK, SBIN</h3>
    """
    
    for comp_id in target_companies:
        html_content += f"<div class='section'><h2>{comp_id}</h2>"
        
        # Companies
        comp_df = pd.read_sql("SELECT * FROM companies WHERE id = ?", conn, params=(comp_id,))
        if not comp_df.empty:
            html_content += "<h4>Company Info:</h4>"
            html_content += comp_df.to_html(index=False, escape=False)
        
        # P&L
        html_content += "<h4>Profit & Loss (Last 5):</h4>"
        pnl_df = pd.read_sql("SELECT year, sales, operating_profit, net_profit FROM profitandloss WHERE company_id = ? ORDER BY id DESC LIMIT 5", conn, params=(comp_id,))
        if not pnl_df.empty:
            html_content += pnl_df.to_html(index=False)
        
        # BS
        html_content += "<h4>Balance Sheet (Last 5):</h4>"
        bs_df = pd.read_sql("SELECT year, total_assets, total_liabilities FROM balancesheet WHERE company_id = ? ORDER BY id DESC LIMIT 5", conn, params=(comp_id,))
        if not bs_df.empty:
            html_content += bs_df.to_html(index=False)
        
        # CF
        html_content += "<h4>Cash Flow (Last 5):</h4>"
        cf_df = pd.read_sql("SELECT year, operating_activity, investing_activity, financing_activity FROM cashflow WHERE company_id = ? ORDER BY id DESC LIMIT 5", conn, params=(comp_id,))
        if not cf_df.empty:
            html_content += cf_df.to_html(index=False)
        
        # Documents
        html_content += "<h4>Documents (Last 5):</h4>"
        docs_df = pd.read_sql("SELECT Year, Annual_Report FROM documents WHERE company_id = ? ORDER BY id DESC LIMIT 5", conn, params=(comp_id,))
        if not docs_df.empty:
            html_content += docs_df.to_html(index=False, escape=False)
        
        # Stock Prices
        html_content += "<h4>Stock Prices (Last 5):</h4>"
        sp_df = pd.read_sql("SELECT date, open_price, close_price, volume FROM stock_prices WHERE company_id = ? ORDER BY id DESC LIMIT 5", conn, params=(comp_id,))
        if not sp_df.empty:
            html_content += sp_df.to_html(index=False)
        
        html_content += "</div>"
    
    html_content += "</body></html>"
    conn.close()
    
    with open(os.path.join(base_dir, 'manual_review_report.html'), 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Report saved as manual_review_report.html!")

if __name__ == "__main__":
    generate_html_report()
