
# Nifty100 Sprint 2 Day 1

This is the Sprint 2 Day 1 deliverable for the Nifty100 project, focused on building a Profitability Ratio Engine.

## Structure
- `data/`: Raw and supporting data files
- `db/`: SQLite database, schema, and exploratory queries
- `src/etl/`: Source code for data loading and quality validation
- `src/analytics/`: Profitability Ratio Engine implementation (ratios.py)
- `output/`: Load audit and validation failures
- `notebooks/`: Jupyter notebooks (as .py files)
- `tests/`: Pytest tests (119 total; including 8 new profitability ratio-specific tests in tests/kpi/)

## New Features Added (Sprint 2 Day 1)
- **Profitability Ratio Engine (`src/analytics/ratios.py`)**:
  - Net Profit Margin, Operating Margin, ROE, ROCE, ROA
  - New ratios added:
    1. PAT to Equity + Reserve
    2. EBIT to (Equity + Reserve + Borrowings)
    3. PAT to Total Assets
- **Tests**:
  - New test file: `tests/kpi/test_profitability.py` (8 specific tests for profitability ratios)
  - `tests/kpi/test_ratios.py` (tests all implemented ratios)

## Git Commit
The latest commit is `2e3dcc1` with message: "Sprint2 Day1 Profitability Ratio Engine"
