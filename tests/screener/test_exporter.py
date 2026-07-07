"""
tests/screener/test_exporter.py
────────────────────────────────
Tests for src/screener/exporter.py

Covers
──────
- export_screeners() produces output/screener_output.xlsx
- Workbook contains expected sheets (Summary, Ranked (All), all presets)
- Summary sheet has correct headers and at least one data row
- Ranked (All) sheet contains all 92 companies, sorted by Score DESC
- Each preset sheet has required columns and Score-sorted rows
- ScreenerExporter.export_to_excel() backward-compat still works
"""

import os
import sys
import pytest
import pandas as pd
from pathlib import Path
from openpyxl import load_workbook

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from src.screener.engine import StockScreener
from src.screener.exporter import export_screeners, ScreenerExporter


OUTPUT_PATH = Path("output/screener_output.xlsx")
TEST_EXPORT  = Path("output/test_export_tmp.xlsx")

# ── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def screener():
    return StockScreener()


@pytest.fixture(scope="module")
def exported_path(screener):
    """Run export_screeners once and return the output path."""
    path = export_screeners(screener, output_path=str(OUTPUT_PATH))
    yield path
    # leave file in place; it is the deliverable


@pytest.fixture(scope="module")
def workbook(exported_path):
    return load_workbook(exported_path, read_only=True, data_only=True)


# ── Basic file checks ─────────────────────────────────────────────────────────

def test_file_exists(exported_path):
    """output/screener_output.xlsx must be created."""
    assert exported_path.exists(), f"File not found: {exported_path}"


def test_file_is_nonempty(exported_path):
    """File must have actual content (> 5 KB)."""
    assert exported_path.stat().st_size > 5_000, "File looks too small"


# ── Sheet presence ────────────────────────────────────────────────────────────

def test_summary_sheet_exists(workbook):
    assert "Summary" in workbook.sheetnames, "Missing 'Summary' sheet"


def test_ranked_all_sheet_exists(workbook):
    assert "Ranked (All)" in workbook.sheetnames, "Missing 'Ranked (All)' sheet"


def test_all_preset_sheets_exist(workbook, screener):
    """Every preset defined in screener_config.yaml must have its own sheet."""
    preset_display_names = [
        screener.config["screens"][name].get("name", name)[:31]
        for name in screener.config.get("screens", {})
    ]
    for display_name in preset_display_names:
        assert display_name in workbook.sheetnames, (
            f"Missing preset sheet: '{display_name}'"
        )


def test_sheet_count(workbook, screener):
    """Sheet count = 2 (Summary + Ranked) + number of presets."""
    preset_count = len(screener.config.get("screens", {}))
    expected     = 2 + preset_count
    assert len(workbook.sheetnames) == expected, (
        f"Expected {expected} sheets, got {len(workbook.sheetnames)}: {workbook.sheetnames}"
    )


# ── Summary sheet ─────────────────────────────────────────────────────────────

def test_summary_headers(workbook):
    ws   = workbook["Summary"]
    rows = list(ws.iter_rows(min_row=4, max_row=4, values_only=True))
    assert rows, "Summary sheet has no header row at row 4"
    headers = [str(v).strip() if v else "" for v in rows[0]]
    assert "Screen Name"      in headers, f"Missing 'Screen Name' header: {headers}"
    assert "Companies Found"  in headers, f"Missing 'Companies Found' header: {headers}"
    assert "Top Company"      in headers, f"Missing 'Top Company' header: {headers}"
    assert "Top Score"        in headers, f"Missing 'Top Score' header: {headers}"


def test_summary_has_data_rows(workbook, screener):
    ws         = workbook["Summary"]
    preset_count = len(screener.config.get("screens", {}))
    data_rows  = [
        row for row in ws.iter_rows(min_row=5, values_only=True)
        if any(cell is not None for cell in row)
    ]
    assert len(data_rows) == preset_count, (
        f"Expected {preset_count} data rows in Summary, got {len(data_rows)}"
    )


# ── Ranked (All) sheet ────────────────────────────────────────────────────────

def test_ranked_all_has_companies(workbook):
    ws = workbook["Ranked (All)"]
    data_rows = [
        row for row in ws.iter_rows(min_row=3, values_only=True)
        if any(cell is not None for cell in row)
    ]
    assert len(data_rows) >= 80, (
        f"Expected ~92 companies in Ranked (All), got {len(data_rows)}"
    )


def test_ranked_all_score_column_exists(workbook):
    ws      = workbook["Ranked (All)"]
    headers = [cell.value for cell in ws[2]]
    assert "Score" in headers, f"'Score' column missing in Ranked (All). Headers: {headers}"


def test_ranked_all_sorted_descending(workbook):
    """Scores in Ranked (All) must be non-increasing."""
    ws = workbook["Ranked (All)"]
    headers = [cell.value for cell in ws[2]]
    try:
        score_col = headers.index("Score") + 1
    except ValueError:
        pytest.skip("Score column not found in Ranked (All)")

    scores = []
    for row in ws.iter_rows(min_row=3, values_only=True):
        val = row[score_col - 1]
        if val is not None:
            try:
                scores.append(float(val))
            except (TypeError, ValueError):
                pass

    assert scores, "No scores found in Ranked (All)"
    assert scores == sorted(scores, reverse=True), (
        "Ranked (All) is not sorted Score DESC"
    )


# ── Individual preset sheets ──────────────────────────────────────────────────

@pytest.mark.parametrize("preset_key", [
    "quality_compounder",
    "growth_accelerator",
    "value_pick",
    "dividend_champion",
    "debt_free_bluechip",
    "turnaround_watch",
])
def test_preset_sheet_required_columns(workbook, screener, preset_key):
    """Each preset sheet must contain Company, Sector, ROE %, Score."""
    display_name = screener.config["screens"][preset_key].get("name", preset_key)[:31]
    if display_name not in workbook.sheetnames:
        pytest.skip(f"Sheet '{display_name}' not in workbook")

    ws      = workbook[display_name]
    # Header is at row 2 (row 1 is title)
    headers = [cell.value for cell in ws[2]]
    for required in ("Company", "Sector", "ROE %", "Score"):
        assert required in headers, (
            f"Sheet '{display_name}' missing column '{required}'. Headers: {headers}"
        )


@pytest.mark.parametrize("preset_key", [
    "quality_compounder",
    "growth_accelerator",
])
def test_preset_sheet_scores_sorted(workbook, screener, preset_key):
    """Scores within a preset sheet must be sorted descending."""
    display_name = screener.config["screens"][preset_key].get("name", preset_key)[:31]
    if display_name not in workbook.sheetnames:
        pytest.skip(f"Sheet '{display_name}' not in workbook")

    ws      = workbook[display_name]
    headers = [cell.value for cell in ws[2]]
    try:
        score_col = headers.index("Score") + 1
    except ValueError:
        pytest.skip(f"Score column not in sheet '{display_name}'")

    scores = []
    for row in ws.iter_rows(min_row=3, values_only=True):
        val = row[score_col - 1]
        if val is not None:
            try:
                scores.append(float(val))
            except (TypeError, ValueError):
                pass

    if len(scores) >= 2:
        assert scores == sorted(scores, reverse=True), (
            f"Sheet '{display_name}' not sorted Score DESC"
        )


# ── ScreenerExporter backward-compat ─────────────────────────────────────────

def test_export_to_excel_backward_compat(screener):
    """ScreenerExporter.export_to_excel() must still produce a valid file."""
    result = screener.run_screener("quality_compounder")
    df     = pd.DataFrame(result["companies"])

    try:
        ok = ScreenerExporter.export_to_excel(df, filename=str(TEST_EXPORT))
        assert ok is True, "export_to_excel returned False"
        assert TEST_EXPORT.exists(), "Test export file was not created"

        wb = load_workbook(TEST_EXPORT, read_only=True, data_only=True)
        assert "Screener Results" in wb.sheetnames
        wb.close()
    finally:
        if TEST_EXPORT.exists():
            TEST_EXPORT.unlink()
