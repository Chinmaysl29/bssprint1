import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Adjust path based on your SQLite database location
DB_PATH = Path(__file__).parent.parent.parent / "data" / "nifty100.db"

class Database:
    """
    Common database layer for all API endpoints.
    Provides methods to connect, execute queries, and safely manage resources.
    """
    
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path

    def get_connection(self) -> sqlite3.Connection:
        """Creates and returns a new SQLite connection with row factory configured."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def fetch_all(self, query: str, params: Tuple = ()) -> List[Dict[str, Any]]:
        """
        Executes a SELECT query and returns all results as a list of dictionaries.
        Safely opens and closes the connection.
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def fetch_one(self, query: str, params: Tuple = ()) -> Dict[str, Any]:
        """
        Executes a SELECT query and returns the first result as a dictionary.
        Safely opens and closes the connection.
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            row = cursor.fetchone()
            return dict(row) if row else {}
        finally:
            conn.close()

    def execute(self, query: str, params: Tuple = ()) -> int:
        """
        Executes an INSERT, UPDATE, or DELETE query and commits the transaction.
        Returns the number of affected rows.
        Safely opens and closes the connection.
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount
        finally:
            conn.close()

# Singleton instance to be used across the application
db = Database()

def get_db():
    """
    FastAPI dependency that yields a direct SQLite connection.
    Closes the connection after the request is finished.
    """
    conn = db.get_connection()
    try:
        yield conn
    finally:
        conn.close()
