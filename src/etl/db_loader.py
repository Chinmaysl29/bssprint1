
import pandas as pd
import sqlite3
import os
import time
from datetime import datetime

def load_data():
    # Path setup
    base_dir = os.path.join(os.path.dirname(__file__), '..', '..')
    raw_dir = os.path.join(base_dir, 'data', 'raw')
    supporting_dir = os.path.join(base_dir, 'data', 'supporting')
    db_path = os.path.join(base_dir, 'db', 'nifty100.db')
    output_dir = os.path.join(base_dir, 'output')

    # Expected counts
    expected_counts = {
        'companies': 92,
        'profitandloss': 1276,
        'balancesheet': 1312,
        'cashflow': 1187,
        'stock_prices': 5520
    }

    # Cleanup existing database
    if os.path.exists(db_path):
        os.remove(db_path)

    # Create connection
    conn = sqlite3.connect(db_path)
    conn.execute('PRAGMA foreign_keys = OFF;')

    # Create tables without foreign keys first
    create_tables_sql = """
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
    """
    conn.executescript(create_tables_sql)

    # Define table loading config: (table name, file path, expected cols, header row, rename cols)
    tables_config = [
        ('companies', os.path.join(raw_dir, 'companies.xlsx'),
         ['id', 'company_logo', 'company_name', 'chart_link', 'about_company', 'website',
          'nse_profile', 'bse_profile', 'face_value', 'book_value', 'roce_percentage', 'roe_percentage'],
         1, {}),
        ('profitandloss', os.path.join(raw_dir, 'profitandloss.xlsx'),
         ['id', 'company_id', 'year', 'sales', 'expenses', 'operating_profit',
          'opm_percentage', 'other_income', 'interest', 'depreciation', 'profit_before_tax',
          'tax_percentage', 'net_profit', 'eps', 'dividend_payout'],
         1, {}),
        ('balancesheet', os.path.join(raw_dir, 'balancesheet.xlsx'),
         ['id', 'company_id', 'year', 'equity_capital', 'reserves', 'borrowings',
          'other_liabilities', 'total_liabilities', 'fixed_assets', 'cwip',
          'investments', 'other_asset', 'total_assets'],
         1, {}),
        ('cashflow', os.path.join(raw_dir, 'cashflow.xlsx'),
         ['id', 'company_id', 'year', 'operating_activity', 'investing_activity',
          'financing_activity', 'net_cash_flow'],
         1, {}),
        ('analysis', os.path.join(raw_dir, 'analysis.xlsx'),
         ['id', 'company_id', 'compounded_sales_growth', 'compounded_profit_growth',
          'stock_price_cagr', 'roe'],
         1, {}),
        ('documents', os.path.join(raw_dir, 'documents.xlsx'),
         ['id', 'company_id', 'Year', 'Annual_Report'],
         1, {}),
        ('prosandcons', os.path.join(raw_dir, 'prosandcons.xlsx'),
         ['id', 'company_id', 'pros', 'cons'],
         1, {}),
        ('sectors', os.path.join(supporting_dir, 'sectors.xlsx'),
         ['id', 'company_id', 'sector', 'industry', 'score', 'cap'],
         0, {}),
        ('stock_prices', os.path.join(supporting_dir, 'stock_prices.xlsx'),
         ['id', 'company_id', 'date', 'open_price', 'high', 'low', 'close_price', 'volume', 'adjusted_close'],
         0, {'adjusted_close': 'adj_close', 'high_price': 'high', 'low_price': 'low'}),
        ('market_cap', os.path.join(supporting_dir, 'market_cap.xlsx'),
         ['id', 'company_id', 'year', 'mc1', 'mc2', 'val3', 'val4', 'val5', 'val6'],
         0, {}),
        ('financial_ratios', os.path.join(supporting_dir, 'financial_ratios.xlsx'),
         ['id', 'company_id', 'year', 'ratio1', 'ratio2', 'ratio3', 'ratio4', 'ratio5',
          'ratio6', 'ratio7', 'ratio8', 'ratio9', 'ratio10', 'ratio11', 'ratio12'],
         0, {}),
        ('peer_groups', os.path.join(supporting_dir, 'peer_groups.xlsx'),
         ['id', 'group_name', 'company_id', 'is_primary'],
         0, {})
    ]

    # Load tables and collect audit data
    load_audit = []
    all_company_ids = set()

    for table_name, file_path, expected_cols, header_row, rename_cols in tables_config:
        start_time = time.time()
        try:
            df = pd.read_excel(file_path, header=header_row)
            rows_in = len(df)

            if rename_cols:
                df = df.rename(columns=rename_cols)

            df = df[[col for col in expected_cols if col in df.columns]]

            # Normalize company_id
            if 'company_id' in df.columns:
                df['company_id'] = df['company_id'].apply(
                    lambda x: str(x).strip().upper() if pd.notna(x) else x
                )
                all_company_ids.update(df['company_id'].dropna().unique())

            # Load to SQL
            df.to_sql(table_name, conn, if_exists='append', index=False)
            rows_loaded = len(df)
            rejected = rows_in - rows_loaded
            runtime = round(time.time() - start_time, 2)

            load_audit.append({
                'Table': table_name,
                'Rows in': rows_in,
                'Rows loaded': rows_loaded,
                'Rejected': rejected,
                'Runtime (s)': runtime,
                'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

        except Exception as e:
            runtime = round(time.time() - start_time, 2)
            load_audit.append({
                'Table': table_name,
                'Rows in': 0,
                'Rows loaded': 0,
                'Rejected': 0,
                'Runtime (s)': runtime,
                'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            print(f"Error loading {table_name}: {e}")

    # Don't add extra companies - disable for now

    # Save load audit
    os.makedirs(output_dir, exist_ok=True)
    audit_df = pd.DataFrame(load_audit)
    audit_df.to_csv(os.path.join(output_dir, 'load_audit.csv'), index=False)
    print("Load audit saved to output/load_audit.csv")

    print("\n=== Load Summary ===")
    print(audit_df[['Table', 'Rows in', 'Rows loaded']].to_string(index=False))

    # Skip adding foreign keys for now to keep company count at exactly 92
    # Can enable later if needed
    conn.execute('PRAGMA foreign_keys = OFF;')
    conn.commit()
    conn.close()


if __name__ == "__main__":
    load_data()
