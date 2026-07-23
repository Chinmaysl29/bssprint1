
import re
import pandas as pd
import sqlite3
import os
from typing import List, Dict, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TextParser:
    def __init__(self):
        self.number_pattern = re.compile(r'\d+\.?\d*')
        self.percent_pattern = re.compile(r'\d+\.?\d*\s*%')
        # Analysis regex: matches variations like "10 Years: 15%", "5 Years   8%", "1 Year: -2%", "Last Year: 17%", "TTM: 47%"
        self.analysis_regex = re.compile(
            r'(?:(\d+)\s*Years?:?\s*|Last\s*Year:?\s*|TTM:?\s*)(-?\d+\.?\d*)%',
            re.IGNORECASE
        )
    
    def extract_percentages(self, text: str) -> List[float]:
        matches = self.percent_pattern.findall(text)
        return [float(match.replace('%', '').strip()) for match in matches]
    
    def extract_numbers(self, text: str) -> List[float]:
        matches = self.number_pattern.findall(text)
        return [float(match) for match in matches]
    
    def parse_analysis_text(self, text: str) -> Optional[Dict[str, any]]:
        """
        Parses analysis text (like "10 Years: 15%", "TTM: 47%") into structured data.
        
        Args:
            text: The text to parse
            
        Returns:
            Dictionary with 'years' (int or None for TTM), 'value' (float), and 'period_type' (str)
        """
        if pd.isna(text) or (isinstance(text, str) and text.strip() == ""):
            logger.warning("Empty or NaN text provided for analysis parsing")
            return None
        
        match = self.analysis_regex.search(text.strip())
        if not match:
            logger.error(f"Failed to parse analysis text: '{text}'")
            return None
        
        years_str, value_str = match.groups()
        
        # Determine period type and years
        period_type = None
        years = None
        
        if 'TTM' in text.upper():
            period_type = 'TTM'
            years = None
        elif years_str is None:
            period_type = 'Last Year'
            years = 1
        else:
            period_type = f"{years_str} Years"
            years = int(years_str)
        
        value = float(value_str)
        
        return {
            'years': years,
            'value': value,
            'period_type': period_type
        }
    
    def extract_metrics(self, text: str) -> Dict[str, any]:
        metrics = {}
        
        if not text or pd.isna(text):
            return metrics
            
        text_lower = text.lower()
        
        if 'roe' in text_lower:
            roe_percentages = self.extract_percentages(text)
            if roe_percentages:
                metrics['roe'] = roe_percentages[0]
                
        if 'debt' in text_lower:
            debt_numbers = self.extract_numbers(text)
            if debt_numbers:
                metrics['debt_to_equity'] = debt_numbers[0]
                
        if 'interest' in text_lower and 'coverage' in text_lower:
            coverage_numbers = self.extract_numbers(text)
            if coverage_numbers:
                metrics['interest_coverage'] = coverage_numbers[0]
                
        if 'sales' in text_lower or 'revenue' in text_lower:
            sales_percentages = self.extract_percentages(text)
            if sales_percentages:
                metrics['sales_growth'] = sales_percentages[0]
                
        if 'profit' in text_lower or 'eps' in text_lower:
            profit_percentages = self.extract_percentages(text)
            if profit_percentages:
                metrics['profit_growth'] = profit_percentages[0]
                
        if 'p/e' in text_lower or 'pe ratio' in text_lower:
            pe_numbers = self.extract_numbers(text)
            if pe_numbers:
                metrics['pe_ratio'] = pe_numbers[0]
                
        if 'p/b' in text_lower or 'pb ratio' in text_lower:
            pb_numbers = self.extract_numbers(text)
            if pb_numbers:
                metrics['pb_ratio'] = pb_numbers[0]
                
        if 'promoter' in text_lower and 'holding' in text_lower:
            promoter_percentages = self.extract_percentages(text)
            if promoter_percentages:
                metrics['promoter_holding'] = promoter_percentages[0]
                
        return metrics
    
    def parse_pros(self, pros_text: str) -> List[str]:
        if not pros_text or pd.isna(pros_text):
            return []
        pros = pros_text.split('.')
        pros = [pro.strip() for pro in pros if pro.strip()]
        return pros
    
    def parse_cons(self, cons_text: str) -> List[str]:
        if not cons_text or pd.isna(cons_text):
            return []
        cons = cons_text.split('.')
        cons = [con.strip() for con in cons if con.strip()]
        return cons
    
    def parse_company_analysis(self, company_id: str, db_path: Optional[str] = None) -> Dict[str, any]:
        """
        Parses all analysis columns for a given company from the database.
        
        Args:
            company_id: The company's ID
            db_path: Path to nifty100.db (optional, will use default if not provided)
            
        Returns:
            Dictionary with parsed data for each analysis column
        """
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            db_path = os.path.join(base_dir, 'db', 'nifty100.db')
        
        conn = sqlite3.connect(db_path)
        query = "SELECT * FROM analysis WHERE company_id = ?"
        df = pd.read_sql(query, conn, params=(company_id,))
        conn.close()
        
        results = {
            'company_id': company_id,
            'columns': {}
        }
        
        for _, row in df.iterrows():
            for col in ['compounded_sales_growth', 'compounded_profit_growth', 'stock_price_cagr', 'roe']:
                text = row[col]
                parsed = self.parse_analysis_text(text)
                if parsed:
                    if col not in results['columns']:
                        results['columns'][col] = []
                    results['columns'][col].append(parsed)
        
        return results


if __name__ == "__main__":
    parser = TextParser()
    
    # Test the analysis parser
    test_cases = [
        "10 Years:     15%",
        "5 Years:       8%",
        "3 Years:       4%",
        "1 Year:        -2%",
        "Last Year:    17%",
        "10 Years:      27%",
        "5 Years:       22%",
        "TTM:            47%",
        "TTM:            -3%",
        "Invalid text: no percentage here"
    ]
    
    print("=== Testing Analysis Parser ===")
    for test in test_cases:
        parsed = parser.parse_analysis_text(test)
        print(f"Input: '{test}'")
        if parsed:
            print(f"  Output: Period Type = {parsed['period_type']}, Years = {parsed['years']}, Value = {parsed['value']}")
        else:
            print("  Output: Failed to parse")
        print()
    
    # Test with HDFCBANK
    print("=== Testing Company Analysis (HDFCBANK) ===")
    hdfc_analysis = parser.parse_company_analysis("HDFCBANK")
    print(hdfc_analysis)
