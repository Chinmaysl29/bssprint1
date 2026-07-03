# NIFTY100 Financial Intelligence Dashboard

## Overview

A premium, fully interactive web dashboard visualizing Sprint 1 and Sprint 2 analytics for the NIFTY100 Financial Intelligence Platform. Built as a single-page application using vanilla HTML, CSS, and JavaScript — no backend, no framework required.

---

## Features

### 10 Interactive Pages

| Page | Description |
|------|-------------|
| **Executive Overview** | KPI summary, sector donut, ROE scatter, sprint progress |
| **ETL Dashboard** | Sprint 1 pipeline animation, table row counts, load audit |
| **Data Quality Center** | 16 DQ rules, quality gauge, failure categories |
| **Profitability Analytics** | NPM, OPM, ROE, ROCE — tables, bar charts, sector comparison |
| **Leverage & Risk** | D/E ratios, ICR risk, debt-free companies, financial sector breakdown |
| **CAGR Growth Engine** | Sales/Profit/Stock CAGR, growth heatmap, CAGR flags |
| **Cash Flow Intelligence** | FCF, CFO Quality Score, CapEx intensity, top cash generators |
| **Capital Allocation** | 8 allocation patterns, sector-pattern heatmap, company table |
| **Company Ranking** | Quality scoring model, leaderboard, risk-return scatter |
| **Sprint Summary** | Full timeline, achievement cards, Sprint 3 roadmap |

### Interactive Features
- **Global Search** — filter companies by name across all pages
- **Sector Filter** — narrow data to any of 10 sectors
- **Year Filter** — select TTM or specific financial years
- **Live Charts** — 12+ Chart.js visualizations with hover tooltips
- **Sidebar Navigation** — collapsible, responsive sidebar
- **Responsive Design** — adapts to desktop, tablet, and mobile

---

## Data Sources

| Source | Description |
|--------|-------------|
| `data/dashboard_data.json` | Pre-computed JSON from nifty100.db via Python analytics |
| SQLite `db/nifty100.db` | 12 tables, 12,892 rows |
| `output/capital_allocation.csv` | Capital allocation pattern labels |
| `output/load_audit.csv` | ETL audit results |

### JSON Data Sections
- `sectors` — 10 sector counts
- `companies` — 92 companies with sector/cap
- `top_roe_companies` — Top 20 by ROE
- `profitability` — NPM, OPM, EPS per company
- `leverage` — D/E, borrowings, reserves
- `cashflow` — Operating/Investing/Financing activities
- `cagr_data` — Sales/Profit/Stock CAGR strings
- `financial_ratios` — 1,184 ratio records
- `capital_allocation_companies` — 8-pattern allocation per company
- `capital_allocation_summary` — Pattern distribution counts
- `dq_rules` — All 16 DQ rule results
- `sprint_stats` — Aggregate delivery metrics

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#020617` |
| Surface | `#0F172A` |
| Primary Blue | `#2563EB` |
| Success Green | `#10B981` |
| Warning Amber | `#F59E0B` |
| Danger Red | `#EF4444` |
| Text | `#F8FAFC` |
| Font Heading | Montserrat 800 |
| Font Body | Inter 400/500/600 |

Style: Dark mode · Glassmorphism cards · Smooth animations · Chart.js visualizations

---

## How to Run

### Option 1: VS Code Live Server (Recommended)
1. Open the `Nifty100/dashboard/` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Dashboard opens at `http://127.0.0.1:5500`

### Option 2: Python HTTP Server
```bash
cd Nifty100/dashboard
python -m http.server 8080
# Open http://localhost:8080
```

### Option 3: Node.js `serve`
```bash
npx serve Nifty100/dashboard
```

> **Note:** The dashboard must be served over HTTP (not opened as a `file://` URL) because it uses `fetch()` to load `data/dashboard_data.json`.

---

## File Structure

```
dashboard/
├── index.html              # Main SPA shell
├── css/
│   └── style.css           # Design system + all component styles
├── js/
│   ├── dashboard.js        # Page routing, rendering, filters, search
│   ├── charts.js           # Chart.js factory functions (12+ charts)
│   └── data_loader.js      # JSON loader + NIFTY_DATA accessor API
├── data/
│   └── dashboard_data.json # Pre-computed analytics (5,294 lines)
└── README_dashboard.md     # This file
```

---

## Sprint Delivery

### Sprint 1 – Completed
- 12 datasets loaded into SQLite
- 16 Data Quality rules implemented
- 139 tests passing
- 12,892 total DB rows

### Sprint 2 – Completed
- 50+ financial KPIs computed
- Profitability: NPM, OPM, ROE, ROCE, ROA
- Leverage: D/E, ICR, Net Debt
- CAGR: 3/5/10 year Sales, Profit, EPS
- Cash Flow: FCF, CFO Quality, CapEx Intensity
- Capital Allocation: 8 patterns
- 1,184 ratio records in `financial_ratios` table

### Sprint 3 – Coming Soon
- REST API layer (FastAPI)
- ML quality scoring
- Real-time price feeds
- Portfolio simulation
