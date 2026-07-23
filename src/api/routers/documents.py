from fastapi import APIRouter, HTTPException
from urllib.parse import urlparse
from ..database import db

# We use the /companies prefix because the endpoint is /companies/{ticker}/documents
router = APIRouter(prefix="/companies", tags=["documents"])

def is_url_valid(url: str) -> bool:
    """
    Validates if a string is a properly formed URL.
    """
    if not url or str(url).strip().lower() in ('null', 'nan', 'n/a', 'none', ''):
        return False
    try:
        result = urlparse(str(url).strip())
        # A valid URL must have a scheme (http/https) and a netloc (domain)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

@router.get("/{ticker}/documents")
def get_company_documents(ticker: str):
    """
    Returns valid annual report links for a company.
    Validates each link using is_url_valid().
    """
    # Verify the company exists
    company = db.fetch_one("SELECT id FROM companies WHERE id = ?", (ticker,))
    if not company:
        raise HTTPException(status_code=404, detail=f"Company '{ticker}' not found.")
        
    query = """
        SELECT Year as year, Annual_Report as url
        FROM documents
        WHERE company_id = ?
        ORDER BY year DESC
    """
    
    results = db.fetch_all(query, (ticker,))
    
    documents = []
    for row in results:
        url = row.get("url")
        # Only return records that have a valid URL
        if is_url_valid(url):
            documents.append({
                "year": row.get("year"),
                "url": str(url).strip()
            })
            
    return documents
