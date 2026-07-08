
import sqlite3
import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import re
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


def get_report_radar_dir():
    """Get report directory for final radar chart PNG files."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    output_dir = os.path.join(base_dir, "reports", "radar_charts")
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
    
    # Special handling for Debt_to_Equity: lower is better, so invert percentile (100 - percentile)
    merged_df['Debt_to_Equity_Percentile'] = (
        100 - merged_df['Debt_to_Equity_Percentile']
    ).round(2)
    
    return merged_df


def _year_to_int(year_value):
    """Extract a 4-digit year from values like 'Mar 2024'."""
    if pd.isna(year_value):
        return None
    match = re.search(r"(19|20)\d{2}", str(year_value))
    return int(match.group(0)) if match else None


def load_yearly_peer_metrics():
    """Load one row per company/year with metrics used for peer percentiles."""
    conn = sqlite3.connect(get_database_path())

    query = """
    WITH fr_dedup AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) AS rn
        FROM financial_ratios
    ),
    pl_dedup AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) AS rn
        FROM profitandloss
    ),
    bs_dedup AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY company_id, year ORDER BY id DESC) AS rn
        FROM balancesheet
    )
    SELECT
        fr.company_id,
        fr.year AS source_year,
        fr.ratio3 AS ROE,
        CASE
            WHEN (bs.equity_capital + bs.reserves + bs.borrowings) > 0
            THEN ROUND(((pl.operating_profit + pl.other_income) /
                        (bs.equity_capital + bs.reserves + bs.borrowings)) * 100, 2)
            ELSE NULL
        END AS ROCE,
        fr.ratio1 AS Net_Profit_Margin,
        fr.ratio4 AS "D/E",
        fr.free_cash_flow_cr AS FCF,
        fr.ratio5 AS Interest_Coverage,
        fr.ratio6 AS Asset_Turnover,
        fr.ratio9 AS EPS,
        fr.ratio10 AS Book_Value,
        fr.ratio11 AS Dividend_Payout,
        fr.ratio12 AS Total_Debt
    FROM fr_dedup fr
    LEFT JOIN pl_dedup pl
        ON fr.company_id = pl.company_id AND fr.year = pl.year AND pl.rn = 1
    LEFT JOIN bs_dedup bs
        ON fr.company_id = bs.company_id AND fr.year = bs.year AND bs.rn = 1
    WHERE fr.rn = 1
    """

    df = pd.read_sql(query, conn)
    conn.close()

    df["year"] = df["source_year"].apply(_year_to_int)
    return df[df["year"].notna()].copy()


def calculate_yearly_peer_percentiles():
    """
    Calculate long-form peer percentiles for every company x metric x year.

    Percentiles are calculated within each peer group for the same metric/year.
    D/E is inverted because lower debt is better.
    """
    peer_groups_df = load_peer_groups().rename(columns={"group_name": "peer_group_name"})
    metrics_df = load_yearly_peer_metrics()

    merged_df = peer_groups_df.merge(metrics_df, on="company_id", how="inner")
    metric_cols = [
        "ROE",
        "ROCE",
        "Net_Profit_Margin",
        "D/E",
        "FCF",
        "Interest_Coverage",
        "Asset_Turnover",
        "EPS",
        "Book_Value",
        "Dividend_Payout",
        "Total_Debt",
    ]

    long_df = merged_df.melt(
        id_vars=["company_id", "peer_group_name", "year"],
        value_vars=metric_cols,
        var_name="metric",
        value_name="value",
    )
    long_df = long_df.dropna(subset=["value"]).copy()

    raw_rank = long_df.groupby(["peer_group_name", "metric", "year"])["value"].rank(
        pct=True,
        method="average",
        ascending=True,
    ) * 100
    long_df["percentile_rank"] = raw_rank.round(2)

    de_mask = long_df["metric"].eq("D/E")
    long_df.loc[de_mask, "percentile_rank"] = (
        100 - long_df.loc[de_mask, "percentile_rank"]
    ).round(2)

    long_df["year"] = long_df["year"].astype(int)
    return long_df[
        ["company_id", "peer_group_name", "metric", "value", "percentile_rank", "year"]
    ].sort_values(["company_id", "year", "metric"]).reset_index(drop=True)


def get_company_peer_group(company_id):
    """Return a company's peer group name, or None if no group is assigned."""
    peer_groups_df = load_peer_groups()
    company_groups = peer_groups_df[peer_groups_df["company_id"] == company_id]

    if company_groups.empty:
        return None

    if "is_primary" in company_groups.columns:
        primary_groups = company_groups[company_groups["is_primary"].astype(bool)]
        if not primary_groups.empty:
            return primary_groups.iloc[0]["group_name"]

    return company_groups.iloc[0]["group_name"]


RADAR_AXES = [
    ("ROE", "score_roe", 15),
    ("ROCE", "score_roce", 15),
    ("NPM", "score_opm", 5),
    ("D/E Score", "score_debt", 10),
    ("FCF Score", "fcf_norm_p10p90", 1),
    ("PAT CAGR", "score_pat_cagr", 10),
    ("Revenue CAGR", "score_rev_cagr", 10),
    ("Composite Score", "composite_score", 100),
]


def _load_latest_radar_scores():
    """Load latest company scores and map each company to its peer group."""
    from src.screener.engine import StockScreener

    base_dir = Path(__file__).resolve().parents[2]
    screener = StockScreener(
        db_path=str(base_dir / "db" / "nifty100.db"),
        config_path=str(base_dir / "config" / "screener_config.yaml"),
    )
    scores_df = screener.load_financial_data(compute_scores=True)
    peer_groups_df = load_peer_groups()[["company_id", "group_name", "is_primary"]].copy()
    peer_groups_df["is_primary"] = peer_groups_df["is_primary"].astype(bool)
    primary_groups = peer_groups_df[peer_groups_df["is_primary"]].drop_duplicates("company_id")
    fallback_groups = peer_groups_df.drop_duplicates("company_id")
    peer_map = fallback_groups[["company_id", "group_name"]].merge(
        primary_groups[["company_id", "group_name"]],
        on="company_id",
        how="left",
        suffixes=("_fallback", "_primary"),
    )
    peer_map["peer_group_name"] = peer_map["group_name_primary"].fillna(peer_map["group_name_fallback"])

    scores_df = scores_df.merge(
        peer_map[["company_id", "peer_group_name"]],
        on="company_id",
        how="left",
    )

    for label, column, denominator in RADAR_AXES:
        radar_col = f"radar_{label}"
        if column not in scores_df.columns:
            scores_df[radar_col] = np.nan
        elif denominator == 1:
            scores_df[radar_col] = pd.to_numeric(scores_df[column], errors="coerce") * 100
        else:
            scores_df[radar_col] = (
                pd.to_numeric(scores_df[column], errors="coerce") / denominator
            ) * 100
        scores_df[radar_col] = scores_df[radar_col].clip(0, 100)

    return scores_df


def _radar_output_path(company_id, output_dir=None):
    output_dir = output_dir or get_report_radar_dir()
    os.makedirs(output_dir, exist_ok=True)
    return os.path.join(output_dir, f"{company_id}_radar.png")


def _save_company_vs_peer_radar(company_row, peer_average, output_path, comparison_label=None):
    labels = [axis[0] for axis in RADAR_AXES]
    radar_cols = [f"radar_{label}" for label in labels]
    company_values = [
        0 if pd.isna(company_row[col]) else float(company_row[col])
        for col in radar_cols
    ]
    peer_values = [
        0 if pd.isna(peer_average[col]) else float(peer_average[col])
        for col in radar_cols
    ]

    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]
    company_values += company_values[:1]
    peer_values += peer_values[:1]

    fig = plt.figure(figsize=(8, 8), facecolor="#F8FAFC")
    ax = fig.add_subplot(111, projection="polar")
    ax.set_facecolor("#FFFFFF")
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)
    ax.set_ylim(0, 100)

    comparison_label = comparison_label or "Peer Average"
    ax.plot(angles, peer_values, color="#64748B", linewidth=2.5, linestyle="--", label=comparison_label)
    ax.plot(angles, company_values, color="#2563EB", linewidth=2.8, label="Company")
    ax.fill(angles, company_values, color="#2563EB", alpha=0.24)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=10, color="#0F172A")
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(["20", "40", "60", "80", "100"], fontsize=8, color="#64748B")
    ax.grid(color="#CBD5E1", linewidth=0.8)
    ax.spines["polar"].set_color("#CBD5E1")

    title = str(company_row["company_name"]).strip()
    peer_group = company_row.get("peer_group_name", "")
    subtitle = peer_group if pd.notna(peer_group) and peer_group else comparison_label
    ax.set_title(
        f"{title}\nComparison: {subtitle}",
        fontsize=14,
        fontweight="bold",
        color="#0F172A",
        pad=26,
    )
    ax.legend(loc="upper right", bbox_to_anchor=(1.22, 1.12), frameon=False)
    fig.savefig(output_path, dpi=180, bbox_inches="tight")
    plt.close(fig)


def generate_report_radar_chart(company_id, output_dir=None):
    """Generate reports/radar_charts/<company_id>_radar.png for one company."""
    scores_df = _load_latest_radar_scores()
    company_rows = scores_df[scores_df["company_id"] == company_id]
    if company_rows.empty:
        return "Company not found"

    company_row = company_rows.iloc[0]
    output_path = _radar_output_path(company_id, output_dir)
    peer_group = company_row.get("peer_group_name")
    radar_cols = [f"radar_{axis[0]}" for axis in RADAR_AXES]

    if pd.isna(peer_group) or not peer_group:
        nifty_average = scores_df[radar_cols].mean(numeric_only=True)
        _save_company_vs_peer_radar(
            company_row,
            nifty_average,
            output_path,
            comparison_label="Nifty100 Average",
        )
        return output_path

    peer_df = scores_df[scores_df["peer_group_name"] == peer_group]
    if peer_df.empty:
        nifty_average = scores_df[radar_cols].mean(numeric_only=True)
        _save_company_vs_peer_radar(
            company_row,
            nifty_average,
            output_path,
            comparison_label="Nifty100 Average",
        )
        return output_path

    peer_average = peer_df[radar_cols].mean(numeric_only=True)
    _save_company_vs_peer_radar(company_row, peer_average, output_path)
    return output_path


def generate_all_report_radar_charts(output_dir=None):
    """Generate one radar PNG per company into reports/radar_charts."""
    scores_df = _load_latest_radar_scores()
    output_dir = output_dir or get_report_radar_dir()
    os.makedirs(output_dir, exist_ok=True)

    paths = []
    radar_cols = [f"radar_{axis[0]}" for axis in RADAR_AXES]
    for _, company_row in scores_df.sort_values("company_id").iterrows():
        company_id = company_row["company_id"]
        output_path = _radar_output_path(company_id, output_dir)
        peer_group = company_row.get("peer_group_name")

        if pd.isna(peer_group) or not peer_group:
            nifty_average = scores_df[radar_cols].mean(numeric_only=True)
            _save_company_vs_peer_radar(
                company_row,
                nifty_average,
                output_path,
                comparison_label="Nifty100 Average",
            )
            paths.append(output_path)
            continue

        peer_df = scores_df[scores_df["peer_group_name"] == peer_group]
        if peer_df.empty:
            nifty_average = scores_df[radar_cols].mean(numeric_only=True)
            _save_company_vs_peer_radar(
                company_row,
                nifty_average,
                output_path,
                comparison_label="Nifty100 Average",
            )
        else:
            peer_average = peer_df[radar_cols].mean(numeric_only=True)
            _save_company_vs_peer_radar(company_row, peer_average, output_path)
        paths.append(output_path)

    return paths


def _peer_percentiles_to_long(percentiles_df):
    """Convert wide percentile output to the peer_percentiles table schema."""
    metric_cols = [
        'ROE', 'ROCE', 'Net_Profit_Margin_pct', 'Debt_to_Equity', 'FCF',
        'PAT_CAGR_5yr_pct', 'Revenue_CAGR_5yr_pct', 'EPS_CAGR_5yr_pct',
        'Interest_Coverage', 'Asset_Turnover'
    ]

    rows = []
    for _, row in percentiles_df.iterrows():
        for metric in metric_cols:
            rows.append({
                'company_id': row.get('company_id'),
                'peer_group_name': row.get('group_name'),
                'metric': metric,
                'value': row.get(metric),
                'percentile_rank': row.get(f'{metric}_Percentile'),
                'year': None,
            })

    return pd.DataFrame(
        rows,
        columns=[
            'company_id',
            'peer_group_name',
            'metric',
            'value',
            'percentile_rank',
            'year',
        ],
    )


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
    
    # Then calculate and save one row per company x metric x year.
    peer_percentiles_long = calculate_yearly_peer_percentiles()
    conn.execute("DROP TABLE IF EXISTS peer_percentiles")
    conn.execute("""
        CREATE TABLE peer_percentiles(
            company_id INTEGER,
            peer_group_name TEXT,
            metric TEXT,
            value REAL,
            percentile_rank REAL,
            year INTEGER
        )
    """)
    peer_percentiles_long.to_sql(
        name='peer_percentiles',
        con=conn,
        if_exists='append',
        index=False
    )
    
    conn.commit()
    conn.close()
    
    print("Saved peer group and percentile data to database!")
    return peer_percentiles_long


def generate_radar_chart(company_id, group_name=None):
    """Generate radar chart for a company's peer comparison using percentile scores"""
    if group_name is None:
        group_name = get_company_peer_group(company_id)

    if group_name is None:
        return "No peer group assigned"

    percentiles_df = calculate_peer_percentiles()
    
    # Filter for peer group and target company
    group_df = percentiles_df[percentiles_df['group_name'] == group_name]
    target_company = group_df[group_df['company_id'] == company_id]
    
    if len(target_company) == 0:
        if get_company_peer_group(company_id) is None:
            return "No peer group assigned"
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
