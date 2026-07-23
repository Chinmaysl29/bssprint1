from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional
import os
import pandas as pd
import numpy as np

from ..database import db
from ...reports.tearsheet import generate_company_tearsheet

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("")
@router.get("/")
def list_companies(
    sector: Optional[str] = None,
    market_cap: Optional[str] = None,
    search: Optional[str] = None
):
    query = """
        SELECT c.id as ticker, c.company_name as name, s.sector, c.roe_percentage as roe, c.roce_percentage as roce
        FROM companies c
        LEFT JOIN sectors s ON c.id = s.company_id
        WHERE 1=1
    """
    params = []
    
    if sector:
        query += " AND s.sector = ?"
        params.append(sector)
    if market_cap:
        query += " AND s.cap = ?"
        params.append(market_cap)
    if search:
        query += " AND c.company_name LIKE ?"
        params.append(f"%{search}%")
        
    return db.fetch_all(query, tuple(params))


@router.get("/{ticker}")
def company_profile(ticker: str):
    company = db.fetch_one("SELECT * FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    sector_info = db.fetch_one("SELECT * FROM sectors WHERE company_id = ?", (ticker,))
    analysis = db.fetch_one("SELECT * FROM analysis WHERE company_id = ?", (ticker,))
    prosandcons = db.fetch_one("SELECT * FROM prosandcons WHERE company_id = ?", (ticker,))
    
    return {
        "profile": company,
        "kpis": analysis,
        "sector": sector_info,
        "prosandcons": prosandcons
    }


def get_financial_statement(ticker: str, table: str, from_year: Optional[str], to_year: Optional[str]):
    company = db.fetch_one("SELECT id FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    query = f"SELECT * FROM {table} WHERE company_id = ?"
    params = [ticker]
    
    if from_year:
        query += " AND year >= ?"
        params.append(from_year)
    if to_year:
        query += " AND year <= ?"
        params.append(to_year)
        
    return db.fetch_all(query, tuple(params))


@router.get("/{ticker}/pl")
def company_pl(ticker: str, from_year: Optional[str] = None, to_year: Optional[str] = None):
    return get_financial_statement(ticker, "profitandloss", from_year, to_year)


@router.get("/{ticker}/bs")
def company_bs(ticker: str, from_year: Optional[str] = None, to_year: Optional[str] = None):
    return get_financial_statement(ticker, "balancesheet", from_year, to_year)


@router.get("/{ticker}/cashflow")
def company_cashflow(ticker: str, from_year: Optional[str] = None, to_year: Optional[str] = None):
    return get_financial_statement(ticker, "cashflow", from_year, to_year)


@router.get("/{ticker}/ratios")
def company_ratios(ticker: str, year: Optional[str] = None):
    company = db.fetch_one("SELECT id FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    query = "SELECT * FROM financial_ratios WHERE company_id = ?"
    params = [ticker]
    
    if year:
        query += " AND year = ?"
        params.append(year)
        
    return db.fetch_all(query, tuple(params))


def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)


@router.get("/{ticker}/tearsheet")
def download_tearsheet(ticker: str, background_tasks: BackgroundTasks):
    company = db.fetch_one("SELECT id FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "temp_pdfs")
    os.makedirs(out_dir, exist_ok=True)
    
    try:
        pdf_path = generate_company_tearsheet(ticker, out_dir=out_dir)
        if not pdf_path or not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Failed to generate tearsheet")
            
        background_tasks.add_task(remove_file, pdf_path)
        return FileResponse(pdf_path, media_type="application/pdf", filename=f"{ticker}_tearsheet.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ticker}/peers/compare")
def compare_peers(ticker: str):
    """
    Returns data for an 8-axis radar chart, including the selected company, peer average, and benchmark (Nifty average).
    """
    try:
        from ...analytics.peer import _load_latest_radar_scores, RADAR_AXES
    except ImportError:
        raise HTTPException(status_code=500, detail="Analytics module not available")
        
    try:
        scores_df = _load_latest_radar_scores()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading radar scores: {str(e)}")
        
    company_row = scores_df[scores_df["company_id"] == ticker]
    if company_row.empty:
        raise HTTPException(status_code=404, detail="Company not found in radar scores")
        
    peer_group = company_row.iloc[0].get("peer_group_name")
    
    labels = [axis[0] for axis in RADAR_AXES]
    radar_cols = [f"radar_{label}" for label in labels]
    
    selected_company_data = company_row.iloc[0][radar_cols].replace({np.nan: None}).to_dict()
    
    benchmark_data = scores_df[radar_cols].mean(numeric_only=True).replace({np.nan: None}).to_dict()
    
    peer_data = None
    if peer_group and pd.notna(peer_group):
        peer_df = scores_df[scores_df["peer_group_name"] == peer_group]
        if not peer_df.empty:
            peer_data = peer_df[radar_cols].mean(numeric_only=True).replace({np.nan: None}).to_dict()
            
    return {
        "axes": labels,
        "company": {
            "id": ticker,
            "data": selected_company_data
        },
        "peer_average": {
            "group": peer_group,
            "data": peer_data
        },
        "benchmark": {
            "name": "Nifty Average",
            "data": benchmark_data
        }
    }
