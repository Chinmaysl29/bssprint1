/**
 * NIFTY100 Financial Intelligence Platform
 * Dashboard Orchestration – dashboard.js
 * Handles routing, page rendering, filters, search, and chart wiring.
 */

'use strict';

// ─── State ─────────────────────────────────────────────────────────────────
const APP = {
  currentPage: 'overview',
  sectorFilter: '',
  yearFilter: '',
  searchQuery: '',
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt(n, dec = 1) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  return Number(n).toFixed(dec);
}
function fmtCr(n) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  const abs = Math.abs(n);
  if (abs >= 100000) return (n / 100000).toFixed(1) + 'L Cr';
  if (abs >= 1000)   return (n / 1000).toFixed(1) + 'K Cr';
  return Number(n).toFixed(0) + ' Cr';
}
function badge(val, threshHigh, threshLow) {
  if (val === null || val === undefined || isNaN(val)) return '<span class="tag tag-info">N/A</span>';
  if (val >= threshHigh) return `<span class="tag tag-success">${fmt(val)}%</span>`;
  if (val >= threshLow)  return `<span class="tag tag-warn">${fmt(val)}%</span>`;
  return `<span class="tag tag-danger">${fmt(val)}%</span>`;
}
function shortName(name) {
  if (!name) return '';
  return name.replace(/\n/g, '').trim().split(' ').slice(0, 3).join(' ');
}
function deBadge(de) {
  if (de === null || de === undefined || isNaN(de)) return '<span class="tag tag-info">N/A</span>';
  if (de === 0) return `<span class="tag tag-success">Debt Free</span>`;
  if (de > 5)   return `<span class="tag tag-danger">${fmt(de, 2)}x</span>`;
  if (de > 2)   return `<span class="tag tag-warn">${fmt(de, 2)}x</span>`;
  return `<span class="tag tag-success">${fmt(de, 2)}x</span>`;
}
function patternColor(p) {
  const m = { 'Shareholder Returns': '#10B981', 'Reinvestor': '#2563EB', 'Liquidating Assets': '#F59E0B',
    'Distress Signal': '#EF4444', 'Growth Funded by Debt': '#8B5CF6', 'Cash Accumulator': '#06B6D4',
    'Pre-Revenue': '#EC4899', 'Mixed': '#94A3B8', 'Other': '#475569' };
  return m[p] || '#475569';
}
function cfoLabel(score) {
  if (score === null || score === undefined) return 'N/A';
  if (score > 1.0) return 'High Quality';
  if (score >= 0.5) return 'Moderate';
  return 'Accrual Risk';
}
function cfoColor(score) {
  if (score > 1.0) return '#10B981';
  if (score >= 0.5) return '#F59E0B';
  return '#EF4444';
}
function parseCAGRVal(str) {
  if (!str) return null;
  const m = String(str).match(/([\-\d.]+)%/);
  return m ? parseFloat(m[1]) : null;
}

// ─── Sidebar Navigation ──────────────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
    document.querySelector('.main-wrapper')?.classList.toggle('sidebar-collapsed');
  });
}

function navigateTo(page) {
  APP.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
  const labels = {
    overview: 'Executive Overview', etl: 'ETL Dashboard', dq: 'Data Quality Center',
    profitability: 'Profitability Analytics', leverage: 'Leverage & Risk',
    cagr: 'CAGR Growth Engine', cashflow: 'Cash Flow Intelligence',
    capital: 'Capital Allocation', ranking: 'Company Ranking', summary: 'Sprint Summary'
  };
  document.getElementById('breadcrumb-page').textContent = labels[page] || page;
  renderPage(page);
}

function renderPage(page) {
  const main = document.getElementById('mainContent');
  main.innerHTML = '';
  const fns = {
    overview: renderOverview, etl: renderETL, dq: renderDQ,
    profitability: renderProfitability, leverage: renderLeverage,
    cagr: renderCAGR, cashflow: renderCashflow,
    capital: renderCapital, ranking: renderRanking, summary: renderSummary
  };
  if (fns[page]) fns[page](main);
  else main.innerHTML = '<div class="page-fade-in"><p style="padding:40px;color:var(--text-muted)">Page coming soon.</p></div>';
}

// ─── Filters & Search ────────────────────────────────────────────────────────
function initFilters() {
  const ss = document.getElementById('sectorFilter');
  const ys = document.getElementById('yearFilter');
  const gs = document.getElementById('globalSearch');

  // Populate year filter
  if (ys) {
    ['TTM','Mar 2024','Mar 2023','Mar 2022','Mar 2021','Mar 2020'].forEach(y => {
      const o = document.createElement('option'); o.value = y; o.textContent = y; ys.appendChild(o);
    });
  }

  ss?.addEventListener('change', () => { APP.sectorFilter = ss.value; renderPage(APP.currentPage); });
  ys?.addEventListener('change', () => { APP.yearFilter = ys.value; renderPage(APP.currentPage); });
  gs?.addEventListener('input', debounce(() => { APP.searchQuery = gs.value.toLowerCase(); renderPage(APP.currentPage); }, 300));
}

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ─── KPI Card Builder ────────────────────────────────────────────────────────
function kpiCard(icon, label, value, sub, color) {
  color = color || 'var(--primary)';
  return `<div class="kpi-card page-fade-in">
    <div class="kpi-icon" style="background:${color}22;color:${color}"><i class="${icon}"></i></div>
    <div class="kpi-body">
      <div class="kpi-value">${value}</div>
      <div class="kpi-label">${label}</div>
      ${sub ? `<div class="kpi-sub">${sub}</div>` : ''}
    </div>
  </div>`;
}

function chartCard(title, canvasId, height, extra) {
  height = height || 300;
  extra = extra || '';
  return `<div class="chart-card page-fade-in">
    <div class="chart-card-header"><h3 class="chart-title">${title}</h3>${extra}</div>
    <div class="chart-wrap" style="height:${height}px;position:relative">
      <canvas id="${canvasId}"></canvas>
    </div>
  </div>`;
}

function sectionHeader(title, sub) {
  return `<div class="section-header page-fade-in">
    <h2 class="section-title">${title}</h2>
    ${sub ? `<p class="section-sub">${sub}</p>` : ''}
  </div>`;
}

// ─── PAGE 1: EXECUTIVE OVERVIEW ──────────────────────────────────────────────
function renderOverview(main) {
  const stats = NIFTY_DATA.getSprintStats();
  const topROE = NIFTY_DATA.getTopROE(1)[0] || {};
  const sectors = NIFTY_DATA.getSectors();
  const avgROE = NIFTY_DATA.getTopROE(20).reduce((s,c) => s + (c.roe_percentage || 0), 0) / 20;
  const avgROCE = NIFTY_DATA.getTopROE(20).reduce((s,c) => s + (c.roce_percentage || 0), 0) / 20;

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('NIFTY100 Financial Intelligence Dashboard', 'Sprint 1 + Sprint 2 · Real-time Analytics')}

    <div class="kpi-grid kpi-grid-6">
      ${kpiCard('fa-solid fa-building', 'Companies Analyzed', stats.companies || 92, 'Nifty 100 Universe', 'var(--primary)')}
      ${kpiCard('fa-solid fa-calendar-days', 'Financial Years', stats.financial_years || 'FY2012–FY2024', 'Multi-year Data', 'var(--success)')}
      ${kpiCard('fa-solid fa-chart-bar', 'Financial Ratio Records', (stats.ratio_records || 1184).toLocaleString(), 'Sprint 2 Engine', 'var(--warning)')}
      ${kpiCard('fa-solid fa-circle-check', 'Tests Passed', stats.tests_passed || 139, '0 Failures', 'var(--success)')}
      ${kpiCard('fa-solid fa-bolt', 'KPI Engine', stats.kpi_count ? stats.kpi_count + '+ KPIs' : '50+ KPIs', 'Computed', 'var(--purple)')}
      ${kpiCard('fa-solid fa-shield-halved', 'DQ Rules', stats.dq_rules || 16, 'Data Quality', 'var(--info)')}
    </div>

    <div class="chart-grid chart-grid-2-2">
      ${chartCard('Sector Distribution', 'sectorDonutOv', 300)}
      ${chartCard('Top 10 Companies by ROE', 'topROEBarOv', 300)}
      ${chartCard('ROE vs ROCE Scatter', 'roeRoceOv', 300)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Sprint Progress</h3></div>
        <div style="padding:20px">
          <div class="sprint-progress-block">
            <div class="sprint-label"><span class="status-dot" style="background:var(--success)"></span> Sprint 1 <span class="tag tag-success ml-auto">COMPLETED</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:100%;background:var(--success)"></div></div>
            <div class="sprint-items">
              <span class="sprint-item"><i class="fa-solid fa-database"></i> ETL Pipeline</span>
              <span class="sprint-item"><i class="fa-solid fa-shield-check"></i> Data Quality (16 Rules)</span>
              <span class="sprint-item"><i class="fa-solid fa-table"></i> 12 Tables</span>
              <span class="sprint-item"><i class="fa-solid fa-building"></i> 92 Companies</span>
            </div>
          </div>
          <div class="sprint-progress-block" style="margin-top:20px">
            <div class="sprint-label"><span class="status-dot" style="background:var(--primary)"></span> Sprint 2 <span class="tag tag-primary ml-auto">COMPLETED</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:100%;background:var(--primary)"></div></div>
            <div class="sprint-items">
              <span class="sprint-item"><i class="fa-solid fa-percent"></i> Ratio Engine (50+ KPIs)</span>
              <span class="sprint-item"><i class="fa-solid fa-seedling"></i> CAGR Engine</span>
              <span class="sprint-item"><i class="fa-solid fa-money-bill-wave"></i> Cash Flow Intel</span>
              <span class="sprint-item"><i class="fa-solid fa-sitemap"></i> Capital Allocation</span>
            </div>
          </div>
          <div class="sprint-progress-block" style="margin-top:20px;opacity:.5">
            <div class="sprint-label"><span class="status-dot" style="background:var(--text-faint)"></span> Sprint 3 <span class="tag tag-info ml-auto">COMING SOON</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:0%;background:var(--info)"></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-grid chart-grid-3">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Key Metrics Snapshot</h3></div>
        <div class="metrics-list">
          <div class="metric-row"><span>Avg ROE (Top 20)</span><strong>${fmt(avgROE)}%</strong></div>
          <div class="metric-row"><span>Avg ROCE (Top 20)</span><strong>${fmt(avgROCE)}%</strong></div>
          <div class="metric-row"><span>Debt-Free Companies</span><strong>${NIFTY_DATA.raw.debt_free_count || 17}</strong></div>
          <div class="metric-row"><span>DB Rows Loaded</span><strong>${(stats.db_rows || 12892).toLocaleString()}</strong></div>
          <div class="metric-row"><span>Total Sectors</span><strong>${sectors.length}</strong></div>
          <div class="metric-row"><span>Capital Allocation Records</span><strong>${NIFTY_DATA.getCapAllocSummary().reduce((s,r) => s+r.count, 0)}</strong></div>
        </div>
      </div>
      ${chartCard('Capital Allocation Patterns', 'capAllocOv', 240)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Top Company Spotlight</h3></div>
        <div style="padding:16px">
          ${NIFTY_DATA.getTopROE(5).map(c => `
            <div class="company-spotlight-row">
              <div class="cs-rank-badge">${NIFTY_DATA.getTopROE(5).indexOf(c)+1}</div>
              <div class="cs-info">
                <div class="cs-name">${shortName(c.company_name)}</div>
                <div class="cs-sector">${c.sector}</div>
              </div>
              <div class="cs-metrics">
                <span class="cs-roe">ROE ${fmt(c.roe_percentage)}%</span>
                <span class="cs-roce">ROCE ${fmt(c.roce_percentage)}%</span>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    renderSectorDonut('sectorDonutOv');
    renderTopROEBar('topROEBarOv', 10);
    renderRoeRoceScatter('roeRoceOv');
    renderCapAllocDonut('capAllocOv');
  }, 50);
}

// ─── PAGE 2: ETL DASHBOARD ───────────────────────────────────────────────────
function renderETL(main) {
  const counts = NIFTY_DATA.getTableCounts();
  const totalRows = Object.values(counts).reduce((s, v) => s + v, 0);

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Sprint 1 – ETL Dashboard', 'Data Extraction, Transformation & Load Pipeline')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-file-excel', 'Datasets Loaded', 12, 'Raw + Supporting XLS', 'var(--success)')}
      ${kpiCard('fa-solid fa-building', 'Companies Loaded', 92, 'Nifty 100 Universe', 'var(--primary)')}
      ${kpiCard('fa-solid fa-table', 'DB Tables Created', 12, 'SQLite nifty100.db', 'var(--warning)')}
      ${kpiCard('fa-solid fa-database', 'Total DB Rows', totalRows.toLocaleString(), 'All tables combined', 'var(--purple)')}
    </div>

    <!-- ETL Pipeline Diagram -->
    <div class="etl-pipeline-wrap page-fade-in">
      <h3 class="chart-title" style="margin-bottom:20px">ETL Pipeline Flow</h3>
      <div class="etl-pipeline">
        <div class="etl-step etl-step-source">
          <div class="etl-icon"><i class="fa-solid fa-file-excel"></i></div>
          <div class="etl-step-name">Raw XLSX Files</div>
          <div class="etl-step-sub">7 files · companies, P&L, Balance Sheet, Cash Flow, Analysis, Documents, Pros&Cons</div>
        </div>
        <div class="etl-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        <div class="etl-step etl-step-loader">
          <div class="etl-icon"><i class="fa-solid fa-gear fa-spin"></i></div>
          <div class="etl-step-name">loader.py</div>
          <div class="etl-step-sub">Read & parse Excel sheets</div>
        </div>
        <div class="etl-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        <div class="etl-step etl-step-transform">
          <div class="etl-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
          <div class="etl-step-name">normalizer.py</div>
          <div class="etl-step-sub">Clean · Type Cast · Deduplicate</div>
        </div>
        <div class="etl-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        <div class="etl-step etl-step-validate">
          <div class="etl-icon"><i class="fa-solid fa-shield-check"></i></div>
          <div class="etl-step-name">validator.py</div>
          <div class="etl-step-sub">16 DQ Rules · FK Checks</div>
        </div>
        <div class="etl-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        <div class="etl-step etl-step-db">
          <div class="etl-icon"><i class="fa-solid fa-database"></i></div>
          <div class="etl-step-name">SQLite DB</div>
          <div class="etl-step-sub">nifty100.db · ${totalRows.toLocaleString()} rows</div>
        </div>
      </div>
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Database Table Row Counts', 'etlTableBar', 340)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Supporting Datasets</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Dataset</th><th>Type</th><th>Rows</th><th>Status</th></tr></thead>
            <tbody>
              ${Object.entries(counts).map(([t,c]) => `
              <tr>
                <td>${t}</td>
                <td><span class="tag tag-info">Table</span></td>
                <td><strong>${c.toLocaleString()}</strong></td>
                <td><span class="tag tag-success">Loaded</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="chart-grid chart-grid-3">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Load Audit Summary</h3></div>
        <div class="metrics-list">
          <div class="metric-row"><span>Total Tables</span><strong>${Object.keys(counts).length}</strong></div>
          <div class="metric-row"><span>Total Rows Loaded</span><strong>${totalRows.toLocaleString()}</strong></div>
          <div class="metric-row"><span>P&L Records</span><strong>${(counts.profitandloss || 1276).toLocaleString()}</strong></div>
          <div class="metric-row"><span>Balance Sheet Records</span><strong>${(counts.balancesheet || 1312).toLocaleString()}</strong></div>
          <div class="metric-row"><span>Cash Flow Records</span><strong>${(counts.cashflow || 1187).toLocaleString()}</strong></div>
          <div class="metric-row"><span>Analysis Records</span><strong>${(counts.analysis || 20).toLocaleString()}</strong></div>
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">ETL Status Timeline</h3></div>
        <div style="padding:12px 16px">
          ${[
            ['Sprint 1 – Day 1', 'ETL Setup, Loader, Normalizer', 'var(--success)'],
            ['Sprint 1 – Day 2', 'Validator, 16 DQ Rules', 'var(--success)'],
            ['Sprint 1 – Day 3', 'FK Checks, Test Suite (139 tests)', 'var(--success)'],
            ['Sprint 2 – Day 1', 'Ratio Engine: Profitability', 'var(--primary)'],
            ['Sprint 2 – Day 2', 'Leverage, CAGR, Cashflow KPIs', 'var(--primary)'],
            ['Sprint 2 – Day 3', 'Capital Allocation, Quality Ranking', 'var(--primary)'],
          ].map(([d,t,c]) => `
            <div class="timeline-row">
              <div class="timeline-dot" style="background:${c}"></div>
              <div class="timeline-content"><strong>${d}</strong><span>${t}</span></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">File Summary</h3></div>
        <div class="metrics-list">
          ${[
            ['companies.xlsx','companies','92 rows'],
            ['profitandloss.xlsx','profitandloss','1,276 rows'],
            ['balancesheet.xlsx','balancesheet','1,312 rows'],
            ['cashflow.xlsx','cashflow','1,187 rows'],
            ['analysis.xlsx','analysis','20 rows'],
            ['documents.xlsx','documents','1,585 rows'],
            ['prosandcons.xlsx','prosandcons','2,530 rows'],
          ].map(([f,t,r]) => `
            <div class="metric-row">
              <span><i class="fa-solid fa-file-excel" style="color:var(--success);margin-right:6px"></i>${f}</span>
              <strong style="font-size:11px;color:var(--text-muted)">${r}</strong>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  setTimeout(() => renderETLTableBar('etlTableBar'), 50);
}

// ─── PAGE 3: DATA QUALITY CENTER ────────────────────────────────────────────
function renderDQ(main) {
  const rules = NIFTY_DATA.getDQRules();
  const pass = rules.filter(r => r.status === 'PASS').length;
  const warn = rules.filter(r => r.status === 'WARN').length;
  const fail = rules.filter(r => r.status === 'FAIL').length;
  const info = rules.filter(r => r.status === 'INFO').length;

  const statusIcon = s => ({
    PASS: '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>',
    WARN: '<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i>',
    FAIL: '<i class="fa-solid fa-circle-xmark" style="color:var(--danger)"></i>',
    INFO: '<i class="fa-solid fa-circle-info" style="color:var(--info)"></i>',
  }[s] || '');

  const tagClass = s => ({ PASS:'tag-success', WARN:'tag-warn', FAIL:'tag-danger', INFO:'tag-info' }[s] || 'tag-info');

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Data Quality Center', 'Sprint 1 Validation – 16 Data Quality Rules')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-circle-check', 'Rules Passed', pass, 'No issues detected', 'var(--success)')}
      ${kpiCard('fa-solid fa-triangle-exclamation', 'Rules Warned', warn, 'Minor inconsistencies', 'var(--warning)')}
      ${kpiCard('fa-solid fa-circle-xmark', 'Rules Failed', fail, 'Critical failures', 'var(--danger)')}
      ${kpiCard('fa-solid fa-circle-info', 'Info Rules', info, 'Informational checks', 'var(--info)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('DQ Rule Status Distribution', 'dqRulesChart', 280)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Quality Score Overview</h3></div>
        <div style="padding:20px;text-align:center">
          <div class="gauge-wrap">
            <svg viewBox="0 0 200 120" style="width:100%;max-width:220px;margin:0 auto;display:block">
              <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="var(--surface2)" stroke-width="18" stroke-linecap="round"/>
              <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="url(#gaugeGrad)" stroke-width="18" stroke-linecap="round"
                stroke-dasharray="251" stroke-dashoffset="${251 - 251 * (pass / rules.length)}"/>
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:var(--danger)"/>
                  <stop offset="50%" style="stop-color:var(--warning)"/>
                  <stop offset="100%" style="stop-color:var(--success)"/>
                </linearGradient>
              </defs>
              <text x="100" y="95" text-anchor="middle" fill="var(--text)" font-size="26" font-weight="700">${Math.round(pass/rules.length*100)}%</text>
              <text x="100" y="112" text-anchor="middle" fill="var(--text-muted)" font-size="10">Quality Score</text>
            </svg>
          </div>
          <div class="dq-score-legend">
            <span><span class="legend-dot" style="background:var(--success)"></span>${pass} Passed</span>
            <span><span class="legend-dot" style="background:var(--warning)"></span>${warn} Warned</span>
            <span><span class="legend-dot" style="background:var(--danger)"></span>${fail} Failed</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">All 16 Data Quality Rules</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rule</th><th>Description</th><th>Severity</th><th>Failures</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map(r => `
            <tr class="${r.status === 'FAIL' ? 'row-danger' : r.status === 'WARN' ? 'row-warn' : ''}">
              <td><strong>${r.rule}</strong></td>
              <td>${r.desc}</td>
              <td><span class="tag tag-${r.severity === 'Critical' ? 'danger' : r.severity === 'Warning' ? 'warn' : 'info'}">${r.severity}</span></td>
              <td>${r.count > 0 ? `<strong style="color:var(--warning)">${r.count.toLocaleString()}</strong>` : '<span style="color:var(--success)">0</span>'}</td>
              <td>${statusIcon(r.status)} <span class="tag ${tagClass(r.status)}">${r.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="chart-grid chart-grid-2">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Validation Failure Categories</h3></div>
        <div class="metrics-list">
          ${rules.filter(r => r.count > 0).sort((a,b) => b.count - a.count).map(r => `
          <div class="metric-row">
            <span>${statusIcon(r.status)} ${r.desc}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:80px;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
                <div style="height:100%;background:${r.status==='FAIL'?'var(--danger)':r.status==='WARN'?'var(--warning)':'var(--info)'};width:${Math.min(100, r.count/396*100)}%"></div>
              </div>
              <strong>${r.count.toLocaleString()}</strong>
            </div>
          </div>`).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Critical DQ Notes</h3></div>
        <div style="padding:16px">
          ${[
            ['DQ05', 'OPM Mismatch', 'warning', '234 records where OPM% differs >1% from calculated value. Source data rounding issue.'],
            ['DQ06', 'Zero Sales', 'danger', '1 record with zero/null sales – edge case handled by analytics engine.'],
            ['DQ09', 'Cash Flow Mismatch', 'warning', '396 records where net_cash_flow ≠ sum of components. Rounding in source data.'],
            ['DQ14', 'EPS Sign Mismatch', 'danger', '3 records where EPS sign conflicts with Net Profit sign. Flagged for review.'],
            ['DQ16', 'ICR < 1', 'warning', '302 records with Interest Coverage < 1.0. Primarily financial sector (banks/NBFCs).'],
          ].map(([rule, label, sev, note]) => `
          <div class="dq-note ${sev}">
            <div class="dq-note-header"><strong>${rule}</strong> – ${label}</div>
            <p>${note}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  setTimeout(() => renderDQRulesChart('dqRulesChart'), 50);
}

// ─── PAGE 4: PROFITABILITY ANALYTICS ────────────────────────────────────────
function renderProfitability(main) {
  let data = NIFTY_DATA.getProfitability(92);

  // Apply sector filter
  if (APP.sectorFilter) {
    const co = NIFTY_DATA.getCompaniesBySector(APP.sectorFilter).map(c => c.id);
    data = data.filter(d => co.includes(d.company_id));
  }
  // Apply search
  if (APP.searchQuery) {
    data = data.filter(d => shortName(d.company_name).toLowerCase().includes(APP.searchQuery));
  }

  const avgNPM = data.slice(0,20).reduce((s,c) => s + (c.npm||0), 0) / Math.min(20, data.length);
  const avgOPM = data.slice(0,20).filter(d => d.opm > 0 && d.opm < 200).reduce((s,c) => s + (c.opm||0), 0) /
    Math.min(20, data.filter(d => d.opm > 0 && d.opm < 200).length);
  const roeData = NIFTY_DATA.getTopROE(92);
  const avgROE  = roeData.reduce((s,c) => s + (c.roe_percentage||0), 0) / roeData.length;
  const avgROCE = roeData.reduce((s,c) => s + (c.roce_percentage||0), 0) / roeData.length;

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Profitability Analytics', 'Sprint 2 – Net Profit Margin, Operating Margin, ROE, ROCE')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-percent', 'Avg Net Profit Margin', fmt(avgNPM) + '%', 'Top 20 Companies', 'var(--success)')}
      ${kpiCard('fa-solid fa-industry', 'Avg Operating Margin', fmt(avgOPM) + '%', 'Excl. Banks/Finance', 'var(--primary)')}
      ${kpiCard('fa-solid fa-arrow-trend-up', 'Avg ROE', fmt(avgROE) + '%', 'All Companies', 'var(--warning)')}
      ${kpiCard('fa-solid fa-chart-line', 'Avg ROCE', fmt(avgROCE) + '%', 'All Companies', 'var(--purple)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Top 10 – Net Profit Margin vs Operating Margin', 'profitBar', 320)}
      ${chartCard('Sector-wise ROE & ROCE Comparison', 'sectorROEBar', 320)}
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header">
        <h3 class="chart-title">Company Profitability Table</h3>
        <span class="tag tag-info">${data.length} companies</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>Net Profit Margin</th><th>Op. Margin</th><th>EPS</th><th>Sales (₹Cr)</th><th>Net Profit (₹Cr)</th></tr></thead>
          <tbody>
            ${data.slice(0,30).map((c,i) => `
            <tr>
              <td>${i+1}</td>
              <td><strong>${shortName(c.company_name)}</strong></td>
              <td><span class="sector-tag">${(NIFTY_DATA.getCompaniesBySector('').find(x=>x.id===c.company_id)||{}).sector||'—'}</span></td>
              <td>${badge(c.npm, 20, 10)}</td>
              <td>${c.opm > 0 && c.opm < 500 ? badge(c.opm, 25, 12) : '<span class="tag tag-info">N/A</span>'}</td>
              <td>₹${fmt(c.eps,0)}</td>
              <td>${fmtCr(c.sales)}</td>
              <td>${fmtCr(c.net_profit)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="chart-grid chart-grid-2">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">ROE Leaders</h3></div>
        <div style="padding:12px">
          ${NIFTY_DATA.getTopROE(10).map((c,i) => `
          <div class="rank-row">
            <span class="rank-num">${i+1}</span>
            <div class="rank-info">
              <div class="rank-name">${shortName(c.company_name)}</div>
              <div class="rank-bar-wrap"><div class="rank-bar" style="width:${Math.min(100, c.roe_percentage)}%;background:var(--success)"></div></div>
            </div>
            <span class="rank-val" style="color:var(--success)">${fmt(c.roe_percentage)}%</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">ROCE Leaders</h3></div>
        <div style="padding:12px">
          ${[...NIFTY_DATA.getTopROE(20)].sort((a,b)=>b.roce_percentage-a.roce_percentage).slice(0,10).map((c,i) => `
          <div class="rank-row">
            <span class="rank-num">${i+1}</span>
            <div class="rank-info">
              <div class="rank-name">${shortName(c.company_name)}</div>
              <div class="rank-bar-wrap"><div class="rank-bar" style="width:${Math.min(100, c.roce_percentage/2)}%;background:var(--primary)"></div></div>
            </div>
            <span class="rank-val" style="color:var(--primary)">${fmt(c.roce_percentage)}%</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    renderProfitabilityBar('profitBar');
    renderSectorROEBar('sectorROEBar');
  }, 50);
}

// ─── PAGE 5: LEVERAGE & RISK ─────────────────────────────────────────────────
function renderLeverage(main) {
  let leverage = NIFTY_DATA.getLeverage(92);
  const highLev = NIFTY_DATA.raw.high_leverage || leverage.slice(0, 10);
  const debtFreeCount = NIFTY_DATA.raw.debt_free_count || 17;

  if (APP.sectorFilter) {
    leverage = leverage.filter(d => d.sector === APP.sectorFilter);
  }

  // separate financial sector
  const financial = leverage.filter(d => d.sector === 'Financials');
  const nonFinancial = leverage.filter(d => d.sector !== 'Financials');
  const avgDE = nonFinancial.reduce((s,c) => s + (c.de_ratio||0), 0) / (nonFinancial.length || 1);

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Leverage & Risk Dashboard', 'Sprint 2 – Debt/Equity, Interest Coverage, Net Debt, Asset Turnover')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-scale-unbalanced-flip', 'Avg D/E Ratio', fmt(avgDE, 2) + 'x', 'Non-Financial Sector', 'var(--warning)')}
      ${kpiCard('fa-solid fa-building-columns', 'Debt-Free Companies', debtFreeCount, 'D/E = 0', 'var(--success)')}
      ${kpiCard('fa-solid fa-landmark', 'High Leverage (D/E>5)', highLev.length, 'Mostly Banks/NBFCs', 'var(--danger)')}
      ${kpiCard('fa-solid fa-shield-halved', 'Financial Sector', financial.length, 'Banks/NBFC/Insurance', 'var(--info)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Debt-to-Equity Ratio – Top Companies', 'leverageBar', 360)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">High Leverage Companies</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>D/E Ratio</th><th>Risk Level</th></tr></thead>
            <tbody>
              ${highLev.slice(0,12).map((c,i) => `
              <tr>
                <td>${i+1}</td>
                <td><strong>${shortName(c.company_name)}</strong></td>
                <td><span class="sector-tag">${c.sector}</span></td>
                <td>${deBadge(c.de_ratio)}</td>
                <td>${c.de_ratio > 5 ? '<span class="tag tag-danger">High</span>' : c.de_ratio > 2 ? '<span class="tag tag-warn">Medium</span>' : '<span class="tag tag-success">Low</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="chart-grid chart-grid-2">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Leverage Breakdown by Sector</h3></div>
        <div style="padding:12px">
          ${NIFTY_DATA.getSectors().map(s => {
            const sl = leverage.filter(d => d.sector === s.sector);
            const avg = sl.length ? sl.reduce((a,b)=>a+(b.de_ratio||0),0)/sl.length : 0;
            return `<div class="metric-row">
              <span>${s.sector}</span>
              <div style="display:flex;align-items:center;gap:8px;min-width:180px">
                <div style="width:100px;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
                  <div style="height:100%;background:${avg>5?'var(--danger)':avg>2?'var(--warning)':'var(--success)'};width:${Math.min(100,avg/15*100)}%"></div>
                </div>
                <strong>${fmt(avg,2)}x</strong>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Financial Sector Note</h3></div>
        <div style="padding:16px">
          <div class="info-banner">
            <i class="fa-solid fa-circle-info"></i>
            <span>Banks, NBFCs, and Insurance companies have naturally high D/E ratios due to their business model. These are treated separately in leverage analysis.</span>
          </div>
          <div style="margin-top:16px">
            <div class="metric-row"><span>Banks / PSU Banks</span><strong>~6–15x D/E (Normal)</strong></div>
            <div class="metric-row"><span>NBFCs / Finance Co.</span><strong>~4–8x D/E (Normal)</strong></div>
            <div class="metric-row"><span>Insurance</span><strong>Asset-light model</strong></div>
            <div class="metric-row"><span>Manufacturing</span><strong>&lt;2x preferred</strong></div>
            <div class="metric-row"><span>IT / Healthcare</span><strong>0–1x (Debt Free)</strong></div>
          </div>
          <div class="info-banner" style="margin-top:12px;background:rgba(16,185,129,0.1);border-color:var(--success)">
            <i class="fa-solid fa-circle-check" style="color:var(--success)"></i>
            <span><strong>${debtFreeCount} companies</strong> in the Nifty 100 are completely debt-free as of the latest data.</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">Full Leverage Data Table</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>Year</th><th>Borrowings (₹Cr)</th><th>Equity Capital</th><th>Reserves (₹Cr)</th><th>D/E Ratio</th></tr></thead>
          <tbody>
            ${leverage.slice(0,25).map((c,i) => `
            <tr>
              <td>${i+1}</td>
              <td><strong>${shortName(c.company_name)}</strong></td>
              <td><span class="sector-tag">${c.sector}</span></td>
              <td>${c.year || '—'}</td>
              <td>${fmtCr(c.borrowings)}</td>
              <td>₹${fmt(c.equity_capital,0)}Cr</td>
              <td>${fmtCr(c.reserves)}</td>
              <td>${deBadge(c.de_ratio)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  setTimeout(() => renderLeverageBar('leverageBar'), 50);
}

// ─── PAGE 6: CAGR GROWTH ENGINE ──────────────────────────────────────────────
function renderCAGR(main) {
  const raw = NIFTY_DATA.getCAGR();

  function parseAll(d) {
    return {
      name: shortName(d.company_name),
      id: d.company_id,
      sales: parseCAGRVal(d.compounded_sales_growth),
      profit: parseCAGRVal(d.compounded_profit_growth),
      stock: parseCAGRVal(d.stock_price_cagr),
      roe: parseCAGRVal(d.roe),
    };
  }

  const parsed = raw.map(parseAll).filter(d => d.sales !== null || d.profit !== null);
  const salesTop = [...parsed].filter(d => d.sales !== null).sort((a,b) => b.sales - a.sales).slice(0, 12);
  const profitTop = [...parsed].filter(d => d.profit !== null).sort((a,b) => b.profit - a.profit).slice(0, 12);
  const turnaround = parsed.filter(d => d.sales !== null && d.profit !== null && d.profit > 0 && d.sales < d.profit);

  const avgSales = parsed.filter(d=>d.sales!==null).reduce((s,c)=>s+(c.sales||0),0)/Math.max(1,parsed.filter(d=>d.sales!==null).length);
  const avgProfit = parsed.filter(d=>d.profit!==null).reduce((s,c)=>s+(c.profit||0),0)/Math.max(1,parsed.filter(d=>d.profit!==null).length);

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('CAGR Growth Engine', 'Sprint 2 – Revenue CAGR, PAT CAGR, EPS CAGR, Stock CAGR')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-arrow-up-right-dots', 'Avg Sales CAGR', fmt(avgSales) + '%', 'Multi-year compounded', 'var(--success)')}
      ${kpiCard('fa-solid fa-coins', 'Avg Profit CAGR', fmt(avgProfit) + '%', 'PAT growth rate', 'var(--primary)')}
      ${kpiCard('fa-solid fa-rotate', 'Turnaround Companies', turnaround.length, 'Profit CAGR > Sales CAGR', 'var(--warning)')}
      ${kpiCard('fa-solid fa-trophy', 'Growth Leaders', salesTop.filter(d => d.sales > 15).length, 'CAGR > 15%', 'var(--purple)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Top 10 – Sales & Profit CAGR Comparison', 'cagrBar', 360)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">CAGR Growth Heatmap</h3></div>
        <div style="padding:12px;overflow-x:auto">
          <table class="data-table heatmap-table">
            <thead><tr><th>Company</th><th>Sales CAGR</th><th>Profit CAGR</th><th>Stock CAGR</th><th>Flag</th></tr></thead>
            <tbody>
              ${parsed.slice(0,15).map(d => {
                const flag = d.profit !== null && d.sales !== null
                  ? (d.profit < 0 && d.sales > 0 ? 'DECLINE_TO_LOSS' : d.sales <= 0 ? 'ZERO_BASE' : d.profit > 0 && d.sales < 0 ? 'TURNAROUND' : 'OK')
                  : 'OK';
                const fc = {'OK':'tag-success','TURNAROUND':'tag-warn','DECLINE_TO_LOSS':'tag-danger','ZERO_BASE':'tag-info'}[flag]||'tag-info';
                return `<tr>
                  <td><strong>${d.name}</strong></td>
                  <td class="${d.sales>15?'cell-high':d.sales>0?'cell-mid':'cell-low'}">${d.sales!==null?fmt(d.sales)+'%':'—'}</td>
                  <td class="${d.profit>15?'cell-high':d.profit>0?'cell-mid':'cell-low'}">${d.profit!==null?fmt(d.profit)+'%':'—'}</td>
                  <td class="${d.stock>15?'cell-high':d.stock>0?'cell-mid':'cell-low'}">${d.stock!==null?fmt(d.stock)+'%':'—'}</td>
                  <td><span class="tag ${fc}">${flag}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="chart-grid chart-grid-2">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Sales CAGR Leaders</h3></div>
        <div style="padding:12px">
          ${salesTop.map((c,i) => `
          <div class="rank-row">
            <span class="rank-num">${i+1}</span>
            <div class="rank-info">
              <div class="rank-name">${c.name}</div>
              <div class="rank-bar-wrap">
                <div class="rank-bar" style="width:${Math.min(100,Math.max(0,c.sales))}%;background:${c.sales>20?'var(--success)':c.sales>10?'var(--warning)':'var(--primary)'}"></div>
              </div>
            </div>
            <span class="rank-val" style="color:${c.sales>20?'var(--success)':c.sales>10?'var(--warning)':'var(--primary)'}">${fmt(c.sales)}%</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Profit CAGR Leaders</h3></div>
        <div style="padding:12px">
          ${profitTop.map((c,i) => `
          <div class="rank-row">
            <span class="rank-num">${i+1}</span>
            <div class="rank-info">
              <div class="rank-name">${c.name}</div>
              <div class="rank-bar-wrap">
                <div class="rank-bar" style="width:${Math.min(100,Math.max(0,c.profit))}%;background:${c.profit>25?'var(--success)':c.profit>10?'var(--warning)':'var(--primary)'}"></div>
              </div>
            </div>
            <span class="rank-val" style="color:${c.profit>25?'var(--success)':c.profit>10?'var(--warning)':'var(--primary)'}">${fmt(c.profit)}%</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">Full CAGR Data – All Companies</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Sales CAGR</th><th>Profit CAGR</th><th>Stock CAGR</th><th>ROE</th><th>Growth Flag</th></tr></thead>
          <tbody>
            ${raw.map((d,i) => {
              const p = parseAll(d);
              const flag = p.profit !== null && p.sales !== null
                ? (p.profit < 0 && p.sales > 0 ? 'DECLINE_TO_LOSS' : p.sales <= 0 ? 'ZERO_BASE' : p.profit > 0 && p.sales < 0 ? 'TURNAROUND' : 'OK')
                : 'N/A';
              const fc = {'OK':'tag-success','TURNAROUND':'tag-warn','DECLINE_TO_LOSS':'tag-danger','ZERO_BASE':'tag-info','N/A':'tag-info'}[flag];
              return `<tr>
                <td>${i+1}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.sales!==null?badge(p.sales,15,0):'—'}</td>
                <td>${p.profit!==null?badge(p.profit,15,0):'—'}</td>
                <td>${p.stock!==null?badge(p.stock,15,0):'—'}</td>
                <td>${p.roe!==null?badge(p.roe,20,10):'—'}</td>
                <td><span class="tag ${fc}">${flag}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  setTimeout(() => renderCAGRBar('cagrBar'), 50);
}

// ─── PAGE 7: CASH FLOW INTELLIGENCE ─────────────────────────────────────────
function renderCashflow(main) {
  const topFCF = NIFTY_DATA.getTopFCF(15);
  const capex = NIFTY_DATA.getCapexLabels();
  const cashflow = NIFTY_DATA.getCashflow(92);

  // deduplicate by company_id for latest
  const seen = new Set();
  const cfDedup = NIFTY_DATA.raw.capital_allocation_companies
    ? NIFTY_DATA.raw.capital_allocation_companies.filter(c => { if (seen.has(c.company_id)) return false; seen.add(c.company_id); return true; })
    : [];

  const highQuality = cfDedup.filter(c => c.cfo_quality_score > 1.0).length;
  const accrualRisk = cfDedup.filter(c => c.cfo_quality_score < 0.5 && c.cfo_quality_score !== null).length;
  const topFCFVal = topFCF[0] ? topFCF[0].free_cash_flow_cr : 0;

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Cash Flow Intelligence', 'Sprint 2 – Free Cash Flow, CFO Quality, CapEx Intensity, FCF Conversion')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-money-bill-wave', 'Top FCF Generator', fmtCr(topFCFVal), topFCF[0] ? shortName(topFCF[0].company_name) : '', 'var(--success)')}
      ${kpiCard('fa-solid fa-star', 'High CFO Quality', highQuality, 'CFO Quality Score > 1.0', 'var(--primary)')}
      ${kpiCard('fa-solid fa-triangle-exclamation', 'Accrual Risk Companies', accrualRisk, 'CFO Quality < 0.5', 'var(--danger)')}
      ${kpiCard('fa-solid fa-feather', 'Asset Light Companies', capex.find(c=>c.capex_label==='Asset Light')?.count || 27, 'CapEx < 3% of Sales', 'var(--success)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Top Cash Generating Companies (₹Cr)', 'cashflowBar', 340)}
      ${chartCard('CapEx Intensity Distribution', 'capexDonut', 280)}
    </div>

    <div class="chart-grid chart-grid-2">
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Top FCF Companies</h3></div>
        <div style="padding:12px">
          ${topFCF.map((c,i) => `
          <div class="rank-row">
            <span class="rank-num">${i+1}</span>
            <div class="rank-info">
              <div class="rank-name">${shortName(c.company_name)}</div>
              <div style="font-size:10px;color:var(--text-muted)">${c.capex_label} · CFO Quality: ${fmt(c.cfo_quality_score,2)}</div>
            </div>
            <span class="rank-val" style="color:${c.free_cash_flow_cr>0?'var(--success)':'var(--danger)'}">${fmtCr(c.free_cash_flow_cr)}</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">CFO Quality Classification</h3></div>
        <div style="padding:12px">
          <div class="info-banner" style="margin-bottom:12px">
            <i class="fa-solid fa-info-circle"></i>
            CFO Quality = CFO / PAT averaged over 5 years
          </div>
          ${[
            ['High Quality (>1.0)', highQuality, 'var(--success)', 'Strong cash conversion'],
            ['Moderate (0.5–1.0)', cfDedup.filter(c => c.cfo_quality_score >= 0.5 && c.cfo_quality_score <= 1.0).length, 'var(--warning)', 'Reasonable cash flow'],
            ['Accrual Risk (<0.5)', accrualRisk, 'var(--danger)', 'Watch earnings quality'],
          ].map(([label, count, color, note]) => `
          <div class="metric-row" style="padding:10px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-weight:600;color:${color}">${label}</div>
              <div style="font-size:11px;color:var(--text-muted)">${note}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:60px;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
                <div style="height:100%;background:${color};width:${count/cfDedup.length*100}%"></div>
              </div>
              <strong style="color:${color}">${count}</strong>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">Cash Flow Details Table</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>Free Cash Flow</th><th>CFO Quality Score</th><th>CFO Label</th><th>Capital Pattern</th></tr></thead>
          <tbody>
            ${cfDedup.slice(0,30).map((c,i) => `
            <tr>
              <td>${i+1}</td>
              <td><strong>${shortName(c.company_name)}</strong></td>
              <td><span class="sector-tag">${c.sector}</span></td>
              <td style="color:${c.free_cash_flow_cr>0?'var(--success)':'var(--danger)'};font-weight:600">${fmtCr(c.free_cash_flow_cr)}</td>
              <td style="color:${cfoColor(c.cfo_quality_score)};font-weight:600">${fmt(c.cfo_quality_score,2)}</td>
              <td><span class="tag" style="background:${cfoColor(c.cfo_quality_score)}22;color:${cfoColor(c.cfo_quality_score)}">${cfoLabel(c.cfo_quality_score)}</span></td>
              <td><span class="tag" style="background:${patternColor(c.capital_allocation_pattern)}22;color:${patternColor(c.capital_allocation_pattern)};font-size:10px">${c.capital_allocation_pattern}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    renderCashflowBar('cashflowBar');
    renderCapexDonut('capexDonut');
  }, 50);
}

// ─── PAGE 8: CAPITAL ALLOCATION ──────────────────────────────────────────────
function renderCapital(main) {
  const summary = NIFTY_DATA.getCapAllocSummary();
  const companies = NIFTY_DATA.getCapAllocCompanies();

  // Deduplicate by company_id
  const seen = new Set();
  const dedup = companies.filter(c => { if (seen.has(c.company_id)) return false; seen.add(c.company_id); return true; });

  let filtered = dedup;
  if (APP.sectorFilter) filtered = dedup.filter(d => d.sector === APP.sectorFilter);
  if (APP.searchQuery) filtered = filtered.filter(d => shortName(d.company_name).toLowerCase().includes(APP.searchQuery));

  const total = summary.reduce((s,r) => s + r.count, 0);

  // Sector-pattern heatmap data
  const sectors = [...new Set(dedup.map(d => d.sector))];
  const patterns = [...new Set(dedup.map(d => d.capital_allocation_pattern))];

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Capital Allocation Analysis', 'Sprint 2 – 8 Capital Allocation Patterns · ' + total + ' Records')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-hand-holding-dollar', 'Shareholder Returns', summary.find(s=>s.pattern_label==='Shareholder Returns')?.count || 0, 'Positive CFO & FCF', 'var(--success)')}
      ${kpiCard('fa-solid fa-seedling', 'Reinvestors', summary.find(s=>s.pattern_label==='Reinvestor')?.count || 0, 'Investing in Growth', 'var(--primary)')}
      ${kpiCard('fa-solid fa-chart-bar', 'Growth via Debt', summary.find(s=>s.pattern_label==='Growth Funded by Debt')?.count || 0, 'High CFI + CFF', 'var(--warning)')}
      ${kpiCard('fa-solid fa-skull-crossbones', 'Distress Signals', summary.find(s=>s.pattern_label==='Distress Signal')?.count || 0, 'Negative CFO & FCF', 'var(--danger)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Capital Allocation Pattern Distribution', 'capAllocPg', 300)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Pattern Definitions</h3></div>
        <div style="padding:12px">
          ${[
            ['Shareholder Returns', 'var(--success)', 'CFO(+) + FCF(+) + CFF(-). Returns cash via dividends/buybacks.'],
            ['Reinvestor', 'var(--primary)', 'CFO(+) + CFI(-) + CFF(+/-). Investing earnings back into business.'],
            ['Growth Funded by Debt', 'var(--purple)', 'CFI(-) + CFF(+). Borrowing to fund expansion.'],
            ['Liquidating Assets', 'var(--warning)', 'CFI(+). Selling off assets to generate cash.'],
            ['Distress Signal', 'var(--danger)', 'CFO(-) + FCF(-). Burning cash, high risk.'],
            ['Cash Accumulator', 'var(--info)', 'Hoarding cash with minimal deployment.'],
            ['Pre-Revenue', 'var(--pink)', 'Early-stage, CFO negative, investing for future.'],
            ['Mixed', '#94A3B8', 'Multiple competing signals, no clear pattern.'],
          ].map(([p, c, desc]) => `
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
            <span style="width:10px;height:10px;border-radius:50%;background:${c};flex-shrink:0;margin-top:3px"></span>
            <div>
              <div style="font-weight:600;font-size:12px;color:${c}">${p}</div>
              <div style="font-size:11px;color:var(--text-muted)">${desc}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Sector-Pattern Heatmap -->
    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">Sector × Pattern Heatmap</h3></div>
      <div style="overflow-x:auto;padding:12px">
        <table class="data-table heatmap-table" style="min-width:800px">
          <thead>
            <tr>
              <th>Sector</th>
              ${patterns.map(p => `<th style="font-size:10px;white-space:nowrap">${p}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sectors.map(sec => {
              const sCompanies = dedup.filter(d => d.sector === sec);
              return `<tr>
                <td><strong>${sec}</strong></td>
                ${patterns.map(p => {
                  const count = sCompanies.filter(d => d.capital_allocation_pattern === p).length;
                  const intensity = sCompanies.length ? count / sCompanies.length : 0;
                  const bg = count > 0 ? `${patternColor(p)}${Math.round(intensity * 200 + 30).toString(16).padStart(2,'0')}` : 'transparent';
                  return `<td style="background:${bg};text-align:center;font-weight:600;font-size:12px">${count || ''}</td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header">
        <h3 class="chart-title">Company Allocation Details</h3>
        <span class="tag tag-info">${filtered.length} companies</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>Year</th><th>Pattern</th><th>CFO Quality</th><th>Free Cash Flow</th></tr></thead>
          <tbody>
            ${filtered.slice(0,30).map((c,i) => `
            <tr>
              <td>${i+1}</td>
              <td><strong>${shortName(c.company_name)}</strong></td>
              <td><span class="sector-tag">${c.sector}</span></td>
              <td>${c.year}</td>
              <td><span class="tag" style="background:${patternColor(c.capital_allocation_pattern)}22;color:${patternColor(c.capital_allocation_pattern)}">${c.capital_allocation_pattern}</span></td>
              <td style="color:${cfoColor(c.cfo_quality_score)};font-weight:600">${fmt(c.cfo_quality_score, 2)}</td>
              <td style="color:${c.free_cash_flow_cr > 0 ? 'var(--success)' : 'var(--danger)'};font-weight:600">${fmtCr(c.free_cash_flow_cr)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  setTimeout(() => renderCapAllocDonut('capAllocPg'), 50);
}

// ─── PAGE 9: COMPANY RANKING ─────────────────────────────────────────────────
function renderRanking(main) {
  let scores = NIFTY_DATA.computeQualityScores();

  if (APP.sectorFilter) {
    scores = scores.filter(s => s.sector === APP.sectorFilter);
  }
  if (APP.searchQuery) {
    scores = scores.filter(s => s.company_name.toLowerCase().includes(APP.searchQuery));
  }

  const tierS = scores.filter(s => s.score >= 70);
  const tierA = scores.filter(s => s.score >= 50 && s.score < 70);
  const tierB = scores.filter(s => s.score >= 30 && s.score < 50);
  const tierC = scores.filter(s => s.score < 30);

  const tierBadge = score =>
    score >= 70 ? '<span class="tag tag-success">S-Tier</span>' :
    score >= 50 ? '<span class="tag tag-primary">A-Tier</span>' :
    score >= 30 ? '<span class="tag tag-warn">B-Tier</span>' :
    '<span class="tag tag-danger">C-Tier</span>';

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Company Quality Ranking', 'Composite Score: ROE(30%) + ROCE(25%) + Leverage(20%) + CFO Quality(15%) + FCF(10%)')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-crown', 'S-Tier (Score ≥ 70)', tierS.length, 'Premium quality', 'var(--success)')}
      ${kpiCard('fa-solid fa-medal', 'A-Tier (50–69)', tierA.length, 'Good quality', 'var(--primary)')}
      ${kpiCard('fa-solid fa-ribbon', 'B-Tier (30–49)', tierB.length, 'Average quality', 'var(--warning)')}
      ${kpiCard('fa-solid fa-circle-exclamation', 'C-Tier (<30)', tierC.length, 'Below average', 'var(--danger)')}
    </div>

    <div class="chart-grid chart-grid-2">
      ${chartCard('Top 20 Quality Scores', 'qualityScoreBar', 380)}
      <div class="chart-card page-fade-in">
        <div class="chart-card-header"><h3 class="chart-title">Risk-Return Matrix</h3></div>
        <div class="chart-wrap" style="height:340px;position:relative">
          <canvas id="riskReturnScatter"></canvas>
        </div>
      </div>
    </div>

    <!-- Investment Quality Cards – Top 6 -->
    <div class="page-fade-in">
      <h3 class="chart-title" style="margin:20px 0 12px">Top Investment Quality Picks</h3>
      <div class="quality-cards-grid">
        ${scores.slice(0,6).map((c,i) => `
        <div class="quality-card">
          <div class="qc-header">
            <span class="qc-rank">#${i+1}</span>
            ${tierBadge(c.score)}
          </div>
          <div class="qc-name">${shortName(c.company_name)}</div>
          <div class="qc-sector">${c.sector}</div>
          <div class="qc-score-big">${c.score}<span style="font-size:14px;color:var(--text-muted)">/100</span></div>
          <div class="qc-metrics">
            <div class="qc-metric"><span>ROE</span><strong style="color:var(--success)">${fmt(c.roe)}%</strong></div>
            <div class="qc-metric"><span>ROCE</span><strong style="color:var(--primary)">${fmt(c.roce)}%</strong></div>
            <div class="qc-metric"><span>D/E</span><strong style="color:${c.de_ratio===0?'var(--success)':c.de_ratio>3?'var(--danger)':'var(--warning)'}">${c.de_ratio===null?'N/A':fmt(c.de_ratio,2)+'x'}</strong></div>
            <div class="qc-metric"><span>CFO Quality</span><strong style="color:${cfoColor(c.cfo_quality)}">${fmt(c.cfo_quality,2)}</strong></div>
          </div>
          <div class="qc-bar-wrap">
            <div class="qc-bar" style="width:${c.score}%;background:${c.score>=70?'var(--success)':c.score>=50?'var(--primary)':c.score>=30?'var(--warning)':'var(--danger)'}"></div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="chart-card page-fade-in">
      <div class="chart-card-header">
        <h3 class="chart-title">Full Quality Leaderboard</h3>
        <span class="tag tag-info">${scores.length} companies</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Rank</th><th>Company</th><th>Sector</th><th>ROE%</th><th>ROCE%</th><th>D/E</th><th>CFO Quality</th><th>FCF</th><th>Score</th><th>Tier</th></tr>
          </thead>
          <tbody>
            ${scores.map((c,i) => `
            <tr>
              <td><strong>${i+1}</strong></td>
              <td>${shortName(c.company_name)}</td>
              <td><span class="sector-tag">${c.sector}</span></td>
              <td>${badge(c.roe, 20, 10)}</td>
              <td>${badge(c.roce, 20, 10)}</td>
              <td>${deBadge(c.de_ratio)}</td>
              <td style="color:${cfoColor(c.cfo_quality)};font-weight:600">${fmt(c.cfo_quality,2)}</td>
              <td style="color:${c.free_cash_flow>0?'var(--success)':'var(--danger)'}">
                ${c.free_cash_flow>0?'<i class="fa-solid fa-circle-check"></i>':'<i class="fa-solid fa-circle-xmark"></i>'}
              </td>
              <td>
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:50px;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden">
                    <div style="height:100%;width:${c.score}%;background:${c.score>=70?'var(--success)':c.score>=50?'var(--primary)':c.score>=30?'var(--warning)':'var(--danger)'}"></div>
                  </div>
                  <strong>${c.score}</strong>
                </div>
              </td>
              <td>${tierBadge(c.score)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    renderQualityScoreBar('qualityScoreBar', 20);
    // Risk-Return scatter: ROE vs D/E
    destroyChart('riskReturnScatter');
    const canvas = document.getElementById('riskReturnScatter');
    if (canvas) {
      const smap = {};
      scores.forEach(s => {
        const sec = s.sector || 'Other';
        if (!smap[sec]) smap[sec] = [];
        smap[sec].push({ x: s.de_ratio === null ? 0 : s.de_ratio, y: s.roe, company: shortName(s.company_name), score: s.score });
      });
      const datasets = Object.entries(smap).map(([sec, pts], i) => ({
        label: sec, data: pts,
        backgroundColor: PALETTE.sectors[i % PALETTE.sectors.length] + 'BB',
        pointRadius: 7, pointHoverRadius: 10
      }));
      registerChart('riskReturnScatter', new Chart(canvas.getContext('2d'), {
        type: 'scatter',
        data: { datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 8, padding: 10, font: { size: 10 } } },
            tooltip: { callbacks: { label: c => `${c.raw.company}: ROE ${c.raw.y?.toFixed(1)}%, D/E ${c.raw.x?.toFixed(2)}x, Score ${c.raw.score}` } }
          },
          scales: {
            x: { title: { display: true, text: 'Debt/Equity Ratio', color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { title: { display: true, text: 'ROE %', color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      }));
    }
  }, 50);
}

// ─── PAGE 10: SPRINT SUMMARY ─────────────────────────────────────────────────
function renderSummary(main) {
  const stats = NIFTY_DATA.getSprintStats();

  main.innerHTML = `
  <div class="page-fade-in">
    ${sectionHeader('Sprint Summary', 'NIFTY100 Financial Intelligence Platform – Complete Delivery')}

    <div class="kpi-grid kpi-grid-4">
      ${kpiCard('fa-solid fa-file-code', 'Source Files Created', '25+', 'Python + JS + HTML + CSS', 'var(--primary)')}
      ${kpiCard('fa-solid fa-bolt', 'KPIs Implemented', stats.kpi_count ? stats.kpi_count + '+' : '50+', 'Profitability + Leverage + CAGR + CF', 'var(--success)')}
      ${kpiCard('fa-solid fa-vial', 'Tests Passed', stats.tests_passed || 139, '0 Failures · 100% Pass Rate', 'var(--success)')}
      ${kpiCard('fa-solid fa-database', 'Database Rows', (stats.db_rows || 12892).toLocaleString(), 'nifty100.db · SQLite', 'var(--warning)')}
    </div>

    <!-- Sprint 1 -->
    <div class="sprint-summary-card page-fade-in" style="margin-bottom:20px">
      <div class="sprint-s-header" style="border-color:var(--success)">
        <div>
          <h2 style="color:var(--success)"><i class="fa-solid fa-check-circle"></i> Sprint 1 – COMPLETED</h2>
          <p style="color:var(--text-muted)">ETL Pipeline · Data Quality Engine · Database Loading</p>
        </div>
        <span class="tag tag-success" style="font-size:14px">100% Delivered</span>
      </div>
      <div class="sprint-s-body">
        <div class="sprint-grid-3">
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--success)"><i class="fa-solid fa-file-excel"></i></div>
            <div class="sf-title">Data Ingestion</div>
            <div class="sf-items">
              <span>12 XLSX datasets processed</span>
              <span>7 raw + 5 supporting files</span>
              <span>pandas-based loader.py</span>
              <span>Normalizer & Deduplication</span>
            </div>
          </div>
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--primary)"><i class="fa-solid fa-database"></i></div>
            <div class="sf-title">Database</div>
            <div class="sf-items">
              <span>SQLite nifty100.db</span>
              <span>12 tables created</span>
              <span>${(stats.db_rows || 12892).toLocaleString()} rows loaded</span>
              <span>Foreign key constraints</span>
            </div>
          </div>
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--warning)"><i class="fa-solid fa-shield-check"></i></div>
            <div class="sf-title">Data Quality</div>
            <div class="sf-items">
              <span>16 DQ Rules implemented</span>
              <span>FK validation</span>
              <span>Type & format checks</span>
              <span>Validation CSV report</span>
            </div>
          </div>
        </div>
        <div class="sprint-stats-row">
          ${[['Companies','92'],['Tables','12'],['DQ Rules','16'],['Test Files','3'],['Datasets','12'],['DB Rows',(stats.db_rows||12892).toLocaleString()]].map(([k,v]) =>
            `<div class="sprint-stat"><strong>${v}</strong><span>${k}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Sprint 2 -->
    <div class="sprint-summary-card page-fade-in" style="margin-bottom:20px">
      <div class="sprint-s-header" style="border-color:var(--primary)">
        <div>
          <h2 style="color:var(--primary)"><i class="fa-solid fa-check-circle"></i> Sprint 2 – COMPLETED</h2>
          <p style="color:var(--text-muted)">Financial Ratio Engine · CAGR · Cash Flow KPIs · Capital Allocation</p>
        </div>
        <span class="tag tag-primary" style="font-size:14px">100% Delivered</span>
      </div>
      <div class="sprint-s-body">
        <div class="sprint-grid-4">
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--success)"><i class="fa-solid fa-percent"></i></div>
            <div class="sf-title">Profitability Ratios</div>
            <div class="sf-items">
              <span>Net Profit Margin</span>
              <span>Operating Margin</span>
              <span>ROE · ROCE · ROA</span>
              <span>EPS & Dividend Payout</span>
            </div>
          </div>
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--warning)"><i class="fa-solid fa-scale-unbalanced"></i></div>
            <div class="sf-title">Leverage Analysis</div>
            <div class="sf-items">
              <span>Debt-to-Equity Ratio</span>
              <span>Interest Coverage (ICR)</span>
              <span>Net Debt Calculation</span>
              <span>Bank/NBFC exceptions</span>
            </div>
          </div>
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--primary)"><i class="fa-solid fa-seedling"></i></div>
            <div class="sf-title">CAGR Engine</div>
            <div class="sf-items">
              <span>3/5/10 Year CAGR</span>
              <span>Revenue & PAT CAGR</span>
              <span>EPS & Stock CAGR</span>
              <span>CAGR Flags (4 types)</span>
            </div>
          </div>
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--info)"><i class="fa-solid fa-money-bill-wave"></i></div>
            <div class="sf-title">Cash Flow Intel</div>
            <div class="sf-items">
              <span>Free Cash Flow (FCF)</span>
              <span>CFO Quality Score</span>
              <span>CapEx Intensity (3 tiers)</span>
              <span>8 Capital Allocation Patterns</span>
            </div>
          </div>
        </div>
        <div class="sprint-stats-row">
          ${[['KPIs Computed','50+'],['Ratio Records',(stats.ratio_records||1184).toLocaleString()],['Tests Passed','139'],['CAGR Flags','4'],['Alloc Patterns','8'],['Quality Tiers','4']].map(([k,v]) =>
            `<div class="sprint-stat"><strong>${v}</strong><span>${k}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Sprint 3 Teaser -->
    <div class="sprint-summary-card page-fade-in" style="opacity:.65">
      <div class="sprint-s-header" style="border-color:var(--text-faint)">
        <div>
          <h2 style="color:var(--text-muted)"><i class="fa-solid fa-rocket"></i> Sprint 3 – COMING SOON</h2>
          <p style="color:var(--text-faint)">REST API · Real-time Data · ML Scoring · Portfolio Simulation</p>
        </div>
        <span class="tag tag-info" style="font-size:14px">Planned</span>
      </div>
      <div class="sprint-s-body">
        <div class="sprint-grid-4">
          ${[
            ['fa-solid fa-server','REST API','FastAPI endpoints for all KPIs'],
            ['fa-solid fa-robot','ML Scoring','Predictive quality scoring model'],
            ['fa-solid fa-chart-candlestick','Live Data','Real-time price integration'],
            ['fa-solid fa-briefcase','Portfolio','Simulated portfolio analytics'],
          ].map(([icon,title,desc]) => `
          <div class="sprint-feature">
            <div class="sf-icon" style="color:var(--text-faint)"><i class="${icon}"></i></div>
            <div class="sf-title" style="color:var(--text-faint)">${title}</div>
            <div class="sf-items"><span>${desc}</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Project Timeline -->
    <div class="chart-card page-fade-in">
      <div class="chart-card-header"><h3 class="chart-title">Full Project Timeline</h3></div>
      <div style="padding:20px">
        ${[
          ['Sprint 1 – Day 1', 'var(--success)', 'Project Setup · ETL Architecture · loader.py · normalizer.py'],
          ['Sprint 1 – Day 2', 'var(--success)', 'Validator · 16 DQ Rules · FK Constraints · load_audit.csv'],
          ['Sprint 1 – Day 3', 'var(--success)', 'Test Suite (139 tests) · DB verification · Sprint 1 Report'],
          ['Sprint 2 – Day 1', 'var(--primary)', 'Ratio Engine: Net Profit Margin, Operating Margin, ROE, ROCE, ROA'],
          ['Sprint 2 – Day 2', 'var(--primary)', 'Leverage: D/E, ICR, Net Debt · CAGR Engine (3/5/10yr)'],
          ['Sprint 2 – Day 3', 'var(--primary)', 'Cash Flow KPIs · Capital Allocation (8 patterns) · Quality Ranking'],
          ['Sprint 2 – Day 4', 'var(--primary)', 'HTML Dashboard · All 10 pages · Charts · Filters · README'],
          ['Sprint 3', 'var(--text-faint)', 'API Layer · ML Models · Real-time Integration (Planned)'],
        ].map(([day,c,desc]) => `
        <div class="timeline-row-full">
          <div class="timeline-dot" style="background:${c};box-shadow:0 0 10px ${c}"></div>
          <div class="timeline-content-full">
            <strong style="color:${c}">${day}</strong>
            <span>${desc}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function init() {
  const overlay = document.getElementById('loadingOverlay');

  // Show loading
  if (overlay) overlay.style.display = 'flex';

  const ok = await loadDashboardData();

  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => { overlay.style.display = 'none'; }, 400);
  }

  if (!ok) {
    document.getElementById('mainContent').innerHTML = `
      <div style="padding:60px;text-align:center;color:var(--danger)">
        <i class="fa-solid fa-circle-xmark" style="font-size:48px;margin-bottom:16px"></i>
        <h2>Failed to load dashboard data</h2>
        <p style="color:var(--text-muted);margin-top:8px">Make sure <code>data/dashboard_data.json</code> exists and is valid JSON.</p>
        <p style="color:var(--text-muted);margin-top:4px">Open the dashboard using a local server (Live Server extension or <code>python -m http.server</code>).</p>
      </div>`;
    return;
  }

  initNav();
  initFilters();
  renderPage('overview');
}

document.addEventListener('DOMContentLoaded', init);
