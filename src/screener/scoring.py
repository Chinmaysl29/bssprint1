
import pandas as pd


class ScreenerScoring:
    """
    Handles all scoring and normalization for the stock screener.
    """

    @staticmethod
    def calculate_p10_p90_normalization(df: pd.DataFrame) -> pd.DataFrame:
        """
        Applies P10/P90 normalization to key financial metrics.
        
        Args:
            df: DataFrame with financial data
        
        Returns:
            DataFrame with normalized metrics added (_norm_p10p90 suffix)
        """
        metrics_to_normalize = [
            "roe_percentage",
            "roce_percentage",
            "revenue_cagr_5y",
            "pat_cagr_5y",
            "eps_cagr_5y",
            "cfo_quality_score",
            "opm_percentage",
            "asset_turnover",
            "dividend_payout",
        ]

        result_df = df.copy()

        for metric in metrics_to_normalize:
            if metric not in result_df.columns:
                continue

            p10 = result_df[metric].quantile(0.10)
            p90 = result_df[metric].quantile(0.90)

            result_df[f"{metric}_norm_p10p90"] = result_df[metric].apply(
                lambda x: (
                    max(0, min(1, (x - p10) / (p90 - p10)))
                    if (p90 - p10) != 0
                    else 0.5
                )
                if pd.notna(x)
                else 0.5
            )

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
            "revenue_cagr_5y",
            "pat_cagr_5y",
            "cfo_quality_score",
            "debt_equity",
            "opm_percentage",
            "asset_turnover",
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
    def calculate_advanced_composite_score(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates advanced weighted composite score.
        
        Args:
            df: DataFrame with normalized metrics
        
        Returns:
            DataFrame with composite score added
        """
        score_weights = {
            "roe_percentage_norm_p10p90": 20,
            "roce_percentage_norm_p10p90": 20,
            "revenue_cagr_5y_norm_p10p90": 15,
            "pat_cagr_5y_norm_p10p90": 15,
            "cfo_quality_score_norm_p10p90": 15,
            "opm_percentage_norm_p10p90": 10,
            "asset_turnover_norm_p10p90": 5,
        }

        result_df = df.copy()
        result_df["advanced_composite_score"] = 0.0

        for metric, weight in score_weights.items():
            if metric in result_df.columns:
                result_df["advanced_composite_score"] += result_df[metric] * weight

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

        return result_df
