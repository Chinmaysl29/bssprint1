
import pandas as pd
import numpy as np


class ScreenerScoring:
    """
    Handles all scoring and normalization for the stock screener.
    """

    @staticmethod
    def winsorize_metric(series: pd.Series, lower: float = 0.10, upper: float = 0.90) -> pd.Series:
        """
        Winsorize a metric at the specified percentiles (default P10/P90).
        
        Args:
            series: Input pandas Series
            lower: Lower percentile (default 0.10 = 10th)
            upper: Upper percentile (default 0.90 = 90th)
        
        Returns:
            Winsorized pandas Series
        """
        series = series.copy().astype(float)
        non_na = series.dropna()
        
        if len(non_na) == 0:
            return series
        
        lower_val = non_na.quantile(lower)
        upper_val = non_na.quantile(upper)
        
        # Only winsorize non-NA values, leave NA as is
        series[~series.isna()] = np.clip(non_na, lower_val, upper_val)
        return series

    @staticmethod
    def normalize_metric(series: pd.Series, method: str = "p10p90") -> pd.Series:
        """
        Normalize a metric using the specified method.
        
        Args:
            series: Input pandas Series
            method: Normalization method (p10p90, minmax, zscore)
        
        Returns:
            Normalized pandas Series
        """
        series = series.copy().astype(float)
        non_na = series.dropna()
        result = series.copy()
        
        if len(non_na) == 0:
            return result
        
        if method == "p10p90":
            p10 = non_na.quantile(0.10)
            p90 = non_na.quantile(0.90)
            if p90 - p10 == 0:
                result[~result.isna()] = 0.5
            else:
                normalized = (non_na - p10) / (p90 - p10)
                result[~result.isna()] = np.clip(normalized, 0, 1)
            return result
        
        elif method == "minmax":
            min_val = non_na.min()
            max_val = non_na.max()
            if max_val - min_val == 0:
                result[~result.isna()] = 0.5
            else:
                result[~result.isna()] = (non_na - min_val) / (max_val - min_val)
            return result
        
        elif method == "zscore":
            mean = non_na.mean()
            std = non_na.std()
            if std == 0:
                result[~result.isna()] = 0.0
            else:
                result[~result.isna()] = (non_na - mean) / std
            return result
        
        else:
            raise ValueError(f"Unknown normalization method: {method}")

    @staticmethod
    def sector_relative_score(df: pd.DataFrame, metric: str) -> pd.Series:
        """
        Calculate sector-relative scores for a metric.
        
        Args:
            df: Input DataFrame with 'sector' column
            metric: Metric column name to compute relative score
        
        Returns:
            Series with sector-relative normalized scores
        """
        if "sector" not in df.columns:
            raise ValueError("DataFrame must contain 'sector' column")
        
        def normalize_sector(group):
            return ScreenerScoring.normalize_metric(group[metric])
        
        return df.groupby("sector").apply(normalize_sector).reset_index(level=0, drop=True)

    @staticmethod
    def calculate_p10_p90_normalization(df: pd.DataFrame) -> pd.DataFrame:
        """
        Applies P10/P90 winsorization and normalization to key financial metrics.
        
        Args:
            df: DataFrame with financial data
        
        Returns:
            DataFrame with winsorized and normalized metrics added
        """
        metrics_to_process = [
            # Required metrics per sprint
            "roe_percentage",          # ROE
            "roce_percentage",         # ROCE
            "opm_percentage",          # NPM (Operating Profit Margin as proxy)
            "fcf",                     # FCF
            "revenue_cagr_3y",         # CAGR (3yr)
            "revenue_cagr_5y",         # CAGR (5yr)
            "pat_cagr_3y",             # CAGR (3yr)
            "pat_cagr_5y",             # CAGR (5yr)
            "fcf_cagr_3y",             # CAGR (3yr)
            "fcf_cagr_5y",             # CAGR (5yr)
            "avg_cfo_pat_ratio",       # CFO/PAT Ratio
            "debt_equity",             # Debt
            "icr",                     # ICR
            # Existing metrics for backward compatibility
            "eps_cagr_5y",
            "cfo_quality_score",
            "asset_turnover",
            "dividend_payout",
        ]

        result_df = df.copy()

        for metric in metrics_to_process:
            if metric not in result_df.columns:
                continue
            
            # Winsorize first at P10/P90
            result_df[f"{metric}_winsorized"] = ScreenerScoring.winsorize_metric(result_df[metric])
            # Then normalize
            normalized = ScreenerScoring.normalize_metric(result_df[f"{metric}_winsorized"])
            result_df[f"{metric}_norm_p10p90"] = normalized.fillna(0.5)

        return result_df

    @staticmethod
    def calculate_sector_comparison(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates sector-level metrics and peer comparisons.
        
        Args:
            df: DataFrame with financial data
        
        Returns:
            DataFrame with sector metrics and comparisons
        """
        if "sector" not in df.columns:
            return df

        result_df = df.copy()
        sector_metrics = [
            "roe_percentage",
            "roce_percentage",
            "opm_percentage",
            "fcf",
            "revenue_cagr_3y",
            "revenue_cagr_5y",
            "pat_cagr_3y",
            "pat_cagr_5y",
            "fcf_cagr_3y",
            "fcf_cagr_5y",
            "avg_cfo_pat_ratio",
            "debt_equity",
            "icr",
            "eps_cagr_5y",
            "cfo_quality_score",
            "asset_turnover",
            "dividend_payout",
        ]

        # Calculate sector aggregations
        sector_agg = result_df.groupby("sector")[sector_metrics].agg(["mean", "median"]).reset_index()
        new_columns = ["sector"]
        for col in sector_agg.columns[1:]:
            metric, stat = col
            new_columns.append(f"{metric}_sector_{stat}")
        sector_agg.columns = new_columns

        result_df = result_df.merge(sector_agg, on="sector", how="left")

        for metric in sector_metrics:
            median_col = f"{metric}_sector_median"
            if median_col in result_df.columns:
                result_df[f"{metric}_vs_sector"] = result_df.apply(
                    lambda row: (
                        row[metric] - row[median_col]
                        if pd.notna(row[metric]) and pd.notna(row[median_col])
                        else None
                    ),
                    axis=1,
                )

        return result_df

    @staticmethod
    def calculate_composite_score(df: pd.DataFrame, weights: dict = None) -> pd.DataFrame:
        """
        Calculates new composite score as per sprint requirements
        
        Total: 100 Points
        - Profitability (35):
            - ROE (15)
            - ROCE (10)
            - OPM (Net Profit Margin proxy) (10)
        - Cash Quality (30):
            - FCF CAGR (15)
            - CFO/PAT Ratio (10)
            - FCF Positive (5)
        - Growth (20):
            - Revenue CAGR (10)
            - PAT CAGR (10)
        - Leverage (15):
            - Debt Score (10)
            - ICR Score (5)
        
        Args:
            df: DataFrame with normalized metrics
            weights: Optional custom weights dict (metric -> weight)
        
        Returns:
            DataFrame with all individual scores and final composite score
        """
        
        result_df = df.copy()
        
        # ------------------------------
        # 1. Profitability Score (35)
        # ------------------------------
        # ROE (15)
        roe_norm = "roe_percentage_norm_p10p90"
        if roe_norm in result_df.columns:
            result_df["score_roe"] = (result_df[roe_norm].fillna(0.5) * 15)
        else:
            result_df["score_roe"] = 0.0
            
        # ROCE (10)
        roce_norm = "roce_percentage_norm_p10p90"
        if roce_norm in result_df.columns:
            result_df["score_roce"] = (result_df[roce_norm].fillna(0.5) * 10)
        else:
            result_df["score_roce"] = 0.0
            
        # OPM (10)
        opm_norm = "opm_percentage_norm_p10p90"
        if opm_norm in result_df.columns:
            result_df["score_opm"] = (result_df[opm_norm].fillna(0.5) * 10)
        else:
            result_df["score_opm"] = 0.0
            
        result_df["score_profitability"] = result_df["score_roe"] + result_df["score_roce"] + result_df["score_opm"]
        
        # ------------------------------
        # 2. Cash Quality Score (30)
        # ------------------------------
        # FCF CAGR (15) - use 5y if available, else 3y
        fcf_cagr_5y_norm = "fcf_cagr_5y_norm_p10p90"
        fcf_cagr_3y_norm = "fcf_cagr_3y_norm_p10p90"
        if fcf_cagr_5y_norm in result_df.columns:
            result_df["score_fcf_cagr"] = (result_df[fcf_cagr_5y_norm].fillna(0.5) * 15)
        elif fcf_cagr_3y_norm in result_df.columns:
            result_df["score_fcf_cagr"] = (result_df[fcf_cagr_3y_norm].fillna(0.5) * 15)
        else:
            result_df["score_fcf_cagr"] = 0.0
            
        # CFO/PAT Ratio (10) - normalize from 0 to 1 (capped at 2.0)
        if "avg_cfo_pat_ratio" in result_df.columns:
            result_df["cfo_pat_clamped"] = result_df["avg_cfo_pat_ratio"].apply(
                lambda x: min(max(x, 0), 2.0) if pd.notna(x) else 1.0
            )
            # Normalize to 0-1 range (0: 0, 1: 2.0)
            result_df["cfo_pat_normalized"] = result_df["cfo_pat_clamped"] / 2.0
            result_df["score_cfo_pat"] = (result_df["cfo_pat_normalized"] * 10)
        else:
            result_df["score_cfo_pat"] = 0.0
            
        # FCF Positive (5)
        if "fcf" in result_df.columns:
            result_df["score_fcf_positive"] = result_df["fcf"].apply(
                lambda x: 5.0 if pd.notna(x) and x > 0 else 0.0
            )
        else:
            result_df["score_fcf_positive"] = 0.0
            
        result_df["score_cash_quality"] = (
            result_df["score_fcf_cagr"] 
            + result_df["score_cfo_pat"] 
            + result_df["score_fcf_positive"]
        )
        
        # ------------------------------
        # 3. Growth Score (20)
        # ------------------------------
        # Revenue CAGR (10) - use 5y if available, else 3y
        rev_cagr_5y_norm = "revenue_cagr_5y_norm_p10p90"
        rev_cagr_3y_norm = "revenue_cagr_3y_norm_p10p90"
        if rev_cagr_5y_norm in result_df.columns:
            result_df["score_rev_cagr"] = (result_df[rev_cagr_5y_norm].fillna(0.5) * 10)
        elif rev_cagr_3y_norm in result_df.columns:
            result_df["score_rev_cagr"] = (result_df[rev_cagr_3y_norm].fillna(0.5) * 10)
        else:
            result_df["score_rev_cagr"] = 0.0
            
        # PAT CAGR (10) - use 5y if available, else 3y
        pat_cagr_5y_norm = "pat_cagr_5y_norm_p10p90"
        pat_cagr_3y_norm = "pat_cagr_3y_norm_p10p90"
        if pat_cagr_5y_norm in result_df.columns:
            result_df["score_pat_cagr"] = (result_df[pat_cagr_5y_norm].fillna(0.5) * 10)
        elif pat_cagr_3y_norm in result_df.columns:
            result_df["score_pat_cagr"] = (result_df[pat_cagr_3y_norm].fillna(0.5) * 10)
        else:
            result_df["score_pat_cagr"] = 0.0
            
        result_df["score_growth"] = result_df["score_rev_cagr"] + result_df["score_pat_cagr"]
        
        # ------------------------------
        # 4. Leverage Score (15)
        # ------------------------------
        # Debt Score (10): lower debt -> higher score
        # Let's normalize debt_equity to 0-1 range, then invert it (1 - normalized)
        if "debt_equity" in result_df.columns:
            # Clamp debt_equity between 0 and 5.0
            result_df["debt_clamped"] = result_df["debt_equity"].apply(
                lambda x: min(max(x, 0), 5.0) if pd.notna(x) else 2.5
            )
            # Normalize to 0-1 (0: 0, 1:5.0)
            result_df["debt_normalized"] = result_df["debt_clamped"] / 5.0
            # Invert (low debt = high score)
            result_df["debt_score_normalized"] = 1.0 - result_df["debt_normalized"]
            result_df["score_debt"] = (result_df["debt_score_normalized"] * 10)
        else:
            result_df["score_debt"] = 0.0
            
        # ICR Score (5): higher ICR -> higher score
        if "icr" in result_df.columns:
            # For ICR: treat inf (debt-free) as 100%
            result_df["icr_processed"] = result_df["icr"].apply(
                lambda x: 10.0 if pd.notna(x) and x == float("inf") 
                else min(max(x, 0), 10.0) if pd.notna(x) 
                else 5.0
            )
            # Normalize to 0-1 range (0: 0, 1:10.0)
            result_df["icr_normalized"] = result_df["icr_processed"] / 10.0
            result_df["score_icr"] = (result_df["icr_normalized"] * 5)
        else:
            result_df["score_icr"] = 0.0
            
        result_df["score_leverage"] = result_df["score_debt"] + result_df["score_icr"]
        
        # ------------------------------
        # Final Composite Score
        # ------------------------------
        result_df["composite_score"] = (
            result_df["score_profitability"]
            + result_df["score_cash_quality"]
            + result_df["score_growth"]
            + result_df["score_leverage"]
        )
        
        # ------------------------------
        # Sector Relative Scoring & Ranking
        # ------------------------------
        # Normalize composite score within each sector (0-100 relative range)
        def normalize_sector_composite(group):
            non_na = group.dropna()
            if len(non_na) == 0:
                return group
            min_score = non_na.min()
            max_score = non_na.max()
            if max_score - min_score == 0:
                # All scores same, give 50
                return group.apply(lambda x: 50.0 if pd.notna(x) else None)
            # Normalize to 0-100
            normalized = ((group - min_score) / (max_score - min_score)) * 100
            return normalized
        
        if "sector" in result_df.columns and "composite_score" in result_df.columns:
            result_df["sector_relative_score"] = result_df.groupby("sector")["composite_score"].transform(normalize_sector_composite)
            
            # Create sector_quality_rank (1 = best in sector)
            result_df["sector_quality_rank"] = result_df.groupby("sector")["composite_score"].rank(ascending=False, method="min").astype("Int64")
        
        # Keep simple composite_quality_score for backward compatibility
        result_df["composite_quality_score"] = result_df.apply(
            lambda row: (
                (row["roe_percentage"] if pd.notna(row["roe_percentage"]) else 0)
                + (row["roce_percentage"] if pd.notna(row["roce_percentage"]) else 0)
                + (row["revenue_cagr_5y"] if pd.notna(row["revenue_cagr_5y"]) else 0)
                + (row["cfo_quality_score"] if pd.notna(row["cfo_quality_score"]) else 0)
                - (row["debt_equity"] if pd.notna(row["debt_equity"]) else 0)
            ),
            axis=1,
        )

        # Also keep advanced_composite_score for backward compatibility
        result_df["advanced_composite_score"] = result_df["composite_score"]

        return result_df

    @staticmethod
    def calculate_advanced_composite_score(df: pd.DataFrame) -> pd.DataFrame:
        """Backward compatibility wrapper for calculate_composite_score"""
        return ScreenerScoring.calculate_composite_score(df)
