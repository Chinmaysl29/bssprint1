# Nifty 100 Analytics: Sprint 5 Report

## 1. Objectives
The primary objective of Sprint 5 was to synthesize the raw financial data, calculated KPIs, and historical patterns generated in earlier sprints into professional, actionable, and highly visual reports. This required adding Cash Flow intelligence, generating qualitative text via NLP, and orchestrating a batch PDF generation suite.

## 2. Architecture
The Sprint 5 architecture acts as the final presentation layer of the pipeline:
- **Data Layer**: SQLite Database (`nifty100.db`) containing raw financial statements, and intermediate CSVs (`valuation_summary.csv`, `capital_allocation.csv`).
- **Analytics Layer**: Pandas/NumPy driven logic computing CAGRs, Free Cash Flow yields, and sector aggregates.
- **NLP Layer**: Rule-based synthesis in `pros_cons_generator.py` converting quantitative percentiles into human-readable insights.
- **Presentation Layer**: Matplotlib's `PdfPages` generating structured multi-page PDF documents (`tearsheet.py`, `sector_report.py`, `portfolio_summary.py`).

## 3. Modules Developed
- **`cashflow_kpis.py`**: Calculates Free Cash Flow (FCF) margins, scores CFO quality, and flags distress markers.
- **`pros_cons_generator.py`**: Synthesizes the quantitative metrics (ROE ranks, Sales CAGR ranks) into structured English Pros & Cons.
- **`tearsheet.py`**: Generates a 2-page company-specific PDF detailing historical trends, peer comparisons, and cash flow waterfalls.
- **`sector_report.py`**: Generates a 2-page sector-specific PDF aggregating total sector revenue/profits and ranking top performers.
- **`portfolio_summary.py`**: Generates a 4-page macro-level PDF visualizing portfolio distributions (Pie Charts, Histograms) and overall rankings.
- **`batch_generator.py`**: Orchestrates the automated sequential processing of all 92 companies to generate Tearsheets.

## 4. Results
- Successfully processed **92 Nifty 100 Companies**.
- Generated **102 distinct PDF reports** (91 Tearsheets, 10 Sector Reports, 1 Portfolio Summary).
- Rendered over **320+ unique data visualizations** directly into the reports.
- Achieved **0 missing KPI errors** across all generated PDFs.

## 5. Screenshots & Visuals
*(Placeholder for actual screenshots)*
- **[Tearsheet Visual]**: Features dual-axis ROE/ROCE line charts and clean KPI grids.
- **[Sector Visual]**: Features sector-aggregated Bar charts and green/red highlight texts for top/bottom performers.
- **[Portfolio Visual]**: Features a 4-color distinct Capital Allocation pie chart and ROE distribution histograms.

## 6. Testing & Quality Assurance
- **Data Integrity Validation**: Verified that exactly 92 companies were present and that no missing ratios crashed the `tearsheet.py` engine. (We caught and patched a bug regarding `net_profit` NaNs).
- **Type Checking**: Resolved sorting crashes caused by mixed `float` and `string` ("N/A") types in Pandas DataFrames.
- **Warning Suppression**: Cleaned up the terminal output by programmatically handling `RuntimeWarnings` caused by empty sector metric slices.

## 7. Deliverables
1. `README.md` (Updated with Sprint 5 Installation & Usage)
2. `Sprint5_Retrospective.md` (Documenting challenges and lessons learned)
3. `Sprint5_Report.pdf` (This document)
4. `output/reports/tearsheets/*.pdf` (91 Company Reports)
5. `output/reports/sector/*.pdf` (10 Sector Reports)
6. `output/reports/portfolio/portfolio_summary.pdf` (1 Portfolio Report)
