from pathlib import Path
import sqlite3
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import pandas as pd
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


@st.cache_data(show_spinner=False)
def load_report_data() -> pd.DataFrame:
    query = """
        SELECT
            d.company_id,
            COALESCE(c.company_name, d.company_id) AS company_name,
            d.Year AS year,
            d.Annual_Report AS annual_report
        FROM documents d
        LEFT JOIN companies c
            ON d.company_id = c.id
        ORDER BY company_name, d.Year DESC
    """
    with sqlite3.connect(PROJECT_ROOT / "db" / "nifty100.db") as conn:
        df = pd.read_sql_query(query, conn)

    df["year"] = pd.to_numeric(df["year"], errors="coerce").astype("Int64")
    df["annual_report"] = df["annual_report"].replace({"Null": pd.NA, "": pd.NA})
    return df.dropna(subset=["company_id", "year"]).reset_index(drop=True)


@st.cache_data(ttl=3600, show_spinner=False)
def get_url_status(url: str | None) -> int | None:
    if url is None or pd.isna(url) or not str(url).strip():
        return None

    request = Request(
        str(url).strip(),
        method="HEAD",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    try:
        with urlopen(request, timeout=5) as response:
            return response.status
    except HTTPError as exc:
        if exc.code == 405:
            return get_url_status_with_get(url)
        return exc.code
    except (TimeoutError, URLError, ValueError):
        return None


@st.cache_data(ttl=3600, show_spinner=False)
def get_url_status_with_get(url: str | None) -> int | None:
    if url is None or pd.isna(url) or not str(url).strip():
        return None

    request = Request(
        str(url).strip(),
        method="GET",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    try:
        with urlopen(request, timeout=5) as response:
            return response.status
    except HTTPError as exc:
        return exc.code
    except (TimeoutError, URLError, ValueError):
        return None


def is_report_available(url: str | None) -> bool:
    status = get_url_status(url)
    return status is not None and status != 404 and 200 <= status < 400


def render_report_row(year: int, url: str | None) -> None:
    col_year, col_status = st.columns([1, 4])
    with col_year:
        st.write(f"**{year}**")

    with col_status:
        if is_report_available(url):
            st.link_button("Open PDF", str(url).strip())
        else:
            st.markdown(
                '<span class="unavailable-badge">Report Unavailable</span>',
                unsafe_allow_html=True,
            )


st.title("Annual Reports")
st.caption("Company annual report links with availability checks")

st.markdown(
    """
    <style>
    .unavailable-badge {
        display: inline-block;
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        font-weight: 700;
        font-size: 0.9rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

reports_df = load_report_data()
if reports_df.empty:
    st.warning("No annual report data found.")
    st.stop()

company_options = {
    f"{row.company_name} ({row.company_id})": row.company_id
    for row in reports_df[["company_id", "company_name"]]
    .drop_duplicates()
    .sort_values("company_name")
    .itertuples(index=False)
}

default_label = next(
    (label for label, ticker in company_options.items() if ticker == "TCS"),
    next(iter(company_options)),
)

selected_company_label = st.selectbox(
    "Company Search",
    list(company_options),
    index=list(company_options).index(default_label),
    placeholder="Search by company name or ticker",
)
selected_company = company_options[selected_company_label]

company_reports = reports_df[reports_df["company_id"].eq(selected_company)].copy()
years = sorted(company_reports["year"].dropna().astype(int).unique(), reverse=True)

selected_years = st.multiselect(
    "Available Years",
    years,
    default=years[:6],
)

if not selected_years:
    st.info("Select at least one year to view annual report links.")
    st.stop()

st.subheader("Annual Report Links")
selected_reports = company_reports[
    company_reports["year"].astype(int).isin(selected_years)
].sort_values("year", ascending=False)

with st.spinner("Checking report links..."):
    for report in selected_reports.itertuples(index=False):
        render_report_row(int(report.year), report.annual_report)
