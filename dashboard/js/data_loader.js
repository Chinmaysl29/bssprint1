/**
 * NIFTY100 Dashboard – Data Loader
 * Loads dashboard_data.json and exposes a global NIFTY_DATA object.
 */

const NIFTY_DATA = {
  loaded: false,
  raw: null,

  // Utility: get all unique sectors
  getSectors() {
    if (!this.raw) return [];
    return this.raw.sectors || [];
  },

  // Utility: get companies filtered by sector
  getCompaniesBySector(sector) {
    if (!this.raw) return [];
    const all = this.raw.companies || [];
    if (!sector) return all;
    return all.filter(c => c.sector === sector);
  },

  // Utility: top ROE companies
  getTopROE(n = 10) {
    if (!this.raw) return [];
    return (this.raw.top_roe_companies || []).slice(0, n);
  },

  // Utility: capital allocation summary
  getCapAllocSummary() {
    if (!this.raw) return [];
    return this.raw.capital_allocation_summary || [];
  },

  // Utility: profitability sorted
  getProfitability(n = 15) {
    if (!this.raw) return [];
    return (this.raw.profitability || []).slice(0, n);
  },

  // Utility: leverage data
  getLeverage(n = 15) {
    if (!this.raw) return [];
    return (this.raw.leverage || []).slice(0, n);
  },

  // Utility: cashflow data
  getCashflow(n = 15) {
    if (!this.raw) return [];
    return (this.raw.cashflow || []).slice(0, n);
  },

  // Utility: financial ratios (latest year)
  getFinancialRatios() {
    if (!this.raw) return [];
    return this.raw.financial_ratios || [];
  },

  // Utility: ROE vs ROCE scatter
  getRoeRoce() {
    if (!this.raw) return [];
    return this.raw.roe_roce_scatter || [];
  },

  // Utility: sector ROE averages
  getSectorROE() {
    if (!this.raw) return [];
    return this.raw.sector_roe || [];
  },

  // Utility: DQ rules
  getDQRules() {
    if (!this.raw) return [];
    return this.raw.dq_rules || [];
  },

  // Sprint stats
  getSprintStats() {
    if (!this.raw) return {};
    return this.raw.sprint_stats || {};
  },

  // Table counts
  getTableCounts() {
    if (!this.raw) return {};
    return this.raw.table_counts || {};
  },

  // Capital allocation companies
  getCapAllocCompanies() {
    if (!this.raw) return [];
    return this.raw.capital_allocation_companies || [];
  },

  // Top FCF
  getTopFCF(n = 10) {
    if (!this.raw) return [];
    return (this.raw.top_fcf || []).slice(0, n);
  },

  // Capex labels
  getCapexLabels() {
    if (!this.raw) return [];
    return this.raw.capex_labels || [];
  },

  // CAGR data – deduplicated to one row per company (prefer 10yr/5yr/TTM)
  getCAGR() {
    if (!this.raw) return [];
    const all = this.raw.cagr_data || [];
    // Prefer rows with "10 Years" in sales growth, else take first row per company
    const seen = new Map();
    all.forEach(d => {
      const key = d.company_id;
      if (!seen.has(key)) { seen.set(key, d); }
      else if (d.compounded_sales_growth && /10\s*Years/i.test(d.compounded_sales_growth)) {
        seen.set(key, d);
      }
    });
    return Array.from(seen.values());
  },

  // Company quality score (composite)
  computeQualityScores() {
    if (!this.raw) return [];
    const roe_map = {};
    (this.raw.top_roe_companies || []).forEach(r => {
      roe_map[r.id] = { roe: r.roe_percentage, roce: r.roce_percentage, sector: r.sector };
    });
    const fr_map = {};
    (this.raw.financial_ratios || []).forEach(r => {
      fr_map[r.company_id] = r;
    });
    const lev_map = {};
    (this.raw.leverage || []).forEach(r => {
      lev_map[r.company_id] = r.de_ratio;
    });
    const cf_map = {};
    (this.raw.cashflow || []).forEach(r => {
      cf_map[r.company_id] = r;
    });

    return (this.raw.companies || []).map(c => {
      const r = roe_map[c.id] || {};
      const fr = fr_map[c.id] || {};
      const de = lev_map[c.id] || null;
      const cf = cf_map[c.id] || {};

      const roe_s = Math.min(100, Math.max(0, (r.roe || 0) * 2));
      const roce_s = Math.min(100, Math.max(0, (r.roce || 0) * 2));
      const lev_s = de === null ? 50 : Math.max(0, 100 - de * 15);
      const cfo_q = fr.cfo_quality_score || 0;
      const cf_s = Math.min(100, Math.max(0, cfo_q * 50));
      const fcf_s = fr.free_cash_flow_cr > 0 ? 60 : 30;

      const score = Math.round((roe_s * 0.30 + roce_s * 0.25 + lev_s * 0.20 + cf_s * 0.15 + fcf_s * 0.10));

      return {
        company_id: c.id,
        company_name: c.company_name,
        sector: c.sector || r.sector || 'N/A',
        roe: r.roe || 0,
        roce: r.roce || 0,
        de_ratio: de,
        cfo_quality: cfo_q,
        free_cash_flow: fr.free_cash_flow_cr || 0,
        score,
        cap_pattern: fr.capital_allocation_pattern || ''
      };
    }).sort((a, b) => b.score - a.score);
  }
};

/**
 * Load JSON data and populate NIFTY_DATA
 */
async function loadDashboardData() {
  try {
    const response = await fetch('data/dashboard_data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    NIFTY_DATA.raw = await response.json();
    NIFTY_DATA.loaded = true;

    // Populate sector filter
    const sectorSel = document.getElementById('sectorFilter');
    if (sectorSel) {
      NIFTY_DATA.getSectors().forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.sector;
        opt.textContent = `${s.sector} (${s.count})`;
        sectorSel.appendChild(opt);
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    return false;
  }
}
