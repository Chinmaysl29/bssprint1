
import streamlit as st

st.title("Financial Trends")
st.caption("Multi-year revenue, profit, and ratio trends")

metric = st.selectbox("Metric", ["Revenue", "Net Profit", "ROE", "ROCE", "FCF"])
years = st.slider("Years to display", min_value=3, max_value=10, value=5)
st.write(f"Trend chart for **{metric}** over the last **{years}** years will be implemented here.")
