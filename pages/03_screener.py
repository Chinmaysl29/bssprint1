from pathlib import Path
import sys

import pandas as pd
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.screener.engine import StockScreener


DEFAULT_FILTERS = {
    "roe_min": 0.0,
    "debt_equity_max": 10.0,
    "fcf_min": -50000.0,
    "revenue_cagr_5y_min": -50.0,
    "pat_cagr_5y_min": -100.0,
    "opm_min": -50.0,
    "pe_max": 5000.0,
    "pb_max": 20000.0,
    "dividend_yield_min": 0.0,
    "icr_min": -100.0,
}

SLIDER_SPECS = [
    ("ROE Minimum", "roe_min", 0.0, 100.0, 1.0, "%"),
    ("D/E Maximum", "debt_equity_max", 0.0, 10.0, 0.1, ""),
    ("FCF Minimum", "fcf_min", -50000.0, 100000.0, 1000.0, " Cr"),
    ("Revenue CAGR Minimum", "revenue_cagr_5y_min", -50.0, 150.0, 1.0, "%"),
    ("PAT CAGR Minimum", "pat_cagr_5y_min", -100.0, 250.0, 1.0, "%"),
    ("OPM Minimum", "opm_min", -50.0, 100.0, 1.0, "%"),
    ("P/E Maximum", "pe_max", 0.0, 5000.0, 10.0, ""),
    ("P/B Maximum", "pb_max", 0.0, 20000.0, 50.0, ""),
    ("Dividend Yield Minimum", "dividend_yield_min", 0.0, 100.0, 0.5, "%"),
    ("ICR Minimum", "icr_min", -100.0, 100.0, 1.0, ""),
]

PRESETS = {
    "Quality": "quality_compounder",
    "Value": "value_pick",
    "Growth": "growth_accelerator",
    "Dividend": "dividend_champion",
    "Debt Free": "debt_free_bluechip",
    "Turnaround": "turnaround_watch",
}

VISIBLE_COLUMNS = [
    "Company",
    "Sector",
    "Composite Score",
    "ROE",
    "ROCE",
    "Revenue CAGR",
    "Debt",
    "PE",
    "PB",
    "Dividend",
    "ICR",
]


@st.cache_resource
def get_screener() -> StockScreener:
    return StockScreener(
        db_path=PROJECT_ROOT / "db" / "nifty100.db",
        config_path=PROJECT_ROOT / "config" / "screener_config.yaml",
    )


def initialize_filters() -> None:
    for key, value in DEFAULT_FILTERS.items():
        st.session_state.setdefault(key, value)


def apply_preset(preset_key: str) -> None:
    screener = get_screener()
    preset_filters = (
        screener.config.get("screens", {})
        .get(preset_key, {})
        .get("filters", {})
    )
    slider_filters = {**DEFAULT_FILTERS, **preset_filters}

    for key in DEFAULT_FILTERS:
        st.session_state[key] = float(slider_filters.get(key, DEFAULT_FILTERS[key]))

    st.session_state["active_screener_preset"] = preset_key


def collect_filters() -> dict:
    return {
        key: value
        for key in DEFAULT_FILTERS
        if abs((value := float(st.session_state[key])) - DEFAULT_FILTERS[key]) > 1e-9
    }


def first_existing_column(df: pd.DataFrame, candidates: list[str]) -> pd.Series:
    for column in candidates:
        if column in df.columns:
            return df[column]
    return pd.Series([pd.NA] * len(df), index=df.index)


def build_result_table(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=VISIBLE_COLUMNS)

    result = pd.DataFrame(index=df.index)
    result["Company"] = first_existing_column(df, ["company_name"]).astype(str).str.strip()
    result["Sector"] = first_existing_column(df, ["sector"])
    result["Composite Score"] = first_existing_column(
        df,
        ["composite_score", "advanced_composite_score"],
    )
    result["ROE"] = first_existing_column(df, ["roe_percentage", "roe"])
    result["ROCE"] = first_existing_column(df, ["roce_percentage", "roce"])
    result["Revenue CAGR"] = first_existing_column(
        df,
        ["revenue_cagr_5y", "revenue_cagr_3y", "revenue_cagr"],
    )
    result["Debt"] = first_existing_column(df, ["debt_equity", "debt_to_equity"])
    result["PE"] = first_existing_column(df, ["pe"])
    result["PB"] = first_existing_column(df, ["pb"])
    result["Dividend"] = first_existing_column(df, ["dividend_yield"])
    result["ICR"] = first_existing_column(df, ["icr"])

    numeric_columns = [
        column
        for column in VISIBLE_COLUMNS
        if column not in ["Company", "Sector", "ICR"]
    ]
    for column in numeric_columns:
        result[column] = pd.to_numeric(result[column], errors="coerce").round(2)

    result["ICR"] = pd.to_numeric(result["ICR"], errors="coerce").map(
        lambda value: (
            "Debt Free"
            if value == float("inf")
            else f"{value:.2f}" if pd.notna(value) else ""
        )
    )
    return result[VISIBLE_COLUMNS].sort_values(
        "Composite Score",
        ascending=False,
        na_position="last",
    ).reset_index(drop=True)


def run_filtered_screener(filters: dict) -> pd.DataFrame:
    screener = get_screener()
    result = screener.run_screener(**filters)
    return pd.DataFrame(result["companies"])


initialize_filters()

st.title("Stock Screener")
st.caption("Interactive Nifty 100 screening powered by the Sprint 3 Screener Engine")

st.sidebar.header("Filters")
for label, key, minimum, maximum, step, suffix in SLIDER_SPECS:
    st.sidebar.slider(
        label,
        min_value=minimum,
        max_value=maximum,
        step=step,
        key=key,
        format=f"%.1f{suffix}",
    )

st.sidebar.header("Presets")
preset_columns = st.sidebar.columns(2)
for index, (label, preset_key) in enumerate(PRESETS.items()):
    with preset_columns[index % 2]:
        st.button(
            label,
            key=f"preset_{preset_key}",
            width="stretch",
            on_click=apply_preset,
            args=(preset_key,),
        )

filters = collect_filters()
try:
    filtered_df = run_filtered_screener(filters)
except Exception as exc:
    st.error(f"Unable to run screener: {exc}")
    st.stop()

visible_df = build_result_table(filtered_df)

count = len(visible_df)
st.subheader(f"{count} Companies Match Your Filters")

st.dataframe(
    visible_df,
    hide_index=True,
    width="stretch",
    column_config={
        "Composite Score": st.column_config.NumberColumn(format="%.2f"),
        "ROE": st.column_config.NumberColumn(format="%.2f%%"),
        "ROCE": st.column_config.NumberColumn(format="%.2f%%"),
        "Revenue CAGR": st.column_config.NumberColumn(format="%.2f%%"),
        "Debt": st.column_config.NumberColumn(format="%.2f"),
        "PE": st.column_config.NumberColumn(format="%.2f"),
        "PB": st.column_config.NumberColumn(format="%.2f"),
        "Dividend": st.column_config.NumberColumn(format="%.2f%%"),
    },
)

csv_data = visible_df.to_csv(index=False).encode("utf-8")
st.download_button(
    "Download CSV",
    data=csv_data,
    file_name="screener_results.csv",
    mime="text/csv",
    width="content",
)
