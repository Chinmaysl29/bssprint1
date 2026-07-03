
# Sprint 2 Report: Nifty 100 Financial Analytics

## Table of Contents
1. Day 1: Profitability Ratios
2. Day 2: CAGR & Leverage Ratios
3. Day 3: Cashflow KPIs & Capital Allocation
4. Day 4: Validation & Testing
5. Testing Results
6. Git Commits
7. Output Files

---

## 1. Day 1: Profitability Ratios

### Completed Tasks
- Calculated Net Profit Margin
- Calculated Operating Profit Margin
- Calculated Return on Equity (ROE)
- Calculated Return on Capital Employed (ROCE)
- Calculated Return on Assets (ROA)
- Calculated PAT to Equity & Reserve Ratio
- Calculated EBIT to (Equity + Reserve + Borrowings)
- Calculated PAT to Assets Ratio
- All profitability ratios implemented in `src/analytics/ratios.py`

### Formula References
| Ratio | Formula |
|-------|---------|
| Net Profit Margin | `(Net Profit / Sales) * 100` |
| ROE | `(Net Profit / (Equity + Reserves)) * 100` |
| ROCE | `((Operating Profit + Other Income) / (Equity + Reserves + Borrowings)) * 100` |

---

## 2. Day 2: CAGR & Leverage Ratios

### CAGR Calculations
Implemented in `src/analytics/cagr.py`:
- Multi‑year CAGR (3‑year, 5‑year, 10‑year) for:
  - Sales
  - Profit
  - EPS
- CAGR formula: `((End Value / Start Value)^(1/N) - 1) * 100`
- Handles edge cases: negative values, insufficient data, zero base value

### Leverage Ratios
Implemented in `src/analytics/ratios.py`:
| Ratio | Formula |
|-------|---------|
| Debt-to-Equity | `Borrowings / (Equity Capital + Reserves)` |
| Interest Coverage | `(Operating Profit + Other Income) / Interest` |
| Asset Turnover | `Sales / Total Assets` |

### Financial Sector Carve‑Out
- High leverage flag is **not set** for companies in "Financials" sector
- Reason: Banks and NBFCs naturally operate with higher leverage

---

## 3. Day 3: Cashflow KPIs & Capital Allocation

### Cashflow KPIs
Implemented in `src/analytics/cashflow_kpis.py`:
- Free Cash Flow (FCF): `Operating Activity + Investing Activity`
- CFO Quality Score: 5‑year average of `Cash from Operations / Net Profit`
- Capex Intensity: `(abs(Investing Activity) / Sales) * 100` with labels (<3% Asset Light, 3-8% Moderate, >8% Capital Intensive)
- FCF Conversion: `(FCF / Operating Profit) * 100`

### Capital Allocation Classifier
8-pattern classifier based on signs of CFO, CFI, and CFF, plus CFO quality score:
1. **Shareholder Returns**: CFO +, CFI -, CFF -, CFO quality >1
2. **Reinvestor**: CFO +, CFI -, CFF -, CFO quality ≤1
3. **Liquidating Assets**: CFO +, CFI +, CFF -
4. **Distress Signal**: CFO -, CFI +, CFF +
5. **Growth Funded by Debt**: CFO -, CFI -, CFF +
6. **Cash Accumulator**: CFO +, CFI +, CFF +
7. **Pre-Revenue**: CFO -, CFI -, CFF -
8. **Mixed**: All other combinations

### Files Generated
- `output/capital_allocation.csv`: Capital allocation labels per company/year

---

## 4. Day 4: Validation & Testing

### Database Validation
- **Total rows in financial_ratios**: 1,184 ≥1,100 ✅
- **All KPI columns have non-null values**: No column is 100% null ✅
- **Screener Query**: 37 companies with ROE >15% and D/E <1 (latest year) ✅ (15–50 range)

### Edge Case Logger
- File: `output/ratio_edge_cases.log`
- Log format: Custom text format with sections for each warning
- Categories: DATA_SOURCE_ISSUE, FORMULA_DIFFERENCE, VERSION_DIFFERENCE
- Logs scale mismatches (source ROE/ROCE as decimal vs calculated as percentage)

---

## 5. Testing Results
- **Total tests run**: 139
- **Tests passed**: 139 ✅
- **Tests failed**: 0 ❌
- **Test files**:
  - `tests/etl/test_data_quality.py`
  - `tests/etl/test_db_loader.py`
  - `tests/kpi/test_cagr.py`
  - `tests/kpi/test_leverage.py`
  - `tests/kpi/test_profitability.py`
  - and more...

---

## 6. Git Commits
Key commits made during Sprint 2:
1. Initial implementation of ratios.py
2. CAGR calculator implementation
3. Cashflow KPIs and capital allocation classifier
4. Populate financial_ratios with new cashflow columns
5. Edge case logger implementation
6. ROE/ROCE cross checks and categorization
7. Final validation and testing

---

## 7. Output Files
- `output/load_audit.csv`: Audit log of data loading process
- `output/capital_allocation.csv`: Capital allocation labels
- `output/ratio_edge_cases.log`: Edge cases from ROE/ROCE cross checks
- `reports/sprint2_retrospective.md`: Sprint retrospective
- `reports/Sprint2_Report.md` (this file)
