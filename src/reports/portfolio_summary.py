import os
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import sys
import numpy as np
import warnings
import textwrap

# Suppress RuntimeWarning for empty slices
warnings.filterwarnings("ignore", category=RuntimeWarning, message="Mean of empty slice")
warnings.filterwarnings("ignore", category=RuntimeWarning, message="All-NaN axis encountered")

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

def generate_portfolio_summary():
    print("Generating Portfolio Summary...")
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = os.path.join(base_dir, "reports", "portfolio")
    os.makedirs(out_dir, exist_ok=True)
    
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    
    # 1. Fetch Companies & Sectors
    comp_query = """
    SELECT c.id as company_id, c.company_name, c.roe_percentage, c.roce_percentage, s.sector 
    FROM companies c 
    LEFT JOIN sectors s ON c.id = s.company_id
    """
    comp_df = pd.read_sql(comp_query, conn)
    
    # 2. Fetch Latest Financials for Debt/Equity
    fin_query = """
    SELECT company_id, year, borrowings, equity_capital
    FROM balancesheet
    """
    bs_df = pd.read_sql(fin_query, conn)
    if not bs_df.empty:
        latest_bs = bs_df.sort_values('year').groupby('company_id').tail(1).copy()
        latest_bs['debt_equity'] = latest_bs.apply(
            lambda x: x['borrowings'] / x['equity_capital'] if pd.notna(x['borrowings']) and pd.notna(x['equity_capital']) and x['equity_capital'] != 0 else None, 
            axis=1
        )
        comp_df = pd.merge(comp_df, latest_bs[['company_id', 'debt_equity']], on='company_id', how='left')
    else:
        comp_df['debt_equity'] = None
        
    # 3. Fetch CFO Quality Score
    fr_query = """
    SELECT company_id, year, cfo_quality_score
    FROM financial_ratios
    """
    fr_df = pd.read_sql(fr_query, conn)
    high_cfo_count = 0
    if not fr_df.empty:
        latest_fr = fr_df.sort_values('year').groupby('company_id').tail(1)
        high_cfo_count = (latest_fr['cfo_quality_score'] > 1).sum()
        
    conn.close()

    # 4. Fetch CAGRs
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

    # 5. Fetch Additional CSV Data
    val_csv = os.path.join(base_dir, "output", "valuation_summary.csv")
    fcf_yield_avg = None
    if os.path.exists(val_csv):
        val_df = pd.read_csv(val_csv)
        # Assuming one row per company (latest)
        latest_val = val_df.drop_duplicates(subset=['company_id'], keep='last')
        fcf_yield_avg = latest_val['fcf_yield_pct'].mean()
        
    distress_csv = os.path.join(base_dir, "output", "distress_alerts.csv")
    distress_count = 0
    if os.path.exists(distress_csv):
        distress_df = pd.read_csv(distress_csv)
        if 'Distress Flag' in distress_df.columns:
            distress_count = (distress_df['Distress Flag'] == 'Yes').sum()
            
    alloc_csv = os.path.join(base_dir, "output", "capital_allocation.csv")
    alloc_counts = {}
    if os.path.exists(alloc_csv):
        alloc_df = pd.read_csv(alloc_csv)
        latest_alloc = alloc_df.sort_values('financial_year').groupby('company_id').tail(1)
        if 'capital_allocation_label' in latest_alloc.columns:
            alloc_counts = latest_alloc['capital_allocation_label'].value_counts().to_dict()

    # --- Calculations ---
    total_companies = len(comp_df)
    total_sectors = comp_df['sector'].nunique()
    
    avg_roe = comp_df['roe_percentage'].mean()
    avg_roce = comp_df['roce_percentage'].mean()
    avg_rev_cagr = comp_df['sales_cagr_pct'].mean()
    avg_pat_cagr = comp_df['net_profit_cagr_pct'].mean()
    avg_de = comp_df['debt_equity'].mean()
    
    # Rankings
    ranked_df = comp_df.sort_values(by='roe_percentage', ascending=False).dropna(subset=['roe_percentage'])
    top_20 = ranked_df.head(20)
    bottom_20 = ranked_df.tail(20)

    # --- PDF Generation ---
    pdf_path = os.path.join(out_dir, "portfolio_summary.pdf")
    
    with PdfPages(pdf_path) as pdf:
        # PAGE 1: Overview & KPIs
        fig = plt.figure(figsize=(8.5, 11))
        
        fig.text(0.5, 0.95, "Portfolio Summary", ha='center', va='top', fontsize=24, fontweight='bold')
        fig.text(0.5, 0.90, "Overall Portfolio Statistics and Health", ha='center', va='top', fontsize=14, color='gray')
        
        # Section 1: Overall Statistics
        fig.text(0.1, 0.85, "Overall Statistics", fontsize=14, fontweight='bold', color='darkblue')
        stats_vals = {
            "Total Companies": f"{total_companies}",
            "Total Sectors": f"{total_sectors}",
            "Average ROE": f"{avg_roe:.2f}%" if pd.notna(avg_roe) else "N/A",
            "Average ROCE": f"{avg_roce:.2f}%" if pd.notna(avg_roce) else "N/A",
            "Average Revenue CAGR": f"{avg_rev_cagr:.2f}%" if pd.notna(avg_rev_cagr) else "N/A",
            "Average PAT CAGR": f"{avg_pat_cagr:.2f}%" if pd.notna(avg_pat_cagr) else "N/A",
        }
        
        keys1 = list(stats_vals.keys())
        for i in range(2):
            for j in range(3):
                idx = i * 3 + j
                x = 0.2 + j * 0.3
                y = 0.75 - i * 0.08
                fig.text(x, y+0.03, keys1[idx], ha='center', fontsize=10, color='gray', fontweight='bold')
                fig.text(x, y, stats_vals[keys1[idx]], ha='center', fontsize=14, fontweight='bold')
                rect = plt.Rectangle((x-0.12, y-0.02), 0.24, 0.07, fill=False, color='lightblue', lw=1.5, transform=fig.transFigure)
                fig.add_artist(rect)
                
        # Section 2: Portfolio KPIs
        fig.text(0.1, 0.58, "Portfolio KPIs", fontsize=14, fontweight='bold', color='darkblue')
        kpi_vals = {
            "Average Debt/Equity": f"{avg_de:.2f}" if pd.notna(avg_de) else "N/A",
            "Average FCF Yield": f"{fcf_yield_avg:.2f}%" if pd.notna(fcf_yield_avg) else "N/A",
            "Companies in Distress": f"{distress_count}",
            "High Quality CFO": f"{high_cfo_count}"
        }
        
        keys2 = list(kpi_vals.keys())
        for i in range(2):
            for j in range(2):
                idx = i * 2 + j
                x = 0.3 + j * 0.4
                y = 0.48 - i * 0.08
                fig.text(x, y+0.03, keys2[idx], ha='center', fontsize=10, color='gray', fontweight='bold')
                fig.text(x, y, kpi_vals[keys2[idx]], ha='center', fontsize=14, fontweight='bold')
                rect = plt.Rectangle((x-0.16, y-0.02), 0.32, 0.07, fill=False, color='lightgreen', lw=1.5, transform=fig.transFigure)
                fig.add_artist(rect)
                
        pdf.savefig(fig)
        plt.close(fig)
        
        # PAGE 2: Charts
        fig2 = plt.figure(figsize=(11, 8.5))
        fig2.text(0.5, 0.95, "Portfolio Distribution Charts", ha='center', va='top', fontsize=18, fontweight='bold')
        
        gs = fig2.add_gridspec(2, 2, left=0.1, right=0.9, top=0.85, bottom=0.1, hspace=0.4, wspace=0.3)
        
        # Chart 1: Sector Distribution
        ax1 = fig2.add_subplot(gs[0, 0])
        sector_counts = comp_df['sector'].value_counts()
        ax1.pie(sector_counts.values, labels=sector_counts.index, autopct='%1.1f%%', startangle=90, textprops={'fontsize': 7})
        ax1.set_title("Sector Distribution", fontweight='bold', color='#2C3E50')
        
        # Chart 2: Capital Allocation Distribution
        ax2 = fig2.add_subplot(gs[0, 1])
        if alloc_counts:
            ax2.pie(list(alloc_counts.values()), labels=list(alloc_counts.keys()), autopct='%1.1f%%', startangle=90, colors=['#F1C40F', '#3498DB', '#2ECC71', '#E74C3C'], textprops={'fontsize': 7})
        else:
            ax2.text(0.5, 0.5, "No Data", ha='center')
        ax2.set_title("Capital Allocation Distribution", fontweight='bold', color='#2C3E50')
        
        # Chart 3: ROE Distribution
        ax3 = fig2.add_subplot(gs[1, 0])
        valid_roe = comp_df['roe_percentage'].dropna()
        ax3.hist(valid_roe, bins=20, color='#3498DB', alpha=0.8, edgecolor='black')
        ax3.set_title("ROE Distribution", fontweight='bold', color='#2C3E50')
        ax3.set_xlabel("ROE (%)")
        ax3.set_ylabel("Count")
        
        # Chart 4: Revenue CAGR Distribution
        ax4 = fig2.add_subplot(gs[1, 1])
        valid_cagr = comp_df['sales_cagr_pct'].dropna()
        ax4.hist(valid_cagr, bins=20, color='#27AE60', alpha=0.8, edgecolor='black')
        ax4.set_title("10Y Revenue CAGR Distribution", fontweight='bold', color='#2C3E50')
        ax4.set_xlabel("CAGR (%)")
        ax4.set_ylabel("Count")
        
        pdf.savefig(fig2)
        plt.close(fig2)
        
        # PAGE 3: Top 20 Companies
        fig3 = plt.figure(figsize=(11, 8.5))
        fig3.text(0.5, 0.95, "Portfolio Ranking: Top 20 Companies (by ROE)", ha='center', va='top', fontsize=18, fontweight='bold', color='green')
        
        ax_top = fig3.add_subplot(111)
        ax_top.axis('tight')
        ax_top.axis('off')
        
        top_table = top_20[['company_id', 'company_name', 'roe_percentage', 'roce_percentage', 'sales_cagr_pct', 'net_profit_cagr_pct']].copy()
        top_table = top_table.round(2).fillna("N/A")
        cols = ["Ticker", "Company Name", "ROE (%)", "ROCE (%)", "10Y Rev CAGR", "10Y PAT CAGR"]
        
        cell_text_top = []
        for _, row in top_table.iterrows():
            cell_text_top.append([row['company_id'], textwrap.shorten(row['company_name'], 30), row['roe_percentage'], row['roce_percentage'], row['sales_cagr_pct'], row['net_profit_cagr_pct']])
            
        table1 = ax_top.table(cellText=cell_text_top, colLabels=cols, cellLoc='center', loc='center', bbox=[0.1, 0.1, 0.8, 0.8])
        table1.auto_set_font_size(False)
        table1.set_fontsize(9)
        table1.scale(1, 1.2)
        
        pdf.savefig(fig3)
        plt.close(fig3)
        
        # PAGE 4: Bottom 20 Companies
        fig4 = plt.figure(figsize=(11, 8.5))
        fig4.text(0.5, 0.95, "Portfolio Ranking: Bottom 20 Companies (by ROE)", ha='center', va='top', fontsize=18, fontweight='bold', color='red')
        
        ax_bot = fig4.add_subplot(111)
        ax_bot.axis('tight')
        ax_bot.axis('off')
        
        bot_table = bottom_20[['company_id', 'company_name', 'roe_percentage', 'roce_percentage', 'sales_cagr_pct', 'net_profit_cagr_pct']].copy()
        bot_table = bot_table.round(2).fillna("N/A")
        
        cell_text_bot = []
        for _, row in bot_table.iterrows():
            cell_text_bot.append([row['company_id'], textwrap.shorten(row['company_name'], 30), row['roe_percentage'], row['roce_percentage'], row['sales_cagr_pct'], row['net_profit_cagr_pct']])
            
        table2 = ax_bot.table(cellText=cell_text_bot, colLabels=cols, cellLoc='center', loc='center', bbox=[0.1, 0.1, 0.8, 0.8])
        table2.auto_set_font_size(False)
        table2.set_fontsize(9)
        table2.scale(1, 1.2)
        
        pdf.savefig(fig4)
        plt.close(fig4)
        
    print(f"Successfully generated Portfolio Summary at {pdf_path}")

if __name__ == "__main__":
    generate_portfolio_summary()
