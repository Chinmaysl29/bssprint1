
import pytest
import pandas as pd
import os

def test_load_audit_exists():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    assert os.path.exists(audit_path), "load_audit.csv should exist"

def test_load_audit_columns():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    expected_columns = ['Table', 'Rows in', 'Rows loaded', 'Rejected', 'Runtime (s)', 'Timestamp']
    for col in expected_columns:
        assert col in df.columns, f"Column {col} should exist in load_audit"

def test_load_audit_tables():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    tables = df['Table'].tolist()
    required_tables = ['companies', 'profitandloss', 'balancesheet', 'cashflow']
    for table in required_tables:
        assert table in tables, f"Table {table} should be in load_audit"

def test_load_audit_companies_count():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    companies_row = df[df['Table'] == 'companies']
    assert len(companies_row) == 1, "Should have one row for companies"
    assert companies_row['Rows in'].iloc[0] == 92, "Companies should have 92 rows in"
    assert companies_row['Rows loaded'].iloc[0] == 92, "Companies should have 92 rows loaded"

def test_load_audit_profitandloss_count():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    row = df[df['Table'] == 'profitandloss']
    assert len(row) == 1
    assert row['Rows in'].iloc[0] == 1276
    assert row['Rows loaded'].iloc[0] == 1276

def test_load_audit_balancesheet_count():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    row = df[df['Table'] == 'balancesheet']
    assert len(row) == 1
    assert row['Rows in'].iloc[0] == 1312
    assert row['Rows loaded'].iloc[0] == 1312

def test_load_audit_cashflow_count():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    row = df[df['Table'] == 'cashflow']
    assert len(row) == 1
    assert row['Rows in'].iloc[0] == 1187
    assert row['Rows loaded'].iloc[0] == 1187

def test_load_audit_stock_prices_count():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    row = df[df['Table'] == 'stock_prices']
    assert len(row) == 1
    assert row['Rows in'].iloc[0] == 5520
    assert row['Rows loaded'].iloc[0] == 5520

def test_load_audit_no_rejections():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    assert df['Rejected'].sum() == 0, "No rows should be rejected"

def test_load_audit_timestamps():
    audit_path = os.path.join(os.path.dirname(__file__), '../output/load_audit.csv')
    df = pd.read_csv(audit_path)
    assert not df['Timestamp'].isna().any(), "All timestamps should be filled"
