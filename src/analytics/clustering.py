import os
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer

import sys
sys.path.append(os.path.dirname(__file__))
try:
    from cagr import calculate_multiyear_sales_cagr, calculate_multiyear_fcf_cagr, pivot_multiyear_cagr
except ImportError:
    pass  # We'll handle this in the code below if we need to load differently

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db', 'nifty100.db')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'output')
REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'reports')

def get_latest_financial_ratios():
    conn = sqlite3.connect(DB_PATH)
    
    # We want to get the latest year for each company
    query = """
    SELECT company_id, 
           ratio3 AS return_on_equity_pct, 
           ratio4 AS debt_to_equity, 
           ratio2 AS operating_profit_margin_pct
    FROM (
        SELECT company_id, ratio3, ratio4, ratio2,
               ROW_NUMBER() OVER(PARTITION BY company_id ORDER BY year DESC) as rn
        FROM financial_ratios
    )
    WHERE rn = 1
    """
    ratios_df = pd.read_sql(query, conn)
    conn.close()
    return ratios_df

def get_cagr_metrics():
    # Revenue CAGR
    sales_cagr = calculate_multiyear_sales_cagr([5])
    sales_cagr_pivot = pivot_multiyear_cagr(sales_cagr, 'sales')
    sales_cagr_5yr = sales_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'revenue_cagr_5yr'})

    # FCF CAGR
    fcf_cagr = calculate_multiyear_fcf_cagr([5])
    fcf_cagr_pivot = pivot_multiyear_cagr(fcf_cagr, 'free_cash_flow_cr')
    if '5-Year_cagr_pct' in fcf_cagr_pivot.columns:
        fcf_cagr_5yr = fcf_cagr_pivot[['company_id', '5-Year_cagr_pct']].rename(columns={'5-Year_cagr_pct': 'fcf_cagr_5yr'})
    else:
        fcf_cagr_5yr = pd.DataFrame(columns=['company_id', 'fcf_cagr_5yr'])

    return sales_cagr_5yr, fcf_cagr_5yr

def load_data():
    ratios_df = get_latest_financial_ratios()
    sales_cagr_5yr, fcf_cagr_5yr = get_cagr_metrics()
    
    # Also fetch sectors
    conn = sqlite3.connect(DB_PATH)
    sectors_df = pd.read_sql("SELECT company_id, sector FROM sectors", conn)
    conn.close()
    
    df = ratios_df.merge(sales_cagr_5yr, on='company_id', how='left')
    df = df.merge(fcf_cagr_5yr, on='company_id', how='left')
    df = df.merge(sectors_df, on='company_id', how='left')
    return df

def generate_elbow_plot(X_scaled, max_k=10):
    os.makedirs(REPORTS_DIR, exist_ok=True)
    inertias = []
    # Test from K=2 to K=10 as specified
    K = range(2, max_k + 1)
    for k in K:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        inertias.append(km.inertia_)
        
    plt.figure(figsize=(8, 5))
    plt.plot(K, inertias, 'bo-')
    
    # Mark the chosen K=5 to confirm it is near the elbow
    plt.axvline(x=5, color='r', linestyle='--', alpha=0.7)
    plt.annotate('Chosen K=5', xy=(5, inertias[3]), xytext=(6, inertias[3] + (inertias[0]-inertias[-1])*0.1),
                 arrowprops=dict(facecolor='black', shrink=0.05))

    plt.xlabel('Number of clusters (k)')
    plt.ylabel('Inertia')
    plt.title('Elbow Method For Optimal k')
    
    output_path = os.path.join(REPORTS_DIR, 'elbow_plot.png')
    plt.savefig(output_path)
    plt.close()
    print(f"Saved elbow plot to {output_path}")

def perform_clustering():
    print("Loading data...")
    df = load_data()
    
    # Keep track of company_id
    companies = df['company_id']
    
    features = [
        'return_on_equity_pct', 
        'debt_to_equity', 
        'revenue_cagr_5yr', 
        'fcf_cagr_5yr', 
        'operating_profit_margin_pct'
    ]
    
    X = df[features].copy()
    
    # Convert to numeric, handle strings if any
    for col in features:
        X[col] = pd.to_numeric(X[col], errors='coerce')
        
    # Handle missing values using sector median imputation
    print("Imputing missing values using sector medians...")
    X_imputed = df[features].copy()
    
    # Group by sector and fill with median
    for col in features:
        # Fill with sector median
        X_imputed[col] = X_imputed.groupby(df['sector'])[col].transform(lambda x: x.fillna(x.median()))
        # Fallback to global median if sector median is also NaN
        X_imputed[col] = X_imputed[col].fillna(X_imputed[col].median())
    
    # Scale data
    print("Scaling data...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)
    
    # Generate Elbow Plot
    print("Generating elbow plot...")
    generate_elbow_plot(X_scaled)
    
    # Cluster using KMeans with k=5 (as required by Sprint specification)
    k = 5
    print(f"Applying KMeans with k={k}...")
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X_scaled)
    
    # Add clusters to original dataframe
    df['cluster_id'] = clusters
    
    # Calculate distance from centroid
    distances = kmeans.transform(X_scaled)
    df['distance_from_centroid'] = [distances[i, c] for i, c in enumerate(clusters)]
    
    # Assign Cluster Names (Archetypes)
    # Note: As per Sprint spec, these names are Business Decisions, not purely ML outputs.
    # They should be reviewed with the Team Lead.
    archetype_map = {
        0: "High Quality Compounders",
        1: "Defensive Dividend Payers",
        2: "Emerging Growth",
        3: "Value Cyclicals",
        4: "Distressed Companies"
    }
    df['cluster_name'] = df['cluster_id'].map(archetype_map)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Export just the required columns to cluster_labels.csv
    labels_output_path = os.path.join(OUTPUT_DIR, 'cluster_labels.csv')
    df[['company_id', 'cluster_id', 'cluster_name', 'distance_from_centroid']].to_csv(labels_output_path, index=False)
    print(f"Saved cluster labels to {labels_output_path}")
    
    # Export full dataset for downstream scripts
    full_output_path = os.path.join(OUTPUT_DIR, 'clustering_full_data.csv')
    df.to_csv(full_output_path, index=False)
    
    return df

if __name__ == "__main__":
    perform_clustering()
