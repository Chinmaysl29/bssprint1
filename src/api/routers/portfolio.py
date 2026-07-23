from fastapi import APIRouter, HTTPException
import os
import pandas as pd
import numpy as np

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.get("/stats")
def get_portfolio_stats():
    """
    Returns P10, P25, P50, P75, P90 generated from the Day 1 portfolio statistics.
    """
    # Attempt to load the pre-calculated stats file from the pipeline
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    stats_file = os.path.join(base_dir, 'output', 'portfolio_stats.csv')
    
    if os.path.exists(stats_file):
        df = pd.read_csv(stats_file)
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
        
    # Fallback to computing dynamically if the file is missing
    try:
        from ...screener.engine import StockScreener
        screener = StockScreener()
        df = screener.load_financial_data(compute_scores=False)
        
        # Mapping exactly to the Day 1 KPI list used in portfolio_statistics.py
        features_map = {
            'return_on_equity_pct': 'roe_percentage' if 'roe_percentage' in df.columns else 'roe',
            'debt_to_equity': 'debt_equity',
            'revenue_cagr_5yr': 'revenue_cagr_5y',
            'fcf_cagr_5yr': 'fcf_cagr_5y',
            'operating_profit_margin_pct': 'opm_percentage' if 'opm_percentage' in df.columns else 'opm'
        }
        
        stats_rows = []
        for name, col in features_map.items():
            if col in df.columns:
                col_data = pd.to_numeric(df[col], errors='coerce').dropna()
                stats_rows.append({
                    'KPI': name,
                    'P10': round(col_data.quantile(0.10), 2) if not col_data.empty else None,
                    'P25': round(col_data.quantile(0.25), 2) if not col_data.empty else None,
                    'P50': round(col_data.quantile(0.50), 2) if not col_data.empty else None,
                    'P75': round(col_data.quantile(0.75), 2) if not col_data.empty else None,
                    'P90': round(col_data.quantile(0.90), 2) if not col_data.empty else None,
                    'Mean': round(col_data.mean(), 2) if not col_data.empty else None,
                    'Std': round(col_data.std(), 2) if not col_data.empty else None,
                })
        return stats_rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
