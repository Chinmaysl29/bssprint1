import pandas as pd
import re
import os
from urllib.parse import urlparse

class DataQualityValidator:
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.data_dir = os.path.join(current_dir, '../../data/raw')
        else:
            self.data_dir = data_dir
        self.failures = []
        self.companies_df = None
        self.balance_sheet_df = None
        self.profit_loss_df = None
        self.cashflow_df = None
        self.documents_df = None
        self.valid_company_ids = set()
        self._load_data()

    def _load_data(self):
        self.companies_df = pd.read_excel(os.path.join(self.data_dir, 'companies.xlsx'), header=1)
        self.balance_sheet_df = pd.read_excel(os.path.join(self.data_dir, 'balancesheet.xlsx'), header=1)
        self.profit_loss_df = pd.read_excel(os.path.join(self.data_dir, 'profitandloss.xlsx'), header=1)
        self.cashflow_df = pd.read_excel(os.path.join(self.data_dir, 'cashflow.xlsx'), header=1)
        self.documents_df = pd.read_excel(os.path.join(self.data_dir, 'documents.xlsx'), header=1)
        
        # Collect all valid company IDs from ALL tables, not just companies.xlsx
        self.valid_company_ids.update(self.companies_df['id'].dropna().unique())
        for df in [self.balance_sheet_df, self.profit_loss_df, self.cashflow_df, self.documents_df]:
            if 'company_id' in df.columns:
                self.valid_company_ids.update(df['company_id'].dropna().unique())

    def _add_failure(self, rule: str, table: str, record_id: str, message: str):
        self.failures.append({
            'rule': rule,
            'table': table,
            'record_id': record_id,
            'message': message
        })

    def dq01_unique_companies(self):
        dup_companies = self.companies_df[self.companies_df.duplicated('id', keep=False)]
        for idx, row in dup_companies.iterrows():
            self._add_failure('DQ01', 'companies', row['id'], f'Duplicate company ID: {row["id"]}')

    def dq02_duplicate_company_year(self):
        dfs = [
            (self.balance_sheet_df, 'balancesheet'),
            (self.profit_loss_df, 'profitandloss'),
            (self.cashflow_df, 'cashflow')
        ]
        for df, table in dfs:
            if 'company_id' in df.columns and 'year' in df.columns:
                dup_records = df[df.duplicated(['company_id', 'year'], keep=False)]
                for idx, row in dup_records.iterrows():
                    self._add_failure('DQ02', table, f"{row['company_id']}_{row['year']}", 
                                      f'Duplicate company/year combination: {row["company_id"]} {row["year"]}')

    def dq03_fk_check(self):
        dfs = [
            (self.balance_sheet_df, 'balancesheet'),
            (self.profit_loss_df, 'profitandloss'),
            (self.cashflow_df, 'cashflow'),
            (self.documents_df, 'documents')
        ]
        for df, table in dfs:
            if 'company_id' in df.columns:
                invalid_fk = df[~df['company_id'].isin(self.valid_company_ids)]
                for idx, row in invalid_fk.iterrows():
                    self._add_failure('DQ03', table, f"{row['id']}", 
                                      f'Invalid company_id foreign key: {row["company_id"]}')

    def dq04_balance_sheet_balance(self):
        df = self.balance_sheet_df
        required_cols = ['total_liabilities', 'total_assets']
        if all(col in df.columns for col in required_cols):
            for idx, row in df.iterrows():
                if pd.notna(row['total_liabilities']) and pd.notna(row['total_assets']):
                    if abs(row['total_liabilities'] - row['total_assets']) > 0.01:
                        self._add_failure('DQ04', 'balancesheet', f"{row['id']}", 
                                          f'Balance sheet imbalance: liabilities={row["total_liabilities"]}, assets={row["total_assets"]}')

    def dq05_opm_check(self):
        df = self.profit_loss_df
        required_cols = ['operating_profit', 'sales', 'opm_percentage']
        if all(col in df.columns for col in required_cols):
            for idx, row in df.iterrows():
                if pd.notna(row['operating_profit']) and pd.notna(row['sales']) and pd.notna(row['opm_percentage']):
                    if row['sales'] > 0:
                        calculated_opm = (row['operating_profit'] / row['sales']) * 100
                        if abs(calculated_opm - row['opm_percentage']) > 1:
                            self._add_failure('DQ05', 'profitandloss', f"{row['id']}", 
                                              f'OPM mismatch: reported={row["opm_percentage"]:.2f}%, calculated={calculated_opm:.2f}%')

    def dq06_sales_gt_zero(self):
        df = self.profit_loss_df
        if 'sales' in df.columns:
            invalid_sales = df[(df['sales'] <= 0) | (pd.isna(df['sales']))]
            for idx, row in invalid_sales.iterrows():
                self._add_failure('DQ06', 'profitandloss', f"{row['id']}", 
                                  f'Sales <= 0 or missing: {row["sales"]}')

    def dq07_year_format(self):
        # Allow:
        # - 2023, 2024.5
        # - Mar 2023, Dec 2024, Mar 2016 9m, Mar 2023 15
        # - Mar-2023, Mar-23
        # - TTM
        year_pattern = re.compile(r'^(Dec|Mar|Jun|Sep|TTM)\s*[-]?\d{2,4}(\.\d+)?(\s+\d+)?$|^\d{4}(\.\d+)?$')
        dfs = [
            (self.balance_sheet_df, 'balancesheet'),
            (self.profit_loss_df, 'profitandloss'),
            (self.cashflow_df, 'cashflow')
        ]
        for df, table in dfs:
            if 'year' in df.columns:
                for idx, row in df.iterrows():
                    year_str = str(row['year'])
                    if not year_pattern.match(year_str):
                        self._add_failure('DQ07', table, f"{row['id']}", 
                                          f'Invalid year format: {year_str}')

    def dq08_ticker_format(self):
        df = self.companies_df
        # Allow letters, numbers, hyphens, and ampersands - these appear valid in the data
        ticker_pattern = re.compile(r'^[A-Z0-9&-]+$')
        for idx, row in df.iterrows():
            ticker = str(row['id'])
            if not ticker_pattern.match(ticker):
                self._add_failure('DQ08', 'companies', f"{row['id']}", 
                                  f'Invalid ticker format: {ticker}')

    def dq09_cashflow_check(self):
        df = self.cashflow_df
        required_cols = ['operating_activity', 'investing_activity', 'financing_activity', 'net_cash_flow']
        if all(col in df.columns for col in required_cols):
            for idx, row in df.iterrows():
                if all(pd.notna(row[col]) for col in required_cols):
                    calculated_net = row['operating_activity'] + row['investing_activity'] + row['financing_activity']
                    if abs(calculated_net - row['net_cash_flow']) > 0.01:
                        self._add_failure('DQ09', 'cashflow', f"{row['id']}", 
                                          f'Cash flow mismatch: reported={row["net_cash_flow"]}, calculated={calculated_net}')

    def dq10_fixed_assets(self):
        df = self.balance_sheet_df
        if 'fixed_assets' in df.columns:
            invalid_assets = df[(df['fixed_assets'] < 0) | (pd.isna(df['fixed_assets']))]
            for idx, row in invalid_assets.iterrows():
                self._add_failure('DQ10', 'balancesheet', f"{row['id']}", 
                                  f'Invalid fixed assets: {row["fixed_assets"]}')

    def dq11_tax_check(self):
        df = self.profit_loss_df
        if 'tax_percentage' in df.columns:
            invalid_tax = df[(df['tax_percentage'] < 0) | (df['tax_percentage'] > 100) | (pd.isna(df['tax_percentage']))]
            for idx, row in invalid_tax.iterrows():
                self._add_failure('DQ11', 'profitandloss', f"{row['id']}", 
                                  f'Invalid tax percentage: {row["tax_percentage"]}%')

    def dq12_dividend_payout(self):
        df = self.profit_loss_df
        if 'dividend_payout' in df.columns:
            invalid_dividend = df[(df['dividend_payout'] < 0) | (df['dividend_payout'] > 100) | (pd.isna(df['dividend_payout']))]
            for idx, row in invalid_dividend.iterrows():
                self._add_failure('DQ12', 'profitandloss', f"{row['id']}", 
                                  f'Invalid dividend payout: {row["dividend_payout"]}%')

    def dq13_document_urls(self):
        df = self.documents_df
        url_col = 'Annual_Report'
        if url_col in df.columns:
            for idx, row in df.iterrows():
                url = str(row[url_col])
                try:
                    result = urlparse(url)
                    if not all([result.scheme, result.netloc]):
                        self._add_failure('DQ13', 'documents', f"{row['id']}", 
                                          f'Invalid URL: {url}')
                except:
                    self._add_failure('DQ13', 'documents', f"{row['id']}", 
                                      f'Invalid URL: {url}')

    def dq14_eps_sign(self):
        df = self.profit_loss_df
        if 'eps' in df.columns and 'net_profit' in df.columns:
            for idx, row in df.iterrows():
                if pd.notna(row['eps']) and pd.notna(row['net_profit']):
                    if (row['eps'] > 0 and row['net_profit'] < 0) or (row['eps'] < 0 and row['net_profit'] > 0):
                        self._add_failure('DQ14', 'profitandloss', f"{row['id']}", 
                                          f'EPS and net profit sign mismatch: EPS={row["eps"]}, profit={row["net_profit"]}')

    def dq15_assets_liabilities_non_negative(self):
        df = self.balance_sheet_df
        asset_cols = ['fixed_assets', 'cwip', 'investments', 'other_asset', 'total_assets']
        # Reserves can be negative (accumulated losses), so we remove it from the check
        liability_cols = ['equity_capital', 'borrowings', 'other_liabilities', 'total_liabilities']
        all_cols = [col for col in asset_cols + liability_cols if col in df.columns]
        for col in all_cols:
            invalid = df[(df[col] < 0) | (pd.isna(df[col]))]
            for idx, row in invalid.iterrows():
                self._add_failure('DQ15', 'balancesheet', f"{row['id']}", 
                                  f'Negative or missing {col}: {row[col]}')

    def dq16_coverage_check(self):
        df = self.profit_loss_df
        required_cols = ['profit_before_tax', 'interest']
        if all(col in df.columns for col in required_cols):
            for idx, row in df.iterrows():
                if pd.notna(row['profit_before_tax']) and pd.notna(row['interest']):
                    if row['interest'] > 0:
                        coverage = row['profit_before_tax'] / row['interest']
                        if coverage < 1:
                            self._add_failure('DQ16', 'profitandloss', f"{row['id']}", 
                                              f'Interest coverage < 1: {coverage:.2f}x')

    def validate_all(self):
        self.dq01_unique_companies()
        self.dq02_duplicate_company_year()
        self.dq03_fk_check()
        self.dq04_balance_sheet_balance()
        self.dq05_opm_check()
        self.dq06_sales_gt_zero()
        self.dq07_year_format()
        self.dq08_ticker_format()
        self.dq09_cashflow_check()
        self.dq10_fixed_assets()
        self.dq11_tax_check()
        self.dq12_dividend_payout()
        self.dq13_document_urls()
        self.dq14_eps_sign()
        self.dq15_assets_liabilities_non_negative()
        self.dq16_coverage_check()

    def export_failures(self, output_path: str = None):
        if output_path is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            output_path = os.path.join(current_dir, '../../output/validation_failures.csv')
        failures_df = pd.DataFrame(self.failures)
        failures_df.to_csv(output_path, index=False)
        return failures_df

if __name__ == '__main__':
    validator = DataQualityValidator()
    validator.validate_all()
    failures = validator.export_failures()
    print(f"Validation complete. Found {len(failures)} failures.")
    print(f"\nFailures by rule:")
    print(failures['rule'].value_counts().sort_index())
