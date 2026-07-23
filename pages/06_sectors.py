from pathlib import Path
import sqlite3
import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.screener.engine import StockScreener


KPI_COLUMNS = ["Median ROE", "Median Revenue", "Median Debt", "Median CAGR"]


@st.cache_data(show_spinner=False)
def load_sector_data() -> pd.DataFrame:
    screener = StockScreener(
        db_path=PROJECT_ROOT / "db" / "nifty100.db",
        config_path=PROJECT_ROOT / "config" / "screener_config.yaml",
    )
    try:
        df = screener.load_financial_data(compute_scores=False)
    finally:
        screener.close()

    sector_query = """
        WITH ranked AS (
            SELECT
                company_id,
                industry,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT company_id, industry
        FROM ranked
        WHERE rn = 1
    """
    with sqlite3.connect(PROJECT_ROOT / "db" / "nifty100.db") as conn:
        industry_df = pd.read_sql_query(sector_query, conn)
        revenue_history = pd.read_sql_query(
            """
            SELECT company_id, year, sales
            FROM profitandloss
            WHERE year NOT LIKE '%TTM%'
            """,
            conn,
        )

    df = df.merge(industry_df, on="company_id", how="left")
    fallback_cagr = calculate_revenue_cagr(revenue_history)
    df = df.merge(fallback_cagr, on="company_id", how="left")

    result = pd.DataFrame()
    result["Company"] = df["company_name"].astype(str).str.strip()
    result["Ticker"] = df["company_id"]
    result["Sector"] = df["sector"].fillna("Unclassified")
    result["Sub Sector"] = df["industry"].fillna("Unclassified")
    result["Revenue"] = pd.to_numeric(df["sales"], errors="coerce")
    result["ROE"] = pd.to_numeric(df["roe_percentage"], errors="coerce")
    result["Market Cap"] = pd.to_numeric(df["market_cap"], errors="coerce")
    result["Debt"] = pd.to_numeric(df["debt_equity"], errors="coerce")
    result["Revenue CAGR"] = (
        pd.to_numeric(df["revenue_cagr_5y"], errors="coerce")
        .combine_first(pd.to_numeric(df["revenue_cagr_3y"], errors="coerce"))
        .combine_first(pd.to_numeric(df["fallback_revenue_cagr"], errors="coerce"))
    )

    return result


def calculate_revenue_cagr(revenue_history: pd.DataFrame) -> pd.DataFrame:
    history = revenue_history.copy()
    history["year_number"] = history["year"].astype(str).str.extract(r"((?:19|20)\d{2})").astype(float)
    history["sales"] = pd.to_numeric(history["sales"], errors="coerce")
    history = history.dropna(subset=["company_id", "year_number", "sales"])

    rows = []
    for company_id, group in history.sort_values("year_number").groupby("company_id"):
        clean_group = group[group["sales"] > 0].tail(6)
        if len(clean_group) < 2:
            rows.append({"company_id": company_id, "fallback_revenue_cagr": pd.NA})
            continue

        start = clean_group.iloc[0]
        end = clean_group.iloc[-1]
        years = end["year_number"] - start["year_number"]
        if years <= 0 or start["sales"] <= 0:
            cagr = pd.NA
        else:
            cagr = ((end["sales"] / start["sales"]) ** (1 / years) - 1) * 100
        rows.append({"company_id": company_id, "fallback_revenue_cagr": cagr})

    return pd.DataFrame(rows)


def build_bubble_chart(sector_df: pd.DataFrame) -> go.Figure:
    chart_df = sector_df.dropna(subset=["Revenue", "ROE", "Market Cap"]).copy()
    if chart_df.empty:
        return go.Figure()

    fig = px.scatter(
        chart_df,
        x="Revenue",
        y="ROE",
        size="Market Cap",
        color="Sub Sector",
        hover_name="Company",
        hover_data={
            "Ticker": True,
            "Revenue": ":,.0f",
            "ROE": ":.2f",
            "Market Cap": ":,.0f",
            "Debt": ":.2f",
            "Revenue CAGR": ":.2f",
        },
        size_max=54,
    )
    fig.update_layout(
        xaxis_title="Revenue (Rs Cr)",
        yaxis_title="ROE (%)",
        margin=dict(l=10, r=10, t=20, b=10),
        legend_title_text="Sub Sector",
    )
    fig.update_traces(marker=dict(line=dict(width=0.8, color="rgba(15, 23, 42, 0.35)")))
    return fig


def build_median_kpis(sector_df: pd.DataFrame) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "KPI": KPI_COLUMNS,
            "Value": [
                sector_df["ROE"].median(),
                sector_df["Revenue"].median(),
                sector_df["Debt"].median(),
                sector_df["Revenue CAGR"].median(),
            ],
        }
    )


def build_median_chart(kpi_df: pd.DataFrame) -> go.Figure:
    fig = px.bar(
        kpi_df,
        x="KPI",
        y="Value",
        text=kpi_df["Value"].map(lambda value: "" if pd.isna(value) else f"{value:,.2f}"),
        color="KPI",
    )
    fig.update_layout(
        xaxis_title=None,
        yaxis_title="Median Value",
        showlegend=False,
        margin=dict(l=10, r=10, t=20, b=10),
    )
    fig.update_traces(textposition="outside", cliponaxis=False)
    return fig


st.title("Sector Analytics")
st.caption("Sector revenue, profitability, market-cap spread, and median KPIs")

data = load_sector_data()
sectors = sorted(data["Sector"].dropna().unique())

default_index = sectors.index("Information Technology") if "Information Technology" in sectors else 0
selected_sector = st.selectbox(
    "Sector",
    sectors,
    index=default_index,
)

sector_df = data[data["Sector"].eq(selected_sector)].copy()
if sector_df.empty:
    st.warning("No companies found for the selected sector.")
    st.stop()

st.subheader("Revenue vs ROE")
bubble_chart = build_bubble_chart(sector_df)
if not bubble_chart.data:
    st.warning("Bubble chart data is unavailable for this sector.")
else:
    st.plotly_chart(bubble_chart, width="stretch")

st.subheader("Median KPIs")
kpi_df = build_median_kpis(sector_df)

kpi_cols = st.columns(4)
for column, row in zip(kpi_cols, kpi_df.itertuples(index=False)):
    value = "N/A" if pd.isna(row.Value) else f"{row.Value:,.2f}"
    suffix = "%" if row.KPI in {"Median ROE", "Median CAGR"} else ""
    with column:
        st.metric(row.KPI, f"{value}{suffix}")

st.plotly_chart(
    build_median_chart(kpi_df),
    width="stretch",
)
