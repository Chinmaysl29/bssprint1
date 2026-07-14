
import streamlit as st

st.title("Peer Comparison")
st.caption("Percentile ranks and peer-group benchmarking")

company = st.selectbox("Company", ["TCS", "RELIANCE", "INFY"])
peer_group = st.text_input("Peer group", value="IT Services")
st.write(f"Peer analytics for **{company}** in **{peer_group}** will be implemented here.")
