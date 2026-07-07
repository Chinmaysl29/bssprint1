import sqlite3
import yaml
import pandas as pd
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent))
from analytics.cagr import (
    calculate_multiyear_sales_cagr,
    calculate_multiyear_profit_cagr,
    calculate_multiyear_eps_cagr,
    pivot_multiyear_cagr
)


class StockScreener:
    def __init__(self, db_path="db/nifty100.db", config_path="config/screener_config.yaml"):
        self.db_path = Path(db_path)
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.conn = sqlite3.connect(self.db_path)
        self.financial_data = None

    def load_config(self):
        """Load screener configuration from YAML file"""
        if self.config_path.exists():
            with open(self.config_path, "r") as f:
                return yaml.safe_load(f)
        return {}

    def load_financial_data(self):
        """Load and merge all necessary financial data from the database"""
        # Query to get latest year data for each company (deduplicated)
        query = """
        WITH latest_year AS (
            SELECT company_id, MAX(year) as latest_year
            FROM financial_ratios
            GROUP BY company_id
        ),
        fr_latest AS (
            SELECT fr.*
            FROM financial_ratios fr
            JOIN latest_year ly ON fr.company_id = ly.company_id AND fr.year = ly.latest_year
        ),
        pl_latest AS (
            SELECT p.*, ROW_NUMBER() OVER (PARTITION BY p.company_id ORDER BY p.id DESC) as rn
            FROM profitandloss p
            JOIN latest_year ly ON p.company_id = ly.company_id AND p.year = ly.latest_year
        ),
        bs_latest AS (
            SELECT b.*, ROW_NUMBER() OVER (PARTITION BY b.company_id ORDER BY b.id DESC) as rn
            FROM balancesheet b
            JOIN latest_year ly ON b.company_id = ly.company_id AND b.year = ly.latest_year
        ),
        cf_latest AS (
            SELECT c.*, ROW_NUMBER() OVER (PARTITION BY c.company_id ORDER BY c.id DESC) as rn
            FROM cashflow c
            JOIN latest_year ly ON c.company_id = ly.company_id AND c.year = ly.latest_year
        ),
        sectors_dedup AS (
            SELECT s.*, ROW_NUMBER() OVER (PARTITION BY s.company_id ORDER BY s.id DESC) as rn
            FROM sectors s
        ),
        mc_latest AS (
            SELECT mc.*, ROW_NUMBER() OVER (PARTITION BY mc.company_id ORDER BY mc.id DESC) as rn
            FROM market_cap mc
        )
        SELECT DISTINCT
            c.id as company_id,
            c.company_name,
            c.roe_percentage,
            c.roce_percentage,
            c.book_value,
            s.sector,
            s.cap,
            pl.sales,
            pl.net_profit as pat,
            pl.eps,
            pl.dividend_payout,
            pl.operating_profit,
            pl.other_income,
            pl.interest,
            pl.opm_percentage,
            bs.equity_capital,
            bs.reserves,
            bs.borrowings,
            bs.total_assets,
            cf.operating_activity,
            cf.investing_activity,
            fr.free_cash_flow_cr as fcf,
            fr.cfo_quality_score,
            mc.mc1 as market_cap,
            mc.mc2 as market_cap_2
        FROM companies c
        LEFT JOIN sectors_dedup s ON c.id = s.company_id AND s.rn = 1
        LEFT JOIN fr_latest fr ON c.id = fr.company_id
        LEFT JOIN pl_latest pl ON c.id = pl.company_id AND pl.rn = 1
        LEFT JOIN bs_latest bs ON c.id = bs.company_id AND bs.rn = 1
        LEFT JOIN cf_latest cf ON c.id = cf.company_id AND cf.rn = 1
        LEFT JOIN mc_latest mc ON c.id = mc.company_id AND mc.rn = 1
        """
        self.financial_data = pd.read_sql(query, self.conn)

        # Calculate derived metrics
        self.financial_data['debt_equity'] = self.financial_data.apply(
            lambda row: row['borrowings'] / (row['equity_capital'] + row['reserves'])
            if pd.notna(row['borrowings']) and pd.notna(row['equity_capital']) and pd.notna(row['reserves']) and (row['equity_capital'] + row['reserves']) != 0
            else None,
            axis=1
        )

        self.financial_data['asset_turnover'] = self.financial_data.apply(
            lambda row: row['sales'] / row['total_assets']
            if pd.notna(row['sales']) and pd.notna(row['total_assets']) and row['total_assets'] != 0
            else None,
            axis=1
        )

        # Determine if company is debt free (borrowings == 0 or NaN)
        self.financial_data['icr_label'] = self.financial_data['borrowings'].apply(
            lambda x: "Debt Free" if pd.notna(x) and x == 0 else None
        )

        # Calculate ICR: set to infinity for debt free companies
        self.financial_data['icr'] = self.financial_data.apply(
            lambda row: float('inf')
            if pd.notna(row['icr_label']) and row['icr_label'] == "Debt Free"
            else (row['operating_profit'] + row['other_income']) / row['interest']
            if pd.notna(row['operating_profit']) and pd.notna(row['other_income']) and pd.notna(row['interest']) and row['interest'] != 0
            else None,
            axis=1
        )

        # Load CAGR data for 3-Year and 5-Year for all metrics
        sales_cagr = calculate_multiyear_sales_cagr(period_list=[3,5])
        sales_pivot = pivot_multiyear_cagr(sales_cagr, 'sales')
        
        profit_cagr = calculate_multiyear_profit_cagr(period_list=[3,5])
        profit_pivot = pivot_multiyear_cagr(profit_cagr, 'net_profit')
        
        eps_cagr = calculate_multiyear_eps_cagr(period_list=[3,5])
        eps_pivot = pivot_multiyear_cagr(eps_cagr, 'eps')
        
        # Merge all CAGR data
        if not sales_pivot.empty:
            self.financial_data = self.financial_data.merge(
                sales_pivot[['company_id', '3-Year_cagr_pct', '5-Year_cagr_pct']],
                on='company_id',
                how='left'
            ).rename(columns={
                '3-Year_cagr_pct': 'revenue_cagr_3y',
                '5-Year_cagr_pct': 'revenue_cagr_5y'
            })
        
        if not profit_pivot.empty:
            self.financial_data = self.financial_data.merge(
                profit_pivot[['company_id', '3-Year_cagr_pct', '5-Year_cagr_pct']],
                on='company_id',
                how='left'
            ).rename(columns={
                '3-Year_cagr_pct': 'pat_cagr_3y',
                '5-Year_cagr_pct': 'pat_cagr_5y'
            })
        
        if not eps_pivot.empty:
            self.financial_data = self.financial_data.merge(
                eps_pivot[['company_id', '3-Year_cagr_pct', '5-Year_cagr_pct']],
                on='company_id',
                how='left'
            ).rename(columns={
                '3-Year_cagr_pct': 'eps_cagr_3y',
                '5-Year_cagr_pct': 'eps_cagr_5y'
            })

        # Calculate P10/P90 Normalization for metrics
        self._calculate_p10_p90_normalization()
        
        # Calculate Sector Comparison (peer metrics)
        self._calculate_sector_comparison()
        
        # Calculate Advanced Composite Score Engine
        self._calculate_advanced_composite_score()

        return self.financial_data
    
    def _calculate_p10_p90_normalization(self):
        """Calculate P10/P90 normalized scores for key metrics"""
        metrics_to_normalize = [
            'roe_percentage', 'roce_percentage', 'revenue_cagr_5y', 
            'pat_cagr_5y', 'eps_cagr_5y', 'cfo_quality_score', 'opm_percentage',
            'asset_turnover', 'dividend_payout'
        ]
        
        for metric in metrics_to_normalize:
            if metric in self.financial_data.columns:
                # Calculate P10 and P90
                p10 = self.financial_data[metric].quantile(0.10)
                p90 = self.financial_data[metric].quantile(0.90)
                
                # Normalize to [0, 1] range, clamping outliers
                self.financial_data[f'{metric}_norm_p10p90'] = self.financial_data[metric].apply(
                    lambda x: max(0, min(1, (x - p10) / (p90 - p10) if (p90 - p10) != 0 else 0.5))
                    if pd.notna(x) else 0.5
                )
    
    def _calculate_sector_comparison(self):
        """Calculate sector-level metrics and peer comparisons"""
        if 'sector' not in self.financial_data.columns:
            return
            
        # Calculate sector averages
        sector_metrics = [
            'roe_percentage', 'roce_percentage', 'revenue_cagr_5y', 'pat_cagr_5y',
            'cfo_quality_score', 'debt_equity', 'opm_percentage', 'asset_turnover'
        ]
        
        sector_agg = self.financial_data.groupby('sector')[sector_metrics].agg(['mean', 'median']).reset_index()
        # Rename columns to include _sector_ prefix
        new_columns = ['sector']
        for col in sector_agg.columns[1:]:
            metric, stat = col
            new_columns.append(f"{metric}_sector_{stat}")
        sector_agg.columns = new_columns
        
        # Merge sector averages back into main data
        self.financial_data = self.financial_data.merge(
            sector_agg, on='sector', how='left'
        )
        
        # Calculate relative performance vs sector median
        for metric in sector_metrics:
            median_col = f'{metric}_sector_median'
            if median_col in self.financial_data.columns:
                self.financial_data[f'{metric}_vs_sector'] = self.financial_data.apply(
                    lambda row: (row[metric] - row[median_col]) if pd.notna(row[metric]) and pd.notna(row[median_col]) else None,
                    axis=1
                )
    
    def _calculate_advanced_composite_score(self):
        """Calculate advanced weighted composite score"""
        # Define weights for each metric (sum to 100)
        score_weights = {
            'roe_percentage_norm_p10p90': 20,
            'roce_percentage_norm_p10p90': 20,
            'revenue_cagr_5y_norm_p10p90': 15,
            'pat_cagr_5y_norm_p10p90': 15,
            'cfo_quality_score_norm_p10p90': 15,
            'opm_percentage_norm_p10p90': 10,
            'asset_turnover_norm_p10p90': 5
        }
        
        # Calculate weighted score
        self.financial_data['advanced_composite_score'] = 0
        for metric, weight in score_weights.items():
            if metric in self.financial_data.columns:
                self.financial_data['advanced_composite_score'] += (
                    self.financial_data[metric] * weight
                )
        
        # Keep the original simple score for backward compatibility
        self.financial_data['composite_quality_score'] = self.financial_data.apply(
            lambda row:
                (row['roe_percentage'] if pd.notna(row['roe_percentage']) else 0) +
                (row['roce_percentage'] if pd.notna(row['roce_percentage']) else 0) +
                (row['revenue_cagr_5y'] if pd.notna(row['revenue_cagr_5y']) else 0) +
                (row['cfo_quality_score'] if pd.notna(row['cfo_quality_score']) else 0) -
                (row['debt_equity'] if pd.notna(row['debt_equity']) else 0),
            axis=1
        )

    def apply_filters(self, df, **kwargs):
        """
        Apply generic filters to the dataframe

        Accepts keyword arguments like:
            roe_min:15, debt_equity_max:1, fcf_min:0, etc.

        Logic:
            - {metric}_min: keep rows where metric >= value
            - {metric}_max: keep rows where metric <= value
        """
        if df is None or df.empty:
            return df

        filtered_df = df.copy()

        # Map filter keys to column names (handle different naming conventions)
        column_mapping = {
            'roe': ['roe_percentage', 'roe'],
            'roce': ['roce_percentage', 'roce'],
            'debt_equity': ['debt_equity', 'debt_to_equity'],
            'debt_to_equity': ['debt_to_equity', 'debt_equity'],
            'fcf': ['fcf'],
            'revenue': ['revenue', 'sales'],
            'sales': ['sales', 'revenue'],
            'pat': ['pat', 'net_profit'],
            'net_profit': ['net_profit', 'pat'],
            'revenue_cagr_3y': ['revenue_cagr_3y'],
            'revenue_cagr_5y': ['revenue_cagr_5y', 'revenue_cagr'],
            'pat_cagr_3y': ['pat_cagr_3y'],
            'pat_cagr_5y': ['pat_cagr_5y', 'pat_cagr'],
            'eps_cagr_3y': ['eps_cagr_3y'],
            'eps_cagr_5y': ['eps_cagr_5y', 'eps_cagr'],
            'opm': ['opm_percentage', 'opm'],
            'pe': ['pe'],
            'pb': ['pb'],
            'dividend_yield': ['dividend_yield'],
            'dividend_payout': ['dividend_payout'],
            'icr': ['icr'],
            'market_cap': ['market_cap', 'market_cap_2'],
            'asset_turnover': ['asset_turnover']
        }

        # Find the first available column in the dataframe
        def get_col_name(df, metric):
            possible_cols = column_mapping.get(metric, [metric])
            for col in possible_cols:
                if col in df.columns:
                    return col
            return None

        # Identify D/E filter keys
        is_de_filter = lambda key: key in ['debt_equity_max', 'debt_to_equity_max', 'debt_equity_min', 'debt_to_equity_min']

        for filter_key, filter_value in kwargs.items():
            if filter_value is None:
                continue

            # Validate filter value
            if not isinstance(filter_value, (int, float)):
                raise ValueError(f"Invalid filter value for {filter_key}: must be numeric, got {type(filter_value).__name__}")

            # Skip D/E filter for financial sector companies (Rule 1)
            if is_de_filter(filter_key) and 'sector' in filtered_df.columns:
                # Apply filter to non-financial companies, keep all financial companies
                non_financial = filtered_df[filtered_df['sector'] != 'Financials']
                financial = filtered_df[filtered_df['sector'] == 'Financials']
                
                # Get col name for D/E
                if filter_key.endswith('_min'):
                    metric = filter_key[:-4]
                else:
                    metric = filter_key[:-4]
                col_name = get_col_name(non_financial, metric)
                
                if col_name:
                    if filter_key.endswith('_min'):
                        filtered_non_financial = non_financial[non_financial[col_name] >= filter_value]
                    else:
                        filtered_non_financial = non_financial[non_financial[col_name] <= filter_value]
                    filtered_df = pd.concat([filtered_non_financial, financial], ignore_index=True)
                continue

            # Determine if it's a min or max filter
            if filter_key.endswith('_min'):
                metric = filter_key[:-4]  # remove '_min'
                operator = '>='
            elif filter_key.endswith('_max'):
                metric = filter_key[:-4]  # remove '_max'
                operator = '<='
            else:
                continue  # skip unrecognized filter keys

            # Get the actual column name
            col_name = get_col_name(filtered_df, metric)

            if col_name:
                if operator == '>=':
                    filtered_df = filtered_df[filtered_df[col_name] >= filter_value]
                elif operator == '<=':
                    filtered_df = filtered_df[filtered_df[col_name] <= filter_value]

        return filtered_df

    def run_screener(self, screen_name=None, export_to_excel=False, excel_filename='screener_output.xlsx', **kwargs):
        """
        Run the specified screen or apply custom filters and return filtered companies

        Args:
            screen_name: Name of predefined screen from config (optional)
            export_to_excel: Whether to export results to Excel
            excel_filename: Name of Excel file to export to
            **kwargs: Custom filters (e.g., roe_min=15, debt_equity_max=1)

        Returns:
            Dictionary with filtered results
        """
        # Load data if not already loaded
        if self.financial_data is None:
            self.load_financial_data()

        filtered_df = self.financial_data.copy()
        display_name = "Custom Screen"
        filters = kwargs

        # If a predefined screen is specified, use its filters
        if screen_name and 'screens' in self.config and screen_name in self.config['screens']:
            screen = self.config['screens'][screen_name]
            display_name = screen.get('name', screen_name)
            # Merge predefined filters with custom kwargs (kwargs take precedence)
            predefined_filters = screen.get('filters', {})
            merged_filters = {**predefined_filters, **kwargs}
            filters = merged_filters
            # Load joined data with all metrics for predefined screens
            filtered_df = self.financial_data.copy()

        # Apply filters
        filtered_companies = self.apply_filters(filtered_df, **filters)
        
        # Export to Excel if requested
        export_result = False
        if export_to_excel:
            export_result = self.export_to_excel(filtered_companies, excel_filename)

        return {
            'screen_name': screen_name or 'custom',
            'screen_display_name': display_name,
            'filters': filters,
            'companies': filtered_companies.to_dict('records'),
            'count': len(filtered_companies),
            'excel_exported': export_result,
            'excel_filename': excel_filename if export_result else None
        }

    def calculate_composite_score(self, df):
        """Calculate a composite score for the filtered companies"""
        if df is None or df.empty:
            return df

        scored_df = df.copy()
        # Simple composite score example (sum of normalized metrics)
        metrics = ['roe_percentage', 'roce_percentage', 'cfo_quality_score']
        for metric in metrics:
            if metric in scored_df.columns:
                max_val = scored_df[metric].max()
                if max_val > 0:
                    scored_df[f'{metric}_norm'] = scored_df[metric] / max_val

        # Calculate composite score as average of normalized metrics
        norm_cols = [col for col in scored_df.columns if col.endswith('_norm')]
        if norm_cols:
            scored_df['composite_score'] = scored_df[norm_cols].mean(axis=1)

        return scored_df

    def export_to_excel(self, df, filename='screener_output.xlsx'):
        """Export screener results to Excel file"""
        if df is None or df.empty:
            return False
        
        # Sort by advanced composite score descending
        sorted_df = df.sort_values('advanced_composite_score', ascending=False, na_position='last')
        
        # Select key columns for export
        export_cols = [
            'company_id', 'company_name', 'sector', 'market_cap',
            'roe_percentage', 'roce_percentage', 'debt_equity',
            'revenue_cagr_3y', 'revenue_cagr_5y', 'pat_cagr_3y', 'pat_cagr_5y',
            'cfo_quality_score', 'opm_percentage', 'asset_turnover',
            'advanced_composite_score', 'composite_quality_score'
        ] + [col for col in sorted_df.columns if col.endswith('_vs_sector')]
        
        # Filter to only available columns
        available_cols = [col for col in export_cols if col in sorted_df.columns]
        export_df = sorted_df[available_cols].copy()
        
        # Export to Excel
        output_path = Path(filename)
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            export_df.to_excel(writer, sheet_name='Screener Results', index=False)
            
            # Get the worksheet for formatting
            worksheet = writer.sheets['Screener Results']
            
            # Auto-fit columns (basic implementation)
            for idx, col in enumerate(export_df.columns):
                max_len = max(
                    export_df[col].astype(str).map(len).max(),
                    len(str(col))
                ) + 2
                worksheet.column_dimensions[chr(65 + idx)].width = min(max_len, 50)
        
        return True
    
    def close(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()
