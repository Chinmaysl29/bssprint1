import sqlite3
import os
import pandas as pd

def get_database_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, 'db', 'nifty100.db')

def calculate_all_metrics():
    conn = sqlite3.connect(get_database_path())
    
    # First, get all necessary data
    query = """
    WITH cf_dedup AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) as rn
        FROM cashflow
    ),
    pl_dedup AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) as rn
        FROM profitandloss
    )
    SELECT 
        fr.id,
        fr.company_id,
        fr.year,
        cf.operating_activity,
        cf.investing_activity,
        cf.financing_activity,
        p.sales,
        p.operating_profit,
        p.net_profit as pat
    FROM financial_ratios fr
    LEFT JOIN cf_dedup cf ON fr.company_id = cf.company_id AND fr.year = cf.year AND cf.rn = 1
    LEFT JOIN pl_dedup p ON fr.company_id = p.company_id AND fr.year = p.year AND p.rn = 1
    ORDER BY fr.company_id, fr.year DESC
    """
    df = pd.read_sql(query, conn)
    
    # Calculate CFO Quality Score (company-level, average over last 5 years)
    cfo_quality_map = {}
    for company_id in df['company_id'].unique():
        company_df = df[df['company_id'] == company_id].copy()
        last_5 = company_df.head(5).copy()
        last_5['cfo_pat_ratio'] = last_5.apply(
            lambda row: row['operating_activity'] / row['pat']
            if pd.notna(row['operating_activity']) and pd.notna(row['pat']) and row['pat'] != 0
            else None,
            axis=1
        )
        valid_ratios = last_5['cfo_pat_ratio'].dropna()
        if len(valid_ratios) >= 1:
            avg_ratio = round(valid_ratios.mean(), 2)
            cfo_quality_map[company_id] = avg_ratio
        else:
            cfo_quality_map[company_id] = None
    
    # Calculate each metric
    def calculate_row(row):
        # Free Cash Flow
        free_cash_flow = None
        if pd.notna(row['operating_activity']) and pd.notna(row['investing_activity']):
            free_cash_flow = row['operating_activity'] + row['investing_activity']
        
        # CFO Quality Score (company-level)
        cfo_quality = cfo_quality_map.get(row['company_id'])
        
        # Capex Intensity
        capex_intensity_pct = None
        capex_label = None
        if pd.notna(row['investing_activity']) and pd.notna(row['sales']) and row['sales'] > 0:
            capex_intensity_pct = round(abs(row['investing_activity']) / row['sales'] * 100, 2)
            if capex_intensity_pct < 3:
                capex_label = "Asset Light"
            elif 3 <= capex_intensity_pct <= 8:
                capex_label = "Moderate"
            else:
                capex_label = "Capital Intensive"
        
        # FCF Conversion
        fcf_conversion_pct = None
        if pd.notna(free_cash_flow) and pd.notna(row['operating_profit']) and row['operating_profit'] != 0:
            fcf_conversion_pct = round((free_cash_flow / row['operating_profit']) * 100, 2)
        
        # Capital Allocation Pattern
        capital_allocation_pattern = None
        cfo_sign = None
        cfi_sign = None
        cff_sign = None
        if pd.notna(row['operating_activity']):
            cfo_sign = "+" if row['operating_activity'] > 0 else "-"
        if pd.notna(row['investing_activity']):
            cfi_sign = "+" if row['investing_activity'] > 0 else "-"
        if pd.notna(row['financing_activity']):
            cff_sign = "+" if row['financing_activity'] > 0 else "-"
        
        if pd.notna(cfo_sign) and pd.notna(cfi_sign) and pd.notna(cff_sign):
            avg_cfo_pat = cfo_quality_map.get(row['company_id'])
            if cfo_sign == "+" and cfi_sign == "-" and cff_sign == "-" and avg_cfo_pat is not None and avg_cfo_pat > 1.0:
                capital_allocation_pattern = "Shareholder Returns"
            elif cfo_sign == "+" and cfi_sign == "-" and cff_sign == "-":
                capital_allocation_pattern = "Reinvestor"
            elif cfo_sign == "+" and cfi_sign == "+" and cff_sign == "-":
                capital_allocation_pattern = "Liquidating Assets"
            elif cfo_sign == "-" and cfi_sign == "+" and cff_sign == "+":
                capital_allocation_pattern = "Distress Signal"
            elif cfo_sign == "-" and cfi_sign == "-" and cff_sign == "+":
                capital_allocation_pattern = "Growth Funded by Debt"
            elif cfo_sign == "+" and cfi_sign == "+" and cff_sign == "+":
                capital_allocation_pattern = "Cash Accumulator"
            elif cfo_sign == "-" and cfi_sign == "-" and cff_sign == "-":
                capital_allocation_pattern = "Pre-Revenue"
            elif cfo_sign == "+" and cfi_sign == "-" and cff_sign == "+":
                capital_allocation_pattern = "Mixed"
            else:
                capital_allocation_pattern = "Other"
        
        return pd.Series({
            'id': row['id'],
            'free_cash_flow_cr': free_cash_flow,
            'cfo_quality_score': cfo_quality,
            'capex_intensity_pct': capex_intensity_pct,
            'capex_label': capex_label,
            'fcf_conversion_pct': fcf_conversion_pct,
            'capital_allocation_pattern': capital_allocation_pattern
        })
    
    results_df = df.apply(calculate_row, axis=1)
    
    # Now update the database
    update_query = """
    UPDATE financial_ratios
    SET free_cash_flow_cr = ?,
        cfo_quality_score = ?,
        capex_intensity_pct = ?,
        capex_label = ?,
        fcf_conversion_pct = ?,
        capital_allocation_pattern = ?
    WHERE id = ?
    """
    
    cursor = conn.cursor()
    for _, row in results_df.iterrows():
        cursor.execute(update_query, (
            row['free_cash_flow_cr'],
            row['cfo_quality_score'],
            row['capex_intensity_pct'],
            row['capex_label'],
            row['fcf_conversion_pct'],
            row['capital_allocation_pattern'],
            row['id']
        ))
    
    conn.commit()
    conn.close()
    print(f"Successfully populated {len(results_df)} rows in financial_ratios!")

if __name__ == "__main__":
    calculate_all_metrics()
