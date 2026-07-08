
import pandas as pd
import sqlite3
import os


def load_data():
    base_dir = os.path.join(os.path.dirname(__file__), '..', '..')
    raw_dir = os.path.join(base_dir, 'data', 'raw')
    supporting_dir = os.path.join(base_dir, 'data', 'supporting')
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')

    # Delete existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Deleted existing database")

    # Create connection
    conn = sqlite3.connect(db_path)
    print("Database connection created")

    # Create tables without foreign keys first
    create_tables_without_fk = """
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
        dividend_payout REAL
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
        total_assets INTEGER
    );

    CREATE TABLE cashflow (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        year TEXT,
        operating_activity REAL,
        investing_activity REAL,
        financing_activity REAL,
        net_cash_flow REAL
    );

    CREATE TABLE analysis (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        compounded_sales_growth TEXT,
        compounded_profit_growth TEXT,
        stock_price_cagr TEXT,
        roe TEXT
    );

    CREATE TABLE documents (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        Year INTEGER,
        Annual_Report TEXT
    );

    CREATE TABLE prosandcons (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        pros TEXT,
        cons TEXT
    );

    CREATE TABLE sectors (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        sector TEXT,
        industry TEXT,
        score REAL,
        cap TEXT
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
        adj_close REAL
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
        val6 REAL
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
        capital_allocation_pattern TEXT
    );

    CREATE TABLE peer_groups (
        id INTEGER PRIMARY KEY,
        group_name TEXT,
        company_id TEXT NOT NULL,
        is_primary BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS peer_percentiles (
        company_id INTEGER,
        peer_group_name TEXT,
        metric TEXT,
        value REAL,
        percentile_rank REAL,
        year INTEGER
    );
    """
    conn.executescript(create_tables_without_fk)
    print("Tables created successfully!")

    # Load data
    def load_excel_to_table(file_path, table_name, expected_cols, rename_cols=None):
        df = pd.read_excel(file_path, header=1)
        if rename_cols:
            df = df.rename(columns=rename_cols)
        # Only keep columns that are in the schema
        df = df[[col for col in expected_cols if col in df.columns]]
        df.to_sql(table_name, conn, if_exists='append', index=False)
        print(f"Loaded {len(df)} rows into {table_name}")
        return df

    # Load all tables
    companies_df = load_excel_to_table(
        os.path.join(raw_dir, 'companies.xlsx'), 
        'companies',
        ['id', 'company_logo', 'company_name', 'chart_link', 'about_company', 
         'website', 'nse_profile', 'bse_profile', 'face_value', 'book_value', 
         'roce_percentage', 'roe_percentage']
    )

    dfs = {}
    dfs['profitandloss'] = load_excel_to_table(
        os.path.join(raw_dir, 'profitandloss.xlsx'), 
        'profitandloss',
        ['id', 'company_id', 'year', 'sales', 'expenses', 'operating_profit', 
         'opm_percentage', 'other_income', 'interest', 'depreciation', 
         'profit_before_tax', 'tax_percentage', 'net_profit', 'eps', 'dividend_payout']
    )
    dfs['balancesheet'] = load_excel_to_table(
        os.path.join(raw_dir, 'balancesheet.xlsx'), 
        'balancesheet',
        ['id', 'company_id', 'year', 'equity_capital', 'reserves', 'borrowings', 
         'other_liabilities', 'total_liabilities', 'fixed_assets', 'cwip', 
         'investments', 'other_asset', 'total_assets']
    )
    dfs['cashflow'] = load_excel_to_table(
        os.path.join(raw_dir, 'cashflow.xlsx'), 
        'cashflow',
        ['id', 'company_id', 'year', 'operating_activity', 'investing_activity', 
         'financing_activity', 'net_cash_flow']
    )
    dfs['analysis'] = load_excel_to_table(
        os.path.join(raw_dir, 'analysis.xlsx'), 
        'analysis',
        ['id', 'company_id', 'compounded_sales_growth', 'compounded_profit_growth', 
         'stock_price_cagr', 'roe']
    )
    dfs['documents'] = load_excel_to_table(
        os.path.join(raw_dir, 'documents.xlsx'), 
        'documents',
        ['id', 'company_id', 'Year', 'Annual_Report']
    )
    dfs['prosandcons'] = load_excel_to_table(
        os.path.join(raw_dir, 'prosandcons.xlsx'), 
        'prosandcons',
        ['id', 'company_id', 'pros', 'cons']
    )

    dfs['sectors'] = load_excel_to_table(
        os.path.join(supporting_dir, 'sectors.xlsx'), 
        'sectors', 
        ['id', 'company_id', 'sector', 'industry', 'score', 'cap'],
        rename_cols={
            '1': 'id',
            'ABB': 'company_id',
            'Industrials': 'sector',
            'Capital Goods': 'industry',
            0.81: 'score',
            'Large Cap': 'cap'
        }
    )
    dfs['stock_prices'] = load_excel_to_table(
        os.path.join(supporting_dir, 'stock_prices.xlsx'), 
        'stock_prices', 
        ['id', 'company_id', 'date', 'open_price', 'high', 'low', 'close_price', 'volume', 'adj_close'],
        rename_cols={
            '1': 'id',
            'ABB': 'company_id',
            '2020-01-01': 'date',
            1958.61: 'open_price',
            2150.53: 'high',
            1835.28: 'low',
            1964.3: 'close_price',
            26184368: 'volume',
            '1964.3.1': 'adj_close'
        }
    )
    dfs['market_cap'] = load_excel_to_table(
        os.path.join(supporting_dir, 'market_cap.xlsx'), 
        'market_cap', 
        ['id', 'company_id', 'year', 'mc1', 'mc2', 'val3', 'val4', 'val5', 'val6'],
        rename_cols={
            '1': 'id',
            'ABB': 'company_id',
            2019: 'year',
            844312.98: 'mc1',
            814410.48: 'mc2',
            19.29: 'val3',
            14.26: 'val4',
            22.84: 'val5',
            0.84: 'val6'
        }
    )
    dfs['financial_ratios'] = load_excel_to_table(
        os.path.join(supporting_dir, 'financial_ratios.xlsx'), 
        'financial_ratios', 
        ['id', 'company_id', 'year', 'ratio1', 'ratio2', 'ratio3', 'ratio4', 
         'ratio5', 'ratio6', 'ratio7', 'ratio8', 'ratio9', 'ratio10', 'ratio11', 'ratio12',
         'free_cash_flow_cr', 'cfo_quality_score', 'capex_intensity_pct', 'capex_label',
         'fcf_conversion_pct', 'capital_allocation_pattern'],
        rename_cols={
            '1': 'id',
            'ABB': 'company_id',
            'Dec 2012': 'year',
            8.77: 'ratio1',
            12: 'ratio2',
            22.41: 'ratio3',
            0: 'ratio4',
            'Unnamed: 7': 'ratio5',
            1.8225: 'ratio6',
            42: 'ratio7',
            59: 'ratio8',
            68: 'ratio9',
            3.081: 'ratio10',
            25: 'ratio11',
            '0.1': 'ratio12',
            101: 'ratio13'
        }
    )
    dfs['peer_groups'] = load_excel_to_table(
        os.path.join(supporting_dir, 'peer_groups.xlsx'), 
        'peer_groups', 
        ['id', 'group_name', 'company_id', 'is_primary'],
        rename_cols={
            '1': 'id',
            'Private Banks': 'group_name',
            'HDFCBANK': 'company_id',
            'True.1': 'is_primary'
        }
    )

    # Collect all unique company IDs from all tables
    all_company_ids = set(companies_df['id'].unique())
    for df_name, df in dfs.items():
        if 'company_id' in df.columns:
            all_company_ids.update(df['company_id'].dropna().unique())

    # Insert missing companies into companies table
    existing_companies = set(companies_df['id'].unique())
    missing_companies = all_company_ids - existing_companies
    if missing_companies:
        print(f"Adding {len(missing_companies)} missing companies: {sorted(missing_companies)}")
        missing_companies_df = pd.DataFrame({
            'id': list(missing_companies),
            'company_name': list(missing_companies)
        })
        missing_companies_df.to_sql('companies', conn, if_exists='append', index=False)
        print(f"Added {len(missing_companies)} missing companies")

    # Now add foreign keys
    add_foreign_keys = """
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE profitandloss_new (
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
    INSERT INTO profitandloss_new SELECT * FROM profitandloss;
    DROP TABLE profitandloss;
    ALTER TABLE profitandloss_new RENAME TO profitandloss;

    CREATE TABLE balancesheet_new (
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
    INSERT INTO balancesheet_new SELECT * FROM balancesheet;
    DROP TABLE balancesheet;
    ALTER TABLE balancesheet_new RENAME TO balancesheet;

    CREATE TABLE cashflow_new (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        year TEXT,
        operating_activity REAL,
        investing_activity REAL,
        financing_activity REAL,
        net_cash_flow REAL,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO cashflow_new SELECT * FROM cashflow;
    DROP TABLE cashflow;
    ALTER TABLE cashflow_new RENAME TO cashflow;

    CREATE TABLE analysis_new (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        compounded_sales_growth TEXT,
        compounded_profit_growth TEXT,
        stock_price_cagr TEXT,
        roe TEXT,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO analysis_new SELECT * FROM analysis;
    DROP TABLE analysis;
    ALTER TABLE analysis_new RENAME TO analysis;

    CREATE TABLE documents_new (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        Year INTEGER,
        Annual_Report TEXT,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO documents_new SELECT * FROM documents;
    DROP TABLE documents;
    ALTER TABLE documents_new RENAME TO documents;

    CREATE TABLE prosandcons_new (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        pros TEXT,
        cons TEXT,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO prosandcons_new SELECT * FROM prosandcons;
    DROP TABLE prosandcons;
    ALTER TABLE prosandcons_new RENAME TO prosandcons;

    CREATE TABLE sectors_new (
        id INTEGER PRIMARY KEY,
        company_id TEXT NOT NULL,
        sector TEXT,
        industry TEXT,
        score REAL,
        cap TEXT,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO sectors_new SELECT * FROM sectors;
    DROP TABLE sectors;
    ALTER TABLE sectors_new RENAME TO sectors;

    CREATE TABLE stock_prices_new (
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
    INSERT INTO stock_prices_new SELECT * FROM stock_prices;
    DROP TABLE stock_prices;
    ALTER TABLE stock_prices_new RENAME TO stock_prices;

    CREATE TABLE market_cap_new (
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
    INSERT INTO market_cap_new SELECT * FROM market_cap;
    DROP TABLE market_cap;
    ALTER TABLE market_cap_new RENAME TO market_cap;

    CREATE TABLE financial_ratios_new (
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
    INSERT INTO financial_ratios_new SELECT * FROM financial_ratios;
    DROP TABLE financial_ratios;
    ALTER TABLE financial_ratios_new RENAME TO financial_ratios;

    CREATE TABLE peer_groups_new (
        id INTEGER PRIMARY KEY,
        group_name TEXT,
        company_id TEXT NOT NULL,
        is_primary BOOLEAN,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    INSERT INTO peer_groups_new SELECT * FROM peer_groups;
    DROP TABLE peer_groups;
    ALTER TABLE peer_groups_new RENAME TO peer_groups;
    """
    conn.executescript(add_foreign_keys)
    print("Foreign keys added!")

    conn.commit()
    conn.close()
    print("All data loaded successfully!")


if __name__ == '__main__':
    load_data()
