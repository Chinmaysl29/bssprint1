"""Valuation metrics for NIFTY100 companies.

This module is intentionally UI-free. It reads the SQLite warehouse and returns
pandas DataFrames that can be used by dashboards, reports, screeners, or tests.
"""

from __future__ import annotations

import os
import re
import sqlite3
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[2]

VALUATION_DATASET_CONFIG = {
    "market_cap": {
        "path": PROJECT_ROOT / "data" / "supporting" / "market_cap.xlsx",
        "header": 0,
        "columns": [
            "id",
            "company_id",
            "year",
            "market_cap_crore",
            "enterprise_value_crore",
            "pe_ratio",
            "pb_ratio",
            "ev_ebitda",
            "dividend_yield_pct",
        ],
    },
    "financial_ratios": {
        "path": PROJECT_ROOT / "data" / "supporting" / "financial_ratios.xlsx",
        "header": 0,
        "columns": [
            "id",
            "company_id",
            "year",
            "net_profit_margin_pct",
            "operating_profit_margin_pct",
            "return_on_equity_pct",
            "debt_to_equity",
            "interest_coverage",
            "asset_turnover",
            "free_cash_flow_cr",
            "capex_cr",
            "earnings_per_share",
            "book_value_per_share",
            "dividend_payout_ratio_pct",
            "total_debt_cr",
            "cash_from_operations_cr",
        ],
    },
    "companies": {
        "path": PROJECT_ROOT / "data" / "raw" / "companies.xlsx",
        "header": 1,
        "columns": [
            "id",
            "company_logo",
            "company_name",
            "chart_link",
            "about_company",
            "website",
            "nse_profile",
            "bse_profile",
            "face_value",
            "book_value",
            "roce_percentage",
            "roe_percentage",
        ],
    },
    "cashflow": {
        "path": PROJECT_ROOT / "data" / "raw" / "cashflow.xlsx",
        "header": 1,
        "columns": [
            "id",
            "company_id",
            "year",
            "operating_activity",
            "investing_activity",
            "financing_activity",
            "net_cash_flow",
        ],
    },
    "profitandloss": {
        "path": PROJECT_ROOT / "data" / "raw" / "profitandloss.xlsx",
        "header": 1,
        "columns": [
            "id",
            "company_id",
            "year",
            "sales",
            "expenses",
            "operating_profit",
            "opm_percentage",
            "other_income",
            "interest",
            "depreciation",
            "profit_before_tax",
            "tax_percentage",
            "net_profit",
            "eps",
            "dividend_payout",
        ],
    },
    "sectors": {
        "path": PROJECT_ROOT / "data" / "supporting" / "sectors.xlsx",
        "header": 0,
        "columns": [
            "id",
            "company_id",
            "broad_sector",
            "sub_sector",
            "index_weight_pct",
            "market_cap_category",
        ],
    },
}


def get_database_path() -> str:
    """Return the path to nifty100.db."""
    return str(PROJECT_ROOT / "db" / "nifty100.db")


def _normalize_company_ids(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize ticker/company identifiers for downstream joins."""
    df = df.copy()
    ticker_column = "company_id" if "company_id" in df.columns else "id" if "id" in df.columns else None
    if ticker_column is not None:
        df[ticker_column] = df[ticker_column].apply(
            lambda value: str(value).strip().upper() if pd.notna(value) else value
        )
    return df


def load_excel_dataset(dataset_name: str) -> pd.DataFrame:
    """Load one valuation input dataset from its Excel source file."""
    if dataset_name not in VALUATION_DATASET_CONFIG:
        known = ", ".join(sorted(VALUATION_DATASET_CONFIG))
        raise ValueError(f"Unknown valuation dataset: {dataset_name}. Expected one of: {known}")

    config = VALUATION_DATASET_CONFIG[dataset_name]
    path = config["path"]
    if not path.exists():
        raise FileNotFoundError(f"Valuation input file not found: {path}")

    df = pd.read_excel(path, header=config["header"])
    missing_columns = [column for column in config["columns"] if column not in df.columns]
    if missing_columns:
        raise ValueError(
            f"{dataset_name} is missing expected columns: {', '.join(missing_columns)}"
        )

    df = df[config["columns"]].copy()
    return _normalize_company_ids(df)


def load_valuation_datasets() -> dict[str, pd.DataFrame]:
    """
    Load the source datasets required by the valuation engine.

    Loaded datasets:
    - market_cap.xlsx
    - financial_ratios.xlsx
    - companies.xlsx
    - cashflow.xlsx
    - profitandloss.xlsx
    - sectors.xlsx
    """
    return {
        dataset_name: load_excel_dataset(dataset_name)
        for dataset_name in VALUATION_DATASET_CONFIG
    }


def load_valuation_inputs_from_excel() -> pd.DataFrame:
    """
    Load and merge valuation inputs directly from the requested Excel files.

    The companies file is used as the 92-company master universe. Market cap,
    financial ratios, cash flow, and profit/loss rows are matched by company and
    extracted year.
    """
    datasets = load_valuation_datasets()
    companies = datasets["companies"].rename(columns={"id": "company_id"})
    market_cap = datasets["market_cap"].copy()
    financial_ratios = datasets["financial_ratios"].copy()
    cashflow = datasets["cashflow"].copy()
    profitandloss = datasets["profitandloss"].copy()
    sectors = datasets["sectors"].copy()

    market_cap["year_int"] = market_cap["year"].apply(_year_to_int)
    financial_ratios["year_int"] = financial_ratios["year"].apply(_year_to_int)
    cashflow["year_int"] = cashflow["year"].apply(_year_to_int)
    profitandloss["year_int"] = profitandloss["year"].apply(_year_to_int)

    market_cap = market_cap.drop_duplicates(["company_id", "year_int"], keep="last")
    financial_ratios = financial_ratios.drop_duplicates(
        ["company_id", "year_int"], keep="last"
    )
    cashflow = cashflow.drop_duplicates(["company_id", "year_int"], keep="last")
    profitandloss = profitandloss.drop_duplicates(["company_id", "year_int"], keep="last")
    sectors = sectors.drop_duplicates("company_id", keep="last")

    df = companies[["company_id", "company_name", "book_value", "roce_percentage", "roe_percentage"]]
    df = df.merge(
        sectors[
            [
                "company_id",
                "broad_sector",
                "sub_sector",
                "index_weight_pct",
                "market_cap_category",
            ]
        ],
        on="company_id",
        how="left",
    )
    df = df.merge(market_cap, on="company_id", how="left")
    df = df.merge(
        financial_ratios,
        on=["company_id", "year_int"],
        how="left",
        suffixes=("", "_financial_ratio"),
    )
    df = df.merge(
        cashflow,
        on=["company_id", "year_int"],
        how="left",
        suffixes=("", "_cashflow"),
    )
    df = df.merge(
        profitandloss,
        on=["company_id", "year_int"],
        how="left",
        suffixes=("", "_profitandloss"),
    )

    return df.sort_values(["company_id", "year_int"]).reset_index(drop=True)


def load_market_cap() -> pd.DataFrame:
    """Load market_cap.xlsx with normalized IDs and a parsed year column."""
    market_cap = load_excel_dataset("market_cap")
    market_cap["year_int"] = market_cap["year"].apply(_year_to_int)
    return market_cap.sort_values(["company_id", "year_int"]).reset_index(drop=True)


def calculate_fcf_yield(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """
    Calculate FCF Yield = Free Cash Flow / Market Cap * 100.

    If no DataFrame is supplied, source data is loaded directly from the Step 2
    Excel inputs. Negative FCF is preserved.
    """
    if df is None:
        df = load_valuation_inputs_from_excel()
    else:
        df = df.copy()

    if "free_cash_flow_cr" not in df.columns:
        if {"operating_activity", "investing_activity"}.issubset(df.columns):
            df["free_cash_flow_cr"] = df["operating_activity"] + df["investing_activity"]
        else:
            raise ValueError(
                "FCF yield requires free_cash_flow_cr or operating_activity and investing_activity"
            )

    if "market_cap_crore" not in df.columns:
        raise ValueError("FCF yield requires market_cap_crore")

    df["fcf_yield_pct"] = df.apply(
        lambda row: _safe_divide(row["free_cash_flow_cr"], row["market_cap_crore"]),
        axis=1,
    )
    df["fcf_yield_pct"] = _round_series(df["fcf_yield_pct"] * 100)

    output_columns = [
        column
        for column in [
            "company_id",
            "company_name",
            "year",
            "year_int",
            "market_cap_crore",
            "free_cash_flow_cr",
            "fcf_yield_pct",
        ]
        if column in df.columns
    ]
    return df[output_columns].sort_values(["company_id", "year_int"]).reset_index(drop=True)


def calculate_sector_median_pe(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """
    Add sector_median_pe for each row based on broad_sector.

    Median PE is calculated within each broad sector and year when year data is
    present.
    """
    if df is None:
        df = load_valuation_inputs_from_excel()
    else:
        df = df.copy()

    if "broad_sector" not in df.columns:
        if "sector" in df.columns:
            df["broad_sector"] = df["sector"]
        else:
            raise ValueError("Sector median P/E requires a broad_sector column")

    pe_column = "source_pe_ratio" if "source_pe_ratio" in df.columns else "pe_ratio"
    if pe_column not in df.columns:
        raise ValueError("Sector median P/E requires pe_ratio or source_pe_ratio")

    group_columns = ["broad_sector"]
    if "valuation_year" in df.columns:
        group_columns.append("valuation_year")
    elif "year" in df.columns:
        group_columns.append("year")
    elif "year_int" in df.columns:
        group_columns.append("year_int")

    df["sector_median_pe"] = (
        df.groupby(group_columns)[pe_column]
        .transform("median")
        .pipe(_round_series)
    )
    return df


def calculate_pe_flag(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """
    Compare PE versus sector median and assign valuation flags.

    Labels:
    - Caution: PE > 1.5 x Sector Median
    - Discount: PE < 0.7 x Sector Median
    - Fair: all other valid comparisons
    """
    if df is None:
        df = calculate_sector_median_pe()
    else:
        df = df.copy()
        if "sector_median_pe" not in df.columns:
            df = calculate_sector_median_pe(df)

    pe_column = "source_pe_ratio" if "source_pe_ratio" in df.columns else "pe_ratio"

    df["pe_vs_sector_median"] = df.apply(
        lambda row: _safe_divide(row.get(pe_column), row.get("sector_median_pe")),
        axis=1,
    )
    df["pe_vs_sector_median"] = _round_series(df["pe_vs_sector_median"])

    def get_flag(row) -> str | None:
        pe_vs_sector_median = row.get("pe_vs_sector_median")
        if pd.isna(pe_vs_sector_median):
            return None
        if pe_vs_sector_median > 1.5:
            return "Caution"
        if pe_vs_sector_median < 0.7:
            return "Discount"
        return "Fair"

    df["valuation_flag"] = df.apply(get_flag, axis=1)
    return df


def calculate_5_year_median_pe(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """Calculate each company's median PE across its latest five market-cap years."""
    if df is None:
        df = load_market_cap()
    else:
        df = df.copy()

    if "year_int" not in df.columns:
        year_column = "valuation_year" if "valuation_year" in df.columns else "year"
        df["year_int"] = df[year_column].apply(_year_to_int)

    pe_column = "source_pe_ratio" if "source_pe_ratio" in df.columns else "pe_ratio"
    if pe_column not in df.columns:
        raise ValueError("5 Year Median PE requires pe_ratio or source_pe_ratio")

    latest_5 = (
        df.sort_values(["company_id", "year_int"], ascending=[True, False])
        .groupby("company_id")
        .head(5)
        .copy()
    )
    median_df = (
        latest_5.groupby("company_id")[pe_column]
        .median()
        .reset_index(name="five_year_median_pe")
    )
    median_df["five_year_median_pe"] = _round_series(median_df["five_year_median_pe"])
    return median_df


def generate_summary(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """Generate the latest 92-company valuation summary for export."""
    if df is None:
        df = load_valuation_inputs_from_excel()
        df = df.sort_values(
            ["company_id", "year_int"], ascending=[True, False], na_position="last"
        ).drop_duplicates("company_id", keep="first")
    else:
        df = df.copy()

    df = calculate_sector_median_pe(df)
    df = calculate_pe_flag(df)
    fcf_yield = calculate_fcf_yield()
    five_year_median_pe = calculate_5_year_median_pe()

    latest_fcf = fcf_yield.sort_values(
        ["company_id", "year_int"], ascending=[True, False], na_position="last"
    ).drop_duplicates("company_id", keep="first")

    df = df.merge(
        latest_fcf[["company_id", "free_cash_flow_cr", "fcf_yield_pct"]],
        on="company_id",
        how="left",
        suffixes=("", "_from_excel"),
    )
    df = df.merge(five_year_median_pe, on="company_id", how="left")

    summary = pd.DataFrame(
        {
            "company_id": df["company_id"],
            "company_name": df["company_name"],
            "sector": df["broad_sector"],
            "PE": df["pe_ratio"],
            "PB": df["pb_ratio"],
            "EV/EBITDA": df["ev_ebitda"],
            "FCF Yield %": df["fcf_yield_pct"],
            "5 Year Median PE": df["five_year_median_pe"],
            "PE vs Sector": df["pe_vs_sector_median"],
            "Flag": df["valuation_flag"],
        }
    )
    return summary.sort_values("company_id").reset_index(drop=True)


def export_results(
    df: pd.DataFrame | None = None,
    output_path: str | os.PathLike | None = None,
) -> dict[str, Path]:
    """
    Export valuation outputs.

    Files generated:
    - output/valuation_summary.xlsx: all 92 companies
    - output/valuation_flags.csv: only Discount and Caution companies
    """
    if df is None:
        df = generate_summary()
    else:
        df = df.copy()

    summary_path = Path(output_path or PROJECT_ROOT / "output" / "valuation_summary.xlsx")
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(summary_path, index=False)

    flags_path = summary_path.parent / "valuation_flags.csv"
    flags_df = df[df["Flag"].isin(["Discount", "Caution"])].copy()
    flags_df.to_csv(flags_path, index=False)

    return {"summary": summary_path, "flags": flags_path}


def _year_to_int(year_value) -> int | None:
    """Extract a 4-digit fiscal/calendar year from database year values."""
    if pd.isna(year_value):
        return None

    match = re.search(r"(19|20)\d{2}", str(year_value))
    return int(match.group(0)) if match else None


def _safe_divide(numerator, denominator):
    """Return numerator / denominator when the denominator is positive."""
    if pd.isna(numerator) or pd.isna(denominator) or denominator <= 0:
        return None
    return numerator / denominator


def _round_series(series: pd.Series, digits: int = 2) -> pd.Series:
    """Round numeric output while preserving missing values."""
    return pd.to_numeric(series, errors="coerce").round(digits)


def load_valuation_inputs(db_path: str | os.PathLike | None = None) -> pd.DataFrame:
    """
    Load company, sector, market-cap, P&L, and balance-sheet inputs.

    The returned DataFrame is one row per company and market_cap year where data
    exists, with financial statement rows matched by company and extracted year.
    """
    db_path = str(db_path or get_database_path())

    with sqlite3.connect(db_path) as conn:
        companies = pd.read_sql_query(
            """
            SELECT
                id AS company_id,
                company_name
            FROM companies
            """,
            conn,
        )
        sectors = pd.read_sql_query(
            """
            SELECT company_id, sector, industry, cap, id
            FROM sectors
            ORDER BY company_id, id DESC
            """,
            conn,
        )
        market_cap = pd.read_sql_query(
            """
            SELECT
                company_id,
                year AS valuation_year,
                mc1 AS market_cap_crore,
                mc2 AS enterprise_value_crore,
                val3 AS source_pe_ratio,
                val4 AS source_pb_ratio,
                val5 AS source_ev_ebitda,
                val6 AS source_dividend_yield_pct,
                id
            FROM market_cap
            ORDER BY company_id, year, id DESC
            """,
            conn,
        )
        profitandloss = pd.read_sql_query(
            """
            SELECT
                company_id,
                year AS financial_year,
                sales,
                operating_profit,
                other_income,
                interest,
                depreciation,
                net_profit,
                eps,
                dividend_payout,
                id
            FROM profitandloss
            ORDER BY company_id, id DESC
            """,
            conn,
        )
        balancesheet = pd.read_sql_query(
            """
            SELECT
                company_id,
                year AS balance_sheet_year,
                equity_capital,
                reserves,
                borrowings,
                investments,
                total_assets,
                id
            FROM balancesheet
            ORDER BY company_id, id DESC
            """,
            conn,
        )

    sectors = sectors.drop_duplicates("company_id", keep="first").drop(columns=["id"])

    market_cap["valuation_year_int"] = market_cap["valuation_year"].apply(_year_to_int)
    market_cap = market_cap.drop_duplicates(
        ["company_id", "valuation_year_int"], keep="first"
    ).drop(columns=["id"])

    profitandloss["financial_year_int"] = profitandloss["financial_year"].apply(_year_to_int)
    profitandloss = profitandloss.drop_duplicates(
        ["company_id", "financial_year_int"], keep="first"
    ).drop(columns=["id"])

    balancesheet["balance_sheet_year_int"] = balancesheet["balance_sheet_year"].apply(
        _year_to_int
    )
    balancesheet = balancesheet.drop_duplicates(
        ["company_id", "balance_sheet_year_int"], keep="first"
    ).drop(columns=["id"])

    df = companies.merge(sectors, on="company_id", how="left")
    df = df.merge(market_cap, on="company_id", how="left")
    df = df.merge(
        profitandloss,
        left_on=["company_id", "valuation_year_int"],
        right_on=["company_id", "financial_year_int"],
        how="left",
    )
    df = df.merge(
        balancesheet,
        left_on=["company_id", "valuation_year_int"],
        right_on=["company_id", "balance_sheet_year_int"],
        how="left",
    )

    return df.sort_values(["company_id", "valuation_year"]).reset_index(drop=True)


def calculate_valuation_metrics(db_path: str | os.PathLike | None = None) -> pd.DataFrame:
    """
    Calculate valuation metrics for every company/year available in market_cap.

    Output includes source valuation fields from market_cap and calculated
    cross-check metrics from statement data.
    """
    df = load_valuation_inputs(db_path)

    df["equity_value_crore"] = df["equity_capital"] + df["reserves"]
    df["net_debt_crore"] = df["borrowings"] - df["investments"]
    df["ebit_crore"] = df["operating_profit"] + df["other_income"] - df["depreciation"]
    df["ebitda_crore"] = df["operating_profit"]

    df["pe_ratio"] = df.apply(
        lambda row: _safe_divide(row["market_cap_crore"], row["net_profit"]),
        axis=1,
    )
    df["pb_ratio"] = df.apply(
        lambda row: _safe_divide(row["market_cap_crore"], row["equity_value_crore"]),
        axis=1,
    )
    df["price_to_sales_ratio"] = df.apply(
        lambda row: _safe_divide(row["market_cap_crore"], row["sales"]),
        axis=1,
    )
    df["ev_to_sales_ratio"] = df.apply(
        lambda row: _safe_divide(row["enterprise_value_crore"], row["sales"]),
        axis=1,
    )
    df["ev_to_ebit_ratio"] = df.apply(
        lambda row: _safe_divide(row["enterprise_value_crore"], row["ebit_crore"]),
        axis=1,
    )
    df["ev_ebitda_ratio"] = df.apply(
        lambda row: _safe_divide(row["enterprise_value_crore"], row["ebitda_crore"]),
        axis=1,
    )
    df["earnings_yield_pct"] = df.apply(
        lambda row: _safe_divide(row["net_profit"], row["market_cap_crore"]),
        axis=1,
    )
    df["sales_yield_pct"] = df.apply(
        lambda row: _safe_divide(row["sales"], row["market_cap_crore"]),
        axis=1,
    )

    percent_cols = ["earnings_yield_pct", "sales_yield_pct"]
    for column in percent_cols:
        df[column] = df[column] * 100

    rounded_cols = [
        "equity_value_crore",
        "net_debt_crore",
        "ebit_crore",
        "ebitda_crore",
        "pe_ratio",
        "pb_ratio",
        "price_to_sales_ratio",
        "ev_to_sales_ratio",
        "ev_to_ebit_ratio",
        "ev_ebitda_ratio",
        "earnings_yield_pct",
        "sales_yield_pct",
    ]
    for column in rounded_cols:
        df[column] = _round_series(df[column])

    output_columns = [
        "company_id",
        "company_name",
        "sector",
        "industry",
        "cap",
        "valuation_year",
        "financial_year",
        "balance_sheet_year",
        "market_cap_crore",
        "enterprise_value_crore",
        "net_debt_crore",
        "sales",
        "net_profit",
        "equity_value_crore",
        "ebit_crore",
        "ebitda_crore",
        "source_pe_ratio",
        "pe_ratio",
        "source_pb_ratio",
        "pb_ratio",
        "price_to_sales_ratio",
        "ev_to_sales_ratio",
        "ev_to_ebit_ratio",
        "source_ev_ebitda",
        "ev_ebitda_ratio",
        "source_dividend_yield_pct",
        "earnings_yield_pct",
        "sales_yield_pct",
    ]
    return df[output_columns].sort_values(
        ["company_id", "valuation_year"], na_position="last"
    ).reset_index(drop=True)


def calculate_latest_valuation_metrics(
    db_path: str | os.PathLike | None = None,
) -> pd.DataFrame:
    """Return the latest valuation metrics for all 92 companies."""
    df = calculate_valuation_metrics(db_path)
    if df.empty:
        return df

    latest_df = df.copy()
    latest_df["valuation_year_int"] = latest_df["valuation_year"].apply(_year_to_int)
    latest_df = latest_df.sort_values(
        ["company_id", "valuation_year_int"],
        ascending=[True, False],
        na_position="last",
    )
    latest_df = latest_df.drop_duplicates("company_id", keep="first")
    latest_df = latest_df.drop(columns=["valuation_year_int"])
    return latest_df.sort_values("company_id").reset_index(drop=True)


if __name__ == "__main__":
    latest_valuations = calculate_latest_valuation_metrics()
    print(latest_valuations.head(10))
    print(f"Companies covered: {latest_valuations['company_id'].nunique()}")
