import os
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import sys

try:
    plt.style.use('seaborn-v0_8-whitegrid')
except:
    try:
        plt.style.use('seaborn-whitegrid')
    except:
        pass # fallback to default
import textwrap

# Add src to path so we can import cagr
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from analytics.cagr import calculate_multiyear_sales_cagr, calculate_multiyear_profit_cagr


def get_database_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, "db", "nifty100.db")


def fetch_company_data(company_id):
    conn = sqlite3.connect(get_database_path())
    
    # Header Info
    header_query = """
    SELECT c.company_name, c.id as ticker, s.sector 
    FROM companies c 
    LEFT JOIN sectors s ON c.id = s.company_id 
    WHERE c.id = ?
    """
    header_df = pd.read_sql(header_query, conn, params=(company_id,))
    
    if header_df.empty:
        conn.close()
        return None
        
    # KPIs
    kpi_query = """
    SELECT c.roe_percentage as roe, c.roce_percentage as roce
    FROM companies c WHERE c.id = ?
    """
    kpi_df = pd.read_sql(kpi_query, conn, params=(company_id,))
    
    # Financials
    fin_query = """
    SELECT 
        p.year,
        p.sales,
        p.net_profit,
        p.operating_profit,
        b.borrowings,
        b.equity_capital,
        b.reserves,
        b.other_liabilities,
        cf.operating_activity,
        cf.investing_activity,
        cf.financing_activity
    FROM profitandloss p
    LEFT JOIN balancesheet b ON p.company_id = b.company_id AND p.year = b.year
    LEFT JOIN cashflow cf ON p.company_id = cf.company_id AND p.year = cf.year
    WHERE p.company_id = ?
    ORDER BY p.year ASC
    """
    fin_df = pd.read_sql(fin_query, conn, params=(company_id,))
    conn.close()
    
    # Calculate CAGRs
    sales_cagr_df = calculate_multiyear_sales_cagr([10])
    sales_cagr_val = None
    if not sales_cagr_df.empty:
        match = sales_cagr_df[sales_cagr_df['company_id'] == company_id]
        if not match.empty:
            sales_cagr_val = match.iloc[0]['sales_cagr_pct']
            
    pat_cagr_df = calculate_multiyear_profit_cagr([10])
    pat_cagr_val = None
    if not pat_cagr_df.empty:
        match = pat_cagr_df[pat_cagr_df['company_id'] == company_id]
        if not match.empty:
            pat_cagr_val = match.iloc[0]['net_profit_cagr_pct']

    # Fetch Valuation Data
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    val_csv = os.path.join(base_dir, "output", "valuation_summary.csv")
    val_data = None
    if os.path.exists(val_csv):
        val_df = pd.read_csv(val_csv)
        val_match = val_df[val_df['company_id'] == company_id]
        if not val_match.empty:
            val_data = val_match.iloc[-1].to_dict()

    return {
        'header': header_df.iloc[0],
        'kpis': kpi_df.iloc[0] if not kpi_df.empty else None,
        'financials': fin_df,
        'sales_cagr': sales_cagr_val,
        'pat_cagr': pat_cagr_val,
        'valuation': val_data
    }


def generate_company_tearsheet(company_id: str, out_dir: str = None):
    """
    Generate a reusable 2-page company tearsheet.
    """
    print(f"Generating tearsheet for {company_id}...")
    data = fetch_company_data(company_id)
    if not data:
        raise ValueError("Company not found in database")
        
    # VALIDATION CHECKS
    fin_df = data['financials']
    if len(fin_df) < 3:
        raise ValueError("Less than 3 years of data")
        
    # Check for missing cash flow (if all cash flow data is empty)
    if fin_df['operating_activity'].dropna().empty and fin_df['investing_activity'].dropna().empty:
        raise ValueError("Missing cash flow")
        
    # Check for missing ratios
    if data['kpis'] is None or (pd.isna(data['kpis']['roe']) and pd.isna(data['kpis']['roce'])):
        raise ValueError("Missing ratios")
        
    if out_dir is None:
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "reports", "sample_tearsheets")
    else:
        output_dir = out_dir
        
    os.makedirs(output_dir, exist_ok=True)
    pdf_path = os.path.join(output_dir, f"{company_id}.pdf")
    
    with PdfPages(pdf_path) as pdf:
        # PAGE 1
        fig = plt.figure(figsize=(8.5, 11))
        
        # 1. Header
        header = data['header']
        name = textwrap.fill(header['company_name'], width=40)
        ticker = header['ticker']
        sector = textwrap.fill(header['sector'] if pd.notna(header['sector']) else "Unknown Sector", width=40)
        
        val_data = data.get('valuation', {})
        if not val_data:
            val_data = {}
            
        mcap = val_data.get('market_cap_crore', "N/A")
        mcap_str = f"₹{mcap:,.0f} Cr" if isinstance(mcap, (int, float)) and pd.notna(mcap) else "N/A"
        
        fig.text(0.5, 0.95, f"{name} ({ticker})", ha='center', va='top', fontsize=18, fontweight='bold')
        fig.text(0.5, 0.90, f"Sector: {sector} | Market Cap: {mcap_str}", ha='center', va='top', fontsize=12, color='gray')
        
        # 2. KPI Cards (2x3 grid)
        fin_df = data['financials']
        latest_fin = fin_df.iloc[-1] if not fin_df.empty else None
        
        debt_equity = "N/A"
        if latest_fin is not None and pd.notna(latest_fin['borrowings']) and pd.notna(latest_fin['equity_capital']) and latest_fin['equity_capital'] != 0:
            debt_equity = f"{latest_fin['borrowings'] / latest_fin['equity_capital']:.2f}"
            
        fcf_yield_val = val_data.get('fcf_yield_pct', "N/A")
        fcf_yield = f"{fcf_yield_val}%" if isinstance(fcf_yield_val, (int, float)) and pd.notna(fcf_yield_val) else "N/A"
        
        kpi_vals = {
            "ROE": f"{data['kpis']['roe']}%" if data['kpis'] is not None and pd.notna(data['kpis']['roe']) else "N/A",
            "ROCE": f"{data['kpis']['roce']}%" if data['kpis'] is not None and pd.notna(data['kpis']['roce']) else "N/A",
            "10Y Rev CAGR": f"{data['sales_cagr']}%" if data['sales_cagr'] is not None else "N/A",
            "10Y PAT CAGR": f"{data['pat_cagr']}%" if data['pat_cagr'] is not None else "N/A",
            "Debt/Equity": debt_equity,
            "FCF Yield": fcf_yield
        }
        
        kpi_names = list(kpi_vals.keys())
        for i in range(2):
            for j in range(3):
                idx = i * 3 + j
                x = 0.2 + j * 0.3
                y = 0.78 - i * 0.08
                fig.text(x, y+0.03, kpi_names[idx], ha='center', fontsize=10, color='gray', fontweight='bold')
                fig.text(x, y, kpi_vals[kpi_names[idx]], ha='center', fontsize=14, fontweight='bold')
                
                # Draw a box
                rect = plt.Rectangle((x-0.12, y-0.02), 0.24, 0.07, fill=False, color='lightgray', lw=1.5, transform=fig.transFigure)
                fig.add_artist(rect)
        
        # 3. Charts using GridSpec for responsive layout
        if not fin_df.empty:
            chart_df = fin_df.tail(10).copy()
            years = chart_df['year'].astype(str)
            
            gs = fig.add_gridspec(2, 2, left=0.1, right=0.9, top=0.62, bottom=0.08, hspace=0.4, wspace=0.3)
            
            # 10-Year Revenue Bar Chart
            ax1 = fig.add_subplot(gs[0, 0])
            ax1.bar(years, chart_df['sales'], color='#3498DB', label='Revenue')
            ax1.set_title("10-Year Revenue Trend", fontweight='bold', color='#2C3E50')
            ax1.tick_params(axis='x', rotation=45)
            
            # Profit Chart
            ax2 = fig.add_subplot(gs[0, 1])
            ax2.bar(years, chart_df['net_profit'], color='#27AE60', label='Net Profit')
            ax2.set_title("10-Year Profit Trend", fontweight='bold', color='#2C3E50')
            ax2.tick_params(axis='x', rotation=45)
            
            # ROE vs ROCE Dual-Axis Line Chart
            chart_df['calc_roe'] = chart_df.apply(
                lambda row: (row['net_profit'] / row['equity_capital'] * 100) 
                if pd.notna(row['net_profit']) and pd.notna(row['equity_capital']) and row['equity_capital'] != 0 else None, 
                axis=1
            )
            chart_df['calc_roce'] = chart_df.apply(
                lambda row: (row['operating_profit'] / (row['equity_capital'] + row['reserves'] + row['borrowings']) * 100)
                if pd.notna(row['operating_profit']) and pd.notna(row['equity_capital']) and pd.notna(row['reserves']) and pd.notna(row['borrowings']) 
                and (row['equity_capital'] + row['reserves'] + row['borrowings']) != 0 else None,
                axis=1
            )
            
            ax3 = fig.add_subplot(gs[1, :])
            ax3.plot(years, chart_df['calc_roe'], marker='o', color='#2C3E50', label='ROE (%)', linewidth=2)
            ax3.set_ylabel("ROE (%)", color='#2C3E50', fontweight='bold')
            ax3.tick_params(axis='y', labelcolor='#2C3E50')
            ax3.set_title("ROE & ROCE Trend", fontweight='bold', color='#2C3E50')
            
            ax3_twin = ax3.twinx()
            ax3_twin.plot(years, chart_df['calc_roce'], marker='s', color='#E74C3C', label='ROCE (%)', linewidth=2)
            ax3_twin.set_ylabel("ROCE (%)", color='#E74C3C', fontweight='bold')
            ax3_twin.tick_params(axis='y', labelcolor='#E74C3C')
            
            ax3.set_title("ROE vs ROCE Dual-Axis", fontweight='bold')
            ax3.tick_params(axis='x', rotation=45)
            
            lines_1, labels_1 = ax3.get_legend_handles_labels()
            lines_2, labels_2 = ax3_twin.get_legend_handles_labels()
            ax3.legend(lines_1 + lines_2, labels_1 + labels_2, loc='upper left')

        pdf.savefig(fig)
        plt.close(fig)
        
        # ---------------- PAGE 2 ----------------
        fig2 = plt.figure(figsize=(8.5, 11))
        
        # 1. Header (Same as page 1 to keep context)
        fig2.text(0.5, 0.95, f"{name} ({ticker}) - Page 2", ha='center', va='top', fontsize=18, fontweight='bold')
        
        # Capital Allocation Badge
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        allocation_csv = os.path.join(base_dir, "output", "capital_allocation.csv")
        badge_text = "Unknown Strategy"
        if os.path.exists(allocation_csv):
            alloc_df = pd.read_csv(allocation_csv)
            alloc_match = alloc_df[alloc_df['company_id'] == company_id]
            if not alloc_match.empty:
                badge_text = alloc_match.sort_values('financial_year').iloc[-1]['capital_allocation_label']
        
        # Draw badge
        fig2.text(0.5, 0.90, f"Capital Allocation: {badge_text}", ha='center', va='top', fontsize=14, 
                  bbox=dict(facecolor='gold', alpha=0.5, edgecolor='black', boxstyle='round,pad=0.5'))
                  
        # GridSpec for Page 2
        gs2 = fig2.add_gridspec(3, 2, left=0.1, right=0.9, top=0.82, bottom=0.05, hspace=0.4, wspace=0.3)
                  
        # 2. Balance Sheet Composition (Stacked Bar Chart)
        if not fin_df.empty:
            bs_df = fin_df.tail(10).copy()
            bs_df['total_equity'] = bs_df['equity_capital'].fillna(0) + bs_df['reserves'].fillna(0)
            
            years2 = bs_df['year'].astype(str)
            equity = bs_df['total_equity']
            borrowings = bs_df['borrowings'].fillna(0)
            other_liabilities = bs_df['other_liabilities'].fillna(0)
            
            ax_bs = fig2.add_subplot(gs2[0, 0])
            ax_bs.bar(years2, equity, label='Equity', color='lightblue')
            ax_bs.bar(years2, borrowings, bottom=equity, label='Borrowings', color='salmon')
            ax_bs.bar(years2, other_liabilities, bottom=equity+borrowings, label='Other Liabs', color='lightgray')
            ax_bs.set_title("Balance Sheet Composition", fontweight='bold')
            ax_bs.legend(fontsize=8)
            ax_bs.tick_params(axis='x', rotation=45, labelsize=8)
            
        # 3. Cash Flow Waterfall (Latest year)
        if not fin_df.empty:
            latest_cf = fin_df.iloc[-1]
            cfo = latest_cf['operating_activity'] if pd.notna(latest_cf['operating_activity']) else 0
            cfi = latest_cf['investing_activity'] if pd.notna(latest_cf['investing_activity']) else 0
            cff = latest_cf['financing_activity'] if pd.notna(latest_cf['financing_activity']) else 0
            ncf = cfo + cfi + cff
            
            categories = ['CFO', 'CFI', 'CFF', 'Net CF']
            values = [cfo, cfi, cff, ncf]
            
            ax_cf = fig2.add_subplot(gs2[0, 1])
            
            bottoms = [0, cfo, cfo + cfi, 0]
            colors = ['green' if v > 0 else 'red' for v in values[:-1]] + ['blue']
            
            for i in range(3):
                ax_cf.bar(categories[i], values[i], bottom=bottoms[i], color=colors[i])
            # Total bar
            ax_cf.bar(categories[3], values[3], bottom=0, color=colors[3])
            
            ax_cf.set_title(f"Cash Flow Waterfall ({latest_cf['year']})", fontweight='bold')
            ax_cf.tick_params(axis='x', rotation=45, labelsize=8)
            
        # 4. Valuation Summary
        ax_val = fig2.add_subplot(gs2[1, :])
        ax_val.axis('tight')
        ax_val.axis('off')
        
        ax_val.set_title("Valuation Summary", fontweight='bold', fontsize=12, pad=10)
        
        if val_data:
            cols = ["Metric", "Value"]
            cell_text = [
                ["P/E Ratio", f"{val_data.get('pe_ratio', 'N/A')}"],
                ["Sector Median P/E", f"{val_data.get('sector_median_pe', 'N/A')}"],
                ["P/E vs Sector", f"{val_data.get('pe_vs_sector_median', 'N/A')}x"],
                ["EV/EBITDA", f"{val_data.get('ev_ebitda', 'N/A')}"],
                ["P/B Ratio", f"{val_data.get('pb_ratio', 'N/A')}"],
                ["Dividend Yield", f"{val_data.get('dividend_yield_pct', 'N/A')}%"],
                ["Valuation Flag", f"{val_data.get('valuation_flag', 'N/A')}"]
            ]
            # Create table
            table = ax_val.table(cellText=cell_text, colLabels=cols, cellLoc='center', loc='center', bbox=[0.2, 0.1, 0.6, 0.8])
            table.auto_set_font_size(False)
            table.set_fontsize(10)
            table.scale(1, 1.5)
        else:
            ax_val.text(0.5, 0.5, "No Valuation Data Available", ha='center', va='center', fontsize=10, color='gray')

        # 5. Pros & Cons
        pros_cons_csv = os.path.join(base_dir, "output", "pros_cons_generated.csv")
        pros = []
        cons = []
        if os.path.exists(pros_cons_csv):
            pc_df = pd.read_csv(pros_cons_csv)
            pc_match = pc_df[pc_df['company_id'] == company_id]
            pros = pc_match[pc_match['type'] == 'Pro']['text'].tolist()
            cons = pc_match[pc_match['type'] == 'Con']['text'].tolist()
            
        ax_pros = fig2.add_subplot(gs2[2, 0])
        ax_pros.axis('off')
        
        y_pos = 1.0
        line_height = 0.08
        
        ax_pros.text(0, y_pos, "Pros:", color='green', fontweight='bold', fontsize=12, transform=ax_pros.transAxes)
        y_pos -= line_height * 1.5
        for p in pros[:5]: # limit to top 5
            wrapped_text = "\n".join(textwrap.wrap(p, width=45))
            num_lines = len(wrapped_text.split('\n'))
            ax_pros.text(0.02, y_pos, f"• {wrapped_text}", color='green', fontsize=9, va='top', transform=ax_pros.transAxes)
            y_pos -= line_height * (num_lines + 0.5)
            
        ax_cons = fig2.add_subplot(gs2[2, 1])
        ax_cons.axis('off')
        
        y_pos = 1.0
        ax_cons.text(0, y_pos, "Cons:", color='red', fontweight='bold', fontsize=12, transform=ax_cons.transAxes)
        y_pos -= line_height * 1.5
        for c in cons[:5]: # limit to top 5
            wrapped_text = "\n".join(textwrap.wrap(c, width=45))
            num_lines = len(wrapped_text.split('\n'))
            ax_cons.text(0.02, y_pos, f"• {wrapped_text}", color='red', fontsize=9, va='top', transform=ax_cons.transAxes)
            y_pos -= line_height * (num_lines + 0.5)

        pdf.savefig(fig2)
        plt.close(fig2)
        
    print(f"Successfully generated tearsheet for {company_id} at {pdf_path}")


if __name__ == "__main__":
    print("=== Tearsheet Generator Test ===")
    test_companies = ["TCS", "HDFCBANK", "RELIANCE", "SUNPHARMA", "TATASTEEL"]
    for comp in test_companies:
        try:
            generate_company_tearsheet(comp)
        except Exception as e:
            print(f"Error generating {comp}: {e}")
