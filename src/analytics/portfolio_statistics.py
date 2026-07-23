import os
import pandas as pd
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'output')

def generate_portfolio_statistics():
    print("Generating portfolio statistics...")
    input_file = os.path.join(OUTPUT_DIR, 'clustering_full_data.csv')
    if not os.path.exists(input_file):
        print(f"File not found: {input_file}. Run clustering.py first.")
        return
        
    df = pd.read_csv(input_file)
    
    features = [
        'return_on_equity_pct', 
        'debt_to_equity', 
        'revenue_cagr_5yr', 
        'fcf_cagr_5yr', 
        'operating_profit_margin_pct'
    ]
    
    stats_rows = []
    
    # Portfolio level stats for each KPI
    for f in features:
        col_data = pd.to_numeric(df[f], errors='coerce').dropna()
        
        stat = {
            'KPI': f,
            'P10': col_data.quantile(0.10),
            'P25': col_data.quantile(0.25),
            'P50': col_data.quantile(0.50),  # Median
            'P75': col_data.quantile(0.75),
            'P90': col_data.quantile(0.90),
            'Mean': col_data.mean(),
            'Std': col_data.std()
        }
        stats_rows.append(stat)
        
    stats_df = pd.DataFrame(stats_rows)
    
    # Round metrics for readability
    for col in ['P10', 'P25', 'P50', 'P75', 'P90', 'Mean', 'Std']:
        stats_df[col] = stats_df[col].round(2)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    stats_path = os.path.join(OUTPUT_DIR, 'portfolio_stats.csv')
    stats_df.to_csv(stats_path, index=False)
    
    print(f"Portfolio statistics generated for {len(df)} companies.")
    print(f"Saved portfolio statistics to {stats_path}")

if __name__ == "__main__":
    generate_portfolio_statistics()
