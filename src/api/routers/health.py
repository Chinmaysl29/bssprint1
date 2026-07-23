import time
from fastapi import APIRouter
from ..database import db

router = APIRouter(prefix="/health", tags=["health"])

# Record the time when the module is loaded (app startup)
START_TIME = time.time()

@router.get("")
@router.get("/")
def health_check():
    """
    Health check endpoint to verify API and database status.
    Returns version, uptime, and row counts for all database tables.
    """
    uptime_seconds = int(time.time() - START_TIME)
    
    db_row_counts = {}
    status = "ok"
    
    try:
        # Fetch all table names from SQLite
        tables_query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
        tables = db.fetch_all(tables_query)
        
        # Count rows for each table
        for row in tables:
            table_name = row['name']
            count_query = f"SELECT COUNT(*) as count FROM {table_name}"
            count_result = db.fetch_one(count_query)
            db_row_counts[table_name] = count_result['count'] if count_result else 0
            
    except Exception as e:
        status = f"error: {str(e)}"
        
    return {
        "status": status,
        "version": "1.0.0",
        "uptime_seconds": uptime_seconds,
        "db_row_counts": db_row_counts
    }

@router.get("/schema")
def get_schema():
    query = "SELECT sql FROM sqlite_master WHERE type='table';"
    tables = db.fetch_all(query)
    return {"schema": [t['sql'] for t in tables]}
