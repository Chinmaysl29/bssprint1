
import sqlite3
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

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


def load_and_merge_companies_and_ratios():
    """
    Load companies and financial_ratios tables from nifty100.db and merge them.
    Also includes sector from sectors table.
    
    Returns:
        DataFrame with merged data (example columns: Company, ROE, ROCE, Sector, ...)
    """
    conn = sqlite3.connect(get_database_path())
    
    # Load companies table
    companies_query = """
    SELECT 
        id as company_id,
        company_name,
        roe_percentage as ROE,
        roce_percentage as ROCE
    FROM companies
    """
    companies_df = pd.read_sql(companies_query, conn)
    
    # Load sectors table for sector info
    sectors_query = """
    SELECT company_id, sector
    FROM sectors
    """
    sectors_df = pd.read_sql(sectors_query, conn)
    
    # Load latest financial ratios (since there are multiple years, pick one row per company)
    financial_ratios_query = """
    SELECT 
        company_id,
        free_cash_flow_cr,
        cfo_quality_score,
        capex_intensity_pct,
        capex_label,
        fcf_conversion_pct,
        capital_allocation_pattern
    FROM financial_ratios
    """
    ratios_df = pd.read_sql(financial_ratios_query, conn)
    # Get latest year's data per company (if available)
    latest_ratios = ratios_df.groupby('company_id').last().reset_index()
    
    # Merge all three DataFrames: companies + sectors + latest financial ratios
    merged_df = pd.merge(companies_df, sectors_df, on='company_id', how='left')
    merged_df = pd.merge(merged_df, latest_ratios, on='company_id', how='left')
    
    # Rename columns to match example (Company instead of company_name)
    merged_df = merged_df.rename(columns={'company_name': 'Company'})
    
    conn.close()
    return merged_df

def calculate_percentile(value, series):
    """Calculate percentile of a value relative to a given series"""
    if pd.isna(value) or len(series.dropna()) == 0:
        return None
    return round(np.percentile(series.dropna(), value), 2)

def calculate_all_percentiles():
    """Calculate percentiles for all financial metrics per peer group"""
    peer_groups_df = load_peer_groups()
    metrics_df = load_financial_metrics()
    
    # Merge peer groups with metrics
    merged_df = pd.merge(
        peer_groups_df,
        metrics_df,
        on='company_id',
        how='left'
    )
    
    # List of metrics to calculate percentiles for
    metrics = [
        'roe_percentage',
        'roce_percentage',
        'net_profit',
        'sales'
    ]
    
    # Calculate percentiles per group
    result_df = merged_df.copy()
    for metric in metrics:
        percentile_col = f"{metric}_percentile"
        result_df[percentile_col] = result_df.groupby('group_name')[metric].transform(
            lambda x: x.rank(pct=True) * 100
        ).round(2)
    
    return result_df

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
    
    # Then calculate and save percentiles
    percentiles_df = calculate_all_percentiles()
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
    """Generate radar chart for a company's peer comparison"""
    percentiles_df = calculate_all_percentiles()
    
    # Filter for peer group and target company
    group_df = percentiles_df[percentiles_df['group_name'] == group_name]
    target_company = group_df[group_df['company_id'] == company_id]
    
    if len(target_company) == 0:
        raise ValueError(f"Company {company_id} not found in group {group_name}!")
    
    # Metrics to include in radar chart
    metrics = [
        'roe_percentage_percentile',
        'roce_percentage_percentile'
    ]
    metric_labels = ['ROE %', 'ROCE %']
    
    # Get target company's values
    target_values = []
    for metric in metrics:
        target_values.append(target_company.iloc[0][metric] if not pd.isna(target_company.iloc[0][metric]) else 0)
    
    # Create radar chart
    plt.figure(figsize=(8, 8), facecolor='#020617')
    ax = plt.subplot(projection='polar')
    ax.set_facecolor('#0F172A')
    
    angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
    angles += angles[:1]
    target_values += target_values[:1]
    
    ax.plot(angles, target_values, color='#2563EB', linewidth=2, label=target_company.iloc[0]['company_name'])
    ax.fill(angles, target_values, color='#2563EB', alpha=0.25)
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(metric_labels, color='white', fontsize=12)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(['20', '40', '60', '80', '100'], color='white', fontsize=10)
    ax.set_ylim(0, 100)
    ax.set_title(f"{target_company.iloc[0]['company_name']} | Peer Group: {group_name}",
                 color='white', fontsize=14, pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
    
    # Save chart
    output_path = os.path.join(get_output_dir(), f"{company_id}_{group_name}_radar.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Generated radar chart for {company_id} at {output_path}")
    return output_path

if __name__ == "__main__":
    print("=== Loading and Merging Companies & Financial Ratios ===")
    merged_data = load_and_merge_companies_and_ratios()
    # Show first 5 rows with key columns as in example
    print(merged_data[['Company', 'ROE', 'ROCE', 'sector']].head(10))
    
    print("\n=== Saving Data to Database ===")
    save_to_database()
    
    print("\n=== Calculating All Percentiles ===")
    percentiles = calculate_all_percentiles()
    print(percentiles.head())
    
    print("\n=== Generating Example Radar Chart ===")
    try:
        generate_radar_chart('TCS', 'IT Services')
    except Exception as e:
        print(f"Error generating chart: {e}")
