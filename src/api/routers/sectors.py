from fastapi import APIRouter, HTTPException
import numpy as np

from ...screener.engine import StockScreener
from ..database import db

router = APIRouter(prefix="/sectors", tags=["sectors"])
screener = StockScreener()

@router.get("")
@router.get("/")
def get_sectors():
    """
    Returns a summary of all sectors, including:
    - Company count
    - Median ROE
    - Median PE
    - Median D/E (Debt-to-Equity)
    """
    try:
        df = screener.load_financial_data(compute_scores=False)
        
        # Identify exact column names from the screener DataFrame
        roe_col = "roe_percentage" if "roe_percentage" in df.columns else "roe" if "roe" in df.columns else None
        
        # Group by sector and aggregate
        agg_funcs = {"company_id": "count"}
        if roe_col:
            agg_funcs[roe_col] = "median"
        if "pe" in df.columns:
            agg_funcs["pe"] = "median"
        if "debt_equity" in df.columns:
            agg_funcs["debt_equity"] = "median"
            
        summary = df.groupby("sector").agg(agg_funcs).reset_index()
        
        # Rename columns to match the required output names closely
        rename_map = {
            "company_id": "company_count",
            roe_col: "median_roe",
            "pe": "median_pe",
            "debt_equity": "median_de"
        }
        summary = summary.rename(columns=rename_map)
        
        # Replace NaN with None for valid JSON serialization
        summary = summary.replace({np.nan: None})
        
        return summary.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{sector}/companies")
def get_sector_companies(sector: str):
    """
    Returns companies within the selected sector.
    Returns HTTP 404 if the sector is unknown (or empty).
    """
    query = """
        SELECT c.id as ticker, c.company_name as name, s.sector, c.roe_percentage as roe, c.roce_percentage as roce
        FROM companies c
        JOIN sectors s ON c.id = s.company_id
        WHERE s.sector = ?
    """
    companies = db.fetch_all(query, (sector,))
    
    if not companies:
        raise HTTPException(status_code=404, detail=f"Sector '{sector}' not found or has no companies.")
        
    return companies
