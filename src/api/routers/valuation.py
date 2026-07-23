from fastapi import APIRouter, HTTPException
from ..database import db

router = APIRouter(prefix="/market-cap", tags=["valuation"])

@router.get("/{ticker}")
def get_historical_valuation(ticker: str):
    """
    Returns historical valuation multiples (P/E, P/B, EV/EBITDA, Dividend Yield)
    for the specified company from 2019 to 2024.
    """
    company = db.fetch_one("SELECT id FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail=f"Company '{ticker}' not found.")
        
    query = """
        SELECT 
            year, 
            val3 as "P/E", 
            val4 as "P/B", 
            val5 as "EV/EBITDA", 
            val6 as "Dividend Yield"
        FROM market_cap
        WHERE company_id = ? AND year >= 2019 AND year <= 2024
        ORDER BY year ASC
    """
    
    results = db.fetch_all(query, (ticker,))
    for row in results:
        for k, v in row.items():
            if v is None:
                row[k] = None
                
    return results
