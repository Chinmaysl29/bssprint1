
import pytest
import os
import sqlite3
import tempfile
import pandas as pd
from src.etl.loader import load_data

def test_database_creation():
    # Test that the database file exists after load
    assert os.path.exists(os.path.join(os.path.dirname(__file__), '../db/nifty100.db'))

def test_table_existence():
    # Test that all required tables exist in the database
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = [
        'companies', 'profitandloss', 'balancesheet', 'cashflow',
        'analysis', 'documents', 'prosandcons', 'sectors',
        'stock_prices', 'market_cap', 'financial_ratios', 'peer_groups'
    ]
    
    for table in tables:
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}';")
        result = cursor.fetchone()
        assert result is not None, f"Table {table} should exist"
    
    conn.close()

def test_companies_count():
    # Test that companies table has 92 rows as required
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM companies;")
    count = cursor.fetchone()[0]
    assert count == 92, f"Companies should have 92 rows, got {count}"
    
    conn.close()

def test_profitandloss_count():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM profitandloss;")
    count = cursor.fetchone()[0]
    assert count == 1276, f"Profit and loss should have 1276 rows, got {count}"
    
    conn.close()

def test_balancesheet_count():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM balancesheet;")
    count = cursor.fetchone()[0]
    assert count == 1312, f"Balance sheet should have 1312 rows, got {count}"
    
    conn.close()

def test_cashflow_count():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM cashflow;")
    count = cursor.fetchone()[0]
    assert count == 1187, f"Cash flow should have 1187 rows, got {count}"
    
    conn.close()

def test_stock_prices_count():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM stock_prices;")
    count = cursor.fetchone()[0]
    assert count == 5520, f"Stock prices should have 5520 rows, got {count}"
    
    conn.close()

def test_companies_columns():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(companies);")
    columns = [col[1] for col in cursor.fetchall()]
    
    expected_columns = [
        'id', 'company_logo', 'company_name', 'chart_link', 'about_company',
        'website', 'nse_profile', 'bse_profile', 'face_value', 'book_value',
        'roce_percentage', 'roe_percentage'
    ]
    
    for col in expected_columns:
        assert col in columns, f"Column {col} should exist in companies"
    
    conn.close()

def test_profitandloss_columns():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(profitandloss);")
    columns = [col[1] for col in cursor.fetchall()]
    
    expected_columns = [
        'id', 'company_id', 'year', 'sales', 'expenses', 'operating_profit',
        'opm_percentage', 'other_income', 'interest', 'depreciation',
        'profit_before_tax', 'tax_percentage', 'net_profit', 'eps', 'dividend_payout'
    ]
    
    for col in expected_columns:
        assert col in columns, f"Column {col} should exist in profitandloss"
    
    conn.close()

def test_tcs_exists():
    # Test that TCS exists in companies table
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM companies WHERE id = 'TCS';")
    result = cursor.fetchone()
    assert result is not None, "TCS should be in companies"
    
    conn.close()

def test_infy_exists():
    # Test that INFY exists in companies table
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM companies WHERE id = 'INFY';")
    result = cursor.fetchone()
    assert result is not None, "INFY should be in companies"
    
    conn.close()

def test_reliance_exists():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM companies WHERE id = 'RELIANCE';")
    result = cursor.fetchone()
    assert result is not None, "RELIANCE should be in companies"
    
    conn.close()

def test_hdfcbank_exists():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM companies WHERE id = 'HDFCBANK';")
    result = cursor.fetchone()
    assert result is not None, "HDFCBANK should be in companies"
    
    conn.close()

def test_sbin_exists():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM companies WHERE id = 'SBIN';")
    result = cursor.fetchone()
    assert result is not None, "SBIN should be in companies"
    
    conn.close()
