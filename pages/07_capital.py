from pathlib import Path
import re
import sqlite3
import sys

import pandas as pd
import plotly.express as px
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


PATTERN_ORDER = [
    "Reinvestor",
    "Shareholder Returns",
    "Mixed",
    "Debt Funded",
    "Pre Revenue",
    "Distress",
    "Cash Accumulator",
    "Liquidating Assets",
]

PATTERN_LABEL_MAP = {
    "Growth Funded by Debt": "Debt Funded",
    "Pre-Revenue": "Pre Revenue",
    "Distress Signal": "Distress",
}

PATTERN_COLORS = {
    "Reinvestor": "#2563eb",
    "Shareholder Returns": "#10b981",
    "Mixed": "#64748b",
    "Debt Funded": "#8b5cf6",
    "Pre Revenue": "#f97316",
    "Distress": "#ef4444",
    "Cash Accumulator": "#06b6d4",
    "Liquidating Assets": "#f59e0b",
}


def year_sort_key(value: str | int | None) -> int:
    if value is None:
        return 0
    match = re.search(r"(19|20)\d{2}", str(value))
    return int(match.group(0)) if match else 0


@st.cache_data(show_spinner=False)
def load_capital_allocation() -> pd.DataFrame:
    csv_path = PROJECT_ROOT / "output" / "capital_allocation.csv"
    allocation_df = pd.read_csv(csv_path)
    allocation_df = allocation_df.dropna(subset=["company_id", "pattern_label"]).copy()
    allocation_df["Pattern"] = allocation_df["pattern_label"].replace(PATTERN_LABEL_MAP)
    allocation_df = allocation_df[allocation_df["Pattern"].isin(PATTERN_ORDER)].copy()
    allocation_df["year_number"] = allocation_df["year"].apply(year_sort_key)
    allocation_df = allocation_df.sort_values(
        ["company_id", "year_number"],
        ascending=[True, False],
    ).drop_duplicates("company_id", keep="first")

    company_query = """
        WITH latest_sectors AS (
            SELECT
                company_id,
                sector,
                industry,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT
            c.id AS company_id,
            c.company_name,
            COALESCE(s.sector, 'Unclassified') AS sector,
            COALESCE(s.industry, 'Unclassified') AS industry
        FROM companies c
        LEFT JOIN latest_sectors s
            ON c.id = s.company_id
            AND s.rn = 1
    """
    with sqlite3.connect(PROJECT_ROOT / "db" / "nifty100.db") as conn:
        companies_df = pd.read_sql_query(company_query, conn)

    allocation_df = allocation_df.merge(companies_df, on="company_id", how="left")
    allocation_df["Company"] = allocation_df["company_name"].fillna(allocation_df["company_id"])
    allocation_df["Company"] = allocation_df["Company"].astype(str).str.strip()

    return allocation_df[
        [
            "company_id",
            "Company",
            "sector",
            "industry",
            "year",
            "cfo_sign",
            "cfi_sign",
            "cff_sign",
            "Pattern",
        ]
    ].reset_index(drop=True)


def build_pattern_summary(df: pd.DataFrame) -> pd.DataFrame:
    counts = (
        df.groupby("Pattern")["company_id"]
        .nunique()
        .reindex(PATTERN_ORDER, fill_value=0)
        .reset_index(name="Companies")
    )
    counts["Share"] = counts["Companies"] / max(counts["Companies"].sum(), 1)
    return counts


def build_treemap(summary_df: pd.DataFrame):
    fig = px.treemap(
        summary_df,
        path=["Pattern"],
        values="Companies",
        color="Pattern",
        color_discrete_map=PATTERN_COLORS,
        custom_data=["Pattern", "Companies"],
    )
    fig.update_traces(
        texttemplate="<b>%{label}</b><br>%{value} companies",
        hovertemplate="<b>%{customdata[0]}</b><br>Companies: %{customdata[1]}<extra></extra>",
    )
    fig.update_layout(margin=dict(l=0, r=0, t=10, b=0))
    return fig


def selected_pattern_from_event(event, fallback: str) -> str:
    try:
        points = event.get("selection", {}).get("points", [])
    except AttributeError:
        return fallback

    if not points:
        return fallback

    point = points[0]
    for key in ("label", "id"):
        value = point.get(key)
        if value in PATTERN_ORDER:
            return value

    customdata = point.get("customdata")
    if customdata and customdata[0] in PATTERN_ORDER:
        return customdata[0]

    return fallback


st.title("Capital Allocation")
st.caption("Capital deployment pattern distribution and company drilldown")

data = load_capital_allocation()
if data.empty:
    st.warning("No capital allocation data found in output/capital_allocation.csv.")
    st.stop()

summary = build_pattern_summary(data)

st.subheader("Capital Allocation Patterns")
treemap_event = st.plotly_chart(
    build_treemap(summary),
    width="stretch",
    key="capital_allocation_treemap",
    on_select="rerun",
    selection_mode="points",
)

selected_pattern = selected_pattern_from_event(
    treemap_event,
    st.session_state.get("selected_capital_pattern", "Shareholder Returns"),
)
st.session_state["selected_capital_pattern"] = selected_pattern

pattern_count = int(summary.loc[summary["Pattern"].eq(selected_pattern), "Companies"].iloc[0])
st.subheader(f"{selected_pattern} Companies ({pattern_count})")

companies = data[data["Pattern"].eq(selected_pattern)].copy()
companies = companies.sort_values(["sector", "Company"]).reset_index(drop=True)

st.dataframe(
    companies.rename(
        columns={
            "company_id": "Ticker",
            "sector": "Sector",
            "industry": "Sub Sector",
            "year": "Latest Year",
            "cfo_sign": "CFO",
            "cfi_sign": "CFI",
            "cff_sign": "CFF",
        }
    )[
        ["Company", "Ticker", "Sector", "Sub Sector", "Latest Year", "CFO", "CFI", "CFF"]
    ],
    hide_index=True,
    width="stretch",
)
