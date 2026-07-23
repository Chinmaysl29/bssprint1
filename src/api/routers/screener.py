from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ...screener.engine import StockScreener

router = APIRouter(prefix="/screener", tags=["screener"])

# We initialize a single screener instance for the endpoint to avoid reconnecting DB constantly
screener = StockScreener()

@router.get("")
@router.get("/")
def run_screener(
    roe_min: Optional[float] = Query(None, alias="roe"),
    debt_equity_max: Optional[float] = Query(None, alias="debt_to_equity"),
    fcf_min: Optional[float] = Query(None, alias="fcf"),
    revenue_cagr_min: Optional[float] = Query(None, alias="revenue_cagr"),
    pat_cagr_min: Optional[float] = Query(None, alias="pat_cagr"),
    pe_max: Optional[float] = Query(None, alias="pe"),
    sector: Optional[str] = Query(None)
):
    """
    Screener endpoint that filters companies based on specified criteria.
    Invalid parameters natively return HTTP 400 (Validation Error) due to FastAPI type checking.
    """
    try:
        # Load the dataframe containing all financials and metrics from the engine
        df = screener.load_financial_data(compute_scores=False)
        
        # Ensure column names map correctly to our filters.
        # Based on screener.engine.load_financial_data, these columns exist:
        # "roe", "debt_equity", "fcf", "revenue_cagr_3y" (or similar), "pat_cagr_3y", "pe_ratio" (or pe), "sector"
        
        if roe_min is not None and "roe" in df.columns:
            df = df[df["roe"] >= roe_min]
            
        if debt_equity_max is not None and "debt_equity" in df.columns:
            df = df[df["debt_equity"] <= debt_equity_max]
            
        if fcf_min is not None and "fcf" in df.columns:
            df = df[df["fcf"] >= fcf_min]
            
        # Using regex/fuzzy matches for column names in case they are named like 'revenue_cagr_3y'
        if revenue_cagr_min is not None:
            rev_cols = [c for c in df.columns if "revenue_cagr" in c]
            if rev_cols:
                df = df[df[rev_cols[0]] >= revenue_cagr_min]
                
        if pat_cagr_min is not None:
            pat_cols = [c for c in df.columns if "pat_cagr" in c]
            if pat_cols:
                df = df[df[pat_cols[0]] >= pat_cagr_min]
                
        if pe_max is not None:
            pe_cols = [c for c in df.columns if "pe" in c.lower() and "ratio" in c.lower() or c == "pe"]
            if pe_cols:
                df = df[df[pe_cols[0]] <= pe_max]
                
        if sector is not None and "sector" in df.columns:
            df = df[df["sector"] == sector]
            
        # Drop NaNs for filtered criteria if desired? Actually Pandas filter drops NaNs when evaluating conditional > or < anyway.
        
        # Replace NaNs with None for JSON serialization
        df = df.where(df.notnull(), None)
        
        return df.to_dict(orient="records")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
