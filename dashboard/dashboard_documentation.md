
# NIFTY100 Financial Analytics Dashboard - Documentation

## Overview
This Power BI dashboard visualizes all Sprint 2 achievements, covering:
- Profitability Ratio Engine
- Leverage Analysis
- CAGR Growth Engine
- Cash Flow Intelligence
- Capital Allocation Analysis
- Financial Quality Ranking
- Sector Comparison
- KPI Performance Dashboard

---

## Architecture

```text
ETL
  ↓
Analytics
  ↓
Screener
  ↓
Dashboard
  ↓
Valuation
```

### Flow Summary
- **ETL** loads raw and supporting datasets into `db/nifty100.db`.
- **Analytics** calculates profitability, leverage, CAGR, cash flow, peer, and valuation metrics.
- **Screener** ranks companies using configured quality, growth, value, dividend, and debt screens.
- **Dashboard** presents company, sector, peer, trend, capital allocation, and report views.
- **Valuation** exports `valuation_summary.xlsx` and `valuation_flags.csv` for dashboard cards, summary tables, and download workflows.

---

## Data Sources
1. **SQLite Database**: `db/nifty100.db`
   - Tables:
     - `companies`: Company details including sector mapping
     - `profitandloss`: Profit &amp; loss statement data
     - `balancesheet`: Balance sheet data
     - `cashflow`: Cash flow statement data
     - `financial_ratios`: Precomputed financial ratios
     - `sectors`: Sector definitions and mappings
2. **CSV File**: `output/capital_allocation.csv`
   - Capital allocation pattern labels for each company/year

---

## Data Model (Star Schema)

### Relationships
| From Table | To Table | From Column | To Column | Cardinality |
|------------|----------|-------------|-----------|-------------|
| sectors | companies | sector | sector | 1-to-many |
| companies | financial_ratios | company_id | company_id | 1-to-many |
| companies | profitandloss | company_id | company_id | 1-to-many |
| companies | balancesheet | company_id | company_id | 1-to-many |
| companies | cashflow | company_id | company_id | 1-to-many |

---

## DAX Measures

1. **Total Companies**
   ```dax
   Total Companies = COUNT(companies[company_id])
   ```

2. **Average ROE**
   ```dax
   Average ROE = AVERAGE(financial_ratios[ratio3]) -- ratio3 maps to ROE
   ```

3. **Average ROCE**
   ```dax
   Average ROCE = AVERAGE(financial_ratios[ratio1]) -- ratio1 maps to ROCE
   ```

4. **Average Net Profit Margin**
   ```dax
   Average Net Profit Margin = AVERAGE(financial_ratios[ratio11]) -- ratio11 maps to Net Profit Margin
   ```

5. **Average Debt Equity**
   ```dax
   Average Debt Equity = AVERAGE(financial_ratios[ratio4]) -- ratio4 maps to Debt-to-Equity
   ```

6. **Quality Score**
   ```dax
   Quality Score = 
     (AVERAGE(financial_ratios[ratio3]) * 0.25) +  -- ROE weight
     (AVERAGE(financial_ratios[ratio1]) * 0.25) +  -- ROCE weight
     (AVERAGE(financial_ratios[ratio7]) * 0.20) +  -- CAGR weight
     ((10 - AVERAGE(financial_ratios[ratio4])) * 0.15) +  -- Debt Ratio weight (lower is better)
     (AVERAGE(financial_ratios[cfo_quality_score]) * 0.15)  -- Cashflow Quality weight
   ```

---

## Dashboard Pages

### Page 1: Executive Overview
- **Title**: "NIFTY100 Financial Intelligence Dashboard"
- **KPIs**:
  - Total Companies
  - Average ROE %
  - Average ROCE %
  - Average Revenue CAGR %
  - Average Net Profit Margin %
  - Average Debt Equity
- **Charts**:
  1. Sector Distribution (Donut Chart)
  2. Top 10 Companies by Quality Score (Horizontal Bar Chart)
  3. ROE vs ROCE (Scatter Plot)
  4. Financial Performance Trend (Line Chart)
- **Filters**: Sector, Company, Year

### Page 2: Profitability Analytics
- **KPIs**: Net Profit Margin, Operating Margin, ROE, ROCE, ROA
- **Charts**:
  1. Top 15 Companies by ROE (Bar Chart)
  2. ROCE Comparison by Sector (Column Chart)
  3. Profit Margin Distribution (Histogram)
  4. ROE vs Net Profit Margin (Scatter Chart)
- **Conditional Formatting**: Green (high performers), Red (weak performers)

### Page 3: Leverage &amp; Risk Dashboard
- **KPIs**: Debt-to-Equity, Interest Coverage Ratio, Net Debt, Asset Turnover
- **Visuals**:
  1. Debt Equity Ranking (Bar Chart)
  2. High Leverage Companies (Table)
  3. Debt Free Companies (Card + Table)
  4. ICR Risk Companies (Warning Table)
- **Note**: Financial sector companies are separately grouped

### Page 4: CAGR Growth Engine
- **Visualize**: Revenue CAGR, PAT CAGR, EPS CAGR
- **Visuals**:
  1. Revenue CAGR Top Companies (Bar Chart)
  2. Growth Comparison (Line Chart)
  3. CAGR Heatmap
  4. Turnaround Companies (Table)
- **CAGR Flags**: OK, TURNAROUND, DECLINE_TO_LOSS, ZERO_BASE

### Page 5: Cash Flow Intelligence
- **Visualize**: Free Cash Flow, CFO Quality Score, CapEx Intensity, FCF Conversion
- **Visuals**:
  1. Best Cash Generating Companies (Bar Chart)
  2. CFO Quality Distribution (Chart)
  3. Asset Light vs Capital Intensive (Chart)
  4. Cash Flow Trend (Line Chart)

### Page 6: Capital Allocation Dashboard
- **Use**: `output/capital_allocation.csv`
- **Patterns**: Reinvestor, Shareholder Returns, Liquidating Assets, Distress Signal, Growth Funded by Debt, Cash Accumulator, Pre-Revenue, Mixed
- **Visuals**:
  1. Pattern Distribution (Donut Chart)
  2. Company Allocation Table (Table)
  3. Sector vs Pattern Heatmap (Heatmap)

### Page 7: Quality Scoring Dashboard
- **Scoring Criteria**: ROE, ROCE, Profit Margin, Revenue CAGR, PAT CAGR, Debt Control, Cash Quality
- **Visuals**:
  1. Top 20 Quality Companies (Bar Chart)
  2. Investment Quality Matrix
  3. Risk vs Return Scatter (Scatter Plot)
  4. Sector Leaders (Table)

### Page 8: Data Quality &amp; Sprint Summary
- **Sprint 2 Completion Dashboard**
- **Cards**:
  - KPIs Created
  - Companies Processed
  - Rows Generated
  - Tests Passed
- **Validation**:
  - financial_ratios rows &gt;= 1100
  - 139 tests passed, 0 failures
- **ratio_edge_cases.log summary**

---

## Dashboard Design Theme
- **Background**: Dark navy (#0F172A)
- **Primary**: Blue (#2563EB)
- **Positive**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Negative**: Red (#EF4444)
- **Style**: Modern cards, rounded visuals, clean spacing, professional finance style

---

## Screenshots
Screenshot placeholders (to be filled later):
1. `dashboard_screenshots/01_home_valuation_summary.png`
2. `dashboard_screenshots/02_company_profile_valuation_card.png`
3. `dashboard_screenshots/03_executive_overview.png`
4. `dashboard_screenshots/04_profitability_analytics.png`
5. `dashboard_screenshots/05_leverage_risk.png`
6. `dashboard_screenshots/06_cagr_growth.png`
7. `dashboard_screenshots/07_cash_flow.png`
8. `dashboard_screenshots/08_capital_allocation.png`
9. `dashboard_screenshots/09_quality_scoring.png`
10. `dashboard_screenshots/10_data_quality.png`
