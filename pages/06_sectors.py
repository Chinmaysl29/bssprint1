
import streamlit as st

st.title("Sector Analytics")
st.caption("Sector rankings, medians, and relative performance")

sector = st.selectbox(
    "Sector",
    ["IT Services", "Banking", "Pharma", "Auto", "FMCG", "Power & Utilities"],
)
st.write(f"Sector dashboard for **{sector}** will be implemented here.")
