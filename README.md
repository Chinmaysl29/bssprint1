
# NIFTY100 Financial Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![Data Engineering](https://img.shields.io/badge/Data_Engineering-FF6F00?style=for-the-badge&logo=apachespark&logoColor=white)]()
[![Financial Analytics](https://img.shields.io/badge/Financial_Analytics-00A4E4?style=for-the-badge&logo=quickbooks&logoColor=white)]()
[![Testing](https://img.shields.io/badge/Testing-5E5E5E?style=for-the-badge&logo=pytest&logoColor=white)]()

---
## Sprint Status

**Sprint 3 — Completed**

### Sprint Architecture

```
Sprint 1
ETL Engine

        ↓

Sprint 2
Financial Ratio Engine

        ↓

Sprint 3
Screener + Peer Intelligence
```

---

## 📊 Project Overview

Enterprise-grade financial analytics platform built for NIFTY100 companies. The system performs:

- ✅ **ETL Processing** - Extract, Transform, Load of 12 financial datasets
- ✅ **Data Validation** - 16 quality rules enforced
- ✅ **Financial Ratio Calculation** - Profitability, Leverage, ROE, ROCE
- ✅ **Growth Analytics** - 3/5/10 year CAGR calculations
- ✅ **Cash Flow Intelligence** - Free Cash Flow, CFO Quality, Capital Allocation
- ✅ **Quality Scoring** - Edge case detection and logging
- ✅ **Dashboard Visualization** - Web and Power BI dashboards

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────┐
│     Raw Financial Data (12 Files)   │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     ETL Layer                       │
│     (loader.py, validator.py)       │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     Normalization Engine            │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     Data Quality Engine             │
│     (16 Validation Rules)           │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     SQLite Warehouse                │
│     (nifty100.db)                   │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     Financial Analytics Engine      │
│     (ratios.py, cagr.py, cashflow)  │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│     Dashboard Layer                 │
│     (HTML + Power BI)               │
└─────────────────────────────────────┘
```

---

## 🚀 Sprint 1 — Data Engineering Foundation

### Input
- 12 Financial Datasets

### Processing Modules
- [loader.py](file:///d:/bssprint1/Nifty100/src/etl/loader.py)
- [data_quality.py](file:///d:/bssprint1/Nifty100/src/etl/data_quality.py)
- [validator.py](file:///d:/bssprint1/Nifty100/src/etl/validator.py)

### Outputs
- ✅ [nifty100.db](file:///d:/bssprint1/Nifty100/db/nifty100.db)
- ✅ [schema.sql](file:///d:/bssprint1/Nifty100/db/schema.sql)
- ✅ [validation_failures.csv](file:///d:/bssprint1/Nifty100/output/validation_failures.csv)
- ✅ [load_audit.csv](file:///d:/bssprint1/Nifty100/output/load_audit.csv)
- ✅ [exploratory_queries.sql](file:///d:/bssprint1/Nifty100/db/exploratory_queries.sql)

### Testing
- 35+ ETL tests

**Status:** ✅ COMPLETED

---

## 📈 Sprint 2 — Financial Ratio Engine

### Analytics Modules

#### 💰 Profitability (ratios.py)
- ROE (Return on Equity)
- ROCE (Return on Capital Employed)
- ROA (Return on Assets)
- Net Profit Margin

#### 📊 Growth Analytics (cagr.py)
- Revenue CAGR
- PAT CAGR
- EPS CAGR
- 3/5/10 year growth calculations

**Edge Cases Handled:**
- TURNAROUND
- DECLINE_TO_LOSS
- ZERO_BASE

#### 💸 Cashflow Intelligence (cashflow_kpis.py)
- Free Cash Flow
- CFO Quality Score
- CapEx Intensity
- Capital Allocation Pattern

**Status:** ✅ COMPLETED

---

## Sprint 3 — Completed

### Screener + Peer Intelligence
- Company screening workflow
- Peer comparison intelligence
- Dashboard-ready insights for NIFTY100 analysis

**Status:** COMPLETED

---
## 📦 Database Architecture

### Tables
| Table | Description |
|-------|-------------|
| [companies](file:///d:/bssprint1/Nifty100/db/schema.sql) | Company master data |
| [profitandloss](file:///d:/bssprint1/Nifty100/db/schema.sql) | Income statement data |
| [balancesheet](file:///d:/bssprint1/Nifty100/db/schema.sql) | Balance sheet data |
| [cashflow](file:///d:/bssprint1/Nifty100/db/schema.sql) | Cash flow statement data |
| [financial_ratios](file:///d:/bssprint1/Nifty100/db/schema.sql) | Calculated financial ratios |
| [sectors](file:///d:/bssprint1/Nifty100/db/schema.sql) | Sector classification |

### Relationships
```
companies
    ↓
financial_ratios
```

---

## ✅ Testing Section

### Testing Results
| Metric | Value |
|--------|-------|
| **Total Tests** | 139+ |
| **Status** | PASSED |
| **Failures** | 0 |

### Testing Includes
- ETL Tests
- Financial Ratio Tests
- CAGR Tests
- Cashflow KPIs Tests

---

## 📊 Dashboard Section

### Available Dashboards
- **HTML Dashboard** - Vanilla JS/Chart.js interactive web interface
- **Power BI Dashboard** - Professional financial analytics dashboard

### Features
- 🎯 Executive View
- 📊 Financial KPIs
- 📈 Growth Analytics
- ⚠️ Risk Analytics
- 💰 Cashflow Intelligence

---

## 📁 Project Structure

```
Nifty100/
├── src/
│   ├── etl/          # ETL pipeline modules
│   └── analytics/    # Financial analytics engine
├── db/               # SQLite database & schema
├── tests/            # Pytest test suite
├── output/           # Generated reports & logs
├── dashboard/        # HTML + Power BI dashboards
├── reports/          # Sprint reports & documentation
└── data/             # Raw & supporting data files
```

---

## 📋 Final Status Table

| Sprint | Module | Status |
|--------|--------|--------|
| Sprint 1 | ETL Foundation | ✅ COMPLETE |
| Sprint 2 | Financial Ratio Engine | ✅ COMPLETE |
| Sprint 3 | Screener + Peer Intelligence | COMPLETE |

