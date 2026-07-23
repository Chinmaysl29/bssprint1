import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'output')
REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'reports')

def profile_clusters():
    print("Profiling clusters...")
    df = pd.read_csv(os.path.join(OUTPUT_DIR, 'clustering_full_data.csv'))
    
    features = [
        'return_on_equity_pct', 
        'debt_to_equity', 
        'revenue_cagr_5yr', 
        'fcf_cagr_5yr', 
        'operating_profit_margin_pct'
    ]
    
    # Convert features to numeric
    for col in features:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        
    # Profile based on mean and median values
    profile = df.groupby('cluster_id')[features].agg(['mean', 'median']).reset_index()
    
    # Flatten the MultiIndex columns if necessary
    profile.columns = ['_'.join(col).strip('_') for col in profile.columns.values]
    
    print("Cluster Profiles (Mean and Median values):")
    print(profile)
    
    # We could name clusters based on their characteristics
    # For now, let's just write the profile to a csv for reference
    profile.to_csv(os.path.join(OUTPUT_DIR, 'cluster_profiles.csv'), index=False)
    
    return df, features

import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db', 'nifty100.db')

def generate_correlation_heatmap():
    print("Generating correlation heatmap for 10 KPIs (Latest Year)...")
    
    conn = sqlite3.connect(DB_PATH)
    query = """
    SELECT 
        f.ratio3 AS ROE,
        c.roce_percentage AS ROCE,
        f.ratio4 AS Debt_to_Equity,
        f.ratio5 AS Interest_Coverage,
        f.ratio2 AS OPM_pct,
        f.ratio1 AS NPM_pct,
        f.ratio6 AS Asset_Turnover,
        f.ratio11 AS Dividend_Payout,
        f.fcf_conversion_pct AS FCF_Conversion,
        f.ratio10 AS Book_Value_Per_Share
    FROM (
        SELECT company_id, ratio3, ratio4, ratio5, ratio2, ratio1, ratio6, ratio11, fcf_conversion_pct, ratio10,
               ROW_NUMBER() OVER(PARTITION BY company_id ORDER BY year DESC) as rn
        FROM financial_ratios
    ) f
    JOIN companies c ON f.company_id = c.id
    WHERE f.rn = 1
    """
    df_10_kpis = pd.read_sql(query, conn)
    conn.close()
    
    # Convert all columns to numeric just in case
    for col in df_10_kpis.columns:
        df_10_kpis[col] = pd.to_numeric(df_10_kpis[col], errors='coerce')
        
    corr = df_10_kpis.corr()
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(corr, annot=True, cmap='coolwarm', vmin=-1, vmax=1, fmt=".2f",
                linewidths=0.5, cbar_kws={"shrink": .8})
    plt.title('Correlation Heatmap of 10 Key Financial KPIs (Latest Year)', fontsize=16)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    os.makedirs(REPORTS_DIR, exist_ok=True)
    output_path = os.path.join(REPORTS_DIR, 'correlation_heatmap.png')
    plt.savefig(output_path)
    plt.close()
    print(f"Saved correlation heatmap to {output_path}")

if __name__ == "__main__":
    profile_clusters()
    generate_correlation_heatmap()
