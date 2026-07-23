import plotly.graph_objects as go
import streamlit as st

from src.dashboard.utils.db import (
    find_company,
    get_companies,
    get_company_kpis,
    get_company_pros_cons,
    get_company_revenue_profit,
    get_company_roe_roce_trend,
    get_valuation,
)


def _format_number_value(value):
    if value is None or value == "N/A":
        return "N/A"
    try:
        if value != value:
            return "N/A"
        return f"{float(value):.2f}"
    except (TypeError, ValueError):
        return str(value)


def _format_percent_value(value):
    if value is None or value == "N/A":
        return "N/A"
    try:
        if value != value:
            return "N/A"
        return f"{float(value):.2f}%"
    except (TypeError, ValueError):
        return str(value)


st.title("Company Profile")
st.caption("Fundamentals, ratios, and company metadata")

companies = get_companies()
company_options = {
    f"{row.company_name} ({row.ticker})": row.ticker
    for row in companies.itertuples(index=False)
}

search_term = st.text_input("Search by company name or NSE ticker").strip()
suggestion = st.selectbox(
    "Autocomplete suggestions",
    [""] + list(company_options.keys()),
    index=0,
    format_func=lambda value: "Start typing to find a company" if value == "" else value,
)

selected_term = search_term or (company_options[suggestion] if suggestion else "")

if not selected_term:
    st.info("Search for a company name or NSE ticker to view its profile.")
    st.stop()

company_match = find_company(selected_term)
if company_match.empty:
    st.error("Ticker not found.\nPlease try another company.")
    st.stop()

company = company_match.iloc[0]
ticker = company["ticker"]

st.markdown(
    """
    <style>
    .profile-card {
        border: 1px solid rgba(49, 51, 63, 0.2);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    .profile-label {
        color: #64748b;
        font-size: 0.8rem;
        margin-bottom: 0.15rem;
    }
    .badge {
        display: inline-block;
        border-radius: 999px;
        padding: 0.25rem 0.65rem;
        margin: 0.15rem 0.2rem 0.15rem 0;
        font-size: 0.88rem;
        font-weight: 600;
    }
    .badge-green {
        background: #dcfce7;
        color: #166534;
    }
    .badge-red {
        background: #fee2e2;
        color: #991b1b;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown('<div class="profile-card">', unsafe_allow_html=True)
st.subheader(company["company_name"])
meta_cols = st.columns(3)
with meta_cols[0]:
    st.markdown('<div class="profile-label">Sector</div>', unsafe_allow_html=True)
    st.write(company["sector"])
with meta_cols[1]:
    st.markdown('<div class="profile-label">Sub-sector</div>', unsafe_allow_html=True)
    st.write(company["sub_sector"])
with meta_cols[2]:
    st.markdown('<div class="profile-label">Ticker</div>', unsafe_allow_html=True)
    st.write(ticker)
st.markdown('<div class="profile-label">About Company</div>', unsafe_allow_html=True)
st.write(company["about_company"] or "No company description available.")
st.markdown("</div>", unsafe_allow_html=True)

kpis = get_company_kpis(ticker)
kpi_columns = st.columns(6)
for column, (label, value) in zip(kpi_columns, kpis.items()):
    with column:
        st.metric(label=label, value=value)

valuation = get_valuation(ticker)
if not valuation.empty:
    valuation_row = valuation.iloc[0]
    st.subheader("Valuation")
    valuation_columns = st.columns(4)
    valuation_metrics = [
        ("PE", valuation_row.get("PE")),
        ("PB", valuation_row.get("PB")),
        ("FCF Yield", valuation_row.get("FCF Yield %")),
        ("Valuation Flag", valuation_row.get("Flag")),
    ]
    for column, (label, value) in zip(valuation_columns, valuation_metrics):
        with column:
            if label == "FCF Yield":
                display_value = _format_percent_value(value)
            elif label == "Valuation Flag":
                display_value = "N/A" if value is None or value == "N/A" else str(value)
            else:
                display_value = _format_number_value(value)
            st.metric(label=label, value=display_value)

revenue_profit = get_company_revenue_profit(ticker)
if revenue_profit.empty:
    st.warning("Revenue and net profit history is not available for this company.")
else:
    st.subheader("Revenue & Net Profit")
    revenue_fig = go.Figure()
    revenue_fig.add_bar(
        x=revenue_profit["year"],
        y=revenue_profit["Revenue"],
        name="Revenue",
        marker_color="#2563eb",
    )
    revenue_fig.add_bar(
        x=revenue_profit["year"],
        y=revenue_profit["Net Profit"],
        name="Net Profit",
        marker_color="#10b981",
    )
    revenue_fig.update_layout(
        barmode="group",
        xaxis_title="Year",
        yaxis_title="₹ Cr",
        margin=dict(l=0, r=0, t=10, b=0),
    )
    st.plotly_chart(revenue_fig, width="stretch")

roe_roce = get_company_roe_roce_trend(ticker)
if roe_roce.empty:
    st.warning("ROE and ROCE trend data is not available for this company.")
else:
    st.subheader("ROE vs ROCE Trend")
    trend_fig = go.Figure()
    trend_fig.add_trace(
        go.Scatter(
            x=roe_roce["year"],
            y=roe_roce["ROE"],
            name="ROE",
            mode="lines+markers",
            line=dict(color="#2563eb", width=3),
            yaxis="y",
        )
    )
    trend_fig.add_trace(
        go.Scatter(
            x=roe_roce["year"],
            y=roe_roce["ROCE"],
            name="ROCE",
            mode="lines+markers",
            line=dict(color="#f59e0b", width=3),
            yaxis="y2",
        )
    )
    trend_fig.update_layout(
        xaxis_title="Year",
        yaxis=dict(title="ROE %", rangemode="tozero"),
        yaxis2=dict(title="ROCE %", overlaying="y", side="right", rangemode="tozero"),
        margin=dict(l=0, r=0, t=10, b=0),
    )
    st.plotly_chart(trend_fig, width="stretch")

st.subheader("Pros & Cons")
pros_cons = get_company_pros_cons(ticker)
pros_col, cons_col = st.columns(2)
with pros_col:
    st.markdown("**Pros**")
    if pros_cons["pros"]:
        for pro in pros_cons["pros"]:
            st.markdown(
                f'<span class="badge badge-green">✔ {pro}</span>',
                unsafe_allow_html=True,
            )
    else:
        st.write("No pros available.")
with cons_col:
    st.markdown("**Cons**")
    if pros_cons["cons"]:
        for con in pros_cons["cons"]:
            st.markdown(
                f'<span class="badge badge-red">✘ {con}</span>',
                unsafe_allow_html=True,
            )
    else:
        st.write("No cons available.")
