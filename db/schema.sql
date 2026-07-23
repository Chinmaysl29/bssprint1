
PRAGMA foreign_keys = ON;

CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    company_logo TEXT,
    company_name TEXT,
    chart_link TEXT,
    about_company TEXT,
    website TEXT,
    nse_profile TEXT,
    bse_profile TEXT,
    face_value REAL,
    book_value REAL,
    roce_percentage REAL,
    roe_percentage REAL
);

CREATE TABLE profitandloss (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    year TEXT,
    sales INTEGER,
    expenses INTEGER,
    operating_profit REAL,
    opm_percentage REAL,
    other_income INTEGER,
    interest INTEGER,
    depreciation INTEGER,
    profit_before_tax INTEGER,
    tax_percentage REAL,
    net_profit INTEGER,
    eps REAL,
    dividend_payout REAL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE balancesheet (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    year TEXT,
    equity_capital REAL,
    reserves INTEGER,
    borrowings INTEGER,
    other_liabilities INTEGER,
    total_liabilities INTEGER,
    fixed_assets INTEGER,
    cwip INTEGER,
    investments INTEGER,
    other_asset INTEGER,
    total_assets INTEGER,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE cashflow (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    year TEXT,
    operating_activity REAL,
    investing_activity REAL,
    financing_activity REAL,
    net_cash_flow REAL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE analysis (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    compounded_sales_growth TEXT,
    compounded_profit_growth TEXT,
    stock_price_cagr TEXT,
    roe TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    Year INTEGER,
    Annual_Report TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE prosandcons (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE sectors (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    sector TEXT,
    industry TEXT,
    score REAL,
    cap TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE stock_prices (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    date TEXT,
    open_price REAL,
    high REAL,
    low REAL,
    close_price REAL,
    volume INTEGER,
    adj_close REAL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE market_cap (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    year INTEGER,
    mc1 REAL,
    mc2 REAL,
    val3 REAL,
    val4 REAL,
    val5 REAL,
    val6 REAL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE financial_ratios (
    id INTEGER PRIMARY KEY,
    company_id TEXT NOT NULL,
    year TEXT,
    ratio1 REAL,
    ratio2 REAL,
    ratio3 REAL,
    ratio4 REAL,
    ratio5 REAL,
    ratio6 REAL,
    ratio7 REAL,
    ratio8 REAL,
    ratio9 REAL,
    ratio10 REAL,
    ratio11 REAL,
    ratio12 REAL,
    free_cash_flow_cr REAL,
    cfo_quality_score REAL,
    capex_intensity_pct REAL,
    capex_label TEXT,
    fcf_conversion_pct REAL,
    capital_allocation_pattern TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE peer_groups (
    id INTEGER PRIMARY KEY,
    group_name TEXT,
    company_id TEXT NOT NULL,
    is_primary BOOLEAN,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE peer_percentiles (
    company_id INTEGER,
    peer_group_name TEXT,
    metric TEXT,
    value REAL,
    percentile_rank REAL,
    year INTEGER
);
