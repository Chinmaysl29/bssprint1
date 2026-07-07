
import sqlite3
import yaml
import pandas as pd
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent))

from analytics.cagr import (
    calculate_multiyear_sales_cagr,
    calculate_multiyear_profit_cagr,
    calculate_multiyear_eps_cagr,
    calculate_multiyear_fcf_cagr,
    pivot_multiyear_cagr,
)
from analytics.cashflow_kpis import calculate_cfo_quality_score
from .scoring import ScreenerScoring
from .exporter import ScreenerExporter


class StockScreener:
    def __init__(self, db_path="db/nifty100.db", config_path="config/screener_config.yaml"):
        self.db_path = Path(db_path)
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.conn = sqlite3.connect(self.db_path)
        self.financial_data = None
        self.scoring = ScreenerScoring()
        self.exporter = ScreenerExporter()

    def load_config(self):
        if self.config_path.exists():
            with open(self.config_path, "r") as f:
                return yaml.safe_load(f)
        return {}

    def load_financial_data(self, compute_scores=False):
        query = """
        WITH latest_year AS (
            SELECT company_id, MAX(year) as latest_year
            FROM financial_ratios
            GROUP BY company_id
        ),
        fr_latest AS (
            SELECT fr.*
            FROM financial_ratios fr
            JOIN latest_year ly ON fr.company_id = ly.company_id AND fr.year = ly.latest_year
        ),
        pl_latest AS (
            SELECT p.*, ROW_NUMBER() OVER (PARTITION BY p.company_id ORDER BY p.id DESC) as rn
            FROM profitandloss p
            JOIN latest_year ly ON p.company_id = ly.company_id AND p.year = ly.latest_year
        ),
        bs_latest AS (
            SELECT b.*, ROW_NUMBER() OVER (PARTITION BY b.company_id ORDER BY b.id DESC) as rn
            FROM balancesheet b
            JOIN latest_year ly ON b.company_id = ly.company_id AND b.year = ly.latest_year
        ),
        cf_latest AS (
            SELECT c.*, ROW_NUMBER() OVER (PARTITION BY c.company_id ORDER BY c.id DESC) as rn
            FROM cashflow c
            JOIN latest_year ly ON c.company_id = ly.company_id AND c.year = ly.latest_year
        ),
        sectors_dedup AS (
            SELECT s.*, ROW_NUMBER() OVER (PARTITION BY s.company_id ORDER BY s.id DESC) as rn
            FROM sectors s
        ),
        mc_latest AS (
            SELECT mc.*, ROW_NUMBER() OVER (PARTITION BY mc.company_id ORDER BY mc.id DESC) as rn
            FROM market_cap mc
        )
        SELECT DISTINCT
            c.id as company_id,
            c.company_name,
            c.roe_percentage,
            c.roce_percentage,
            c.book_value,
            s.sector,
            s.cap,
            fr.year as year,
            pl.sales,
            pl.net_profit as pat,
            pl.eps,
            pl.dividend_payout,
            pl.operating_profit,
            pl.other_income,
            pl.interest,
            pl.opm_percentage,
            bs.equity_capital,
            bs.reserves,
            bs.borrowings,
            bs.total_assets,
            cf.operating_activity,
            cf.investing_activity,
            fr.free_cash_flow_cr as fcf,
            fr.cfo_quality_score,
            mc.mc1 as market_cap,
            mc.mc2 as market_cap_2,
            mc.val5 as dividend_yield
        FROM companies c
        LEFT JOIN sectors_dedup s ON c.id = s.company_id AND s.rn = 1
        LEFT JOIN fr_latest fr ON c.id = fr.company_id
        LEFT JOIN pl_latest pl ON c.id = pl.company_id AND pl.rn = 1
        LEFT JOIN bs_latest bs ON c.id = bs.company_id AND bs.rn = 1
        LEFT JOIN cf_latest cf ON c.id = cf.company_id AND cf.rn = 1
        LEFT JOIN mc_latest mc ON c.id = mc.company_id AND mc.rn = 1
        """
        self.financial_data = pd.read_sql(query, self.conn)

        # Calculate derived metrics
        self.financial_data["debt_equity"] = self.financial_data.apply(
            lambda row: (
                row["borrowings"] / (row["equity_capital"] + row["reserves"])
                if pd.notna(row["borrowings"])
                and pd.notna(row["equity_capital"])
                and pd.notna(row["reserves"])
                and (row["equity_capital"] + row["reserves"]) != 0
                else None
            ),
            axis=1,
        )

        self.financial_data["asset_turnover"] = self.financial_data.apply(
            lambda row: (
                row["sales"] / row["total_assets"]
                if pd.notna(row["sales"])
                and pd.notna(row["total_assets"])
                and row["total_assets"] != 0
                else None
            ),
            axis=1,
        )

        self.financial_data["icr_label"] = self.financial_data["borrowings"].apply(
            lambda x: "Debt Free" if pd.notna(x) and x == 0 else None
        )

        self.financial_data["icr"] = self.financial_data.apply(
            lambda row: (
                float("inf")
                if pd.notna(row["icr_label"]) and row["icr_label"] == "Debt Free"
                else (
                    (row["operating_profit"] + row["other_income"]) / row["interest"]
                    if pd.notna(row["operating_profit"])
                    and pd.notna(row["other_income"])
                    and pd.notna(row["interest"])
                    and row["interest"] != 0
                    else None
                )
            ),
            axis=1,
        )

        # Load CAGR data
        sales_cagr = calculate_multiyear_sales_cagr(period_list=[3, 5])
        sales_pivot = pivot_multiyear_cagr(sales_cagr, "sales")
        profit_cagr = calculate_multiyear_profit_cagr(period_list=[3, 5])
        profit_pivot = pivot_multiyear_cagr(profit_cagr, "net_profit")
        eps_cagr = calculate_multiyear_eps_cagr(period_list=[3, 5])
        eps_pivot = pivot_multiyear_cagr(eps_cagr, "eps")
        fcf_cagr = calculate_multiyear_fcf_cagr(period_list=[3, 5])
        fcf_pivot = pivot_multiyear_cagr(fcf_cagr, "free_cash_flow_cr")
        
        # Load CFO/PAT ratio
        cfo_quality = calculate_cfo_quality_score()

        if not sales_pivot.empty:
            self.financial_data = self.financial_data.merge(
                sales_pivot[["company_id", "3-Year_cagr_pct", "5-Year_cagr_pct"]],
                on="company_id",
                how="left",
            ).rename(
                columns={
                    "3-Year_cagr_pct": "revenue_cagr_3y",
                    "5-Year_cagr_pct": "revenue_cagr_5y",
                }
            )

        if not profit_pivot.empty:
            self.financial_data = self.financial_data.merge(
                profit_pivot[["company_id", "3-Year_cagr_pct", "5-Year_cagr_pct"]],
                on="company_id",
                how="left",
            ).rename(
                columns={
                    "3-Year_cagr_pct": "pat_cagr_3y",
                    "5-Year_cagr_pct": "pat_cagr_5y",
                }
            )

        if not eps_pivot.empty:
            self.financial_data = self.financial_data.merge(
                eps_pivot[["company_id", "3-Year_cagr_pct", "5-Year_cagr_pct"]],
                on="company_id",
                how="left",
            ).rename(
                columns={
                    "3-Year_cagr_pct": "eps_cagr_3y",
                    "5-Year_cagr_pct": "eps_cagr_5y",
                }
            )
            
        if not fcf_pivot.empty:
            self.financial_data = self.financial_data.merge(
                fcf_pivot[["company_id", "3-Year_cagr_pct", "5-Year_cagr_pct"]],
                on="company_id",
                how="left",
            ).rename(
                columns={
                    "3-Year_cagr_pct": "fcf_cagr_3y",
                    "5-Year_cagr_pct": "fcf_cagr_5y",
                }
            )
            
        if not cfo_quality.empty:
            self.financial_data = self.financial_data.merge(
                cfo_quality[["company_id", "avg_cfo_pat_ratio"]],
                on="company_id",
                how="left",
            )

        if compute_scores:
            # Compute scores on all data for backward compatibility
            self.financial_data = self.scoring.calculate_p10_p90_normalization(self.financial_data)
            self.financial_data = self.scoring.calculate_sector_comparison(self.financial_data)
            self.financial_data = self.scoring.calculate_advanced_composite_score(self.financial_data)

        return self.financial_data

    def apply_filters(self, df: pd.DataFrame, **kwargs):
        if df is None or df.empty:
            return df

        filtered_df = df.copy()

        column_mapping = {
            "roe": ["roe_percentage", "roe"],
            "roce": ["roce_percentage", "roce"],
            "debt_equity": ["debt_equity", "debt_to_equity"],
            "debt_to_equity": ["debt_to_equity", "debt_equity"],
            "fcf": ["fcf"],
            "revenue": ["revenue", "sales"],
            "sales": ["sales", "revenue"],
            "pat": ["pat", "net_profit"],
            "net_profit": ["net_profit", "pat"],
            "revenue_cagr_3y": ["revenue_cagr_3y"],
            "revenue_cagr_5y": ["revenue_cagr_5y", "revenue_cagr"],
            "pat_cagr_3y": ["pat_cagr_3y"],
            "pat_cagr_5y": ["pat_cagr_5y", "pat_cagr"],
            "eps_cagr_3y": ["eps_cagr_3y"],
            "eps_cagr_5y": ["eps_cagr_5y", "eps_cagr"],
            "opm": ["opm_percentage", "opm"],
            "pe": ["pe"],
            "pb": ["pb"],
            "dividend_yield": ["dividend_yield"],
            "dividend_payout": ["dividend_payout"],
            "icr": ["icr"],
            "market_cap": ["market_cap", "market_cap_2"],
            "asset_turnover": ["asset_turnover"],
        }

        def get_col_name(df, metric):
            possible_cols = column_mapping.get(metric, [metric])
            for col in possible_cols:
                if col in df.columns:
                    return col
            return None

        is_de_filter = lambda key: key in [
            "debt_equity_max",
            "debt_to_equity_max",
            "debt_equity_min",
            "debt_to_equity_min",
        ]

        for filter_key, filter_value in kwargs.items():
            if filter_value is None:
                continue

            if not isinstance(filter_value, (int, float)):
                raise ValueError(
                    f"Invalid filter value for {filter_key}: must be numeric, got {type(filter_value).__name__}"
                )

            if is_de_filter(filter_key) and "sector" in filtered_df.columns:
                non_financial = filtered_df[filtered_df["sector"] != "Financials"]
                financial = filtered_df[filtered_df["sector"] == "Financials"]

                if filter_key.endswith("_min"):
                    metric = filter_key[:-4]
                else:
                    metric = filter_key[:-4]
                col_name = get_col_name(non_financial, metric)

                if col_name:
                    if filter_key.endswith("_min"):
                        filtered_non_financial = non_financial[
                            non_financial[col_name] >= filter_value
                        ]
                    else:
                        filtered_non_financial = non_financial[
                            non_financial[col_name] <= filter_value
                        ]
                    filtered_df = pd.concat([filtered_non_financial, financial], ignore_index=True)
                continue

            if filter_key.endswith("_min"):
                metric = filter_key[:-4]
                operator = ">="
            elif filter_key.endswith("_max"):
                metric = filter_key[:-4]
                operator = "<="
            else:
                continue

            col_name = get_col_name(filtered_df, metric)
            if col_name:
                if operator == ">=":
                    filtered_df = filtered_df[filtered_df[col_name] >= filter_value]
                elif operator == "<=":
                    filtered_df = filtered_df[filtered_df[col_name] <= filter_value]

        return filtered_df

    def run_screener(
        self,
        screen_name=None,
        export_to_excel=False,
        excel_filename="screener_output.xlsx",
        **kwargs,
    ):
        """
        Full screener pipeline:
            Load Data
              ↓
            Apply Preset Filter
              ↓
            Calculate Score
              ↓
            Sort Score DESC
              ↓
            Return Result

        Args:
            screen_name: Name of a predefined screen from screener_config.yaml
            export_to_excel: Whether to export results to Excel
            excel_filename: Output filename for Excel export
            **kwargs: Additional filter overrides (e.g. roe_min=20)

        Returns:
            dict with keys: screen_name, screen_display_name, filters,
                            companies (list of dicts), count,
                            ranked (DataFrame with Company + Score),
                            excel_exported, excel_filename
        """
        # ── Step 1: Load Data ────────────────────────────────────────────────
        if self.financial_data is None:
            self.load_financial_data()

        filtered_df = self.financial_data.copy()
        display_name = "Custom Screen"
        filters = kwargs

        # ── Step 2: Apply Preset Filter ──────────────────────────────────────
        if screen_name and "screens" in self.config and screen_name in self.config["screens"]:
            screen = self.config["screens"][screen_name]
            display_name = screen.get("name", screen_name)
            predefined_filters = screen.get("filters", {})
            # Caller kwargs override preset values
            merged_filters = {**predefined_filters, **kwargs}
            filters = merged_filters

        filtered_companies = self.apply_filters(filtered_df, **filters)

        # ── Step 3: Calculate Score ──────────────────────────────────────────
        if not filtered_companies.empty:
            filtered_companies = self.scoring.calculate_p10_p90_normalization(filtered_companies)
            filtered_companies = self.scoring.calculate_sector_comparison(filtered_companies)
            filtered_companies = self.scoring.calculate_advanced_composite_score(filtered_companies)

            # ── Step 4: Sort Score DESC ──────────────────────────────────────
            filtered_companies = filtered_companies.sort_values(
                by="composite_score", ascending=False, na_position="last"
            )

        # ── Step 5: Build ranked output (Company / Score table) ──────────────
        ranked = self._build_ranked_output(filtered_companies)

        excel_exported = False
        if export_to_excel:
            excel_exported = self.exporter.export_to_excel(filtered_companies, excel_filename)

        # ── Step 5: Return Result ────────────────────────────────────────────
        return {
            "screen_name": screen_name or "custom",
            "screen_display_name": display_name,
            "filters": filters,
            "companies": filtered_companies.to_dict("records"),
            "count": len(filtered_companies),
            "ranked": ranked,
            "excel_exported": excel_exported,
            "excel_filename": excel_filename if excel_exported else None,
        }

    # ── Helper: ranked output ────────────────────────────────────────────────
    @staticmethod
    def _build_ranked_output(df: pd.DataFrame) -> pd.DataFrame:
        """
        Build a clean Company / Score summary table from the scored DataFrame.

        Score is rounded to the nearest integer (0–100).

        Example output:
            Company      Score
            TCS             91
            Infosys         89
            Reliance        85

        Args:
            df: Scored and sorted DataFrame from run_screener

        Returns:
            DataFrame with columns [Company, Score], sorted descending.
        """
        if df is None or df.empty:
            return pd.DataFrame(columns=["Company", "Score"])

        score_col = "composite_score"
        if score_col not in df.columns:
            # Fall back to legacy column if present
            score_col = "advanced_composite_score" if "advanced_composite_score" in df.columns else None

        name_col = "company_name" if "company_name" in df.columns else None

        if name_col is None or score_col is None:
            return pd.DataFrame(columns=["Company", "Score"])

        ranked = df[[name_col, score_col]].copy()
        ranked.columns = ["Company", "Score"]

        # Clean up company name (strip extra whitespace / newlines)
        ranked["Company"] = ranked["Company"].astype(str).str.strip().str.replace(r"\s+", " ", regex=True)

        # Scale composite_score (0–100) to integer
        ranked["Score"] = ranked["Score"].apply(
            lambda x: int(round(float(x))) if pd.notna(x) else 0
        )

        return ranked.sort_values("Score", ascending=False).reset_index(drop=True)

    def close(self):
        if self.conn:
            self.conn.close()
