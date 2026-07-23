import pytest
import sqlite3
import os
import sys
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.screener.engine import StockScreener


@pytest.fixture(scope='module')
def screener():
    return StockScreener()


def test_config_loading(screener):
    """Test that the config loads successfully"""
    assert screener.config is not None
    assert 'screens' in screener.config
    assert 'quality_compounder' in screener.config['screens']
    assert 'growth_accelerator' in screener.config['screens']


def test_roe_filter(screener):
    """Test that ROE min filter works correctly"""
    result = screener.run_screener(roe_min=20)
    df = pd.DataFrame(result['companies'])
    assert len(df) > 0
    assert (df['roe_percentage'] >= 20).all()


def test_debt_filter(screener):
    """Test that Debt Equity max filter works correctly"""
    result = screener.run_screener(debt_equity_max=1)
    df = pd.DataFrame(result['companies'])
    assert len(df) > 0
    non_financial = df[df['sector'] != 'Financials']
    if len(non_financial) > 0:
        assert (non_financial['debt_equity'] <= 1).all()


def test_financial_sector_exception(screener):
    """Test that financial sector companies skip D/E filter"""
    data = screener.load_financial_data()
    financial_companies = data[data['sector'] == 'Financials']
    assert len(financial_companies) > 0
    result = screener.run_screener(debt_equity_max=0.1)
    df_result = pd.DataFrame(result['companies'])
    result_financial = df_result[df_result['sector'] == 'Financials']
    assert len(result_financial) >= len(financial_companies) * 0.9


def test_icr_debt_free(screener):
    """Test that debt-free companies have infinite ICR"""
    data = screener.load_financial_data()
    debt_free = data[data['icr_label'] == 'Debt Free']
    assert len(debt_free) > 0
    assert (debt_free['icr'] == float('inf')).all()


def test_quality_preset(screener):
    """Test that the Quality Compounder preset works"""
    result = screener.run_screener('quality_compounder')
    assert result['count'] > 0
    assert 5 <= result['count'] <= 50


def test_growth_preset(screener):
    """Test that the Growth Accelerator preset works"""
    result = screener.run_screener('growth_accelerator')
    assert result['count'] > 0
    assert 5 <= result['count'] <= 50


def test_output_sorting(screener):
    """Test that the output is sorted by Score DESC (composite_score descending)"""
    result = screener.run_screener('quality_compounder')
    df = pd.DataFrame(result['companies'])
    assert len(df) > 0
    # composite_score must be present and sorted descending
    assert 'composite_score' in df.columns
    scores = df['composite_score'].dropna().tolist()
    assert scores == sorted(scores, reverse=True), "Results must be sorted by composite_score DESC"
    # Legacy column still present for backward compatibility
    sorted_df = df.sort_values('composite_quality_score', ascending=False)
    assert len(sorted_df) == len(df)
    assert sorted_df.iloc[0]['composite_quality_score'] >= sorted_df.iloc[-1]['composite_quality_score']


def test_ranked_output(screener):
    """Test that run_screener returns a ranked Company/Score table"""
    result = screener.run_screener('quality_compounder')

    # 'ranked' key must exist
    assert 'ranked' in result, "run_screener must return a 'ranked' key"

    ranked = result['ranked']
    assert isinstance(ranked, pd.DataFrame), "'ranked' must be a DataFrame"
    assert list(ranked.columns) == ['Company', 'Score'], "ranked must have columns [Company, Score]"
    assert len(ranked) == result['count'], "ranked row count must match companies count"

    # Scores must be integers, sorted descending
    assert ranked['Score'].dtype in (int, 'int64', 'Int64', object) or pd.api.types.is_integer_dtype(ranked['Score'])
    scores = ranked['Score'].tolist()
    assert scores == sorted(scores, reverse=True), "ranked must be sorted Score DESC"

    # Spot-check: top company has highest score
    if len(ranked) >= 2:
        assert ranked.iloc[0]['Score'] >= ranked.iloc[1]['Score']


def test_pipeline_order(screener):
    """
    Verify the full pipeline:
        Load Data → Apply Preset Filter → Calculate Score → Sort Score DESC → Return Result
    """
    result = screener.run_screener('quality_compounder')

    # Pipeline produced results
    assert result['count'] > 0

    # Filters were applied (quality_compounder requires roe_min=18)
    df = pd.DataFrame(result['companies'])
    assert (df['roe_percentage'] >= 18).all(), "Preset filter roe_min=18 must be applied"

    # Scores were calculated
    assert 'composite_score' in df.columns
    assert 'advanced_composite_score' in df.columns

    # Result is sorted descending by composite_score
    scores = df['composite_score'].dropna().tolist()
    assert scores == sorted(scores, reverse=True), "Pipeline must sort Score DESC"

    # ranked table is present and consistent
    ranked = result['ranked']
    assert len(ranked) == result['count']
    assert ranked.iloc[0]['Score'] == int(round(scores[0]))


def test_p10_p90_normalization(screener):
    """Test that P10/P90 normalization is calculated correctly"""
    data = screener.load_financial_data(compute_scores=True)
    assert 'roe_percentage_norm_p10p90' in data.columns
    assert 'roce_percentage_norm_p10p90' in data.columns
    # Check that normalized values are between 0 and 1
    assert (data['roe_percentage_norm_p10p90'] >= 0).all()
    assert (data['roe_percentage_norm_p10p90'] <= 1).all()


def test_sector_comparison(screener):
    """Test that sector comparison metrics are calculated"""
    data = screener.load_financial_data(compute_scores=True)
    assert 'roe_percentage_sector_mean' in data.columns
    assert 'roe_percentage_sector_median' in data.columns
    assert 'roe_percentage_vs_sector' in data.columns
    assert 'sector' in data.columns


def test_advanced_score_engine(screener):
    """Test that advanced composite score is calculated"""
    data = screener.load_financial_data(compute_scores=True)
    assert 'advanced_composite_score' in data.columns
    # Check that scores are between 0 and 100 (approx, given weights sum to 100)
    assert (data['advanced_composite_score'] >= 0).all()
    assert (data['advanced_composite_score'] <= 100).all()


def test_excel_export(screener):
    """Test that Excel export works correctly"""
    import os
    test_filename = 'test_screener_output.xlsx'
    # Clean up any existing test file
    if os.path.exists(test_filename):
        os.remove(test_filename)
    
    # Run screener and export
    result = screener.run_screener('quality_compounder', export_to_excel=True, excel_filename=test_filename)
    
    # Check export result
    assert result['excel_exported'] is True
    assert os.path.exists(test_filename)
    
    # Verify the file has content
    exported_df = pd.read_excel(test_filename, sheet_name='Screener Results')
    assert len(exported_df) > 0
    assert 'company_name' in exported_df.columns
    assert 'advanced_composite_score' in exported_df.columns
    
    # Clean up test file
    if os.path.exists(test_filename):
        os.remove(test_filename)
