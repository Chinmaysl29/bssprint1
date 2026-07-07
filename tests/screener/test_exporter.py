"""
tests/screener/test_exporter.py
────────────────────────────────
Tests for src/screener/exporter.py

Verifies that output/screener_output.xlsx
  • contains exactly 6 sheets (one per preset)
  • each sheet has exactly 20 KPI columns in the correct order
  • each sheet is sorted by Composite Score DESC
  • Rank column is 1-based and sequential
  • Remarks column contains valid tier strings
  • ScreenerExporter.export_to_excel() backward-compat still works
"""

import os
import sys
import pytest
import pandas as pd
from pathlib import Path
from openpyxl import load_workbook

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from src.screener.engine import StockScreener
from src.screener.exporter import export_screeners, ScreenerExporter, KPI_COLUMNS

OUTPUT_PATH = Path("output/screener_output.xlsx")
TEST_EXPORT  = Path("output/test_export_tmp.xlsx")

# Expected sheet names (matching screener_config.yaml display names)
EXPECTED_SHEETS = [
    "Quality Compounder",
    "Value Pick",
    "Growth Accelerator",
    "Dividend Champion",
    "Debt-Free Bluechip",
    "Turnaround Watch",
]

# Expected 20 column headers in exact order
EXPECTED_HEADERS = [h for _, h, _ in KPI_COLUMNS]

VALID_REMARKS = {
    "S-Tier – Strong Buy",
    "A-Tier – Buy",
    "B-Tier – Watch",
    "C-Tier – Avoid",
    "N/A",
}


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def screener():
    return StockScreener()


@pytest.fixture(scope="module")
def exported_path(screener):
    path = export_screeners(screener, output_path=str(OUTPUT_PATH))
    return path


@pytest.fixture(scope="module")
def workbook(exported_path):
    wb = load_workbook(exported_path, read_only=True, data_only=True)
    yield wb
    wb.close()


# ── File-level checks ─────────────────────────────────────────────────────────

def test_file_created(exported_path):
    """output/screener_output.xlsx must exist after export."""
    assert exported_path.exists(), f"File not found: {exported_path}"


def test_file_nonempty(exported_path):
    """File must be at least 10 KB (has real data)."""
    assert exported_path.stat().st_size >= 10_000, (
        f"File too small ({exported_path.stat().st_size} bytes) — probably empty"
    )


# ── Sheet count & names ───────────────────────────────────────────────────────

def test_exactly_6_sheets(workbook):
    """Workbook must contain exactly 6 sheets."""
    assert len(workbook.sheetnames) == 6, (
        f"Expected 6 sheets, got {len(workbook.sheetnames)}: {workbook.sheetnames}"
    )


@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_sheet_exists(workbook, sheet_name):
    """Each of the 6 preset sheets must be present."""
    assert sheet_name in workbook.sheetnames, (
        f"Sheet '{sheet_name}' missing. Found: {workbook.sheetnames}"
    )


def test_no_extra_sheets(workbook):
    """No unexpected sheets (e.g. 'Summary' or 'Ranked (All)') should be present."""
    for name in workbook.sheetnames:
        assert name in EXPECTED_SHEETS, (
            f"Unexpected sheet: '{name}'. Allowed: {EXPECTED_SHEETS}"
        )


# ── Column structure (20 KPIs in exact order) ─────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_20_columns_present(workbook, sheet_name):
    """Every sheet must have exactly 20 columns."""
    ws      = workbook[sheet_name]
    # Headers are on row 3 (row 1 = title, row 2 = subtitle)
    headers = [cell.value for cell in ws[3] if cell.value is not None]
    assert len(headers) == 20, (
        f"Sheet '{sheet_name}': expected 20 columns, got {len(headers)}: {headers}"
    )


@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_column_order(workbook, sheet_name):
    """Columns must appear in the exact required order."""
    ws      = workbook[sheet_name]
    headers = [cell.value for cell in ws[3]]
    assert headers == EXPECTED_HEADERS, (
        f"Sheet '{sheet_name}' column order mismatch.\n"
        f"  Expected: {EXPECTED_HEADERS}\n"
        f"  Got:      {headers}"
    )


# ── Data presence ─────────────────────────────────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_sheet_has_data_rows(workbook, sheet_name):
    """Every sheet must have at least 1 data row (below the header)."""
    ws        = workbook[sheet_name]
    data_rows = [
        row for row in ws.iter_rows(min_row=4, values_only=True)
        if any(v is not None for v in row)
    ]
    assert len(data_rows) >= 1, (
        f"Sheet '{sheet_name}' has no data rows"
    )


# ── Sort order ────────────────────────────────────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_sorted_by_score_desc(workbook, sheet_name):
    """Composite Score must be non-increasing from top to bottom."""
    ws      = workbook[sheet_name]
    headers = [cell.value for cell in ws[3]]

    try:
        score_col = headers.index("Composite Score")
    except ValueError:
        pytest.skip(f"'Composite Score' column not found in '{sheet_name}'")

    scores = []
    for row in ws.iter_rows(min_row=4, values_only=True):
        val = row[score_col]
        if val is not None:
            try:
                scores.append(float(val))
            except (TypeError, ValueError):
                pass

    assert len(scores) >= 2, f"Not enough rows to test sort order in '{sheet_name}'"
    assert scores == sorted(scores, reverse=True), (
        f"Sheet '{sheet_name}' is NOT sorted by Composite Score DESC. "
        f"First 5 scores: {scores[:5]}"
    )


# ── Rank column ───────────────────────────────────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_rank_is_sequential(workbook, sheet_name):
    """Rank must be 1, 2, 3, … sequentially."""
    ws      = workbook[sheet_name]
    headers = [cell.value for cell in ws[3]]

    try:
        rank_col = headers.index("Rank")
    except ValueError:
        pytest.skip(f"'Rank' column not found in '{sheet_name}'")

    ranks = []
    for row in ws.iter_rows(min_row=4, values_only=True):
        val = row[rank_col]
        if val is not None:
            try:
                ranks.append(int(val))
            except (TypeError, ValueError):
                pass

    expected = list(range(1, len(ranks) + 1))
    assert ranks == expected, (
        f"Sheet '{sheet_name}' Rank column is not sequential 1,2,3,...  "
        f"Got: {ranks[:10]}"
    )


# ── Remarks column ────────────────────────────────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
def test_remarks_valid_values(workbook, sheet_name):
    """Every Remarks cell must contain a valid tier string."""
    ws      = workbook[sheet_name]
    headers = [cell.value for cell in ws[3]]

    try:
        rem_col = headers.index("Remarks")
    except ValueError:
        pytest.skip(f"'Remarks' column not found in '{sheet_name}'")

    for row in ws.iter_rows(min_row=4, values_only=True):
        val = row[rem_col]
        if val is not None:
            assert val in VALID_REMARKS, (
                f"Sheet '{sheet_name}': unexpected Remarks value '{val}'. "
                f"Allowed: {VALID_REMARKS}"
            )


# ── Required KPI columns spot-check ──────────────────────────────────────────

@pytest.mark.parametrize("sheet_name", EXPECTED_SHEETS)
@pytest.mark.parametrize("required_col", [
    "Company Name", "Sector", "Year", "ROE (%)", "ROCE (%)",
    "Net Profit Margin (%)", "OPM (%)", "Debt / Equity",
    "ICR", "FCF (₹ Cr)", "Revenue CAGR (3Y %)", "PAT CAGR (3Y %)",
    "EPS CAGR (3Y %)", "Sales (₹ Cr)", "Net Profit (₹ Cr)",
    "Market Cap (₹ Cr)", "Dividend Yield (%)",
    "Composite Score", "Rank", "Remarks",
])
def test_required_kpi_column_present(workbook, sheet_name, required_col):
    """Each of the 20 required KPI columns must be present in every sheet."""
    ws      = workbook[sheet_name]
    headers = [cell.value for cell in ws[3]]
    assert required_col in headers, (
        f"Sheet '{sheet_name}': required column '{required_col}' not found. "
        f"Headers: {headers}"
    )


# ── ScreenerExporter backward-compat ─────────────────────────────────────────

def test_export_to_excel_backward_compat(screener):
    """ScreenerExporter.export_to_excel() must still produce a valid file."""
    result = screener.run_screener("quality_compounder")
    df     = pd.DataFrame(result["companies"])

    try:
        ok = ScreenerExporter.export_to_excel(df, filename=str(TEST_EXPORT))
        assert ok is True, "export_to_excel returned False"
        assert TEST_EXPORT.exists(), "Temp export file was not created"

        wb = load_workbook(TEST_EXPORT, read_only=True, data_only=True)
        assert "Screener Results" in wb.sheetnames
        wb.close()
    finally:
        if TEST_EXPORT.exists():
            TEST_EXPORT.unlink()
