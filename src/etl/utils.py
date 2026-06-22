
import pandas as pd


def normalize_ticker(ticker):
    """Normalize ticker: strip whitespace, convert to uppercase, remove suffixes like .ns, .nse, .bo, etc., and fix typos."""
    if pd.isna(ticker):
        return ticker
    ticker_str = str(ticker).strip().upper()
    suffixes = ['.NS', '.NSE', '.BO', '.BSE']
    for suffix in suffixes:
        if ticker_str.endswith(suffix):
            ticker_str = ticker_str[:-len(suffix)]
    # Fix known typos
    typo_map = {
        'AGTL': 'ATGL'
    }
    return typo_map.get(ticker_str, ticker_str)


def normalize_year(year_str):
    """Extract and normalize year from string like 'Mar 2023' → '2023'"""
    if pd.isna(year_str):
        return year_str
    import re
    match = re.search(r'(\d{4})', str(year_str))
    if match:
        return match.group(1)
    return year_str

