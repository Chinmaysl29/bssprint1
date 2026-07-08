
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
        ratio12 REAL
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
    def load_excel_to_table(file_path, table_name, expected_cols, rename_cols=None, header=1):
        df = pd.read_excel(file_path, header=header)
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
        header=0
    )
    dfs['stock_prices'] = load_excel_to_table(
        os.path.join(supporting_dir, 'stock_prices.xlsx'), 
        'stock_prices', 
        ['id', 'company_id', 'date', 'open_price', 'high', 'low', 'close_price', 'volume', 'adjusted_close'],
        header=0,
        rename_cols={'adjusted_close': 'adj_close'}
    )
    dfs['market_cap'] = load_excel_to_table(
        os.path.join(supporting_dir, 'market_cap.xlsx'), 
        'market_cap', 
        ['id', 'company_id', 'year', 'mc1', 'mc2', 'val3', 'val4', 'val5', 'val6'],
        header=0
    )
    dfs['financial_ratios'] = load_excel_to_table(
        os.path.join(supporting_dir, 'financial_ratios.xlsx'), 
        'financial_ratios', 
        ['id', 'company_id', 'year', 'ratio1', 'ratio2', 'ratio3', 'ratio4', 
         'ratio5', 'ratio6', 'ratio7', 'ratio8', 'ratio9', 'ratio10', 'ratio11', 'ratio12'],
        header=0
    )
    dfs['peer_groups'] = load_excel_to_table(
        os.path.join(supporting_dir, 'peer_groups.xlsx'), 
        'peer_groups', 
        ['id', 'group_name', 'company_id', 'is_primary'],
        header=0
    )

    conn.commit()
    conn.close()
    print("All data loaded successfully!")


if __name__ == '__main__':
    load_data()
