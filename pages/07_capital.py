
import streamlit as st

st.title("Capital Allocation")
st.caption("Cash flow quality, FCF, and capital deployment patterns")

company = st.selectbox("Company", ["TCS", "RELIANCE", "INFY"])
st.write(f"Capital allocation insights for **{company}** will be implemented here.")
