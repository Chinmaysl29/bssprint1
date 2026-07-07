
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
        series = series.copy()
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
        series = series.copy()
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
        Calculates advanced weighted composite score.
        
        Args:
            df: DataFrame with normalized metrics
            weights: Optional custom weights dict (metric -> weight)
        
        Returns:
            DataFrame with composite score added
        """
        if weights is None:
            # Default weights (sum to 100)
            weights = {
                "roe_percentage_norm_p10p90": 20,
                "roce_percentage_norm_p10p90": 20,
                "revenue_cagr_5y_norm_p10p90": 15,
                "pat_cagr_5y_norm_p10p90": 15,
                "cfo_quality_score_norm_p10p90": 15,
                "opm_percentage_norm_p10p90": 10,
                "asset_turnover_norm_p10p90": 5,
            }

        result_df = df.copy()
        result_df["composite_score"] = 0.0

        for metric, weight in weights.items():
            if metric in result_df.columns:
                result_df["composite_score"] += result_df[metric].fillna(0) * weight

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
