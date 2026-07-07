"""
src/screener/exporter.py
────────────────────────
Excel Exporter for the NIFTY100 Stock Screener.

Public API
──────────
    export_screeners(screener, output_path="output/screener_output.xlsx")
        Run every preset screen, score + sort each result, then write a
        richly-formatted multi-sheet Excel workbook.

    ScreenerExporter.export_to_excel(df, filename, ...)
        Low-level single-sheet exporter (used internally by StockScreener
        and retained for backward-compatibility with existing tests).

Sheet layout of output/screener_output.xlsx
───────────────────────────────────────────
    0 – Summary               KPI overview of every screen
    1 – Ranked (All)          All 92 companies scored & ranked
    2 – Quality Compounder    Preset results
    3 – Value Pick            Preset results
    4 – Growth Accelerator    Preset results
    5 – Dividend Champion     Preset results
    6 – Debt-Free Bluechip    Preset results
    7 – Turnaround Watch      Preset results

Column selection per screen sheet
───────────────────────────────────
    Rank | Company | Sector | Cap | ROE% | ROCE% | D/E |
    Rev CAGR 3Y | Rev CAGR 5Y | PAT CAGR 3Y | OPM% |
    CFO Quality | FCF (Cr) | Composite Score

Conditional formatting (score column)
──────────────────────────────────────
    ≥ 70  → green fill   (S-tier)
    50-69 → yellow fill  (A-tier)
    30-49 → orange fill  (B-tier)
    < 30  → red fill     (C-tier)
"""

import logging
from pathlib import Path
from typing import TYPE_CHECKING, Optional

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import (
    Alignment,
    Border,
    Font,
    GradientFill,
    PatternFill,
    Side,
)
from openpyxl.utils import get_column_letter

if TYPE_CHECKING:  # avoid circular import at runtime
    from .engine import StockScreener

logger = logging.getLogger(__name__)

# ── Design tokens ────────────────────────────────────────────────────────────
_NAVY       = "0F172A"   # dark background
_BLUE       = "2563EB"   # primary blue  (header fill)
_WHITE      = "F8FAFC"   # header text
_SUCCESS    = "10B981"   # green
_WARNING    = "F59E0B"   # amber
_ORANGE     = "FB923C"   # orange
_DANGER     = "EF4444"   # red
_LIGHT_BLUE = "DBEAFE"   # light blue row stripe
_LIGHT_GRAY = "F1F5F9"   # alternate row stripe
_BORDER_COL = "CBD5E1"   # thin border


def _thin_border():
    side = Side(style="thin", color=_BORDER_COL)
    return Border(left=side, right=side, top=side, bottom=side)


def _header_fill():
    return PatternFill(fill_type="solid", fgColor=_BLUE)


def _score_fill(score: float) -> PatternFill:
    if score >= 70:
        colour = "D1FAE5"   # green-100
    elif score >= 50:
        colour = "FEF9C3"   # yellow-100
    elif score >= 30:
        colour = "FFEDD5"   # orange-100
    else:
        colour = "FEE2E2"   # red-100
    return PatternFill(fill_type="solid", fgColor=colour)


def _row_fill(row_idx: int) -> PatternFill:
    """Alternating row stripe (1-indexed data row)."""
    colour = _LIGHT_BLUE if row_idx % 2 == 0 else _LIGHT_GRAY
    return PatternFill(fill_type="solid", fgColor=colour)


def column_index_to_letter(index: int) -> str:
    """0-based column index → Excel column letter (A, B, …, Z, AA, …)."""
    return get_column_letter(index + 1)


# ── Column definitions ───────────────────────────────────────────────────────

# What we export for individual screen sheets
_SCREEN_COLUMNS = [
    ("company_name",            "Company"),
    ("sector",                  "Sector"),
    ("cap",                     "Cap"),
    ("roe_percentage",          "ROE %"),
    ("roce_percentage",         "ROCE %"),
    ("debt_equity",             "D/E"),
    ("revenue_cagr_3y",         "Rev CAGR 3Y"),
    ("revenue_cagr_5y",         "Rev CAGR 5Y"),
    ("pat_cagr_3y",             "PAT CAGR 3Y"),
    ("opm_percentage",          "OPM %"),
    ("avg_cfo_pat_ratio",       "CFO/PAT"),
    ("fcf",                     "FCF (Cr)"),
    ("composite_score",         "Score"),
]

# What we export for the "Ranked (All)" master sheet
_RANKED_COLUMNS = [
    ("company_name",            "Company"),
    ("sector",                  "Sector"),
    ("cap",                     "Cap"),
    ("roe_percentage",          "ROE %"),
    ("roce_percentage",         "ROCE %"),
    ("debt_equity",             "D/E"),
    ("revenue_cagr_3y",         "Rev CAGR 3Y"),
    ("revenue_cagr_5y",         "Rev CAGR 5Y"),
    ("pat_cagr_3y",             "PAT CAGR 3Y"),
    ("opm_percentage",          "OPM %"),
    ("avg_cfo_pat_ratio",       "CFO/PAT"),
    ("fcf",                     "FCF (Cr)"),
    ("composite_score",         "Score"),
    ("sector_quality_rank",     "Sector Rank"),
]

# Column widths (by header name)
_COL_WIDTHS = {
    "Company":      34,
    "Sector":       22,
    "Cap":          12,
    "ROE %":        10,
    "ROCE %":       10,
    "D/E":           8,
    "Rev CAGR 3Y":  14,
    "Rev CAGR 5Y":  14,
    "PAT CAGR 3Y":  14,
    "OPM %":        10,
    "CFO/PAT":      10,
    "FCF (Cr)":     14,
    "Score":        10,
    "Sector Rank":  12,
}


# ── Worksheet helpers ────────────────────────────────────────────────────────

def _write_header(ws, headers: list[str], row: int = 1):
    """Write a styled header row."""
    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=row, column=col_idx, value=header)
        cell.font   = Font(bold=True, color=_WHITE, size=11, name="Calibri")
        cell.fill   = _header_fill()
        cell.border = _thin_border()
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=False)


def _write_data_rows(ws, df: pd.DataFrame, col_specs: list[tuple], start_row: int = 2):
    """
    Write data rows with alternating stripes and score-based colour on the
    Score column (if present).

    col_specs: list of (df_column, display_header) tuples
    """
    src_cols  = [c for c, _ in col_specs if c in df.columns]
    disp_cols = [h for c, h in col_specs if c in df.columns]

    score_col_idx = None
    for idx, (src, _) in enumerate([(c, h) for c, h in col_specs if c in df.columns], start=1):
        if src == "composite_score":
            score_col_idx = idx

    for row_offset, (_, data_row) in enumerate(df[src_cols].iterrows()):
        excel_row  = start_row + row_offset
        row_fill   = _row_fill(row_offset + 1)

        for col_idx, value in enumerate(data_row, start=1):
            cell = ws.cell(row=excel_row, column=col_idx)

            # Coerce value
            if pd.isna(value):
                cell.value = None
            elif isinstance(value, float):
                cell.value = round(value, 2)
            else:
                cell.value = str(value).strip() if isinstance(value, str) else value

            # Formatting
            if col_idx == score_col_idx and cell.value is not None:
                try:
                    cell.fill = _score_fill(float(cell.value))
                    cell.font = Font(bold=True, size=10, name="Calibri")
                except (TypeError, ValueError):
                    cell.fill = row_fill
            else:
                cell.fill = row_fill

            cell.border    = _thin_border()
            cell.alignment = Alignment(
                horizontal="right" if col_idx > 2 else "left",
                vertical="center",
            )


def _set_col_widths(ws, headers: list[str]):
    for col_idx, header in enumerate(headers, start=1):
        width = _COL_WIDTHS.get(header, max(len(header) + 4, 12))
        ws.column_dimensions[get_column_letter(col_idx)].width = width


def _apply_sheet_polish(ws, freeze_row: int = 2):
    """Freeze header row, set row height, enable autofilter."""
    ws.freeze_panes = ws.cell(row=freeze_row, column=1)
    ws.row_dimensions[1].height = 22
    if ws.max_row >= 2:
        ws.auto_filter.ref = ws.dimensions


def _rank_col(df: pd.DataFrame) -> pd.DataFrame:
    """Insert a 1-based Rank column as the first column."""
    ranked = df.copy().reset_index(drop=True)
    ranked.insert(0, "_rank", range(1, len(ranked) + 1))
    return ranked


# ── Sheet builders ───────────────────────────────────────────────────────────

def _build_screen_sheet(ws, df: pd.DataFrame, screen_display_name: str, col_specs: list[tuple]):
    """Write a single preset-screen result sheet."""
    # Filter col_specs to columns that actually exist in df
    available = [(c, h) for c, h in col_specs if c in df.columns]
    headers   = [h for _, h in available]

    # Title row
    ws.cell(row=1, column=1).value = screen_display_name
    ws.cell(row=1, column=1).font  = Font(bold=True, size=13, color=_NAVY, name="Calibri")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max(len(headers), 1))

    # Header row
    _write_header(ws, headers, row=2)

    # Data rows
    _write_data_rows(ws, df, available, start_row=3)

    # Column widths
    _set_col_widths(ws, headers)

    # Polish
    ws.freeze_panes = ws.cell(row=3, column=1)
    ws.row_dimensions[1].height = 26
    ws.row_dimensions[2].height = 22
    if ws.max_row >= 3:
        ws.auto_filter.ref = f"A2:{get_column_letter(len(headers))}{ws.max_row}"


def _build_ranked_sheet(ws, df: pd.DataFrame, col_specs: list[tuple]):
    """Write the master 'Ranked (All)' sheet with all scored companies."""
    available = [(c, h) for c, h in col_specs if c in df.columns]
    headers   = ["#"] + [h for _, h in available]

    # Title
    ws.cell(row=1, column=1).value = "NIFTY100 — All Companies Ranked by Composite Score"
    ws.cell(row=1, column=1).font  = Font(bold=True, size=13, color=_NAVY, name="Calibri")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))

    # Header
    _write_header(ws, headers, row=2)

    # Data (prepend rank number)
    src_cols = [c for c, _ in available if c in df.columns]
    for row_offset, (_, data_row) in enumerate(df[src_cols].iterrows()):
        excel_row = 3 + row_offset
        row_fill  = _row_fill(row_offset + 1)

        # Rank cell
        rank_cell           = ws.cell(row=excel_row, column=1, value=row_offset + 1)
        rank_cell.font      = Font(bold=True, size=10, name="Calibri", color="475569")
        rank_cell.fill      = row_fill
        rank_cell.border    = _thin_border()
        rank_cell.alignment = Alignment(horizontal="center", vertical="center")

        # Data cells
        score_col_idx = None
        for idx, (src, _) in enumerate(available, start=1):
            if src == "composite_score":
                score_col_idx = idx + 1   # +1 because rank occupies col 1

        for col_offset, value in enumerate(data_row, start=2):
            cell = ws.cell(row=excel_row, column=col_offset)
            if pd.isna(value):
                cell.value = None
            elif isinstance(value, float):
                cell.value = round(value, 2)
            else:
                cell.value = str(value).strip() if isinstance(value, str) else value

            if col_offset == score_col_idx and cell.value is not None:
                try:
                    cell.fill = _score_fill(float(cell.value))
                    cell.font = Font(bold=True, size=10, name="Calibri")
                except (TypeError, ValueError):
                    cell.fill = row_fill
            else:
                cell.fill = row_fill

            cell.border    = _thin_border()
            cell.alignment = Alignment(
                horizontal="right" if col_offset > 3 else "left",
                vertical="center",
            )

    # Column widths
    ws.column_dimensions["A"].width = 6   # rank col
    _set_col_widths(ws, [h for _, h in available])
    # shift widths right by 1 (rank already occupies A)
    for col_idx, (_, header) in enumerate(available, start=2):
        width = _COL_WIDTHS.get(header, max(len(header) + 4, 12))
        ws.column_dimensions[get_column_letter(col_idx)].width = width

    ws.freeze_panes = ws.cell(row=3, column=1)
    ws.row_dimensions[1].height = 26
    ws.row_dimensions[2].height = 22
    if ws.max_row >= 3:
        ws.auto_filter.ref = f"A2:{get_column_letter(len(headers))}{ws.max_row}"


def _build_summary_sheet(ws, screen_results: list[dict]):
    """
    Write a top-level summary sheet listing every screen with stats.

    Columns: Screen | Filter Count | Companies | Top Company | Top Score
    """
    headers = ["Screen Name", "Filters Applied", "Companies Found",
               "Top Company", "Top Score", "Avg Score"]

    # Title
    ws.cell(row=1, column=1).value = "NIFTY100 Screener — Summary"
    ws.cell(row=1, column=1).font  = Font(bold=True, size=14, color=_NAVY, name="Calibri")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))

    ws.cell(row=2, column=1).value = "Generated by NIFTY100 Financial Intelligence Platform"
    ws.cell(row=2, column=1).font  = Font(italic=True, size=10, color="64748B", name="Calibri")
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=len(headers))

    _write_header(ws, headers, row=4)

    for row_offset, res in enumerate(screen_results):
        excel_row = 5 + row_offset
        row_fill  = _row_fill(row_offset + 1)

        companies_df = pd.DataFrame(res["companies"])
        count        = res["count"]

        top_company = "—"
        top_score   = None
        avg_score   = None

        if count > 0 and "composite_score" in companies_df.columns:
            top_row     = companies_df.iloc[0]
            top_company = str(top_row.get("company_name", "—")).strip()
            top_score   = round(float(top_row["composite_score"]), 1) if pd.notna(top_row["composite_score"]) else None
            avg_score   = round(float(companies_df["composite_score"].mean()), 1)

        values = [
            res["screen_display_name"],
            len(res["filters"]),
            count,
            top_company,
            top_score,
            avg_score,
        ]

        for col_idx, value in enumerate(values, start=1):
            cell           = ws.cell(row=excel_row, column=col_idx, value=value)
            cell.fill      = row_fill
            cell.border    = _thin_border()
            cell.alignment = Alignment(
                horizontal="left" if col_idx in (1, 4) else "center",
                vertical="center",
            )
            if col_idx == 1:
                cell.font = Font(bold=True, size=10, name="Calibri")
            else:
                cell.font = Font(size=10, name="Calibri")

    # Column widths
    widths = [28, 16, 18, 36, 12, 12]
    for col_idx, width in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(col_idx)].width = width

    ws.row_dimensions[1].height = 28
    ws.row_dimensions[4].height = 22
    ws.freeze_panes = ws.cell(row=5, column=1)


# ── Public entry point ───────────────────────────────────────────────────────

def export_screeners(
    screener: "StockScreener",
    output_path: str = "output/screener_output.xlsx",
) -> Path:
    """
    Run every preset screen defined in screener_config.yaml, then write a
    richly-formatted multi-sheet Excel workbook to *output_path*.

    Pipeline per screen
    ───────────────────
        Load Data  →  Apply Preset Filter  →  Calculate Score
            →  Sort Score DESC  →  Write Sheet

    Parameters
    ──────────
    screener    : StockScreener instance (already initialised)
    output_path : destination path, default ``output/screener_output.xlsx``

    Returns
    ───────
    Path : resolved path to the written workbook

    Example
    ───────
    >>> from src.screener.engine import StockScreener
    >>> from src.screener.exporter import export_screeners
    >>> s = StockScreener()
    >>> path = export_screeners(s)
    >>> print(path)
    output/screener_output.xlsx
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # ── 1. Collect preset names ──────────────────────────────────────────────
    preset_names: list[str] = []
    if "screens" in screener.config:
        preset_names = list(screener.config["screens"].keys())

    if not preset_names:
        raise ValueError(
            "No screens defined in screener_config.yaml. "
            "Add at least one entry under the 'screens' key."
        )

    logger.info("export_screeners: running %d presets → %s", len(preset_names), output_path)

    # ── 2. Run all presets ───────────────────────────────────────────────────
    screen_results: list[dict] = []
    for name in preset_names:
        logger.debug("  running preset: %s", name)
        result = screener.run_screener(screen_name=name)
        screen_results.append(result)

    # ── 3. Build Ranked (All) — score entire universe, sort DESC ─────────────
    all_data = screener.load_financial_data(compute_scores=True)
    all_scored = all_data.sort_values(
        "composite_score" if "composite_score" in all_data.columns else "advanced_composite_score",
        ascending=False,
        na_position="last",
    ).reset_index(drop=True)

    # ── 4. Write workbook ────────────────────────────────────────────────────
    wb = Workbook()

    # Remove default empty sheet
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]

    # Sheet 0 – Summary
    ws_summary = wb.create_sheet("Summary")
    _build_summary_sheet(ws_summary, screen_results)

    # Sheet 1 – Ranked (All)
    ws_ranked = wb.create_sheet("Ranked (All)")
    _build_ranked_sheet(ws_ranked, all_scored, _RANKED_COLUMNS)

    # Sheets 2+ – one per preset
    for result in screen_results:
        display_name = result["screen_display_name"]
        # Sheet names max 31 chars
        sheet_name   = display_name[:31]
        ws = wb.create_sheet(sheet_name)
        companies_df = pd.DataFrame(result["companies"])
        _build_screen_sheet(ws, companies_df, display_name, _SCREEN_COLUMNS)

    wb.save(output_path)
    logger.info("export_screeners: saved → %s  (%d sheets)", output_path, len(wb.sheetnames))

    return output_path.resolve()


# ── ScreenerExporter class (backward-compatible) ─────────────────────────────

class ScreenerExporter:
    """
    Low-level single-DataFrame exporter.

    Used internally by ``StockScreener.run_screener(export_to_excel=True)``
    and retained for backward-compatibility with existing tests.

    For the full multi-sheet export use the module-level
    ``export_screeners()`` function instead.
    """

    @staticmethod
    def export_to_excel(
        df: pd.DataFrame,
        filename: str = "screener_output.xlsx",
        sort_by: Optional[str] = "advanced_composite_score",
        ascending: bool = False,
    ) -> bool:
        """
        Export a single scored DataFrame to Excel.

        Parameters
        ──────────
        df        : Scored DataFrame (output of run_screener pipeline)
        filename  : Destination file path
        sort_by   : Column to sort by before writing (default: advanced_composite_score)
        ascending : Sort direction (default: descending)

        Returns
        ───────
        bool : True if the file was written successfully
        """
        if df is None or df.empty:
            return False

        sorted_df = df.copy()
        if sort_by and sort_by in sorted_df.columns:
            sorted_df = sorted_df.sort_values(
                by=sort_by, ascending=ascending, na_position="last"
            )

        # Select key columns, falling back gracefully if absent
        primary_cols = [
            "company_id", "company_name", "sector", "market_cap",
            "roe_percentage", "roce_percentage", "debt_equity",
            "revenue_cagr_3y", "revenue_cagr_5y",
            "pat_cagr_3y", "pat_cagr_5y",
            "cfo_quality_score", "opm_percentage", "asset_turnover",
            "advanced_composite_score", "composite_quality_score",
        ]
        sector_cols  = [c for c in sorted_df.columns if c.endswith("_vs_sector")]
        all_cols     = primary_cols + sector_cols
        export_cols  = [c for c in all_cols if c in sorted_df.columns]
        export_df    = sorted_df[export_cols]

        output_path  = Path(filename)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
            export_df.to_excel(writer, sheet_name="Screener Results", index=False)

            ws = writer.sheets["Screener Results"]

            # Style header row
            header_fill = PatternFill(fill_type="solid", fgColor=_BLUE)
            for cell in ws[1]:
                cell.font      = Font(bold=True, color=_WHITE, size=11, name="Calibri")
                cell.fill      = header_fill
                cell.border    = _thin_border()
                cell.alignment = Alignment(horizontal="center", vertical="center")

            # Auto-fit columns
            for col_idx, col in enumerate(export_df.columns, start=1):
                col_letter = get_column_letter(col_idx)
                try:
                    max_len = max(
                        export_df[col].astype(str).map(len).max()
                        if not export_df[col].isna().all() else len(col),
                        len(col),
                    ) + 2
                except Exception:
                    max_len = len(col) + 2
                ws.column_dimensions[col_letter].width = min(max_len, 50)

            ws.freeze_panes = "A2"

        return True
