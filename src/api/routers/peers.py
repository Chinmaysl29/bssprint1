from fastapi import APIRouter, HTTPException
from ..database import db

router = APIRouter(prefix="/peers", tags=["peers"])

@router.get("/{group}")
def get_peers(group: str):
    """
    Returns peer companies in a specific group along with their percentile rankings.
    """
    companies = db.fetch_all("SELECT company_id, is_primary FROM peer_groups WHERE group_name = ?", (group,))
    if not companies:
        raise HTTPException(status_code=404, detail=f"Peer group '{group}' not found")
        
    company_ids = [c["company_id"] for c in companies]
    placeholders = ",".join(["?"] * len(company_ids))
    
    percentiles_query = f"SELECT * FROM peer_percentiles WHERE company_id IN ({placeholders})"
    percentiles = db.fetch_all(percentiles_query, tuple(company_ids))
    
    return {
        "group": group,
        "companies": companies,
        "percentiles": percentiles
    }
