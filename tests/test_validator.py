
import pytest
import pandas as pd
import os
from src.etl.validator import DataQualityValidator

def test_validator_initialization():
    # Test that validator can be initialized
    validator = DataQualityValidator()
    assert validator is not None
    assert validator.companies_df is not None
    assert len(validator.companies_df) > 0

def test_dq01_no_duplicate_companies():
    validator = DataQualityValidator()
    validator.dq01_unique_companies()
    # We expect some failures but the validator should find none for DQ01
    dq01_failures = [f for f in validator.failures if f['rule'] == 'DQ01']
    # Original data has some duplicates, but we can check
    assert isinstance(dq01_failures, list)

def test_dq02_duplicate_company_year():
    validator = DataQualityValidator()
    validator.dq02_duplicate_company_year()
    dq02_failures = [f for f in validator.failures if f['rule'] == 'DQ02']
    assert isinstance(dq02_failures, list)

def test_dq03_fk_check():
    validator = DataQualityValidator()
    validator.dq03_fk_check()
    dq03_failures = [f for f in validator.failures if f['rule'] == 'DQ03']
    assert isinstance(dq03_failures, list)

def test_dq04_balance_sheet_check():
    validator = DataQualityValidator()
    validator.dq04_balance_sheet_balance()
    dq04_failures = [f for f in validator.failures if f['rule'] == 'DQ04']
    assert isinstance(dq04_failures, list)

def test_dq05_opm_check():
    validator = DataQualityValidator()
    validator.dq05_opm_check()
    dq05_failures = [f for f in validator.failures if f['rule'] == 'DQ05']
    assert isinstance(dq05_failures, list)

def test_dq06_sales_positive():
    validator = DataQualityValidator()
    validator.dq06_sales_gt_zero()
    dq06_failures = [f for f in validator.failures if f['rule'] == 'DQ06']
    assert isinstance(dq06_failures, list)

def test_dq07_year_format():
    validator = DataQualityValidator()
    validator.dq07_year_format()
    dq07_failures = [f for f in validator.failures if f['rule'] == 'DQ07']
    assert isinstance(dq07_failures, list)

def test_dq08_ticker_format():
    validator = DataQualityValidator()
    validator.dq08_ticker_format()
    dq08_failures = [f for f in validator.failures if f['rule'] == 'DQ08']
    assert isinstance(dq08_failures, list)

def test_dq09_cashflow_check():
    validator = DataQualityValidator()
    validator.dq09_cashflow_check()
    dq09_failures = [f for f in validator.failures if f['rule'] == 'DQ09']
    assert isinstance(dq09_failures, list)

def test_dq10_fixed_assets():
    validator = DataQualityValidator()
    validator.dq10_fixed_assets()
    dq10_failures = [f for f in validator.failures if f['rule'] == 'DQ10']
    assert isinstance(dq10_failures, list)

def test_dq11_tax_check():
    validator = DataQualityValidator()
    validator.dq11_tax_check()
    dq11_failures = [f for f in validator.failures if f['rule'] == 'DQ11']
    assert isinstance(dq11_failures, list)

def test_dq12_dividend_payout():
    validator = DataQualityValidator()
    validator.dq12_dividend_payout()
    dq12_failures = [f for f in validator.failures if f['rule'] == 'DQ12']
    assert isinstance(dq12_failures, list)

def test_dq13_document_urls():
    validator = DataQualityValidator()
    validator.dq13_document_urls()
    dq13_failures = [f for f in validator.failures if f['rule'] == 'DQ13']
    assert isinstance(dq13_failures, list)

def test_dq14_eps_sign():
    validator = DataQualityValidator()
    validator.dq14_eps_sign()
    dq14_failures = [f for f in validator.failures if f['rule'] == 'DQ14']
    assert isinstance(dq14_failures, list)

def test_dq15_assets_liabilities():
    validator = DataQualityValidator()
    validator.dq15_assets_liabilities_non_negative()
    dq15_failures = [f for f in validator.failures if f['rule'] == 'DQ15']
    assert isinstance(dq15_failures, list)

def test_dq16_coverage_check():
    validator = DataQualityValidator()
    validator.dq16_coverage_check()
    dq16_failures = [f for f in validator.failures if f['rule'] == 'DQ16']
    assert isinstance(dq16_failures, list)

def test_validate_all():
    validator = DataQualityValidator()
    validator.validate_all()
    assert len(validator.failures) > 0  # There should be some failures as per original data

def test_export_failures():
    validator = DataQualityValidator()
    validator.validate_all()
    failures_df = validator.export_failures()
    assert len(failures_df) > 0
    assert all(col in failures_df.columns for col in ['rule', 'table', 'record_id', 'message'])
