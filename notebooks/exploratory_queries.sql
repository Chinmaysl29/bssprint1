
-- Query 1: Top ROE
SELECT id, company_name, roe_percentage 
FROM companies 
WHERE roe_percentage IS NOT NULL 
ORDER BY roe_percentage DESC 
LIMIT 10;

-- Query 2: Debt free
SELECT DISTINCT c.id, c.company_name 
FROM companies c 
JOIN balancesheet bs ON c.id = bs.company_id 
WHERE bs.borrowings = 0;

-- Query 3: Sector distribution
SELECT sector, COUNT(DISTINCT company_id) AS company_count 
FROM sectors 
GROUP BY sector 
ORDER BY company_count DESC;

-- Query 4: Missing years (check year gaps for each company)
WITH company_years AS (
  SELECT company_id, year,
    ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY year) AS rn
  FROM profitandloss
)
SELECT DISTINCT cy1.company_id, c.company_name,
  cy1.year AS previous_year,
  cy2.year AS next_year
FROM company_years cy1
JOIN company_years cy2 ON cy1.company_id = cy2.company_id 
  AND cy1.rn = cy2.rn - 1
JOIN companies c ON cy1.company_id = c.id
WHERE CAST(SUBSTR(cy1.year, LENGTH(cy1.year)-3, 4) AS INTEGER) + 1 
  != CAST(SUBSTR(cy2.year, LENGTH(cy2.year)-3, 4) AS INTEGER)
ORDER BY cy1.company_id;

-- Query 5: Positive FCF
SELECT DISTINCT cf.company_id, c.company_name,
  ROUND(cf.operating_activity + cf.investing_activity, 2) AS fcf
FROM cashflow cf
JOIN companies c ON cf.company_id = c.id
WHERE (cf.operating_activity + cf.investing_activity) > 0
ORDER BY fcf DESC
LIMIT 20;

-- Query 6: Dividend yield (from market_cap table)
SELECT DISTINCT mc.company_id, c.company_name, mc.val6 AS dividend_yield
FROM market_cap mc
JOIN companies c ON mc.company_id = c.id
WHERE mc.val6 IS NOT NULL AND mc.val6 > 0
ORDER BY mc.val6 DESC
LIMIT 20;

-- Query 7: Top market cap
SELECT DISTINCT mc.company_id, c.company_name, mc.mc1 AS market_cap
FROM market_cap mc
JOIN companies c ON mc.company_id = c.id
WHERE mc.mc1 IS NOT NULL
ORDER BY mc.mc1 DESC
LIMIT 10;

-- Query 8: Companies per sector
SELECT sector, COUNT(DISTINCT company_id) AS num_companies
FROM sectors
GROUP BY sector
ORDER BY num_companies DESC;

-- Query 9: Peer groups
SELECT pg.group_name, COUNT(DISTINCT pg.company_id) AS num_companies,
  GROUP_CONCAT(pg.company_id, ', ') AS companies
FROM peer_groups pg
GROUP BY pg.group_name
ORDER BY num_companies DESC;

-- Query 10: Coverage check (interest coverage < 1)
SELECT 
  p.company_id,
  c.company_name,
  p.year,
  CASE WHEN p.interest > 0 THEN ROUND(p.profit_before_tax / p.interest, 2) ELSE NULL END AS interest_coverage
FROM profitandloss p
JOIN companies c ON p.company_id = c.id
WHERE p.interest > 0 
  AND p.profit_before_tax / p.interest < 1
ORDER BY interest_coverage ASC;

