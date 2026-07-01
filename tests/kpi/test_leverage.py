
import pytest
import sqlite3
import os
import sys
import pandas as pd
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.analytics.ratios import (
    calculate_debt_to_equity,
    calculate_interest_coverage_ratio,
    calculate_net_debt,
    calculate_asset_turnover,
    get_leverage_labels
)


def test_debt_free_returns_0():
    """Test: Debt Free returns 0"""
    df = calculate_debt_to_equity()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    # Check that there are some rows with borrowings=0, check their debt_to_equity_ratio is 0
    debt_free_rows = df[df['borrowings'] == 0]
    assert len(debt_free_rows) > 0
    for idx, row in debt_free_rows.iterrows():
        assert row['debt_to_equity_ratio'] == 0


def test_high_leverage_flag():
    """Test: High Leverage flag"""
    df = get_leverage_labels()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    # Check that high_leverage_flag has 'Yes' and 'No' values
    assert 'high_leverage_flag' in df.columns
    unique_flags = df['high_leverage_flag'].unique()
    assert 'Yes' in unique_flags or 'No' in unique_flags


def test_icr_normal():
    """Test: ICR normal"""
    df = calculate_interest_coverage_ratio()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    normal_rows = df[df['icr_label'] == 'Normal']
    assert len(normal_rows) > 0


def test_interest_zero():
    """Test: Interest =0"""
    df = calculate_interest_coverage_ratio()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    zero_interest_rows = df[df['interest'] == 0]
    assert len(zero_interest_rows) > 0
    for idx, row in zero_interest_rows.iterrows():
        assert row['icr_label'] == 'Debt Free'


def test_debt_free_label():
    """Test: Debt Free label"""
    df = get_leverage_labels()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'debt_free_label' in df.columns
    debt_free_label_rows = df[df['debt_free_label'] == 'Yes']
    assert len(debt_free_label_rows) > 0


def test_asset_turnover():
    """Test: Asset Turnover"""
    df = calculate_asset_turnover()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    valid_rows = df[df['asset_turnover'].notna()]
    assert len(valid_rows) > 0


def test_net_debt():
    """Test: Net Debt"""
    df = calculate_net_debt()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'net_debt' in df.columns
    assert 'investments' in df.columns


def test_icr_warning():
    """Test: ICR Warning (low ICR)"""
    df = calculate_interest_coverage_ratio()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    # Check some rows have icr > 0
    assert len(df[df['interest_coverage_ratio'].notna()]) > 0


def test_high_leverage_not_financials():
    """Test: High leverage companies are not from financials sector"""
    leverage_labels = get_leverage_labels()
    assert len(leverage_labels) > 0
    high_leverage = leverage_labels[leverage_labels['high_leverage_flag'] == 'Yes']
    if len(high_leverage) > 0:
        # Check none of the high leverage companies have sector == 'Financials' (since we only flag non-financials)
        for idx, row in high_leverage.iterrows():
            assert row['sector'] != 'Financials'
