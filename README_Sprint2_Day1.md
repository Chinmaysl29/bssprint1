# Nifty100 Sprint 2 Day 1

This is the Sprint 2 Day 1 deliverable for the Nifty100 project, focused on building a Profitability Ratio Engine.

## Project Repository
https://github.com/Chinmaysl29/bssprint1.git

## Structure
- `data/`: Raw and supporting data files
- `db/`: SQLite database, schema, and exploratory queries
- `src/etl/`: Source code for data loading and quality validation
- `src/analytics/`: Profitability Ratio Engine implementation (`ratios.py`)
- `output/`: Load audit and validation failures
- `notebooks/`: Jupyter notebooks (as .py files)
- `tests/`: Pytest tests (119 total; including 8 new profitability ratio-specific tests in `tests/kpi/`)

## New Features Added (Sprint 2 Day 1)
### Profitability Ratio Engine (`src/analytics/ratios.py`):
- Net Profit Margin, Operating Margin, ROE, ROCE, ROA
- New ratios added:
  1. **PAT to Equity + Reserve**: (Net Profit / (Equity Capital + Reserves)) × 100. Returns None if Equity + Reserve ≤ 0
  2. **EBIT to (Equity + Reserve + Borrowings)**: (Operating Profit + Other Income) / (Equity Capital + Reserves + Borrowings) × 100. For Financials sector companies, only calculated (no benchmark comparison)
  3. **PAT to Total Assets**: (Net Profit / Total Assets) × 100. Returns None if Assets ≤ 0
- Each ratio returns a pandas DataFrame sorted by the ratio descending

### Tests:
- New test file: `tests/kpi/test_profitability.py` – includes exactly 8 specific tests for profitability ratios
  1. Test 1 – Normal Net Profit Margin
  2. Test 2 – Sales = 0, Expect None
  3. Test 3 – Normal ROE
  4. Test 4 – Negative Equity, Expect None
  5. Test 5 – Normal ROCE
  6. Test 6 – Financial Company ROCE
  7. Test 7 – Normal ROA
  8. Test 8 – OPM mismatch detection
- `tests/kpi/test_ratios.py` – tests all implemented ratios

## Git Commit History
1. `2e3dcc1` – Initial commit of Profitability Ratio Engine
2. `8d2db4d` – (Reverted) Updated README.md
3. Latest state: Working tree clean, with original Sprint1 README.md restored

## Running the Ratio Engine
To run all ratio calculations:
```bash
cd src/analytics
python ratios.py
```

To run all tests:
```bash
python -m pytest tests/ -v
```
To run only profitability tests:
```bash
python -m pytest tests/kpi/test_profitability.py -v
```

