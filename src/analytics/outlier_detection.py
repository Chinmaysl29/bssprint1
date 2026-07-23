import os
import pandas as pd
import sqlite3
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'output')
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db', 'nifty100.db')

def detect_outliers():
    print("Detecting outliers using Z-score per broad sector...")
    input_file = os.path.join(OUTPUT_DIR, 'clustering_full_data.csv')
    if not os.path.exists(input_file):
        print(f"File not found: {input_file}. Run clustering.py first.")
        return
        
    df = pd.read_csv(input_file)
    
    # Fetch company names
    conn = sqlite3.connect(DB_PATH)
    companies = pd.read_sql("SELECT id as company_id, company_name FROM companies", conn)
    conn.close()
    
    df = df.merge(companies, on='company_id', how='left')
    
    features = [
        'return_on_equity_pct', 
        'debt_to_equity', 
        'revenue_cagr_5yr', 
        'fcf_cagr_5yr', 
        'operating_profit_margin_pct'
    ]
    
    outlier_records = []
    df['is_outlier'] = False
    
    # Z-score per sector
    for sector in df['sector'].dropna().unique():
        sector_mask = df['sector'] == sector
        
        for col in features:
            col_data = pd.to_numeric(df.loc[sector_mask, col], errors='coerce')
            
            # Skip if standard deviation is 0 or all NaN
            if col_data.isna().all() or col_data.std() == 0:
                continue
                
            mean = col_data.mean()
            std = col_data.std()
            z_scores = (col_data - mean) / std
            
            outliers = df.loc[sector_mask][np.abs(z_scores) > 3]
            
            for idx, row in outliers.iterrows():
                z = z_scores[idx]
                
                # Flag the company as outlier in the main dataframe
                df.loc[idx, 'is_outlier'] = True
                
                outlier_records.append({
                    'Company': row.get('company_name', row['company_id']),
                    'Metric': col,
                    'Z Score': round(z, 2),
                    'Reason': f"Value {round(row[col], 2)} deviates significantly from {sector} sector mean ({round(mean, 2)})"
                })
                
    outliers_df = pd.DataFrame(outlier_records)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    outlier_path = os.path.join(OUTPUT_DIR, 'outlier_report.csv')
    
    # If no outliers found, create an empty dataframe with correct columns
    if outliers_df.empty:
        outliers_df = pd.DataFrame(columns=['Company', 'Metric', 'Z Score', 'Reason'])
        
    outliers_df.to_csv(outlier_path, index=False)
    print(f"Found {len(outliers_df['Company'].unique()) if not outliers_df.empty else 0} outlier companies across {len(outliers_df)} metrics.")
    print(f"Saved outlier report to {outlier_path}")
    
    # Save the main df with outlier flags for portfolio_statistics
    # Drop company_name so we don't mess up downstream scripts expecting exact columns
    df.drop(columns=['company_name'], inplace=True, errors='ignore')
    df.to_csv(os.path.join(OUTPUT_DIR, 'cluster_and_outliers.csv'), index=False)

if __name__ == "__main__":
    detect_outliers()
