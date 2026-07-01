
import pytest
import sqlite3
import os
import sys
import pandas as pd
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.analytics.cagr import (
    calculate_cagr,
    calculate_cagr_for_metric,
    calculate_multiyear_sales_cagr,
    calculate_multiyear_profit_cagr,
    calculate_multiyear_eps_cagr,
    pivot_multiyear_cagr
)


def test_normal_cagr():
    """Test: Normal CAGR (positive to positive)"""
    result = calculate_cagr(100, 200, 1)
    assert result is not None
    assert abs(result - 1.0) < 0.001  # 100% growth


def test_positive_to_negative():
    """Test: Positive → Negative - check logic with synthetic data"""
    # Create test dataframe
    test_data = [
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2022', 'net_profit': 100},
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2023', 'net_profit': -50}
    ]
    test_df = pd.DataFrame(test_data)
    cagr_df = calculate_cagr_for_metric(test_df, 'net_profit')
    assert len(cagr_df) == 1
    assert cagr_df.iloc[0]['flag'] == 'DECLINE_TO_LOSS'
    assert pd.isna(cagr_df.iloc[0]['net_profit_cagr_pct'])


def test_negative_to_positive():
    """Test: Negative → Positive - check logic with synthetic data"""
    # Create test dataframe
    test_data = [
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2022', 'net_profit': -100},
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2023', 'net_profit': 50}
    ]
    test_df = pd.DataFrame(test_data)
    cagr_df = calculate_cagr_for_metric(test_df, 'net_profit')
    assert len(cagr_df) == 1
    assert cagr_df.iloc[0]['flag'] == 'TURNAROUND'
    assert pd.isna(cagr_df.iloc[0]['net_profit_cagr_pct'])


def test_negative_to_negative():
    """Test: Negative → Negative - check logic with synthetic data"""
    # Create test dataframe
    test_data = [
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2022', 'net_profit': -100},
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2023', 'net_profit': -50}
    ]
    test_df = pd.DataFrame(test_data)
    cagr_df = calculate_cagr_for_metric(test_df, 'net_profit')
    assert len(cagr_df) == 1
    assert cagr_df.iloc[0]['flag'] == 'BOTH_NEGATIVE'
    assert pd.isna(cagr_df.iloc[0]['net_profit_cagr_pct'])


def test_zero_base():
    """Test: Zero Base - check logic with synthetic data"""
    # Create test dataframe
    test_data = [
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2022', 'net_profit': 0},
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2023', 'net_profit': 50}
    ]
    test_df = pd.DataFrame(test_data)
    cagr_df = calculate_cagr_for_metric(test_df, 'net_profit')
    assert len(cagr_df) == 1
    assert cagr_df.iloc[0]['flag'] == 'ZERO_BASE'
    assert pd.isna(cagr_df.iloc[0]['net_profit_cagr_pct'])


def test_insufficient_data():
    """Test: Insufficient Data - check logic with synthetic data"""
    # Create test dataframe with only 2 years of data, ask for period of 2 (needs 3 years)
    test_data = [
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2022', 'sales': 100},
        {'company_id': 'TEST', 'company_name': 'Test Company', 'year': '2023', 'sales': 150}
    ]
    test_df = pd.DataFrame(test_data)
    cagr_df = calculate_cagr_for_metric(test_df, 'sales', period_years=2)  # needs period_years + 1 years of data
    assert len(cagr_df) == 1
    assert cagr_df.iloc[0]['flag'] == 'INSUFFICIENT'
    assert pd.isna(cagr_df.iloc[0]['sales_cagr_pct'])


def test_revenue_cagr():
    """Test: Revenue (Sales) CAGR"""
    df = calculate_multiyear_sales_cagr()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'sales_cagr_pct' in df.columns


def test_pat_cagr():
    """Test: PAT (Net Profit) CAGR"""
    df = calculate_multiyear_profit_cagr()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'net_profit_cagr_pct' in df.columns


def test_eps_cagr():
    """Test: EPS CAGR"""
    df = calculate_multiyear_eps_cagr()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'eps_cagr_pct' in df.columns


def test_flag_validation():
    """Test: Flag validation"""
    sales_cagr = calculate_multiyear_sales_cagr()
    # All flags should be one of our expected values
    allowed_flags = ['OK', 'DECLINE_TO_LOSS', 'TURNAROUND', 'BOTH_NEGATIVE', 'ZERO_BASE', 'INSUFFICIENT']
    for idx, row in sales_cagr.iterrows():
        assert row['flag'] in allowed_flags


def test_pivot_multiyear_cagr():
    """Test: Pivot multiyear CAGR"""
    sales_cagr = calculate_multiyear_sales_cagr()
    pivot_df = pivot_multiyear_cagr(sales_cagr, 'sales')
    assert isinstance(pivot_df, pd.DataFrame)
    assert len(pivot_df) > 0
    # Check that pivot has expected columns
    assert '3-Year_cagr_pct' in pivot_df.columns
    assert '3-Year_flag' in pivot_df.columns
    assert '5-Year_cagr_pct' in pivot_df.columns
    assert '5-Year_flag' in pivot_df.columns
    assert '10-Year_cagr_pct' in pivot_df.columns
    assert '10-Year_flag' in pivot_df.columns
