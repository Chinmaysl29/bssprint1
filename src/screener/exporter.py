
import pandas as pd
from pathlib import Path
from typing import Optional


def column_index_to_letter(index: int) -> str:
    """Convert 0-based column index to Excel-style column letter (A, B, ..., Z, AA, AB, ...)."""
    letters = ""
    while index >= 0:
        letters = chr(65 + (index % 26)) + letters
        index = index // 26 - 1
    return letters


class ScreenerExporter:
    """
    Handles exporting screener results to Excel with formatting and multiple sheets.
    """

    @staticmethod
    def export_to_excel(
        df: pd.DataFrame,
        filename: str = "screener_output.xlsx",
        sort_by: Optional[str] = "advanced_composite_score",
        ascending: bool = False,
    ) -> bool:
        """
        Exports screener results to Excel file.
        
        Args:
            df: DataFrame with filtered results
            filename: Output filename
            sort_by: Column to sort by
            ascending: Whether to sort ascending or descending
        
        Returns:
            True if export successful
        """
        if df is None or df.empty:
            return False

        sorted_df = df.copy()
        if sort_by and sort_by in sorted_df.columns:
            sorted_df = sorted_df.sort_values(
                by=sort_by, ascending=ascending, na_position="last"
            )

        # Select key columns
        export_columns = [
            "company_id",
            "company_name",
            "sector",
            "market_cap",
            "roe_percentage",
            "roce_percentage",
            "debt_equity",
            "revenue_cagr_3y",
            "revenue_cagr_5y",
            "pat_cagr_3y",
            "pat_cagr_5y",
            "cfo_quality_score",
            "opm_percentage",
            "asset_turnover",
            "advanced_composite_score",
            "composite_quality_score",
        ]

        # Add sector comparison columns if present
        sector_comparison_cols = [col for col in sorted_df.columns if col.endswith("_vs_sector")]
        export_columns += sector_comparison_cols

        available_columns = [col for col in export_columns if col in sorted_df.columns]
        export_df = sorted_df[available_columns]

        output_path = Path(filename)

        # Write to Excel
        with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
            export_df.to_excel(writer, sheet_name="Screener Results", index=False)
            
            # Auto-fit columns
            worksheet = writer.sheets["Screener Results"]
            for idx, col in enumerate(export_df.columns):
                col_letter = column_index_to_letter(idx)
                max_len = max(
                    export_df[col].astype(str).map(len).max() if not export_df[col].isna().all() else len(str(col)),
                    len(str(col)),
                ) + 2
                worksheet.column_dimensions[col_letter].width = min(max_len, 50)

        return True
