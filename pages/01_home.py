import plotly.express as px
import streamlit as st

from src.dashboard.utils.db import (
    get_home_kpis,
    get_sector_counts,
    get_top_companies,
    get_valuation,
)


st.title("Nifty 100 Financial Intelligence Platform")
st.caption("Financial Analytics Dashboard")

selected_year = st.sidebar.selectbox(
    "Year",
    [2019, 2020, 2021, 2022, 2023, 2024],
    index=5,
)

kpis = get_home_kpis(selected_year)
kpi_columns = st.columns(6)
for column, (label, value) in zip(kpi_columns, kpis.items()):
    with column:
        st.metric(label=label, value=value)

st.subheader("Sector Distribution")
sector_counts = get_sector_counts()
sector_fig = px.pie(
    sector_counts,
    names="sector",
    values="company_count",
    hole=0.45,
)
sector_fig.update_traces(
    textinfo="label+percent",
    hovertemplate="%{label}<br>Companies: %{value}<extra></extra>",
)
sector_fig.update_layout(
    margin=dict(l=0, r=0, t=10, b=0),
    showlegend=True,
)
st.plotly_chart(sector_fig, width="stretch")

st.subheader("Top 5 Companies")
top_companies = get_top_companies(selected_year)
st.dataframe(
    top_companies,
    hide_index=True,
    width="stretch",
)

st.subheader("Valuation Summary")
valuation = get_valuation()
if valuation.empty:
    st.warning("Valuation summary is not available.")
else:
    valuation_display = valuation.fillna("N/A")
    flag_counts = valuation["Flag"].value_counts()
    valuation_columns = st.columns(4)
    valuation_metrics = [
        ("Companies", len(valuation)),
        ("Discount", int(flag_counts.get("Discount", 0))),
        ("Caution", int(flag_counts.get("Caution", 0))),
        ("Fair", int(flag_counts.get("Fair", 0))),
    ]
    for column, (label, value) in zip(valuation_columns, valuation_metrics):
        with column:
            st.metric(label=label, value=value)

    st.download_button(
        label="Download Valuation CSV",
        data=valuation_display.to_csv(index=False).encode("utf-8"),
        file_name="valuation_summary.csv",
        mime="text/csv",
    )

    st.dataframe(
        valuation_display[
            [
                "company_id",
                "company_name",
                "sector",
                "PE",
                "PB",
                "EV/EBITDA",
                "FCF Yield %",
                "Flag",
            ]
        ],
        hide_index=True,
        width="stretch",
    )
