# Nifty 100 Analytics Engine

An automated data processing, analytics, and reporting engine designed to extract, analyze, and visualize financial data for the Nifty 100 companies.

## Sprint 5 Overview

In Sprint 5, we integrated advanced analytics, Natural Language Processing (NLP) for qualitative insights, and a highly automated reporting suite to generate professional-grade financial PDFs. 

### Key Features Delivered:
1. **Cash Flow Intelligence**: Analyzed Operating, Investing, and Financing cash flows to flag distress, deleveraging, and high-quality CFO companies.
2. **NLP Engine**: Implemented an automated Pros & Cons generator that aggregates peer percentiles, financial margins, and historical CAGRs to write qualitative insights with a >60% confidence score.
3. **Report Generation Suite**: 
   - **Tearsheets**: 92 individual company PDFs featuring dual-axis charts and KPI grids.
   - **Sector Reports**: 10 sector-level PDFs aggregating financial trends and highlighting top/bottom performers.
   - **Portfolio Summary**: A master PDF report featuring distribution histograms, pie charts, and portfolio-wide rankings.

## Folder Structure

```text
Nifty100/
│
├── data/                  # Raw and intermediate CSVs
├── db/                    # SQLite database (nifty100.db)
├── reports/               # Generated PDFs 
│   ├── tearsheets/        # 92 Company PDFs
│   ├── sector/            # 10 Sector PDFs
│   └── portfolio/         # Portfolio Summary PDF
│
├── output/
│   ├── peer_charts/       # Peer comparison visualizations
│   └── *.csv              # Analytics outputs (Valuation, Cashflow, NLP)
│
├── src/
│   ├── analytics/         # CAGR, Cash Flow, and Valuation modules
│   ├── nlp/               # Pros & Cons generation logic
│   └── reports/           # PDF Generation (tearsheet, sector_report, portfolio_summary)
│
└── tests/                 # Validation and QA scripts
```

## Installation

1. Clone the repository.
2. Ensure you have Python 3.10+ installed.
3. Install the required dependencies:
```bash
pip install pandas numpy matplotlib sqlite3
```

## Usage

**1. Run Analytics Modules**
Generate the base KPIs and CSV outputs:
```bash
python src/analytics/cagr.py
python src/analytics/cashflow_kpis.py
```

**2. Generate NLP Pros & Cons**
```bash
python src/nlp/pros_cons_generator.py
```

**3. Generate PDF Reports**
```bash
# Generate all 92 Company Tearsheets
python src/reports/batch_generator.py

# Generate 10 Sector Reports
python src/reports/sector_report.py

# Generate the master Portfolio Summary
python src/reports/portfolio_summary.py
```

## Outputs
All final data and reports are saved to the `output/` directory. PDFs are cleanly formatted with `seaborn-v0_8-whitegrid` styling, robust text-wrapping, and dynamic handling of missing data.
