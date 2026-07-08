
import sqlite3
import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# Add root directory to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)


def get_database_path():
    """Get path to nifty100.db"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, "db", "nifty100.db")
    return db_path


def get_peer_excel_path():
    """Get path to peer_groups.xlsx"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    excel_path = os.path.join(base_dir, "data", "supporting", "peer_groups.xlsx")
    return excel_path


def get_output_dir():
    """Get output directory for saving charts"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    output_dir = os.path.join(base_dir, "output", "peer_charts")
    os.makedirs(output_dir, exist_ok=True)
    return output_dir


def load_peer_groups():
    """Load peer groups from Excel file"""
    excel_df = pd.read_excel(get_peer_excel_path())
    excel_df = excel_df.rename(columns={
        'peer_group_name': 'group_name',
        'is_benchmark': 'is_primary'
    })
    return excel_df


def load_financial_metrics():
    """Load key financial metrics for peer companies from database"""
    conn = sqlite3.connect(get_database_path())
    
    query = """
        SELECT 
            c.id as company_id,
            c.company_name,
            s.sector,
            c.roe_percentage,
            c.roce_percentage,
            pf.net_profit,
            pf.sales
        FROM companies c
        LEFT JOIN sectors s ON c.id = s.company_id
        LEFT JOIN (
            SELECT company_id, net_profit, sales 
            FROM profitandloss 
            ORDER BY year DESC
            LIMIT 1 OFFSET 0
        ) pf ON c.id = pf.company_id
        ORDER BY c.company_name
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df


def load_all_10_metrics():
    """
    Load all 10 required metrics for percentile calculation:
    1. ROE
    2. ROCE
    3. Net Profit Margin
    4. Debt-to-Equity
    5. FCF
    6. PAT CAGR 5yr
    7. Revenue CAGR 5yr
    8. EPS CAGR 5yr
    9. Interest Coverage
    10. Asset Turnover
    """
    conn = sqlite3.connect(get_database_path())
    
    # 1. Load base company info (ROE, ROCE)
    companies_df = pd.read_sql("""
        SELECT 
            id as company_id,
            company_name,
            roe_percentage as ROE,
            roce_percentage as ROCE
        FROM companies
    """, conn)
    
    # 2. Load sector info
    sectors_df = pd.read_sql("SELECT company_id, sector FROM sectors", conn)
    
    # 3. Get latest profit and loss (for Net Profit Margin, Interest Coverage, FCF)
    latest_pl_df = pd.read_sql("""
        WITH ranked_pl AS (
            SELECT 
                *,
                ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY year DESC) as rn
            FROM profitandloss
        )
        SELECT 
            company_id,
            sales,
            net_profit,
            operating_profit,
            other_income,
            interest
        FROM ranked_pl
        WHERE rn = 1
    """, conn)
    
    # 4. Get latest balance sheet (for Debt-to-Equity, Asset Turnover)
    latest_bs_df = pd.read_sql("""
        WITH ranked_bs AS (
            SELECT 
                *,
                ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY year DESC) as rn
            FROM balancesheet
        )
        SELECT 
            company_id,
            equity_capital,
            reserves,
            borrowings,
            total_assets
        FROM ranked_bs
        WHERE rn = 1
    """, conn)
    
    # 5. Get latest cash flow for FCF
    latest_cf_df = pd.read_sql("""
        WITH ranked_cf AS (
            SELECT 
                *,
                ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY year DESC) as rn
            FROM cashflow
        )
        SELECT 
            company_id,
            operating_activity,
            investing_activity
        FROM ranked_cf
        WHERE rn = 1
    """, conn)
    
    conn.close()
    
    # 6. Calculate CAGRs (5yr) using functions from cagr.py
    from src.analytics.cagr import (
        calculate_multiyear_sales_cagr,
        calculate_multiyear_profit_cagr,
        calculate_multiyear_eps_cagr,
        pivot_multiyear_cagr
    )
    
    sales_cagr_pivot = pivot_multiyear_cagr(calculate_multiyear_sales_cagr(), 'sales')
    profit_cagr_pivot = pivot_multiyear_cagr(calculate_multiyear_profit_cagr(), 'net_profit')
    eps_cagr_pivot = pivot_multiyear_cagr(calculate_multiyear_eps_cagr(), 'eps')
    
    # Merge everything together
    df = companies_df.merge(sectors_df, on='company_id', how='left')
    df = df.merge(latest_pl_df, on='company_id', how='left')
    df = df.merge(latest_bs_df, on='company_id', how='left')
    df = df.merge(latest_cf_df, on='company_id', how='left')
    df = df.merge(sales_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'Revenue_CAGR_5yr_pct'}), on='company_id', how='left')
    df = df.merge(profit_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'PAT_CAGR_5yr_pct'}), on='company_id', how='left')
    df = df.merge(eps_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'EPS_CAGR_5yr_pct'}), on='company_id', how='left')
    
    # Calculate the metrics
    # 3. Net Profit Margin: (net_profit / sales) *100
    df['Net_Profit_Margin_pct'] = df.apply(
        lambda row: round((row['net_profit'] / row['sales']) * 100, 2) 
        if pd.notna(row['sales']) and pd.notna(row['net_profit']) and row['sales'] > 0 
        else None,
        axis=1
    )
    
    # 4. Debt-to-Equity: borrowings / (equity_capital + reserves)
    df['Debt_to_Equity'] = df.apply(
        lambda row: round(row['borrowings'] / (row['equity_capital'] + row['reserves']), 2) 
        if pd.notna(row['borrowings']) and pd.notna(row['equity_capital']) and pd.notna(row['reserves']) and (row['equity_capital'] + row['reserves']) > 0 
        else None,
        axis=1
    )
    
    # 5. FCF (Free Cash Flow)
    df['FCF'] = df.apply(
        lambda row: row['operating_activity'] + row['investing_activity'] 
        if pd.notna(row['operating_activity']) and pd.notna(row['investing_activity']) 
        else None,
        axis=1
    )
    
    # 9. Interest Coverage: (Operating Profit + Other Income) / Interest
    df['Interest_Coverage'] = df.apply(
        lambda row: round((row['operating_profit'] + row['other_income']) / row['interest'], 2) 
        if pd.notna(row['operating_profit']) and pd.notna(row['other_income']) and pd.notna(row['interest']) and row['interest'] > 0 
        else None,
        axis=1
    )
    
    # 10. Asset Turnover: Sales / Total Assets
    df['Asset_Turnover'] = df.apply(
        lambda row: round(row['sales'] / row['total_assets'], 2) 
        if pd.notna(row['sales']) and pd.notna(row['total_assets']) and row['total_assets'] > 0 
        else None,
        axis=1
    )
    
    # Keep only necessary columns
    df = df[[
        'company_id', 'company_name', 'sector',
        'ROE', 'ROCE', 'Net_Profit_Margin_pct', 'Debt_to_Equity', 'FCF',
        'PAT_CAGR_5yr_pct', 'Revenue_CAGR_5yr_pct', 'EPS_CAGR_5yr_pct',
        'Interest_Coverage', 'Asset_Turnover'
    ]]
    
    return df


def calculate_percentile(value, series):
    """Calculate percentile of a value relative to a given series"""
    if pd.isna(value) or len(series.dropna()) == 0:
        return None
    return round(np.percentile(series.dropna(), value), 2)


def calculate_peer_percentiles():
    """Calculate percentiles for all 10 metrics within each peer group"""
    peer_groups_df = load_peer_groups()
    metrics_df = load_all_10_metrics()
    
    # Merge peer groups with all 10 metrics
    merged_df = peer_groups_df.merge(metrics_df, on='company_id', how='left')
    
    # List of our 10 metrics to calculate percentiles for
    metric_cols = [
        'ROE', 'ROCE', 'Net_Profit_Margin_pct', 'Debt_to_Equity', 'FCF',
        'PAT_CAGR_5yr_pct', 'Revenue_CAGR_5yr_pct', 'EPS_CAGR_5yr_pct',
        'Interest_Coverage', 'Asset_Turnover'
    ]
    
    # For each metric, calculate percentile within each peer group
    for metric in metric_cols:
        percentile_col = f'{metric}_Percentile'
        # Note: Using rank(pct=True) which gives percentile rank (0-1), multiply by 100 to get 0-100
        merged_df[percentile_col] = merged_df.groupby('group_name')[metric].transform(
            lambda x: x.rank(pct=True, ascending=True) * 100
        ).round(2)
    
    return merged_df


def save_to_database():
    """Save peer group and percentile data to database"""
    conn = sqlite3.connect(get_database_path())
    
    # First, load and save peer groups
    peer_groups_df = load_peer_groups()
    peer_groups_df.to_sql(
        name='peer_groups',
        con=conn,
        if_exists='replace',
        index=False
    )
    
    # Then calculate and save peer percentiles
    percentiles_df = calculate_peer_percentiles()
    percentiles_df.to_sql(
        name='peer_percentiles',
        con=conn,
        if_exists='replace',
        index=False
    )
    
    conn.commit()
    conn.close()
    
    print("Saved peer group and percentile data to database!")
    return percentiles_df


def generate_radar_chart(company_id, group_name):
    """Generate radar chart for a company's peer comparison using percentile scores"""
    percentiles_df = calculate_peer_percentiles()
    
    # Filter for peer group and target company
    group_df = percentiles_df[percentiles_df['group_name'] == group_name]
    target_company = group_df[group_df['company_id'] == company_id]
    
    if len(target_company) == 0:
        raise ValueError(f"Company {company_id} not found in group {group_name}!")
    
    # Percentile columns for radar chart
    percentile_cols = [
        'ROE_Percentile', 'ROCE_Percentile', 'Net_Profit_Margin_pct_Percentile',
        'Debt_to_Equity_Percentile', 'FCF_Percentile', 'PAT_CAGR_5yr_pct_Percentile',
        'Revenue_CAGR_5yr_pct_Percentile', 'EPS_CAGR_5yr_pct_Percentile',
        'Interest_Coverage_Percentile', 'Asset_Turnover_Percentile'
    ]
    
    metric_labels = [
        'ROE', 'ROCE', 'Net Profit\nMargin', 'Debt-to-\nEquity', 'FCF',
        'PAT CAGR\n5yr', 'Revenue CAGR\n5yr', 'EPS CAGR\n5yr',
        'Interest\nCoverage', 'Asset\nTurnover'
    ]
    
    # Get target company's percentile values
    target_values = []
    for col in percentile_cols:
        target_values.append(target_company.iloc[0][col] if not pd.isna(target_company.iloc[0][col]) else 0)
    
    # Create radar chart
    plt.figure(figsize=(12, 12), facecolor='#020617')
    ax = plt.subplot(111, projection='polar')
    ax.set_facecolor('#0F172A')
    
    angles = np.linspace(0, 2 * np.pi, len(metric_labels), endpoint=False).tolist()
    angles += angles[:1]  # close the loop
    target_values += target_values[:1]
    
    ax.plot(angles, target_values, color='#2563EB', linewidth=3, label=target_company.iloc[0]['company_name'])
    ax.fill(angles, target_values, color='#2563EB', alpha=0.3)
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(metric_labels, color='white', fontsize=11)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(['20', '40', '60', '80', '100'], color='white', fontsize=10)
    ax.set_ylim(0, 100)
    ax.set_title(f"{target_company.iloc[0]['company_name']}\nPeer Group: {group_name} (Percentile Scores)",
                 color='white', fontsize=16, pad=30)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=12)
    
    # Save chart
    output_path = os.path.join(get_output_dir(), f"{company_id}_{group_name}_radar.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Generated radar chart for {company_id} at {output_path}")
    return output_path


if __name__ == "__main__":
    print("=== Loading all 10 metrics ===\n")
    all_metrics = load_all_10_metrics()
    print("Sample metrics data:")
    print(all_metrics.head(10))
    
    print("\n=== Calculating peer percentiles ===\n")
    peer_percentiles = calculate_peer_percentiles()
    print("Sample percentile data:")
    print(peer_percentiles.head(10))
    
    print("\n=== Saving to database ===\n")
    save_to_database()
    
    print("\n=== Generating sample radar chart for TCS (IT Services) ===\n")
    try:
        generate_radar_chart('TCS', 'IT Services')
    except Exception as e:
        print(f"Error generating chart: {e}")
