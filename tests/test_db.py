
import pytest
import sqlite3
import os

def test_exploratory_query_1_top_roe():
    # Test that top ROE query returns rows
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, company_name, roe_percentage FROM companies WHERE roe_percentage IS NOT NULL ORDER BY roe_percentage DESC LIMIT 10;")
    results = cursor.fetchall()
    assert len(results) == 10, "Should get top 10 companies by ROE"
    
    conn.close()

def test_exploratory_query_2_debt_free():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT c.id, c.company_name FROM companies c JOIN balancesheet bs ON c.id = bs.company_id WHERE bs.borrowings = 0;")
    results = cursor.fetchall()
    assert len(results) >= 0, "Query should run without errors"
    
    conn.close()

def test_exploratory_query_3_sector_count():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT sector, COUNT(DISTINCT company_id) as company_count FROM sectors GROUP BY sector ORDER BY company_count DESC;")
    results = cursor.fetchall()
    assert len(results) > 0, "Should have some sectors"
    
    conn.close()

def test_exploratory_query_4_fcf_positive():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT company_id, ROUND(operating_activity + investing_activity, 2) as fcf FROM cashflow WHERE (operating_activity + investing_activity) > 0 ORDER BY fcf DESC LIMIT 20;")
    results = cursor.fetchall()
    assert len(results) >= 0, "Query should run without errors"
    
    conn.close()

def test_exploratory_query_5_peer_groups():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT group_name, COUNT(company_id) as company_count FROM peer_groups GROUP BY group_name ORDER BY company_count DESC;")
    results = cursor.fetchall()
    assert len(results) > 0, "Should have peer groups"
    
    conn.close()

def test_exploratory_query_6_null_values():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT SUM(CASE WHEN company_logo IS NULL THEN 1 ELSE 0 END) as null_logo, SUM(CASE WHEN website IS NULL THEN 1 ELSE 0 END) as null_website FROM companies;")
    results = cursor.fetchone()
    assert results is not None, "Should return null counts"
    
    conn.close()

def test_exploratory_query_7_year_distribution():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT year, COUNT(*) as record_count FROM profitandloss GROUP BY year ORDER BY year;")
    results = cursor.fetchall()
    assert len(results) > 0, "Should have year distribution"
    
    conn.close()

def test_exploratory_query_8_interest_coverage():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT p.company_id, p.year, CASE WHEN p.interest > 0 THEN ROUND(p.profit_before_tax / p.interest, 2) ELSE NULL END as interest_coverage FROM profitandloss p WHERE p.interest > 0 AND p.profit_before_tax / p.interest < 1 ORDER BY interest_coverage ASC;")
    results = cursor.fetchall()
    assert len(results) >= 0, "Query should run without errors"
    
    conn.close()

def test_exploratory_query_9_latest_entries():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT c.id, c.company_name, pl.year as latest_pl_year, bs.year as latest_bs_year, cf.year as latest_cf_year FROM companies c LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM profitandloss GROUP BY company_id) pl_max ON c.id = pl_max.company_id LEFT JOIN profitandloss pl ON pl_max.company_id = pl.company_id AND pl_max.latest_id = pl.id LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM balancesheet GROUP BY company_id) bs_max ON c.id = bs_max.company_id LEFT JOIN balancesheet bs ON bs_max.company_id = bs.company_id AND bs_max.latest_id = bs.id LEFT JOIN (SELECT company_id, MAX(id) as latest_id FROM cashflow GROUP BY company_id) cf_max ON c.id = cf_max.company_id LEFT JOIN cashflow cf ON cf_max.company_id = cf.company_id AND cf_max.latest_id = cf.id ORDER BY c.id;")
    results = cursor.fetchall()
    assert len(results) > 0, "Should have latest entries"
    
    conn.close()

def test_exploratory_query_10_missing_urls():
    db_path = os.path.join(os.path.dirname(__file__), '../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT d.company_id, c.company_name FROM documents d JOIN companies c ON d.company_id = c.id WHERE d.Annual_Report IS NULL OR d.Annual_Report = 'Null' OR d.Annual_Report = '';")
    results = cursor.fetchall()
    assert len(results) >= 0, "Query should run without errors"
    
    conn.close()
