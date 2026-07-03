
import pytest
import sqlite3
import os


@pytest.fixture
def db_connection():
    db_path = os.path.join(os.path.dirname(__file__), '../../db/nifty100.db')
    conn = sqlite3.connect(db_path)
    yield conn
    conn.close()


def test_companies_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM companies;")
    count = cursor.fetchone()[0]
    assert count == 92, "Should have exactly 92 companies"


def test_stock_prices_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM stock_prices;")
    count = cursor.fetchone()[0]
    assert count == 5520, "Should have exactly 5520 stock prices"


def test_profitandloss_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM profitandloss;")
    count = cursor.fetchone()[0]
    assert count == 1276, "Should have 1276 P&L entries"


def test_balancesheet_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM balancesheet;")
    count = cursor.fetchone()[0]
    assert count == 1312, "Should have 1312 BS entries"


def test_cashflow_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM cashflow;")
    count = cursor.fetchone()[0]
    assert count == 1187, "Should have 1187 CF entries"


def test_sectors_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM sectors;")
    count = cursor.fetchone()[0]
    assert count == 92, "Should have 92 sectors entries"


def test_market_cap_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM market_cap;")
    count = cursor.fetchone()[0]
    assert count == 552, "Should have 552 market cap entries"


def test_financial_ratios_count(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM financial_ratios;")
    count = cursor.fetchone()[0]
    assert count == 1184, "Should have 1184 financial ratios entries"


def test_duplicates_companies(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT id, COUNT(*) as cnt FROM companies GROUP BY id HAVING cnt > 1;")
    results = cursor.fetchall()
    assert len(results) == 0, "No duplicate companies allowed"


def test_duplicates_profitandloss(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT id, COUNT(*) as cnt FROM profitandloss GROUP BY id HAVING cnt > 1;")
    results = cursor.fetchall()
    assert len(results) == 0, "No duplicate P&L entries allowed"


def test_duplicates_balancesheet(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT id, COUNT(*) as cnt FROM balancesheet GROUP BY id HAVING cnt > 1;")
    results = cursor.fetchall()
    assert len(results) == 0, "No duplicate BS entries allowed"


def test_duplicates_stock_prices(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT id, COUNT(*) as cnt FROM stock_prices GROUP BY id HAVING cnt > 1;")
    results = cursor.fetchall()
    assert len(results) == 0, "No duplicate stock price entries allowed"


def test_all_companies_have_sector(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(DISTINCT c.id) FROM companies c LEFT JOIN sectors s ON c.id = s.company_id WHERE s.company_id IS NULL;")
    count = cursor.fetchone()[0]
    assert count == 0, "All companies should have a sector"


def test_companies_have_roe(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM companies WHERE roe_percentage IS NOT NULL;")
    count = cursor.fetchone()[0]
    assert count > 0, "Some companies should have ROE"

