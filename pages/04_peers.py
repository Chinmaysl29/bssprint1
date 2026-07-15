from pathlib import Path
import sys

import pandas as pd
import plotly.graph_objects as go
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.analytics.peer import load_peer_groups
from src.screener.engine import StockScreener


RADAR_COLUMNS = [
    "ROE",
    "ROCE",
    "NPM",
    "Debt",
    "FCF",
    "Revenue CAGR",
    "PAT CAGR",
    "Composite Score",
]

TABLE_COLUMNS = [
    "Company",
    "ROE",
    "ROCE",
    "Composite",
    "Revenue CAGR",
    "Debt",
    "FCF",
]


@st.cache_data(show_spinner=False)
def load_peer_screen_data() -> pd.DataFrame:
    peer_groups = load_peer_groups()[["group_name", "company_id", "is_primary"]].copy()
    peer_groups["is_primary"] = peer_groups["is_primary"].astype(bool)

    screener = StockScreener(
        db_path=PROJECT_ROOT / "db" / "nifty100.db",
        config_path=PROJECT_ROOT / "config" / "screener_config.yaml",
    )
    try:
        metrics = screener.load_financial_data(compute_scores=True)
    finally:
        screener.close()

    df = peer_groups.merge(metrics, on="company_id", how="left")
    df["Company"] = df["company_name"].astype(str).str.strip()
    df["ROE"] = pd.to_numeric(df["roe_percentage"], errors="coerce")
    df["ROCE"] = pd.to_numeric(df["roce_percentage"], errors="coerce")
    df["NPM"] = (
        pd.to_numeric(df["pat"], errors="coerce")
        / pd.to_numeric(df["sales"], errors="coerce")
        * 100
    )
    df["Debt"] = pd.to_numeric(df["debt_equity"], errors="coerce")
    df["FCF"] = pd.to_numeric(df["fcf"], errors="coerce")
    df["Revenue CAGR"] = pd.to_numeric(df["revenue_cagr_5y"], errors="coerce").combine_first(
        pd.to_numeric(df["revenue_cagr_3y"], errors="coerce")
    )
    df["PAT CAGR"] = pd.to_numeric(df["pat_cagr_5y"], errors="coerce").combine_first(
        pd.to_numeric(df["pat_cagr_3y"], errors="coerce")
    )
    df["Composite Score"] = pd.to_numeric(df["composite_score"], errors="coerce")
    df["Composite"] = df["Composite Score"]

    return df


def radar_scores(peer_df: pd.DataFrame) -> pd.DataFrame:
    scored = peer_df.copy()

    for column in RADAR_COLUMNS:
        values = pd.to_numeric(scored[column], errors="coerce")
        ascending = column == "Debt"
        scored[f"{column} Radar"] = (
            values.rank(pct=True, ascending=ascending, method="average") * 100
        ).fillna(0)

    return scored


def build_radar_chart(peer_df: pd.DataFrame, selected_company: str) -> go.Figure:
    scored = radar_scores(peer_df)
    company_row = scored[scored["company_id"].eq(selected_company)].iloc[0]
    radar_fields = [f"{column} Radar" for column in RADAR_COLUMNS]

    company_values = [float(company_row[field]) for field in radar_fields]
    peer_values = scored[radar_fields].mean(numeric_only=True).fillna(0).tolist()

    labels = RADAR_COLUMNS + [RADAR_COLUMNS[0]]
    company_values = company_values + company_values[:1]
    peer_values = peer_values + peer_values[:1]

    fig = go.Figure()
    fig.add_trace(
        go.Scatterpolar(
            r=peer_values,
            theta=labels,
            fill="toself",
            name="Peer Average",
            line=dict(color="#64748b", dash="dash", width=2),
            fillcolor="rgba(100, 116, 139, 0.12)",
        )
    )
    fig.add_trace(
        go.Scatterpolar(
            r=company_values,
            theta=labels,
            fill="toself",
            name=str(company_row["Company"]),
            line=dict(color="#2563eb", width=3),
            fillcolor="rgba(37, 99, 235, 0.24)",
        )
    )
    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100], tickvals=[20, 40, 60, 80, 100]),
        ),
        margin=dict(l=20, r=20, t=40, b=20),
        legend=dict(orientation="h", yanchor="bottom", y=1.05, xanchor="center", x=0.5),
    )
    return fig


def build_peer_table(peer_df: pd.DataFrame) -> pd.DataFrame:
    table_df = peer_df[TABLE_COLUMNS + ["is_primary"]].copy()
    for column in TABLE_COLUMNS[1:]:
        table_df[column] = pd.to_numeric(table_df[column], errors="coerce").round(2)

    return table_df.sort_values(
        ["is_primary", "Composite", "Company"],
        ascending=[False, False, True],
        na_position="last",
    ).reset_index(drop=True)


def highlight_benchmark(row: pd.Series) -> list[str]:
    color = "background-color: #FFD966; color: #0F172A; font-weight: 600"
    return [color if row.get("is_primary") else "" for _ in row]


st.title("Peer Comparison")
st.caption("Peer-group benchmarking with radar comparison and scored fundamentals")

data = load_peer_screen_data()
peer_groups = sorted(data["group_name"].dropna().unique())

default_group_index = peer_groups.index("IT Services") if "IT Services" in peer_groups else 0
selected_group = st.selectbox(
    "Peer Group",
    peer_groups,
    index=default_group_index,
)

peer_df = data[data["group_name"].eq(selected_group)].copy()
if peer_df.empty:
    st.warning("No companies found for the selected peer group.")
    st.stop()

benchmark_rows = peer_df[peer_df["is_primary"]]
default_company = (
    benchmark_rows.iloc[0]["company_id"]
    if not benchmark_rows.empty
    else peer_df.iloc[0]["company_id"]
)
company_options = {
    f"{row.Company} ({row.company_id})": row.company_id
    for row in peer_df.sort_values("Company").itertuples(index=False)
}
default_company_label = next(
    label for label, company_id in company_options.items() if company_id == default_company
)

selected_company_label = st.selectbox(
    "Company",
    list(company_options),
    index=list(company_options).index(default_company_label),
)
selected_company = company_options[selected_company_label]

st.subheader("Selected Company vs Peer Average")
st.plotly_chart(
    build_radar_chart(peer_df, selected_company),
    width="stretch",
)

st.subheader("Peer Table")
table_df = build_peer_table(peer_df)
styled_table = (
    table_df.style
    .apply(highlight_benchmark, axis=1)
    .format(
        {
            "ROE": "{:.2f}%",
            "ROCE": "{:.2f}%",
            "Composite": "{:.2f}",
            "Revenue CAGR": "{:.2f}%",
            "Debt": "{:.2f}",
            "FCF": "{:.2f}",
        },
        na_rep="-",
    )
)

st.dataframe(
    styled_table,
    column_order=TABLE_COLUMNS,
    hide_index=True,
    width="stretch",
)
