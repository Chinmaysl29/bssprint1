
import sys
import os
import pandas as pd
import sqlite3

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))


def calculate_cagr(start_value, end_value, periods):
    """Calculate CAGR given start value, end value, and number of periods"""
    if (
        pd.isna(start_value)
        or pd.isna(end_value)
        or pd.isna(periods)
        or start_value <= 0
        or end_value <= 0
        or periods <= 0
    ):
        return None
    try:
        return round(((end_value / start_value) ** (1 / periods)) - 1, 4)
    except (ZeroDivisionError, ValueError):
        return None


def get_analysis_companies(db_path):
    conn = sqlite3.connect(db_path)
    query = "SELECT DISTINCT company_id FROM analysis"
    companies = pd.read_sql(query, conn)["company_id"].tolist()
    conn.close()
    return companies


def load_pl_data(db_path, company_ids):
    conn = sqlite3.connect(db_path)
    placeholders = ",".join("?" for _ in company_ids)
    query = f"""
        SELECT 
            p.company_id,
            COALESCE(c.company_name, p.company_id) as company_name,
            p.year,
            p.sales,
            p.net_profit
        FROM profitandloss p
        LEFT JOIN companies c ON p.company_id = c.id
        WHERE 
            p.company_id IN ({placeholders})
            AND p.year != 'TTM'
        ORDER BY p.company_id, p.year
    """
    df = pd.read_sql(query, conn, params=company_ids)
    conn.close()
    return df


def compute_cagr_for_company(company_df, metric_col, period_years):
    company_df = company_df.dropna(subset=[metric_col]).copy()
    if len(company_df) < period_years + 1:
        return None

    start_value = company_df[metric_col].iloc[-(period_years + 1)]
    end_value = company_df[metric_col].iloc[-1]

    cagr = calculate_cagr(start_value, end_value, period_years)

    return round(cagr * 100, 2) if cagr is not None else None


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "db", "nifty100.db")
    output_dir = os.path.join(base_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "cagr_validation.csv")

    # Load parsed CAGRs from analysis_parsed.csv
    parsed_path = os.path.join(output_dir, "analysis_parsed.csv")
    df_parsed = pd.read_csv(parsed_path)

    # Keep only Sales and Profit CAGRs, and 3,5,10yr periods
    df_parsed = df_parsed[
        (df_parsed["metric_type"].isin(["Sales CAGR", "Profit CAGR"]))
        & (df_parsed["period_years"].isin([3.0, 5.0, 10.0]))
    ].copy()
    df_parsed["period_years"] = df_parsed["period_years"].astype(int)

    # Get analysis companies and load PL data
    analysis_companies = get_analysis_companies(db_path)
    df_pl = load_pl_data(db_path, analysis_companies)

    # For each company, metric type, period, compute CAGR
    validation_rows = []
    
    for company_id in analysis_companies:
        company_pl = df_pl[df_pl["company_id"] == company_id].copy()
        
        for metric_type in ["Sales CAGR", "Profit CAGR"]:
            metric_col = "sales" if metric_type == "Sales CAGR" else "net_profit"
            
            for period_years in [3, 5, 10]:
                # Get parsed value
                parsed_row = df_parsed[
                    (df_parsed["company_id"] == company_id)
                    & (df_parsed["metric_type"] == metric_type)
                    & (df_parsed["period_years"] == period_years)
                ]
                if len(parsed_row) == 0:
                    continue
                parsed_val = parsed_row.iloc[0]["value_pct"]

                # Compute sprint 2 CAGR
                computed_val = compute_cagr_for_company(
                    company_pl, metric_col, period_years
                )

                # Calculate difference
                diff = abs(parsed_val - computed_val) if (pd.notna(parsed_val) and pd.notna(computed_val)) else None

                # Determine status
                if pd.notna(diff) and diff > 5:
                    status = "Manual Review"
                else:
                    status = "OK"

                # Add row
                validation_rows.append(
                    {
                        "company": company_id,
                        "parsed": parsed_val,
                        "computed": computed_val,
                        "difference": diff,
                        "status": status,
                    }
                )

    # Create DataFrame and save to CSV
    df_validation = pd.DataFrame(validation_rows)
    df_validation.to_csv(output_path, index=False)

    # Print results
    print(f"Generated validation report at {output_path}")
    print("\n=== Validation report ===")
    print(df_validation.to_string(index=False))


if __name__ == "__main__":
    main()
