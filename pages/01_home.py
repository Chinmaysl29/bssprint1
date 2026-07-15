import plotly.express as px
import streamlit as st

from src.dashboard.utils.db import (
    get_home_kpis,
    get_sector_counts,
    get_top_companies,
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
