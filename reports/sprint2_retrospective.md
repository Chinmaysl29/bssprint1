
# Sprint 2 Retrospective

## 1. Completed Work
- **Profitability Ratios Calculation**: Implemented Net Profit Margin, Operating Margin, ROE, ROCE, ROA, and other profitability ratios in `src/analytics/ratios.py`
- **Leverage Ratios Calculation**: Implemented Debt-to-Equity, Interest Coverage, Asset Turnover, and High Leverage Flag (with financial sector carve‑out)
- **CAGR Calculation**: Implemented multi-year CAGR (3/5/10 year) for Sales, Profit, and EPS in `src/analytics/cagr.py`
- **Cashflow KPIs**: Implemented Free Cash Flow, CFO Quality Score, Capex Intensity, FCF Conversion, and Capital Allocation Classifier in `src/analytics/cashflow_kpis.py`
- **Financial Ratios Table Update**: Updated the `financial_ratios` table with new columns for cashflow KPIs and capital allocation
- **Edge Case Logger**: Created `src/analytics/edge_case_logger.py` to log anomalies in a custom text format
- **ROE & ROCE Cross Checks**: Implemented cross checks between calculated ratios and source data from `companies` table
- **Screener Query**: Implemented a screener query to find companies with ROE >15% and D/E <1 using latest year data
- **All Tests Passed**: Ran 139 tests with zero failures

## 2. Ratio Formula Decisions
| Ratio | Formula | Notes |
|-------|---------|-------|
| **Net Profit Margin** | `(Net Profit / Sales) * 100` | Standard formula used |
| **ROE** | `(Net Profit / (Equity Capital + Reserves)) * 100` | Compared to source (companies.roe_percentage) |
| **ROCE** | `((Operating Profit + Other Income) / (Equity Capital + Reserves + Borrowings)) * 100` | Compared to source (companies.roce_percentage) |
| **Debt-to-Equity** | `Borrowings / (Equity Capital + Reserves)` | If borrowings=0, returns 0 |
| **High Leverage Flag** | `True` if D/E >5 **and** sector != 'Financials' | Carved out financial sector since they operate with higher leverage |
| **Free Cash Flow** | `Operating Activity + Investing Activity` | Negative values allowed |
| **CFO Quality Score** | 5‑year average of `(Cash from Operations / Net Profit)` | Only uses years where Net Profit !=0 |

## 3. Edge Cases
- **Scale Mismatch in Source ROE/ROCE**: Some source values (e.g., TCS) were stored as decimals instead of percentages (0.52 vs 52) — flagged as DATA_SOURCE_ISSUE
- **Constant Source Values**: Some companies had constant ROE/ROCE across all years (different calculation method) — flagged as FORMULA_DIFFERENCE
- **Duplicate Company/Year Rows**: Financial ratios table had duplicate entries per company/year — fixed with ROW_NUMBER() window function in screener and CFO quality score
- **Financial Sector Carve‑Out**: Banks/NBFC/Insurance have D/E >5 but should NOT have high_leverage_flag=True — implemented via sector check

## 4. Problems Faced
1. **Source Data Scale Mismatch**: Some source ROE/ROCE values were off by 100x (e.g., TCS source ROE = 0.52, calculated ROE = 50.94)
2. **Duplicate Rows**: The financial_ratios table (and other tables like profitandloss) had duplicate rows per company/year
3. **Null Values**: Some financial ratios had nulls, needed to handle division by zero cases
4. **Sector Check for Leverage**: Needed to check sector info from `sectors` table for leverage flag
5. **Edge Case Logging Format**: Initially used CSV format, then switched to user-requested text format

## 5. Fixes Applied
1. **Scale Mismatch Detection**: Added code to cross check if calculated ratio ~ source_ratio * 100 (or 1/100) and flag as DATA_SOURCE_ISSUE
2. **Duplicate Row Handling**: Used ROW_NUMBER() window function partitioned by company_id (and ordered by year desc) to get unique rows
3. **Division by Zero Handling**: Added checks to return None/skip if denominator == 0
4. **Sector Join**: Joined with `sectors` table in leverage functions to check company's sector
5. **Updated Edge Case Logger**: Modified `src/analytics/edge_case_logger.py` to use user-requested text format with categories

## 6. Future Improvements
- **Deduplicate Source Data**: Clean up the Excel source files to remove duplicate rows before loading
- **Normalize Ratios**: Ensure all source ratios are stored consistently (e.g., all percentages, not some as decimals)
- **Add More Cross Checks**: Extend cross checks to other ratios like ROA, Net Profit Margin, etc.
- **Visualization**: Add charts for ratios over time
- **Screener API**: Build a simple API to allow custom ratio screening
