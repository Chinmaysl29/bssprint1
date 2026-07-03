
import pytest
import pandas as pd
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.analytics.ratios import (
    calculate_net_profit_margin,
    calculate_operating_margin,
    calculate_roe,
    calculate_roce,
    calculate_roa,
    calculate_pat_to_equity_reserve,
    calculate_ebit_to_equity_reserve_borrowings,
    calculate_pat_to_assets
)


def test_calculate_net_profit_margin():
    df = calculate_net_profit_margin()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'net_profit_margin_percent' in df.columns


def test_calculate_operating_margin():
    df = calculate_operating_margin()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'operating_margin_percent' in df.columns


def test_calculate_roe():
    df = calculate_roe()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'roe' in df.columns


def test_calculate_roce():
    df = calculate_roce()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'roce' in df.columns


def test_calculate_roa():
    df = calculate_roa()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'roa_percent' in df.columns


def test_calculate_pat_to_equity_reserve():
    df = calculate_pat_to_equity_reserve()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'pat_to_equity_reserve_percent' in df.columns


def test_calculate_ebit_to_equity_reserve_borrowings():
    df = calculate_ebit_to_equity_reserve_borrowings()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'ebit_to_eq_res_borr_percent' in df.columns
    assert 'sector' in df.columns
    # Check that Financials sector is present
    assert 'Financials' in df['sector'].unique()


def test_calculate_pat_to_assets():
    df = calculate_pat_to_assets()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'company_id' in df.columns
    assert 'company_name' in df.columns
    assert 'pat_to_assets_percent' in df.columns
