
import streamlit as st

st.title("Stock Screener")
st.caption("Preset-based screening powered by the Sprint 3 scoring engine")

preset = st.selectbox(
    "Preset",
    [
        "Quality Compounder",
        "Growth Accelerator",
        "Value Pick",
        "Debt-Free Bluechip",
        "Dividend Champion",
        "Turnaround Watch",
    ],
)
st.write(f"Screener results for **{preset}** will be implemented here.")
