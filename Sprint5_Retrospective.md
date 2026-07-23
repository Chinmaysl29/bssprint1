# Sprint 5 Retrospective

## Completed Work
1. **Cash Flow Intelligence**: Built robust logic in `cashflow_kpis.py` to correctly identify free cash flow yields and analyze the cash flow waterfall across Operating, Investing, and Financing activities.
2. **NLP Engine**: Developed `pros_cons_generator.py` to auto-generate qualitative assessments for each company. It successfully pulls in 10-year CAGRs, ROE percentiles, and Sector rankings to synthesize human-readable Pros & Cons.
3. **Advanced PDF Reporting Suite**:
   - `tearsheet.py`: Standardized 2-page individual company overviews.
   - `sector_report.py`: Aggregated 10-year trends and comparative rankings across 10 distinct sectors.
   - `portfolio_summary.py`: High-level portfolio analytics with macro-distributions (ROE, Sectors, Capital Allocation) and global rankings.
4. **Automated Quality Assurance**: Wrote and executed a final QA Python script that validated processing integrity across 92 companies without any missing KPI failures.
5. **Visual Styling Enhancements**: Upgraded all matplotlib outputs to use a professional `seaborn-v0_8-whitegrid` styling complete with standardized corporate hex color palettes and defensive text-wrapping.

## Challenges
1. **Database Irregularities**: Handling Null values and NaN records correctly in pandas/sqlite was tricky. We experienced several division-by-zero or `NoneType` math errors (e.g., PNB missing `net_profit`), which caused batch generation crashes.
2. **Sorting Mixed Data**: When creating the sector ranking tables, filling missing values with string `"N/A"` prior to sorting caused Pandas to throw `TypeError` crashes.
3. **Library Warnings**: Calculating medians on empty data slices (when an entire sector lacked specific historical data) triggered aggressive `RuntimeWarning` logs from NumPy, cluttering the terminal output.
4. **Execution Environment Limits**: A recurring terminal environment error (`opening NUL for ACL write: Access is denied.`) prevented direct script execution, requiring heavily optimized script writing and manual user hand-offs to run the code.

## Lessons Learned
1. **Defensive Programming**: Always check `pd.notna()` for both numerators and denominators before any financial ratio math (ROE/ROCE). 
2. **Pandas Operation Order**: Always execute `.sort_values()` on numeric data *before* utilizing `.fillna("N/A")` to avoid string-to-float sorting conflicts.
3. **Aesthetic Consistency Matters**: Relying on default matplotlib settings produces dated reports. Explicitly injecting `plt.style.use()` and maintaining strict color control significantly elevates the perceived quality of the data products.

## Future Improvements
1. **HTML/Web App Dashboard**: Transition the static PDF reports into a dynamic interactive web dashboard (using Streamlit or Dash) to allow for real-time filtering and drill-down analysis.
2. **More Complex NLP Models**: Replace the rule-based templating in the Pros & Cons generator with a localized LLM to generate richer, more nuanced contextual summaries.
3. **Outlier Detection Algorithms**: Implement machine learning techniques (like Isolation Forests) to automatically flag irregular financial statements or potential accounting anomalies in the dataset.
