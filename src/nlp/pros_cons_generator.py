
import sqlite3
import os
import pandas as pd
from typing import Dict, List, Any
from pathlib import Path
from .rules import (
    PRO_RULES,
    CON_RULES,
    get_all_pro_rules,
    get_all_con_rules
)


def get_database_path():
    base_dir = Path(__file__).resolve().parents[2]
    return str(base_dir / "db" / "nifty100.db")


def load_all_data():
    """Load all necessary data from the database with multiple years for each company"""
    conn = sqlite3.connect(get_database_path())

    # Load companies
    companies = pd.read_sql("SELECT id, company_name, roe_percentage, roce_percentage FROM companies", conn)

    # Load sectors (get latest sector per company)
    sectors = pd.read_sql("""
        SELECT 
            s.company_id, 
            s.sector, 
            s.industry
        FROM sectors s
        ORDER BY s.id DESC
    """, conn)
    sectors = sectors.drop_duplicates(subset=["company_id"], keep="first")

    # Load all financial ratios (keep all years)
    financial_ratios = pd.read_sql("""
        SELECT fr.* FROM financial_ratios fr ORDER BY fr.company_id, fr.year DESC
    """, conn)

    # Load all profit and loss (keep all years)
    profitandloss = pd.read_sql("""
        SELECT p.* FROM profitandloss p ORDER BY p.company_id, p.year DESC
    """, conn)

    # Load all balance sheet (keep all years)
    balancesheet = pd.read_sql("""
        SELECT bs.* FROM balancesheet bs ORDER BY bs.company_id, bs.year DESC
    """, conn)

    # Load all cash flow (keep all years)
    cashflow = pd.read_sql("""
        SELECT cf.* FROM cashflow cf ORDER BY cf.company_id, cf.year DESC
    """, conn)

    # Load peer percentiles
    peer_percentiles = pd.read_sql("""
        SELECT p.* FROM peer_percentiles p ORDER BY p.company_id, p.year DESC
    """, conn)

    conn.close()

    return {
        "companies": companies,
        "sectors": sectors,
        "financial_ratios": financial_ratios,
        "profitandloss": profitandloss,
        "balancesheet": balancesheet,
        "cashflow": cashflow,
        "peer_percentiles": peer_percentiles
    }


def calculate_cagr(start_value, end_value, periods):
    """Calculate CAGR given start value, end value, and number of periods"""
    if (
        pd.isna(start_value) 
        or pd.isna(end_value) 
        or pd.isna(periods) 
        or start_value <= 0 
        or end_value <= 0 
        or periods <= 0
    ):
        return None
    try:
        return round(((end_value / start_value) ** (1 / periods)) - 1, 4) * 100
    except (ZeroDivisionError, ValueError):
        return None


def calculate_company_metrics(company_id, profitandloss_df, cashflow_df):
    """Calculate additional metrics needed for rule evaluation for a single company"""
    metrics = {
        "sales_cagr_3y": None,
        "profit_cagr_3y": None,
        "eps_cagr_3y": None,
        "free_cash_flows": []
    }

    # Calculate 3-year CAGRs
    if len(profitandloss_df) >= 4:
        # Sales CAGR
        sales = profitandloss_df.sort_values("year")["sales"].dropna().tolist()
        if len(sales) >=4:
            metrics["sales_cagr_3y"] = calculate_cagr(sales[-4], sales[-1], 3)
        
        # Profit CAGR
        profit = profitandloss_df.sort_values("year")["net_profit"].dropna().tolist()
        if len(profit)>=4:
            metrics["profit_cagr_3y"] = calculate_cagr(profit[-4], profit[-1],3)
        
        # EPS CAGR
        eps = profitandloss_df.sort_values("year")["eps"].dropna().tolist()
        if len(eps)>=4:
            metrics["eps_cagr_3y"] = calculate_cagr(eps[-4], eps[-1], 3)

    # Calculate free cash flow for available years
    cashflow_sorted = cashflow_df.sort_values("year", ascending=False)
    for _, row in cashflow_sorted.iterrows():
        if pd.notna(row.get("operating_activity")) and pd.notna(row.get("investing_activity")):
            fcf = row["operating_activity"] + row["investing_activity"]
            metrics["free_cash_flows"].append(fcf)

    return metrics


def evaluate_rule_for_year(rule, year_data):
    """Evaluate a single rule for a single year of data"""
    company_features = year_data

    # PRO Rules Evaluation
    if rule["id"] == "PRO_RULE_1":
        roe = company_features.get("roe_percentage")
        return roe and not pd.isna(roe) and roe > 20
    elif rule["id"] == "PRO_RULE_2":
        roce = company_features.get("roce_percentage")
        return roce and not pd.isna(roce) and roce > 15
    elif rule["id"] == "PRO_RULE_3":
        sales_cagr = company_features.get("sales_cagr_3y")
        return sales_cagr and not pd.isna(sales_cagr) and sales_cagr > 10
    elif rule["id"] == "PRO_RULE_4":
        eps_cagr = company_features.get("eps_cagr_3y")
        return eps_cagr and not pd.isna(eps_cagr) and eps_cagr > 10
    elif rule["id"] == "PRO_RULE_5":
        opm = company_features.get("opm_percentage")
        return opm and not pd.isna(opm) and opm > 15
    elif rule["id"] == "PRO_RULE_6":
        asset_turnover = company_features.get("ratio6")
        return asset_turnover and not pd.isna(asset_turnover) and asset_turnover > 0.5
    elif rule["id"] == "PRO_RULE_7":
        fcf = company_features.get("free_cash_flow")
        return fcf and not pd.isna(fcf) and fcf > 0
    elif rule["id"] == "PRO_RULE_8":
        dte = company_features.get("ratio4")
        return dte is not None and not pd.isna(dte) and dte < 1
    elif rule["id"] == "PRO_RULE_9":
        icr = company_features.get("ratio5")
        return icr and not pd.isna(icr) and icr > 5
    elif rule["id"] == "PRO_RULE_10":
        dp = company_features.get("dividend_payout")
        return dp is not None and not pd.isna(dp) and 30 <= dp <= 50
    elif rule["id"] == "PRO_RULE_11":
        cfo_quality = company_features.get("cfo_quality_score")
        return cfo_quality and not pd.isna(cfo_quality) and cfo_quality > 1
    elif rule["id"] == "PRO_RULE_12":
        avg_pct = company_features.get("avg_peer_percentile")
        return avg_pct is not None and not pd.isna(avg_pct) and avg_pct >= 80

    # CON Rules Evaluation
    elif rule["id"] == "CON_RULE_1":
        roe = company_features.get("roe_percentage")
        return roe and not pd.isna(roe) and roe < 10
    elif rule["id"] == "CON_RULE_2":
        roce = company_features.get("roce_percentage")
        return roce and not pd.isna(roce) and roce < 10
    elif rule["id"] == "CON_RULE_3":
        sales_cagr = company_features.get("sales_cagr_3y")
        return sales_cagr is not None and not pd.isna(sales_cagr) and sales_cagr < 0
    elif rule["id"] == "CON_RULE_4":
        eps_cagr = company_features.get("eps_cagr_3y")
        return eps_cagr is not None and not pd.isna(eps_cagr) and eps_cagr < 0
    elif rule["id"] == "CON_RULE_5":
        opm = company_features.get("opm_percentage")
        return opm and not pd.isna(opm) and opm < 5
    elif rule["id"] == "CON_RULE_6":
        fcf = company_features.get("free_cash_flow")
        return fcf is not None and not pd.isna(fcf) and fcf < 0
    elif rule["id"] == "CON_RULE_7":
        dte = company_features.get("ratio4")
        return dte is not None and not pd.isna(dte) and dte > 2
    elif rule["id"] == "CON_RULE_8":
        icr = company_features.get("ratio5")
        return icr and not pd.isna(icr) and icr < 2
    elif rule["id"] == "CON_RULE_9":
        dp = company_features.get("dividend_payout")
        return dp is not None and not pd.isna(dp) and dp == 0
    elif rule["id"] == "CON_RULE_10":
        cfo_quality = company_features.get("cfo_quality_score")
        return cfo_quality and not pd.isna(cfo_quality) and cfo_quality < 0.5
    elif rule["id"] == "CON_RULE_11":
        avg_pct = company_features.get("avg_peer_percentile")
        return avg_pct is not None and not pd.isna(avg_pct) and avg_pct <= 20
    elif rule["id"] == "CON_RULE_12":
        capex_intensity = company_features.get("capex_intensity_pct")
        return capex_intensity and not pd.isna(capex_intensity) and capex_intensity > 8

    return False


def generate_pros_cons_for_company_detailed(company_id, company_row, all_data):
    """Generate detailed pros/cons for a single company with per-rule confidence"""
    # Get company-specific data
    company_pnl = all_data["profitandloss"][all_data["profitandloss"]["company_id"] == company_id].copy()
    company_bs = all_data["balancesheet"][all_data["balancesheet"]["company_id"] == company_id].copy()
    company_cf = all_data["cashflow"][all_data["cashflow"]["company_id"] == company_id].copy()
    company_fr = all_data["financial_ratios"][all_data["financial_ratios"]["company_id"] == company_id].copy()
    company_sector = all_data["sectors"][all_data["sectors"]["company_id"] == company_id]
    
    company_peers = all_data["peer_percentiles"][all_data["peer_percentiles"]["company_id"] == company_id]
    if not company_peers.empty:
        yearly_peer_pct = dict(zip(company_peers["year"], company_peers["percentile_rank"]))
    else:
        yearly_peer_pct = {}

    # Calculate company metrics
    metrics = calculate_company_metrics(company_id, company_pnl, company_cf)

    # Get latest year's data for base features
    latest_pnl = company_pnl.head(1).iloc[0] if not company_pnl.empty else None
    latest_bs = company_bs.head(1).iloc[0] if not company_bs.empty else None
    latest_fr = company_fr.head(1).iloc[0] if not company_fr.empty else None
    latest_cf = company_cf.head(1).iloc[0] if not company_cf.empty else None

    # Build latest year features
    latest_features = {
        "company_id": company_id,
        "roe_percentage": company_row.get("roe_percentage"),
        "roce_percentage": company_row.get("roce_percentage"),
        "sales_cagr_3y": metrics["sales_cagr_3y"],
        "profit_cagr_3y": metrics["profit_cagr_3y"],
        "eps_cagr_3y": metrics["eps_cagr_3y"],
        "opm_percentage": latest_pnl.get("opm_percentage") if latest_pnl is not None else None,
        "ratio4": latest_fr.get("ratio4") if latest_fr is not None else None,
        "ratio5": latest_fr.get("ratio5") if latest_fr is not None else None,
        "ratio6": latest_fr.get("ratio6") if latest_fr is not None else None,
        "cfo_quality_score": latest_fr.get("cfo_quality_score") if latest_fr is not None else None,
        "capex_intensity_pct": latest_fr.get("capex_intensity_pct") if latest_fr is not None else None,
        "dividend_payout": latest_fr.get("ratio11") if latest_fr is not None else None,
        "avg_peer_percentile": yearly_peer_pct.get(latest_fr.get("year")) if latest_fr is not None and "year" in latest_fr else (company_peers["percentile_rank"].mean() if not company_peers.empty else None)
    }
    if latest_cf is not None and pd.notna(latest_cf.get("operating_activity")) and pd.notna(latest_cf.get("investing_activity")):
        latest_features["free_cash_flow"] = latest_cf["operating_activity"] + latest_cf["investing_activity"]
    else:
        latest_features["free_cash_flow"] = None

    detailed_results = []

    # Process PRO rules
    for rule in get_all_pro_rules():
        # Evaluate across years
        years_satisfied = 0
        total_evaluable_years = 0
        
        # Get latest 5 years of data to check consistency
        for i in range(min(5, len(company_pnl), len(company_fr))):
            year_pnl = company_pnl.iloc[i] if i < len(company_pnl) else None
            year_fr = company_fr.iloc[i] if i < len(company_fr) else None
            year_cf = company_cf.iloc[i] if i < len(company_cf) else None
            
            year_features = latest_features.copy()
            if year_pnl is not None:
                year_features["opm_percentage"] = year_pnl.get("opm_percentage")
            if year_fr is not None:
                year_features["ratio4"] = year_fr.get("ratio4")
                year_features["ratio5"] = year_fr.get("ratio5")
                year_features["ratio6"] = year_fr.get("ratio6")
                year_features["cfo_quality_score"] = year_fr.get("cfo_quality_score")
                year_features["capex_intensity_pct"] = year_fr.get("capex_intensity_pct")
                year_features["dividend_payout"] = year_fr.get("ratio11")
                year_features["avg_peer_percentile"] = yearly_peer_pct.get(year_fr.get("year")) if "year" in year_fr else None
            if year_cf is not None and pd.notna(year_cf.get("operating_activity")) and pd.notna(year_cf.get("investing_activity")):
                year_features["free_cash_flow"] = year_cf["operating_activity"] + year_cf["investing_activity"]
            
            # Check if we can evaluate this rule for this year
            can_evaluate = True
            if rule["id"] in ["PRO_RULE_1", "PRO_RULE_2"]:
                if pd.isna(year_features.get("roe_percentage")) and pd.isna(year_features.get("roce_percentage")):
                    can_evaluate = False
            
            if can_evaluate:
                total_evaluable_years += 1
                if evaluate_rule_for_year(rule, year_features):
                    years_satisfied += 1
        
        # Only consider rule if we could evaluate for at least 1 year
        if total_evaluable_years > 0:
            # Evaluate latest year specifically for inclusion
            latest_satisfied = evaluate_rule_for_year(rule, latest_features)
            
            if latest_satisfied:
                # Calculate confidence for this rule
                if total_evaluable_years >= 3 and years_satisfied == total_evaluable_years:
                    confidence = 95  # Strong evidence
                elif years_satisfied >= max(2, total_evaluable_years * 0.75):
                    confidence = 80  # Consistently meets
                elif years_satisfied >= 1:
                    confidence = 65  # Meets minimum
                else:
                    confidence = 0
                
                # Convert rule id to format like P01
                rule_num = rule["id"].split("_")[2].zfill(2)
                rule_id_formatted = f"P{rule_num}"
                
                detailed_results.append({
                    "company_id": company_id,
                    "type": "Pro",
                    "rule_id": rule_id_formatted,
                    "text": rule["text"],
                    "confidence_pct": confidence
                })

    # Process CON rules
    for rule in get_all_con_rules():
        # Evaluate across years
        years_satisfied = 0
        total_evaluable_years = 0
        
        # Get latest 5 years of data to check consistency
        for i in range(min(5, len(company_pnl), len(company_fr))):
            year_pnl = company_pnl.iloc[i] if i < len(company_pnl) else None
            year_fr = company_fr.iloc[i] if i < len(company_fr) else None
            year_cf = company_cf.iloc[i] if i < len(company_cf) else None
            
            year_features = latest_features.copy()
            if year_pnl is not None:
                year_features["opm_percentage"] = year_pnl.get("opm_percentage")
            if year_fr is not None:
                year_features["ratio4"] = year_fr.get("ratio4")
                year_features["ratio5"] = year_fr.get("ratio5")
                year_features["ratio6"] = year_fr.get("ratio6")
                year_features["cfo_quality_score"] = year_fr.get("cfo_quality_score")
                year_features["capex_intensity_pct"] = year_fr.get("capex_intensity_pct")
                year_features["dividend_payout"] = year_fr.get("ratio11")
                year_features["avg_peer_percentile"] = yearly_peer_pct.get(year_fr.get("year")) if "year" in year_fr else None
            if year_cf is not None and pd.notna(year_cf.get("operating_activity")) and pd.notna(year_cf.get("investing_activity")):
                year_features["free_cash_flow"] = year_cf["operating_activity"] + year_cf["investing_activity"]
            
            # Check if we can evaluate this rule for this year
            can_evaluate = True
            
            if can_evaluate:
                total_evaluable_years += 1
                if evaluate_rule_for_year(rule, year_features):
                    years_satisfied += 1
        
        # Only consider rule if we could evaluate for at least 1 year
        if total_evaluable_years > 0:
            # Evaluate latest year specifically for inclusion
            latest_satisfied = evaluate_rule_for_year(rule, latest_features)
            
            if latest_satisfied:
                # Calculate confidence for this rule
                if total_evaluable_years >= 3 and years_satisfied == total_evaluable_years:
                    confidence = 95  # Strong evidence
                elif years_satisfied >= max(2, total_evaluable_years * 0.75):
                    confidence = 80  # Consistently meets
                elif years_satisfied >= 1:
                    confidence = 65  # Meets minimum
                else:
                    confidence = 0
                
                # Convert rule id to format like C01
                rule_num = rule["id"].split("_")[2].zfill(2)
                rule_id_formatted = f"C{rule_num}"
                
                detailed_results.append({
                    "company_id": company_id,
                    "type": "Con",
                    "rule_id": rule_id_formatted,
                    "text": rule["text"],
                    "confidence_pct": confidence
                })

    # Ensure every company has at least one Con
    if not any(r["type"] == "Con" for r in detailed_results):
        detailed_results.append({
            "company_id": company_id,
            "type": "Con",
            "rule_id": "C99",
            "text": "The company may face broader macroeconomic and sectoral headwinds.",
            "confidence_pct": 50
        })

    return detailed_results


def generate_pros_cons_for_company(company_id, company_row, all_data):
    """Generate pros and cons for a single company with confidence calculation"""
    # Get company-specific data
    company_pnl = all_data["profitandloss"][all_data["profitandloss"]["company_id"] == company_id].copy()
    company_bs = all_data["balancesheet"][all_data["balancesheet"]["company_id"] == company_id].copy()
    company_cf = all_data["cashflow"][all_data["cashflow"]["company_id"] == company_id].copy()
    company_fr = all_data["financial_ratios"][all_data["financial_ratios"]["company_id"] == company_id].copy()
    company_sector = all_data["sectors"][all_data["sectors"]["company_id"] == company_id]
    
    company_peers = all_data["peer_percentiles"][all_data["peer_percentiles"]["company_id"] == company_id]
    if not company_peers.empty:
        yearly_peer_pct = dict(zip(company_peers["year"], company_peers["percentile_rank"]))
    else:
        yearly_peer_pct = {}

    # Calculate company metrics
    metrics = calculate_company_metrics(company_id, company_pnl, company_cf)

    # Get latest year's data for base features
    latest_pnl = company_pnl.head(1).iloc[0] if not company_pnl.empty else None
    latest_bs = company_bs.head(1).iloc[0] if not company_bs.empty else None
    latest_fr = company_fr.head(1).iloc[0] if not company_fr.empty else None
    latest_cf = company_cf.head(1).iloc[0] if not company_cf.empty else None

    # Build latest year features
    latest_features = {
        "company_id": company_id,
        "roe_percentage": company_row.get("roe_percentage"),
        "roce_percentage": company_row.get("roce_percentage"),
        "sales_cagr_3y": metrics["sales_cagr_3y"],
        "profit_cagr_3y": metrics["profit_cagr_3y"],
        "eps_cagr_3y": metrics["eps_cagr_3y"],
        "opm_percentage": latest_pnl.get("opm_percentage") if latest_pnl is not None else None,
        "ratio4": latest_fr.get("ratio4") if latest_fr is not None else None,
        "ratio5": latest_fr.get("ratio5") if latest_fr is not None else None,
        "ratio6": latest_fr.get("ratio6") if latest_fr is not None else None,
        "cfo_quality_score": latest_fr.get("cfo_quality_score") if latest_fr is not None else None,
        "capex_intensity_pct": latest_fr.get("capex_intensity_pct") if latest_fr is not None else None,
        "dividend_payout": latest_fr.get("ratio11") if latest_fr is not None else None,
        "avg_peer_percentile": yearly_peer_pct.get(latest_fr.get("year")) if latest_fr is not None and "year" in latest_fr else (company_peers["percentile_rank"].mean() if not company_peers.empty else None)
    }
    if latest_cf is not None and pd.notna(latest_cf.get("operating_activity")) and pd.notna(latest_cf.get("investing_activity")):
        latest_features["free_cash_flow"] = latest_cf["operating_activity"] + latest_cf["investing_activity"]
    else:
        latest_features["free_cash_flow"] = None

    # Evaluate each rule across all available years
    pros = []
    cons = []
    rule_confidences = []

    for rule in get_all_pro_rules():
        # Evaluate across years
        years_satisfied = 0
        total_evaluable_years = 0
        
        # Get latest 5 years of data to check consistency
        for i in range(min(5, len(company_pnl), len(company_fr))):
            year_pnl = company_pnl.iloc[i] if i < len(company_pnl) else None
            year_fr = company_fr.iloc[i] if i < len(company_fr) else None
            year_cf = company_cf.iloc[i] if i < len(company_cf) else None
            
            year_features = latest_features.copy()
            if year_pnl is not None:
                year_features["opm_percentage"] = year_pnl.get("opm_percentage")
            if year_fr is not None:
                year_features["ratio4"] = year_fr.get("ratio4")
                year_features["ratio5"] = year_fr.get("ratio5")
                year_features["ratio6"] = year_fr.get("ratio6")
                year_features["cfo_quality_score"] = year_fr.get("cfo_quality_score")
                year_features["capex_intensity_pct"] = year_fr.get("capex_intensity_pct")
                year_features["dividend_payout"] = year_fr.get("ratio11")
                year_features["avg_peer_percentile"] = yearly_peer_pct.get(year_fr.get("year")) if "year" in year_fr else None
            if year_cf is not None and pd.notna(year_cf.get("operating_activity")) and pd.notna(year_cf.get("investing_activity")):
                year_features["free_cash_flow"] = year_cf["operating_activity"] + year_cf["investing_activity"]
            
            # Check if we can evaluate this rule for this year
            can_evaluate = True
            if rule["id"] in ["PRO_RULE_1", "PRO_RULE_2"]:
                if pd.isna(year_features.get("roe_percentage")) and pd.isna(year_features.get("roce_percentage")):
                    can_evaluate = False
            # Check other rules as needed
            
            if can_evaluate:
                total_evaluable_years += 1
                if evaluate_rule_for_year(rule, year_features):
                    years_satisfied += 1
        
        # Only consider rule if we could evaluate for at least 1 year
        if total_evaluable_years > 0:
            # Evaluate latest year specifically for inclusion
            latest_satisfied = evaluate_rule_for_year(rule, latest_features)
            
            if latest_satisfied:
                pros.append(rule["text"])
                
                # Calculate confidence for this rule
                if total_evaluable_years >= 3 and years_satisfied == total_evaluable_years:
                    rule_conf = 95  # Strong evidence
                elif years_satisfied >= max(2, total_evaluable_years * 0.75):
                    rule_conf = 80  # Consistently meets
                elif years_satisfied >= 1:
                    rule_conf = 65  # Meets minimum
                else:
                    rule_conf = 0
                
                rule_confidences.append(rule_conf)

    for rule in get_all_con_rules():
        # Evaluate across years
        years_satisfied = 0
        total_evaluable_years = 0
        
        # Get latest 5 years of data to check consistency
        for i in range(min(5, len(company_pnl), len(company_fr))):
            year_pnl = company_pnl.iloc[i] if i < len(company_pnl) else None
            year_fr = company_fr.iloc[i] if i < len(company_fr) else None
            year_cf = company_cf.iloc[i] if i < len(company_cf) else None
            
            year_features = latest_features.copy()
            if year_pnl is not None:
                year_features["opm_percentage"] = year_pnl.get("opm_percentage")
            if year_fr is not None:
                year_features["ratio4"] = year_fr.get("ratio4")
                year_features["ratio5"] = year_fr.get("ratio5")
                year_features["ratio6"] = year_fr.get("ratio6")
                year_features["cfo_quality_score"] = year_fr.get("cfo_quality_score")
                year_features["capex_intensity_pct"] = year_fr.get("capex_intensity_pct")
                year_features["dividend_payout"] = year_fr.get("ratio11")
                year_features["avg_peer_percentile"] = yearly_peer_pct.get(year_fr.get("year")) if "year" in year_fr else None
            if year_cf is not None and pd.notna(year_cf.get("operating_activity")) and pd.notna(year_cf.get("investing_activity")):
                year_features["free_cash_flow"] = year_cf["operating_activity"] + year_cf["investing_activity"]
            
            # Check if we can evaluate this rule for this year
            can_evaluate = True
            # Add checks as needed
            
            if can_evaluate:
                total_evaluable_years += 1
                if evaluate_rule_for_year(rule, year_features):
                    years_satisfied += 1
        
        # Only consider rule if we could evaluate for at least 1 year
        if total_evaluable_years > 0:
            # Evaluate latest year specifically for inclusion
            latest_satisfied = evaluate_rule_for_year(rule, latest_features)
            
            if latest_satisfied:
                cons.append(rule["text"])
                
                # Calculate confidence for this rule
                if total_evaluable_years >= 3 and years_satisfied == total_evaluable_years:
                    rule_conf = 95  # Strong evidence
                elif years_satisfied >= max(2, total_evaluable_years * 0.75):
                    rule_conf = 80  # Consistently meets
                elif years_satisfied >= 1:
                    rule_conf = 65  # Meets minimum
                else:
                    rule_conf = 0
                
                rule_confidences.append(rule_conf)

    # Ensure every company has at least one Con
    if not cons:
        cons.append("The company may face broader macroeconomic and sectoral headwinds.")
        rule_confidences.append(50)

    # Calculate overall confidence (average of rule confidences)
    confidence = round(sum(rule_confidences) / len(rule_confidences)) if rule_confidences else 0

    return {
        "company_id": company_id,
        "company_name": company_row["company_name"],
        "pros": "|".join(pros),
        "cons": "|".join(cons),
        "confidence": confidence
    }


class ProsConsGenerator:
    def __init__(self):
        self.db_path = get_database_path()

    def generate_all(self):
        """Generate pros and cons for all companies and export to CSV"""
        print("Loading data...")
        all_data = load_all_data()

        print("Generating pros and cons...")
        results = []
        detailed_results = []
        for _, company_row in all_data["companies"].iterrows():
            company_id = company_row["id"]
            company_result = generate_pros_cons_for_company(company_id, company_row, all_data)
            results.append(company_result)
            
            # Generate detailed results
            company_detailed = generate_pros_cons_for_company_detailed(company_id, company_row, all_data)
            detailed_results.extend(company_detailed)

        # Convert to DataFrame and filter
        results_df = pd.DataFrame(results)
        print(f"Generated {len(results_df)} records before filtering")
        
        # Only keep records with confidence > 60
        filtered_df = results_df[results_df["confidence"] > 60].copy().reset_index(drop=True)
        print(f"Keeping {len(filtered_df)} records with confidence >60")

        # Export to CSV
        output_path = Path(get_database_path()).parent.parent / "output" / "pros_and_cons.csv"
        output_path.parent.mkdir(exist_ok=True, parents=True)
        filtered_df.to_csv(output_path, index=False)

        # Generate detailed CSV
        detailed_df = pd.DataFrame(detailed_results)
        # Filter detailed results to only include companies that passed the overall confidence check
        valid_company_ids = filtered_df["company_id"].tolist()
        detailed_filtered_df = detailed_df[detailed_df["company_id"].isin(valid_company_ids)].copy().reset_index(drop=True)
        
        detailed_output_path = Path(get_database_path()).parent.parent / "output" / "pros_cons_generated.csv"
        detailed_filtered_df.to_csv(detailed_output_path, index=False)
        print(f"Successfully exported detailed results to {detailed_output_path}")

        print(f"Successfully exported to {output_path}")
        return filtered_df, detailed_filtered_df


if __name__ == "__main__":
    generator = ProsConsGenerator()
    generator.generate_all()
