
import pytest
import pandas as pd
from src.etl.utils import normalize_ticker, normalize_year


def test_normalize_ticker_basic():
    assert normalize_ticker('TCS') == 'TCS'
    assert normalize_ticker('tcs') == 'TCS'
    assert normalize_ticker('  Infy  ') == 'INFY'


def test_normalize_ticker_remove_suffixes():
    assert normalize_ticker('TCS.NS') == 'TCS'
    assert normalize_ticker('infy.nse') == 'INFY'
    assert normalize_ticker('RELIANCE.BO') == 'RELIANCE'
    assert normalize_ticker('HDFC.BSE') == 'HDFC'


def test_normalize_ticker_fix_typo():
    assert normalize_ticker('AGTL') == 'ATGL'
    assert normalize_ticker('agtl') == 'ATGL'


def test_normalize_ticker_nan():
    assert pd.isna(normalize_ticker(pd.NA))
    assert pd.isna(normalize_ticker(None))


def test_normalize_ticker_empty_string():
    assert normalize_ticker('') == ''


def test_normalize_ticker_mixed():
    assert normalize_ticker('  Wipro.nse  ') == 'WIPRO'
    assert normalize_ticker('HDFCBANK') == 'HDFCBANK'


def test_normalize_year_basic():
    assert normalize_year('Mar 2023') == '2023'
    assert normalize_year('Dec 2022') == '2022'
    assert normalize_year('2021') == '2021'


def test_normalize_year_with_slashes():
    assert normalize_year('2023-03-31') == '2023'
    assert normalize_year('31/12/2022') == '2022'


def test_normalize_year_nan():
    assert pd.isna(normalize_year(pd.NA))
    assert pd.isna(normalize_year(None))


def test_normalize_year_empty_string():
    assert normalize_year('') == ''


def test_normalize_year_invalid():
    assert normalize_year('Invalid Year') == 'Invalid Year'
    assert normalize_year('No digits') == 'No digits'


def test_normalize_year_multiple_digits():
    assert normalize_year('Mar 2022, 2023') == '2022'


def test_normalize_ticker_no_change():
    assert normalize_ticker('RELIANCE') == 'RELIANCE'
    assert normalize_ticker('HDFC') == 'HDFC'


def test_normalize_year_already_normal():
    assert normalize_year('2020') == '2020'
    assert normalize_year('2019') == '2019'

