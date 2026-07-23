
# NIFTY100 Financial Analytics Dashboard - Setup Guide

## Step 1: Install Power BI Desktop
Download and install Power BI Desktop from https://powerbi.microsoft.com/en-us/desktop/

---

## Step 2: Connect to Data Sources
### Source 1: SQLite Database
1. Open Power BI Desktop
2. Click "Get Data" → "More..."
3. Search for "SQLite" → Select "SQLite database" → Click "Connect"
4. File path: Select `db/nifty100.db`
5. Load tables:
   - companies
   - profitandloss
   - balancesheet
   - cashflow
   - financial_ratios
   - sectors

### Source 2: CSV File (Capital Allocation)
1. Click "Get Data" → "Text/CSV"
2. File path: Select `output/capital_allocation.csv`
3. Click "Load"

---

## Step 3: Create Relationships (Star Schema)
1. Go to "Model" view
2. Create these relationships:
   a. `sectors`[sector] → `companies`[sector] (1-to-many, single direction)
   b. `companies`[company_id] → `financial_ratios`[company_id] (1-to-many, single direction)
   c. `companies`[company_id] → `profitandloss`[company_id] (1-to-many, single direction)
   d. `companies`[company_id] → `balancesheet`[company_id] (1-to-many, single direction)
   e. `companies`[company_id] → `cashflow`[company_id] (1-to-many, single direction)

---

## Step 4: Create Date Hierarchy
1. In "Model" view, select the `financial_ratios` table
2. Select the `year` column (or appropriate date column)
3. Right-click → "Create hierarchy"
4. Add Quarter and Month as needed (if available)

---

## Step 5: Create DAX Measures
Go to "Model" view, select "New measure" from the toolbar, and create each measure from `dashboard_documentation.md`

---

## Step 6: Create Dashboard Pages
Follow `dashboard_documentation.md`'s "Dashboard Pages" section one by one! For each page:
1. Set the background color to #0F172A (dark navy)
2. Add KPI cards with appropriate visuals
3. Add charts as specified
4. Add filters
5. Apply conditional formatting

---

## Step 7: Save Dashboard
Save the Power BI file as `dashboard/Nifty100_Financial_Analytics.pbix`
