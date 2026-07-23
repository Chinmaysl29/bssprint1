
PRO_RULES = [
    {
        "id": "PRO_RULE_1",
        "condition": "ROE > 20",
        "text": "Consistently high return on equity above 20% demonstrates exceptional capital efficiency.",
    },
    {
        "id": "PRO_RULE_2",
        "condition": "ROCE > 15",
        "text": "Strong return on capital employed above 15% indicates efficient use of both debt and equity.",
    },
    {
        "id": "PRO_RULE_3",
        "condition": "Sales_CAGR > 10",
        "text": "Double-digit revenue compounded annual growth reflects robust business expansion.",
    },
    {
        "id": "PRO_RULE_4",
        "condition": "EPS_CAGR > 10",
        "text": "Earnings per share growing above 10% annually shows increasing profitability per share.",
    },
    {
        "id": "PRO_RULE_5",
        "condition": "OPM > 15",
        "text": "Operating margin above 15% highlights strong operational efficiency and pricing power.",
    },
    {
        "id": "PRO_RULE_6",
        "condition": "Asset_Turnover > 0.5",
        "text": "Asset turnover ratio above 0.5x indicates efficient utilization of company assets.",
    },
    {
        "id": "PRO_RULE_7",
        "condition": "FCF_Positive",
        "text": "Consistently positive free cash flow provides financial flexibility for growth and dividends.",
    },
    {
        "id": "PRO_RULE_8",
        "condition": "D_E_Ratio < 1",
        "text": "Debt-to-equity ratio below 1 reflects a strong balance sheet with conservative leverage.",
    },
    {
        "id": "PRO_RULE_9",
        "condition": "Interest_Coverage > 5",
        "text": "Interest coverage ratio above 5x shows strong ability to service debt obligations.",
    },
    {
        "id": "PRO_RULE_10",
        "condition": "Dividend_Payout_30_50",
        "text": "Dividend payout ratio between 30-50% balances reinvestment and shareholder returns.",
    },
    {
        "id": "PRO_RULE_11",
        "condition": "CFO_Quality_High",
        "text": "High cash flow from operations quality indicates sustainable core business performance.",
    },
    {
        "id": "PRO_RULE_12",
        "condition": "Peer_Percentile_Top_20",
        "text": "Ranking in the top 20th percentile among peers confirms competitive advantage.",
    },
]

CON_RULES = [
    {
        "id": "CON_RULE_1",
        "condition": "ROE < 10",
        "text": "Return on equity below 10% indicates subpar profitability and capital allocation.",
    },
    {
        "id": "CON_RULE_2",
        "condition": "ROCE < 10",
        "text": "Return on capital employed below 10% suggests inefficient use of capital resources.",
    },
    {
        "id": "CON_RULE_3",
        "condition": "Sales_CAGR < 0",
        "text": "Negative revenue compounded annual growth signals business contraction.",
    },
    {
        "id": "CON_RULE_4",
        "condition": "EPS_CAGR < 0",
        "text": "Declining earnings per share indicates falling profitability over time.",
    },
    {
        "id": "CON_RULE_5",
        "condition": "OPM < 5",
        "text": "Operating margin below 5% shows weak operational efficiency and pricing power.",
    },
    {
        "id": "CON_RULE_6",
        "condition": "FCF_Negative",
        "text": "Consistently negative free cash flow raises concerns about financial sustainability.",
    },
    {
        "id": "CON_RULE_7",
        "condition": "D_E_Ratio > 2",
        "text": "Debt-to-equity ratio above 2 indicates high leverage and increased financial risk.",
    },
    {
        "id": "CON_RULE_8",
        "condition": "Interest_Coverage < 2",
        "text": "Interest coverage ratio below 2x suggests difficulty in servicing debt obligations.",
    },
    {
        "id": "CON_RULE_9",
        "condition": "Dividend_Payout_Zero",
        "text": "No dividend payout may indicate lack of profitability or shareholder focus.",
    },
    {
        "id": "CON_RULE_10",
        "condition": "CFO_Quality_Low",
        "text": "Low cash flow quality suggests potential issues with core business operations.",
    },
    {
        "id": "CON_RULE_11",
        "condition": "Peer_Percentile_Bottom_20",
        "text": "Ranking in the bottom 20th percentile among peers indicates competitive weakness.",
    },
    {
        "id": "CON_RULE_12",
        "condition": "Capex_Intensity_High",
        "text": "High capital expenditure intensity may pressure short-term profitability.",
    },
]


def get_pro_rule_by_id(rule_id: str):
    for rule in PRO_RULES:
        if rule["id"] == rule_id:
            return rule
    return None


def get_con_rule_by_id(rule_id: str):
    for rule in CON_RULES:
        if rule["id"] == rule_id:
            return rule
    return None


def get_all_pro_rules():
    return PRO_RULES


def get_all_con_rules():
    return CON_RULES

