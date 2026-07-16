
import sqlite3
from pathlib import Path

import pandas as pd
import streamlit as st


CACHE_TTL_SECONDS = 600
VALID_TABLE_NAMES = {
    "analysis",
    "balancesheet",
    "cashflow",
    "companies",
    "documents",
    "financial_ratios",
    "market_cap",
    "peer_groups",
    "peer_percentiles",
    "profitandloss",
    "prosandcons",
    "sectors",
    "stock_prices",
}


def get_database_path() -> Path:
    """Return the path to the NIFTY100 SQLite warehouse."""
    project_root = Path(__file__).resolve().parents[3]
    return project_root / "db" / "nifty100.db"


def get_project_root() -> Path:
    """Return the NIFTY100 project root."""
    return Path(__file__).resolve().parents[3]


def get_connection() -> sqlite3.Connection:
    """Open a read-only SQLite connection to the warehouse."""
    db_path = get_database_path()
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")
    return sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def run_query(query: str, params: tuple | None = None) -> pd.DataFrame:
    """Execute a SQL query and return the result as a DataFrame."""
    with get_connection() as conn:
        return pd.read_sql_query(query, conn, params=params or ())


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def table_exists(table_name: str) -> bool:
    """Check whether a table exists in the warehouse."""
    query = """
        SELECT COUNT(*)
        FROM sqlite_master
        WHERE type = 'table' AND name = ?
    """
    with get_connection() as conn:
        count = conn.execute(query, (table_name,)).fetchone()[0]
    return count > 0


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_table_count(table_name: str) -> int:
    """Return the row count for a table."""
    if table_name not in VALID_TABLE_NAMES:
        raise ValueError(f"Unknown table name: {table_name}")
    if not table_exists(table_name):
        return 0
    with get_connection() as conn:
        return conn.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_companies() -> pd.DataFrame:
    """Return company master data with latest sector metadata."""
    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT
            c.id AS ticker,
            c.company_name,
            c.company_logo,
            c.website,
            c.nse_profile,
            c.bse_profile,
            c.face_value,
            c.book_value,
            c.roce_percentage,
            c.roe_percentage,
            s.sector,
            s.industry,
            s.score,
            s.cap
        FROM companies c
        LEFT JOIN latest_sectors s
            ON c.id = s.company_id
            AND s.rn = 1
        ORDER BY c.company_name
    """
    return run_query(query)


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_ratios(ticker: str) -> pd.DataFrame:
    """Return financial ratio history for one company."""
    query = """
        SELECT
            fr.*,
            c.company_name
        FROM financial_ratios fr
        JOIN companies c
            ON fr.company_id = c.id
        WHERE fr.company_id = ?
        ORDER BY CAST(fr.year AS INTEGER)
    """
    return run_query(query, (_normalize_ticker(ticker),))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_pl(ticker: str) -> pd.DataFrame:
    """Return profit and loss history for one company."""
    query = """
        SELECT
            p.*,
            c.company_name
        FROM profitandloss p
        JOIN companies c
            ON p.company_id = c.id
        WHERE p.company_id = ?
        ORDER BY CAST(p.year AS INTEGER)
    """
    return run_query(query, (_normalize_ticker(ticker),))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_bs(ticker: str) -> pd.DataFrame:
    """Return balance sheet history for one company."""
    query = """
        SELECT
            b.*,
            c.company_name
        FROM balancesheet b
        JOIN companies c
            ON b.company_id = c.id
        WHERE b.company_id = ?
        ORDER BY CAST(b.year AS INTEGER)
    """
    return run_query(query, (_normalize_ticker(ticker),))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_cf(ticker: str) -> pd.DataFrame:
    """Return cash flow history for one company."""
    query = """
        SELECT
            cf.*,
            c.company_name
        FROM cashflow cf
        JOIN companies c
            ON cf.company_id = c.id
        WHERE cf.company_id = ?
        ORDER BY CAST(cf.year AS INTEGER)
    """
    return run_query(query, (_normalize_ticker(ticker),))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_sectors() -> pd.DataFrame:
    """Return sector and industry groupings with company counts."""
    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT
            sector,
            industry,
            cap,
            COUNT(DISTINCT company_id) AS company_count,
            AVG(score) AS average_score
        FROM latest_sectors
        WHERE rn = 1
        GROUP BY sector, industry, cap
        ORDER BY sector, industry, cap
    """
    return run_query(query)


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_peers(group: str) -> pd.DataFrame:
    """Return companies in a peer group with latest sector and ratio data."""
    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        ),
        latest_ratios AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY CAST(year AS INTEGER) DESC, id DESC
                ) AS rn
            FROM financial_ratios
        )
        SELECT
            pg.group_name,
            pg.is_primary,
            c.id AS ticker,
            c.company_name,
            s.sector,
            s.industry,
            s.cap,
            r.year,
            r.ratio1,
            r.ratio2,
            r.ratio3,
            r.ratio4,
            r.free_cash_flow_cr,
            r.cfo_quality_score,
            r.capex_intensity_pct,
            r.capex_label,
            r.fcf_conversion_pct,
            r.capital_allocation_pattern
        FROM peer_groups pg
        JOIN companies c
            ON pg.company_id = c.id
        LEFT JOIN latest_sectors s
            ON c.id = s.company_id
            AND s.rn = 1
        LEFT JOIN latest_ratios r
            ON c.id = r.company_id
            AND r.rn = 1
        WHERE pg.group_name = ?
        ORDER BY pg.is_primary DESC, c.company_name
    """
    return run_query(query, (group,))


@st.cache_data(ttl=600)
def get_valuation(ticker: str | None = None) -> pd.DataFrame:
    """Return exported valuation summary data, optionally filtered by ticker."""
    output_dir = get_project_root() / "output"
    xlsx_path = output_dir / "valuation_summary.xlsx"
    csv_path = output_dir / "valuation_summary.csv"

    if xlsx_path.exists():
        df = pd.read_excel(xlsx_path)
    elif csv_path.exists():
        df = pd.read_csv(csv_path)
    else:
        return pd.DataFrame(
            columns=[
                "company_id",
                "company_name",
                "sector",
                "PE",
                "PB",
                "EV/EBITDA",
                "FCF Yield %",
                "5 Year Median PE",
                "PE vs Sector",
                "Flag",
            ]
        )

    if "company_id" in df.columns:
        df["company_id"] = df["company_id"].astype(str).str.strip().str.upper()

    if ticker is None:
        return df.fillna("N/A")

    normalized_ticker = _normalize_ticker(ticker)
    return df[df["company_id"] == normalized_ticker].reset_index(drop=True).fillna("N/A")


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_home_kpis(year: int) -> dict[str, str]:
    """Return headline KPIs for the dashboard home screen."""
    year_text = str(year)
    query = """
        WITH latest_sector AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        ),
        year_ratios AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM financial_ratios
            WHERE year LIKE ?
        ),
        five_year_growth AS (
            SELECT
                company_id,
                CAST(
                    REPLACE(
                        TRIM(SUBSTR(compounded_sales_growth, INSTR(compounded_sales_growth, ':') + 1)),
                        '%',
                        ''
                    ) AS REAL
                ) AS revenue_cagr_5y
            FROM analysis
            WHERE compounded_sales_growth LIKE '5 Years:%'
        )
        SELECT
            AVG(c.roe_percentage) AS average_roe,
            (SELECT MEDIAN(val3) FROM market_cap WHERE year = ?) AS median_pe,
            (SELECT MEDIAN(ratio4) FROM year_ratios WHERE rn = 1) AS median_de,
            COUNT(DISTINCT c.id) AS total_companies,
            (SELECT MEDIAN(revenue_cagr_5y) FROM five_year_growth) AS median_revenue_cagr_5y,
            (
                SELECT COUNT(DISTINCT company_id)
                FROM year_ratios
                WHERE rn = 1
                    AND COALESCE(ratio4, 0) = 0
            ) AS debt_free_companies
        FROM companies c
        LEFT JOIN latest_sector s
            ON c.id = s.company_id
            AND s.rn = 1
    """
    with get_connection() as conn:
        conn.create_aggregate("MEDIAN", 1, _MedianAggregate)
        row = conn.execute(query, (f"%{year_text}", year)).fetchone()

    values = {
        "Average ROE": _format_percent(row[0]),
        "Median P/E": _format_number(row[1]),
        "Median D/E": _format_number(row[2]),
        "Total Companies": _format_integer(row[3]),
        "Median Revenue CAGR (5Y)": _format_percent(row[4]),
        "Debt-Free Companies": _format_integer(row[5]),
    }
    return values


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_sector_counts() -> pd.DataFrame:
    """Return latest company counts by sector for the home donut chart."""
    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT
            COALESCE(sector, 'Unclassified') AS sector,
            COUNT(DISTINCT company_id) AS company_count
        FROM latest_sectors
        WHERE rn = 1
        GROUP BY COALESCE(sector, 'Unclassified')
        ORDER BY company_count DESC, sector
    """
    return run_query(query)


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_top_companies(year: int, limit: int = 5) -> pd.DataFrame:
    """Return top companies ranked by computed composite quality score."""
    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        ),
        year_ratios AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM financial_ratios
            WHERE year LIKE ?
        ),
        five_year_growth AS (
            SELECT
                company_id,
                CAST(
                    REPLACE(
                        TRIM(SUBSTR(compounded_sales_growth, INSTR(compounded_sales_growth, ':') + 1)),
                        '%',
                        ''
                    ) AS REAL
                ) AS revenue_cagr_5y
            FROM analysis
            WHERE compounded_sales_growth LIKE '5 Years:%'
        )
        SELECT
            c.company_name AS Company,
            COALESCE(s.sector, 'Unclassified') AS Sector,
            ROUND(
                COALESCE(c.roe_percentage, 0)
                + COALESCE(c.roce_percentage, 0)
                + COALESCE(g.revenue_cagr_5y, 0)
                + COALESCE(r.cfo_quality_score, 0)
                - COALESCE(r.ratio4, 0),
                2
            ) AS "Composite Score"
        FROM companies c
        LEFT JOIN latest_sectors s
            ON c.id = s.company_id
            AND s.rn = 1
        LEFT JOIN year_ratios r
            ON c.id = r.company_id
            AND r.rn = 1
        LEFT JOIN five_year_growth g
            ON c.id = g.company_id
        ORDER BY "Composite Score" DESC, c.company_name
        LIMIT ?
    """
    df = run_query(query, (f"%{year}", limit))
    df.insert(0, "Rank", range(1, len(df) + 1))
    return df


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def find_company(search_term: str) -> pd.DataFrame:
    """Return a single company match by ticker or company name."""
    term = search_term.strip()
    if not term:
        return pd.DataFrame()

    query = """
        WITH latest_sectors AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY id DESC
                ) AS rn
            FROM sectors
        )
        SELECT
            c.id AS ticker,
            c.company_name,
            c.about_company,
            COALESCE(s.sector, 'Unclassified') AS sector,
            COALESCE(s.industry, 'Unclassified') AS sub_sector
        FROM companies c
        LEFT JOIN latest_sectors s
            ON c.id = s.company_id
            AND s.rn = 1
        WHERE UPPER(c.id) = UPPER(?)
            OR UPPER(c.company_name) = UPPER(?)
            OR UPPER(c.company_name) LIKE UPPER(?)
        ORDER BY
            CASE
                WHEN UPPER(c.id) = UPPER(?) THEN 1
                WHEN UPPER(c.company_name) = UPPER(?) THEN 2
                ELSE 3
            END,
            c.company_name
        LIMIT 1
    """
    return run_query(query, (term, term, f"%{term}%", term, term))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_company_kpis(ticker: str) -> dict[str, str]:
    """Return company profile KPI cards for one ticker."""
    normalized_ticker = _normalize_ticker(ticker)
    query = """
        WITH latest_pl AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY _year_sort_key(year) DESC, id DESC
                ) AS rn
            FROM profitandloss
            WHERE company_id = ?
        ),
        latest_ratios AS (
            SELECT
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY company_id
                    ORDER BY _year_sort_key(year) DESC, id DESC
                ) AS rn
            FROM financial_ratios
            WHERE company_id = ?
        ),
        five_year_growth AS (
            SELECT
                company_id,
                CAST(
                    REPLACE(
                        TRIM(SUBSTR(compounded_sales_growth, INSTR(compounded_sales_growth, ':') + 1)),
                        '%',
                        ''
                    ) AS REAL
                ) AS revenue_cagr_5y
            FROM analysis
            WHERE company_id = ?
                AND compounded_sales_growth LIKE '5 Years:%'
        )
        SELECT
            c.roe_percentage AS roe,
            c.roce_percentage AS roce,
            CASE
                WHEN p.sales > 0 THEN ROUND((p.net_profit * 100.0) / p.sales, 2)
                ELSE NULL
            END AS net_profit_margin,
            r.ratio4 AS debt_to_equity,
            g.revenue_cagr_5y,
            r.free_cash_flow_cr AS latest_free_cash_flow
        FROM companies c
        LEFT JOIN latest_pl p
            ON c.id = p.company_id
            AND p.rn = 1
        LEFT JOIN latest_ratios r
            ON c.id = r.company_id
            AND r.rn = 1
        LEFT JOIN five_year_growth g
            ON c.id = g.company_id
        WHERE c.id = ?
    """
    with get_connection() as conn:
        conn.create_function("_year_sort_key", 1, _year_sort_key)
        row = conn.execute(
            query,
            (normalized_ticker, normalized_ticker, normalized_ticker, normalized_ticker),
        ).fetchone()

    if row is None:
        return {}

    return {
        "ROE": _format_percent(row[0]),
        "ROCE": _format_percent(row[1]),
        "Net Profit Margin": _format_percent(row[2]),
        "Debt-to-Equity": _format_number(row[3]),
        "Revenue CAGR (5Y)": _format_percent(row[4]),
        "Latest Free Cash Flow": _format_currency_cr(row[5]),
    }


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_company_revenue_profit(ticker: str) -> pd.DataFrame:
    """Return 10-year revenue and net profit data for one company."""
    query = """
        SELECT
            year,
            sales AS Revenue,
            net_profit AS "Net Profit"
        FROM profitandloss
        WHERE company_id = ?
        ORDER BY _year_sort_key(year) DESC, id DESC
        LIMIT 10
    """
    with get_connection() as conn:
        conn.create_function("_year_sort_key", 1, _year_sort_key)
        df = pd.read_sql_query(query, conn, params=(_normalize_ticker(ticker),))
    return df.sort_values("year", key=lambda values: values.map(_year_sort_key))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_company_roe_roce_trend(ticker: str) -> pd.DataFrame:
    """Return 10-year calculated ROE and ROCE trend data for one company."""
    query = """
        SELECT
            p.year,
            CASE
                WHEN (b.equity_capital + b.reserves) > 0
                    THEN ROUND((p.net_profit * 100.0) / (b.equity_capital + b.reserves), 2)
                ELSE NULL
            END AS ROE,
            CASE
                WHEN (b.equity_capital + b.reserves + b.borrowings) > 0
                    THEN ROUND(((p.operating_profit + p.other_income) * 100.0) / (b.equity_capital + b.reserves + b.borrowings), 2)
                ELSE NULL
            END AS ROCE
        FROM profitandloss p
        JOIN balancesheet b
            ON p.company_id = b.company_id
            AND _year_sort_key(p.year) = _year_sort_key(b.year)
        WHERE p.company_id = ?
        ORDER BY _year_sort_key(p.year) DESC, p.id DESC
        LIMIT 10
    """
    with get_connection() as conn:
        conn.create_function("_year_sort_key", 1, _year_sort_key)
        df = pd.read_sql_query(query, conn, params=(_normalize_ticker(ticker),))
    return df.sort_values("year", key=lambda values: values.map(_year_sort_key))


@st.cache_data(ttl=CACHE_TTL_SECONDS)
def get_company_pros_cons(ticker: str) -> dict[str, list[str]]:
    """Return pros and cons for one company."""
    query = """
        SELECT pros, cons
        FROM prosandcons
        WHERE company_id = ?
        ORDER BY id
    """
    df = run_query(query, (_normalize_ticker(ticker),))
    pros = [value for value in df["pros"].dropna().astype(str).tolist() if value.strip()]
    cons = [value for value in df["cons"].dropna().astype(str).tolist() if value.strip()]
    return {"pros": pros[:5], "cons": cons[:5]}


def _normalize_ticker(ticker: str) -> str:
    """Normalize dashboard ticker inputs to database company IDs."""
    return ticker.strip().upper()


def _format_integer(value: float | int | None) -> str:
    if pd.isna(value):
        return "N/A"
    return f"{int(value):,}"


def _format_number(value: float | int | None) -> str:
    if pd.isna(value):
        return "N/A"
    return f"{float(value):,.2f}"


def _format_percent(value: float | int | None) -> str:
    if pd.isna(value):
        return "N/A"
    return f"{float(value):.1f}%"


def _format_currency_cr(value: float | int | None) -> str:
    if pd.isna(value):
        return "N/A"
    return f"₹{float(value):,.0f} Cr"


def _year_sort_key(value: str | int | None) -> int:
    if value is None:
        return 0
    digits = "".join(character for character in str(value) if character.isdigit())
    if len(digits) >= 4:
        return int(digits[-4:])
    return int(digits) if digits else 0


class _MedianAggregate:
    def __init__(self) -> None:
        self.values: list[float] = []

    def step(self, value: float | int | None) -> None:
        if value is not None:
            self.values.append(float(value))

    def finalize(self) -> float | None:
        if not self.values:
            return None
        values = sorted(self.values)
        midpoint = len(values) // 2
        if len(values) % 2:
            return values[midpoint]
        return (values[midpoint - 1] + values[midpoint]) / 2
