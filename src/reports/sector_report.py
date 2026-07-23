import os
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import warnings
import textwrap
import sys
from matplotlib.backends.backend_pdf import PdfPages

# Suppress RuntimeWarning for empty slices (all-NaN columns when calculating medians)
warnings.filterwarnings("ignore", category=RuntimeWarning, message="Mean of empty slice")
try:
    plt.style.use('seaborn-v0_8-whitegrid')
except:
    try:
        plt.style.use('seaborn-whitegrid')
    except:
        pass

# Add src to path so we can import cagr
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from analytics.cagr import calculate_multiyear_sales_cagr, calculate_multiyear_profit_cagr

def get_database_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, "db", "nifty100.db")

def generate_sector_report(sector_name, out_dir):
    print(f"Generating report for sector: {sector_name}")
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    
    # 1. Fetch Companies in Sector
    comp_query = """
    SELECT s.company_id, c.company_name, c.roe_percentage, c.roce_percentage 
    FROM sectors s 
    JOIN companies c ON s.company_id = c.id 
    WHERE s.sector = ?
    """
    comp_df = pd.read_sql(comp_query, conn, params=(sector_name,))
    
    if comp_df.empty:
        print(f"No companies found for sector {sector_name}")
        conn.close()
        return

    # 2. Fetch Financials for Sector
    fin_query = """
    SELECT 
        p.year,
        p.company_id,
        p.sales,
        p.net_profit,
        p.operating_profit,
        b.borrowings,
        b.equity_capital,
        b.reserves
    FROM profitandloss p
    LEFT JOIN balancesheet b ON p.company_id = b.company_id AND p.year = b.year
    JOIN sectors s ON p.company_id = s.company_id
    WHERE s.sector = ?
    """
    fin_df = pd.read_sql(fin_query, conn, params=(sector_name,))
    conn.close()
    
    # Calculate CAGRs globally and merge
    sales_cagr_df = calculate_multiyear_sales_cagr([10])
    pat_cagr_df = calculate_multiyear_profit_cagr([10])
    
    if not sales_cagr_df.empty:
        comp_df = pd.merge(comp_df, sales_cagr_df[['company_id', 'sales_cagr_pct']], on='company_id', how='left')
    else:
        comp_df['sales_cagr_pct'] = None
        
    if not pat_cagr_df.empty:
        comp_df = pd.merge(comp_df, pat_cagr_df[['company_id', 'net_profit_cagr_pct']], on='company_id', how='left')
    else:
        comp_df['net_profit_cagr_pct'] = None

    # Calculate latest debt/equity for each company
    if not fin_df.empty:
        latest_fin = fin_df.sort_values('year').groupby('company_id').tail(1)
        latest_fin['debt_equity'] = latest_fin.apply(
            lambda x: x['borrowings'] / x['equity_capital'] if pd.notna(x['borrowings']) and pd.notna(x['equity_capital']) and x['equity_capital'] != 0 else None, 
            axis=1
        )
        comp_df = pd.merge(comp_df, latest_fin[['company_id', 'debt_equity']], on='company_id', how='left')
    else:
        comp_df['debt_equity'] = None

    # --- KPI Calculations ---
    total_companies = len(comp_df)
    avg_roe = comp_df['roe_percentage'].median()
    avg_roce = comp_df['roce_percentage'].median()
    avg_rev_cagr = comp_df['sales_cagr_pct'].median()
    avg_pat_cagr = comp_df['net_profit_cagr_pct'].median()
    median_de = comp_df['debt_equity'].median()
    
    # Ranking by ROE for top/bottom
    ranked_df = comp_df.sort_values('roe_percentage', ascending=False).dropna(subset=['roe_percentage'])
    top_performers = ranked_df.head(3)['company_name'].tolist()
    bottom_performers = ranked_df.tail(3)['company_name'].tolist()

    # --- PDF Generation ---
    os.makedirs(out_dir, exist_ok=True)
    pdf_filename = "".join([c if c.isalnum() else "_" for c in sector_name]) + "_Sector_Report.pdf"
    pdf_path = os.path.join(out_dir, pdf_filename)
    
    with PdfPages(pdf_path) as pdf:
        # PAGE 1: Overview & KPIs
        fig = plt.figure(figsize=(8.5, 11))
        
        # Header
        fig.text(0.5, 0.95, f"{sector_name} - Sector Overview", ha='center', va='top', fontsize=20, fontweight='bold')
        fig.text(0.5, 0.90, f"Total Companies: {total_companies}", ha='center', va='top', fontsize=14, color='gray')
        
        # KPI Cards (2x3 grid)
        kpi_vals = {
            "Median ROE": f"{avg_roe:.2f}%" if pd.notna(avg_roe) else "N/A",
            "Median ROCE": f"{avg_roce:.2f}%" if pd.notna(avg_roce) else "N/A",
            "Median 10Y Rev CAGR": f"{avg_rev_cagr:.2f}%" if pd.notna(avg_rev_cagr) else "N/A",
            "Median 10Y PAT CAGR": f"{avg_pat_cagr:.2f}%" if pd.notna(avg_pat_cagr) else "N/A",
            "Median Debt/Equity": f"{median_de:.2f}" if pd.notna(median_de) else "N/A",
            "Companies Analyzed": str(total_companies)
        }
        
        kpi_names = list(kpi_vals.keys())
        for i in range(2):
            for j in range(3):
                idx = i * 3 + j
                x = 0.2 + j * 0.3
                y = 0.78 - i * 0.08
                fig.text(x, y+0.03, kpi_names[idx], ha='center', fontsize=10, color='gray', fontweight='bold')
                fig.text(x, y, kpi_vals[kpi_names[idx]], ha='center', fontsize=14, fontweight='bold')
                # Box
                rect = plt.Rectangle((x-0.12, y-0.02), 0.24, 0.07, fill=False, color='lightgray', lw=1.5, transform=fig.transFigure)
                fig.add_artist(rect)
                
        # Top and Bottom Performers
        y_pos = 0.60
        fig.text(0.1, y_pos, "Top Performing Companies (by ROE):", fontsize=12, fontweight='bold', color='green')
        for idx, comp in enumerate(top_performers):
            fig.text(0.12, y_pos - (idx+1)*0.03, f"{idx+1}. {comp}", fontsize=10)
            
        fig.text(0.5, y_pos, "Bottom Performing Companies (by ROE):", fontsize=12, fontweight='bold', color='red')
        for idx, comp in enumerate(bottom_performers):
            fig.text(0.52, y_pos - (idx+1)*0.03, f"{idx+1}. {comp}", fontsize=10)
            
        # Sector Charts (Aggregated)
        if not fin_df.empty:
            agg_df = fin_df.groupby('year').sum().reset_index()
            agg_df = agg_df.tail(10)
            years = agg_df['year'].astype(str)
            
            gs = fig.add_gridspec(2, 2, left=0.1, right=0.9, top=0.45, bottom=0.08, hspace=0.4, wspace=0.3)
            
            # Revenue Aggregated
            ax1 = fig.add_subplot(gs[0, 0])
            ax1.bar(years, agg_df['sales'], color='#3498DB')
            ax1.set_title("Sector Total Revenue (10Y)", fontweight='bold', color='#2C3E50')
            ax1.tick_params(axis='x', rotation=45)
            
            # Profit Aggregated
            ax2 = fig.add_subplot(gs[0, 1])
            ax2.bar(years, agg_df['net_profit'], color='#27AE60')
            ax2.set_title("Sector Total Net Profit (10Y)", fontweight='bold', color='#2C3E50')
            ax2.tick_params(axis='x', rotation=45)
            
            # Margins (Sector Avg)
            agg_df['net_margin'] = agg_df.apply(lambda x: (x['net_profit'] / x['sales'] * 100) if x['sales'] != 0 else None, axis=1)
            ax3 = fig.add_subplot(gs[1, :])
            ax3.plot(years, agg_df['net_margin'], marker='o', color='#E74C3C', label='Net Margin (%)', linewidth=2)
            ax3.set_title("Sector Aggregate Net Margin Trend", fontweight='bold', color='#2C3E50')
            ax3.set_ylabel("Margin (%)", color='#E74C3C')
            ax3.tick_params(axis='x', rotation=45)
            ax3.legend()

        pdf.savefig(fig)
        plt.close(fig)
        
        # PAGE 2: Company Ranking Table
        fig2 = plt.figure(figsize=(11, 8.5)) # Landscape for table
        fig2.text(0.5, 0.92, f"{sector_name} - Company Ranking Table", ha='center', va='top', fontsize=16, fontweight='bold')
        
        ax_table = fig2.add_subplot(111)
        ax_table.axis('tight')
        ax_table.axis('off')
        
        # Prepare table data
        table_df = comp_df[['company_id', 'company_name', 'roe_percentage', 'roce_percentage', 'sales_cagr_pct', 'net_profit_cagr_pct', 'debt_equity']].copy()
        # Clean up
        table_df = table_df.sort_values(by='roe_percentage', ascending=False)
        table_df = table_df.round(2)
        table_df = table_df.fillna("N/A")
        
        cols = ["Ticker", "Company Name", "ROE (%)", "ROCE (%)", "10Y Rev CAGR (%)", "10Y PAT CAGR (%)", "D/E Ratio"]
        cell_text = []
        for _, row in table_df.iterrows():
            cell_text.append([
                row['company_id'],
                textwrap.shorten(row['company_name'], width=25, placeholder="..."),
                row['roe_percentage'],
                row['roce_percentage'],
                row['sales_cagr_pct'],
                row['net_profit_cagr_pct'],
                row['debt_equity']
            ])
            
        # Add table
        table = ax_table.table(cellText=cell_text, colLabels=cols, cellLoc='center', loc='center', bbox=[0.05, 0.1, 0.9, 0.8])
        table.auto_set_font_size(False)
        table.set_fontsize(8)
        table.scale(1, 1.2)
        
        pdf.savefig(fig2)
        plt.close(fig2)
        
    print(f"Successfully generated sector report at {pdf_path}")


def generate_all_sector_reports():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = os.path.join(base_dir, "reports", "sector")
    os.makedirs(out_dir, exist_ok=True)
    
    db_path = get_database_path()
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
        
    conn = sqlite3.connect(db_path)
    # Fetch all distinct sectors
    query = "SELECT DISTINCT sector FROM sectors WHERE sector IS NOT NULL"
    df = pd.read_sql(query, conn)
    conn.close()
    
    sectors = df['sector'].dropna().tolist()
    print(f"Found {len(sectors)} sectors. Starting batch generation...")
    
    success_count = 0
    error_list = []
    
    for idx, sector_name in enumerate(sectors, 1):
        try:
            print(f"[{idx}/{len(sectors)}] Processing {sector_name}...")
            generate_sector_report(sector_name, out_dir=out_dir)
            success_count += 1
        except Exception as e:
            print(f"Error generating report for {sector_name}: {e}")
            error_list.append((sector_name, str(e)))
            
    print("=" * 40)
    print("Sector Batch Generation Complete")
    print(f"Successfully generated: {success_count}/{len(sectors)}")
    if error_list:
        print(f"Failed: {len(error_list)}")
        for sec, err in error_list:
            print(f"  - {sec}: {err}")

if __name__ == "__main__":
    generate_all_sector_reports()
