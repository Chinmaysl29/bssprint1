import pytest
import pandas as pd
import numpy as np
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.screener.scoring import ScreenerScoring
from src.screener.engine import StockScreener
from src.screener.exporter import export_screeners
from pathlib import Path


@pytest.fixture(scope='module')
def screener():
    return StockScreener()


@pytest.fixture(scope='module')
def sample_data():
    """Create a sample DataFrame with test data"""
    return pd.DataFrame({
        'company_id': [1, 2, 3, 4, 5],
        'company_name': ['A', 'B', 'C', 'D', 'E'],
        'sector': ['IT', 'IT', 'IT', 'Pharma', 'Pharma'],
        'roe_percentage': [10, 15, 20, 25, 100],
        'roce_percentage': [12, 18, 22, 28, 120],
        'opm_percentage': [8, 12, 16, 20, 80],
        'fcf': [100, 200, 300, 400, 500],
        'revenue_cagr_3y': [5, 10, 15, 20, 50],
        'revenue_cagr_5y': [6, 11, 16, 21, 55],
        'pat_cagr_3y': [4, 9, 14, 19, 45],
        'pat_cagr_5y': [5, 10, 15, 20, 50],
        'fcf_cagr_3y': [3, 8, 13, 18, 40],
        'fcf_cagr_5y': [4, 9, 14, 19, 45],
        'avg_cfo_pat_ratio': [0.8, 1.0, 1.2, 1.5, 2.5],
        'debt_equity': [0.5, 1.0, 1.5, 2.0, 5.0],
        'icr': [2.0, 3.0, 4.0, 5.0, float('inf')],
        'eps_cagr_5y': [3, 8, 13, 18, 35],
        'cfo_quality_score': [50, 60, 70, 80, 95],
        'asset_turnover': [0.8, 1.0, 1.2, 1.4, 1.6],
        'dividend_payout': [0.2, 0.3, 0.4, 0.5, 0.6],
    })


def test_winsorization(sample_data):
    """Test that winsorization correctly clips values at P10 and P90"""
    # Test with roe_percentage
    winsorized = ScreenerScoring.winsorize_metric(sample_data['roe_percentage'])
    
    # Original values: [10, 15, 20, 25, 100]
    # P10 = 10, P90 = 70
    assert not pd.isna(winsorized).any()
    assert winsorized.iloc[4] < 100, "Outlier should be winsorized"
    assert (winsorized >= sample_data['roe_percentage'].quantile(0.10)).all()
    assert (winsorized <= sample_data['roe_percentage'].quantile(0.90)).all()


def test_winsorization_with_na():
    """Test that winsorization handles NA values correctly"""
    data = pd.Series([10, 20, np.nan, 40, 50])
    winsorized = ScreenerScoring.winsorize_metric(data)
    assert pd.isna(winsorized.iloc[2])  # NA should remain NA


def test_normalization_p10p90(sample_data):
    """Test that P10/P90 normalization produces values between 0 and 1"""
    # First winsorize, then normalize
    sample_data['roe_winsorized'] = ScreenerScoring.winsorize_metric(sample_data['roe_percentage'])
    normalized = ScreenerScoring.normalize_metric(sample_data['roe_winsorized'], method='p10p90')
    
    assert (normalized >= 0).all()
    assert (normalized <= 1).all()


def test_score_between_0_100(sample_data):
    """Test that composite score is always between 0 and 100"""
    # Process sample data through scoring pipeline
    scored = ScreenerScoring.calculate_p10_p90_normalization(sample_data)
    scored = ScreenerScoring.calculate_composite_score(scored)
    
    assert 'composite_score' in scored.columns
    assert (scored['composite_score'] >= 0).all()
    assert (scored['composite_score'] <= 100).all()


def test_sector_relative_score(sample_data):
    """Test that sector relative scores are calculated correctly"""
    sample_data_with_score = ScreenerScoring.calculate_p10_p90_normalization(sample_data)
    sample_data_with_score = ScreenerScoring.calculate_composite_score(sample_data_with_score)
    
    assert 'sector_relative_score' in sample_data_with_score.columns
    assert 'sector_quality_rank' in sample_data_with_score.columns
    
    # Check sector_relative_score range
    assert (sample_data_with_score['sector_relative_score'] >= 0).all()
    assert (sample_data_with_score['sector_relative_score'] <= 100).all()
    
    # Check sector quality ranking
    for sector in sample_data_with_score['sector'].unique():
        sector_df = sample_data_with_score[sample_data_with_score['sector'] == sector]
        ranks = sector_df['sector_quality_rank'].tolist()
        # Ranks should be 1-based
        assert sorted(ranks) == list(range(1, len(ranks) + 1))


def test_sector_comparison_metrics(screener):
    """Test that sector comparison metrics are calculated"""
    data = screener.load_financial_data(compute_scores=True)
    
    # Check that sector metrics are present
    assert 'roe_percentage_sector_mean' in data.columns
    assert 'roe_percentage_sector_median' in data.columns
    assert 'roe_percentage_vs_sector' in data.columns
    assert 'roce_percentage_sector_mean' in data.columns
    assert 'roce_percentage_sector_median' in data.columns
    assert 'roce_percentage_vs_sector' in data.columns


def test_excel_export_with_six_sheets(screener, tmp_path):
    """Test that Excel export creates six sheets"""
    test_output = tmp_path / "test_six_sheets.xlsx"
    export_path = export_screeners(screener, output_path=str(test_output))
    
    assert export_path.exists()
    
    # Read the workbook and check sheet count
    import pandas as pd
    xl = pd.ExcelFile(export_path)
    assert len(xl.sheet_names) == 6
    xl.close()


def test_sorting_by_score(screener):
    """Test that results are sorted by composite score descending"""
    result = screener.run_screener('quality_compounder')
    df = pd.DataFrame(result['companies'])
    
    assert len(df) > 0
    assert 'composite_score' in df.columns
    
    scores = df['composite_score'].dropna().tolist()
    assert scores == sorted(scores, reverse=True)


def test_full_scoring_pipeline(screener):
    """Test the complete scoring pipeline end-to-end"""
    data = screener.load_financial_data(compute_scores=True)
    
    # Check all expected columns are present
    expected_columns = [
        'roe_percentage_winsorized', 'roe_percentage_norm_p10p90',
        'roce_percentage_winsorized', 'roce_percentage_norm_p10p90',
        'opm_percentage_winsorized', 'opm_percentage_norm_p10p90',
        'composite_score', 'sector_relative_score', 'sector_quality_rank',
    ]
    
    for col in expected_columns:
        assert col in data.columns, f"Missing expected column: {col}"
    
    # Check that all normalized scores are between 0 and 1
    for col in data.columns:
        if col.endswith('_norm_p10p90'):
            assert (data[col] >= 0).all()
            assert (data[col] <= 1).all()
