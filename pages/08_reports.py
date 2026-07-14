
import streamlit as st

st.title("Annual Reports")
st.caption("Peer reports, screener exports, and audit summaries")

report_type = st.selectbox(
    "Report",
    ["Peer Comparison Workbook", "Screener Output", "Load Audit", "Validation Failures"],
)
st.write(f"Download and preview for **{report_type}** will be implemented here.")
