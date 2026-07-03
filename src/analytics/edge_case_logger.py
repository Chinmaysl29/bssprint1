import os
import sqlite3
import pandas as pd


def get_database_path():
    """Get absolute path to nifty100.db"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, 'db', 'nifty100.db')


def get_output_dir():
    """Get absolute path to output directory"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, 'output')


def format_value(value, ratio_name):
    """Format value with appropriate percentage or just number"""
    if pd.isna(value):
        return "N/A"
    if ratio_name in ['ROE', 'ROCE']:
        return f"{value:.2f}%"
    return f"{value:.2f}"


def log_edge_case(
    company_id: str,
    year: str,
    ratio_name: str,
    calculated_value: float,
    source_value: float,
    difference: float,
    category: str,
    explanation: str,
    output_file: str = "ratio_edge_cases.log"
) -> None:
    """
    Log a single KPI mismatch/edge case to a log file with custom format.

    Args:
        company_id: Unique identifier for the company
        year: Financial year
        ratio_name: Name of the ratio/KPI
        calculated_value: Value calculated by our engine
        source_value: Value from source data/financial_ratios table
        difference: Absolute difference between calculated and source
        category: Category of edge case (e.g., "DATA_SOURCE_ISSUE", "VERSION_DIFFERENCE")
        explanation: Brief explanation of the issue
        output_file: Name of the output log file
    """
    output_dir = get_output_dir()
    os.makedirs(output_dir, exist_ok=True)
    log_path = os.path.join(output_dir, output_file)

    with open(log_path, mode='a', encoding='utf-8') as f:
        f.write(f"[{ratio_name}_WARNING]\n\n")
        f.write(f"Company:\n{company_id}\n\n")
        f.write(f"Year:\n{year}\n\n")
        f.write(f"Calculated:\n{format_value(calculated_value, ratio_name)}\n\n")
        f.write(f"Source:\n{format_value(source_value, ratio_name)}\n\n")
        f.write(f"Reason:\n{explanation}\n\n")
        f.write(f"Category:\n{category}\n\n")
        f.write("---\n\n")


def log_edge_cases_batch(edge_cases: list[dict], output_file: str = "ratio_edge_cases.log") -> None:
    """
    Log a batch of KPI mismatches/edge cases to a log file.

    Args:
        edge_cases: List of dictionaries with keys matching log_edge_case parameters
        output_file: Name of the output log file
    """
    for case in edge_cases:
        log_edge_case(**case, output_file=output_file)


def clear_log(output_file: str = "ratio_edge_cases.log") -> None:
    """Clear the edge case log file"""
    output_dir = get_output_dir()
    log_path = os.path.join(output_dir, output_file)
    if os.path.exists(log_path):
        os.remove(log_path)


if __name__ == "__main__":
    # Example usage
    print("Testing edge case logger...")
    log_edge_case(
        company_id="TCS",
        year="Mar 2024",
        ratio_name="ROE",
        calculated_value=52.0,
        source_value=0.52,
        difference=51.48,
        category="DATA_SOURCE_ISSUE",
        explanation="Source scale mismatch"
    )
    print("Test log written!")
