
import sqlite3
import pandas as pd
import os
from src.nlp.parser import TextParser


def main():
    # Set up paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    output_dir = os.path.join(base_dir, 'output')
    parsed_output_path = os.path.join(output_dir, 'analysis_parsed.csv')
    failures_output_path = os.path.join(output_dir, 'parse_failures.csv')
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Initialize parser
    parser = TextParser()
    
    # Connect to DB and get all analysis data
    conn = sqlite3.connect(db_path)
    df_analysis = pd.read_sql("SELECT * FROM analysis", conn)
    conn.close()
    
    # Define metric type mapping
    metric_mapping = {
        'compounded_sales_growth': 'Sales CAGR',
        'compounded_profit_growth': 'Profit CAGR',
        'stock_price_cagr': 'Stock Price CAGR',
        'roe': 'ROE'
    }
    
    # Lists to collect all parsed rows and failures
    parsed_rows = []
    failure_rows = []
    
    # Iterate over each row in analysis data
    for _, row in df_analysis.iterrows():
        company_id = row['company_id']
        
        for col, metric_type in metric_mapping.items():
            text = row[col]
            parsed = parser.parse_analysis_text(text)
            
            if parsed:
                # Determine period_years: use parsed['years'] if available, else None (for TTM)
                period_years = parsed['years']
                value_pct = parsed['value']
                
                parsed_rows.append({
                    'company_id': company_id,
                    'metric_type': metric_type,
                    'period_years': period_years,
                    'value_pct': value_pct
                })
            else:
                # Determine failure reason
                if pd.isna(text) or (isinstance(text, str) and text.strip() == ""):
                    reason = "Empty or NA text"
                else:
                    reason = "Pattern not matched"
                
                failure_rows.append({
                    'company_id': company_id,
                    'metric': metric_type,
                    'original_text': text,
                    'reason': reason
                })
    
    # Create DataFrames
    df_parsed = pd.DataFrame(parsed_rows)
    df_failures = pd.DataFrame(failure_rows)
    
    # Save to CSVs
    df_parsed.to_csv(parsed_output_path, index=False)
    df_failures.to_csv(failures_output_path, index=False)
    
    print(f"Successfully generated {parsed_output_path}")
    print(f"Total parsed rows: {len(df_parsed)}")
    print(f"\nSuccessfully generated {failures_output_path}")
    print(f"Total failure rows: {len(df_failures)}")
    if len(df_failures) > 0:
        print("\nFailures:")
        print(df_failures)


if __name__ == "__main__":
    main()
