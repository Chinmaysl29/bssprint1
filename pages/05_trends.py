from pathlib import Path
import re
import sqlite3
import sys

import pandas as pd
import plotly.graph_objects as go
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.dashboard.utils.db import get_companies


METRIC_OPTIONS = {
    "Revenue": "revenue",
    "PAT": "pat",
    "ROE": "roe",
    "ROCE": "roce",
    "NPM": "npm",
    "OPM": "opm",
    "Debt": "debt",
    "FCF": "fcf",
    "EPS": "eps",
}

PERCENT_METRICS = {"ROE", "ROCE", "NPM", "OPM"}


def year_sort_key(value: str | int | None) -> int:
    if value is None:
        return 0
    match = re.search(r"(19|20)\d{2}", str(value))
    return int(match.group(0)) if match else 0


@st.cache_data(show_spinner=False)
def load_trend_data(ticker: str) -> pd.DataFrame:
    query = """
        WITH pl_ranked AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id, year
                    ORDER BY id DESC
                ) AS rn
            FROM profitandloss
            WHERE company_id = ?
        ),
        bs_ranked AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id, year
                    ORDER BY id DESC
                ) AS rn
            FROM balancesheet
            WHERE company_id = ?
        ),
        fr_ranked AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id, year
                    ORDER BY id DESC
                ) AS rn
            FROM financial_ratios
            WHERE company_id = ?
        ),
        cf_ranked AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id, year
                    ORDER BY id DESC
                ) AS rn
            FROM cashflow
            WHERE company_id = ?
        )
        SELECT
            p.year,
            p.sales AS revenue,
            p.net_profit AS pat,
            COALESCE(fr.ratio3,
                CASE
                    WHEN (b.equity_capital + b.reserves) > 0
                    THEN (p.net_profit * 100.0) / (b.equity_capital + b.reserves)
                    ELSE NULL
                END
            ) AS roe,
            CASE
                WHEN (b.equity_capital + b.reserves + b.borrowings) > 0
                THEN ((p.operating_profit + p.other_income) * 100.0)
                    / (b.equity_capital + b.reserves + b.borrowings)
                ELSE NULL
            END AS roce,
            CASE
                WHEN p.sales > 0 THEN (p.net_profit * 100.0) / p.sales
                ELSE NULL
            END AS npm,
            p.opm_percentage AS opm,
            COALESCE(fr.ratio4,
                CASE
                    WHEN (b.equity_capital + b.reserves) > 0
                    THEN b.borrowings * 1.0 / (b.equity_capital + b.reserves)
                    ELSE NULL
                END
            ) AS debt,
            COALESCE(fr.free_cash_flow_cr, cf.operating_activity + cf.investing_activity) AS fcf,
            p.eps AS eps
        FROM pl_ranked p
        LEFT JOIN bs_ranked b
            ON p.company_id = b.company_id
            AND p.year = b.year
            AND b.rn = 1
        LEFT JOIN fr_ranked fr
            ON p.company_id = fr.company_id
            AND p.year = fr.year
            AND fr.rn = 1
        LEFT JOIN cf_ranked cf
            ON p.company_id = cf.company_id
            AND p.year = cf.year
            AND cf.rn = 1
        WHERE p.rn = 1
            AND p.year NOT LIKE '%TTM%'
    """

    with sqlite3.connect(PROJECT_ROOT / "db" / "nifty100.db") as conn:
        df = pd.read_sql_query(query, conn, params=(ticker, ticker, ticker, ticker))

    if df.empty:
        return df

    df["year_number"] = df["year"].apply(year_sort_key)
    df = df[df["year_number"] > 0].sort_values("year_number").tail(10)
    return df.reset_index(drop=True)


def format_yoy(value: float | int | None) -> str:
    if pd.isna(value):
        return ""
    sign = "+" if value >= 0 else ""
    return f"{sign}{value:.0f}%"


def build_chart(trend_df: pd.DataFrame, selected_metrics: list[str]) -> go.Figure:
    fig = go.Figure()

    for metric_label in selected_metrics:
        column = METRIC_OPTIONS[metric_label]
        series = pd.to_numeric(trend_df[column], errors="coerce")
        yoy = series.pct_change() * 100

        fig.add_trace(
            go.Scatter(
                x=trend_df["year"],
                y=series,
                mode="lines+markers+text",
                name=metric_label,
                text=[format_yoy(value) for value in yoy],
                textposition="top center",
                hovertemplate=(
                    f"{metric_label}<br>"
                    "Year: %{x}<br>"
                    "Value: %{y:,.2f}<br>"
                    "YoY: %{text}<extra></extra>"
                ),
                marker=dict(size=8),
                line=dict(width=3),
            )
        )

    y_axis_title = "Value"
    if selected_metrics and all(metric in PERCENT_METRICS for metric in selected_metrics):
        y_axis_title = "Percent"
    elif selected_metrics and all(metric in {"Revenue", "PAT", "FCF"} for metric in selected_metrics):
        y_axis_title = "Rs Cr"

    fig.update_layout(
        xaxis_title="Financial Year",
        yaxis_title=y_axis_title,
        hovermode="x unified",
        margin=dict(l=10, r=10, t=30, b=10),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5),
    )
    fig.update_xaxes(type="category")
    return fig


st.title("Financial Trends")
st.caption("10-year interactive trend analysis with YoY annotations")

companies = get_companies()
company_options = {
    f"{row.company_name} ({row.ticker})": row.ticker
    for row in companies.itertuples(index=False)
}

selected_company_label = st.selectbox(
    "Company Search",
    list(company_options),
    index=list(company_options.values()).index("TCS") if "TCS" in company_options.values() else 0,
    placeholder="Search by company name or ticker",
)
selected_ticker = company_options[selected_company_label]

selected_metrics = st.multiselect(
    "Metrics",
    list(METRIC_OPTIONS),
    default=["Revenue", "ROE", "PAT"],
    max_selections=3,
    help="Select up to 3 metrics.",
)

if not selected_metrics:
    st.info("Select at least one metric to view the trend chart.")
    st.stop()

trend_df = load_trend_data(selected_ticker)
if trend_df.empty:
    st.warning("No trend data is available for the selected company.")
    st.stop()

st.subheader(f"{selected_company_label} - Last {len(trend_df)} Years")
st.plotly_chart(
    build_chart(trend_df, selected_metrics),
    width="stretch",
)
