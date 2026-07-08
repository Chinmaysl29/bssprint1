
import sqlite3
import os
import pandas as pd

def get_database_path():
    """Get path to nifty100.db"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, "db", "nifty100.db")
    return db_path

def get_peer_groups():
    """Get all peer groups with company names and sectors
    
    Returns:
        DataFrame with group_name, company_id, company_name, sector, is_primary
    """
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        pg.group_name,
        pg.company_id,
        c.company_name,
        s.sector,
        pg.is_primary
    FROM peer_groups pg
    JOIN companies c ON pg.company_id = c.id
    LEFT JOIN sectors s ON pg.company_id = s.company_id
    ORDER BY pg.group_name, pg.is_primary DESC, c.company_name
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df

def get_peer_comparison(group_name, metric='roe_percentage'):
    """Get peer comparison for a specific group and metric
    
    Args:
        group_name: Name of the peer group
        metric: Metric to compare (from companies table: 'roe_percentage', 'roce_percentage')
        
    Returns:
        DataFrame with company_name, sector, is_primary, metric_value, rank
    """
    conn = sqlite3.connect(get_database_path())
    
    query = f"""
    SELECT 
        c.company_name,
        s.sector,
        pg.is_primary,
        c.{metric} as {metric}
    FROM peer_groups pg
    JOIN companies c ON pg.company_id = c.id
    LEFT JOIN sectors s ON pg.company_id = s.company_id
    WHERE pg.group_name = ?
    ORDER BY c.{metric} DESC NULLS LAST
    """
    
    df = pd.read_sql(query, conn, params=(group_name,))
    conn.close()
    
    # Add rank
    df['rank'] = df[metric].rank(ascending=False, method='min').astype('Int64')
    
    return df

def get_all_peer_metrics():
    """Get all peer groups with key metrics (ROE, ROCE)
    
    Returns:
        DataFrame with group_name, company_name, sector, is_primary, roe_percentage, roce_percentage
    """
    conn = sqlite3.connect(get_database_path())
    
    query = """
    SELECT 
        pg.group_name,
        c.company_name,
        s.sector,
        pg.is_primary,
        c.roe_percentage,
        c.roce_percentage
    FROM peer_groups pg
    JOIN companies c ON pg.company_id = c.id
    LEFT JOIN sectors s ON pg.company_id = s.company_id
    ORDER BY pg.group_name, pg.is_primary DESC, c.roe_percentage DESC NULLS LAST
    """
    
    df = pd.read_sql(query, conn)
    conn.close()
    
    return df

if __name__ == "__main__":
    print("=== All Peer Groups ===")
    peer_groups = get_peer_groups()
    print(peer_groups.head(20))
    
    print("\n=== Peer Comparison (Example: First Group) ===")
    if len(peer_groups) > 0:
        first_group = peer_groups['group_name'].iloc[0]
        comparison = get_peer_comparison(first_group)
        print(comparison)
    
    print("\n=== All Peer Metrics ===")
    all_metrics = get_all_peer_metrics()
    print(all_metrics.head(20))
