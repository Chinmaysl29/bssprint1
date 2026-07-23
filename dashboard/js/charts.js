
/**
 * NIFTY100 Dashboard – Charts Module
 * All Chart.js chart factory functions
 */

// ---- Global Chart Defaults ----
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.legend.position = 'bottom';
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.padding = 14;
Chart.defaults.plugins.tooltip.backgroundColor = '#1E293B';
Chart.defaults.plugins.tooltip.titleColor = '#F8FAFC';
Chart.defaults.plugins.tooltip.bodyColor = '#94A3B8';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

// Registry: keep track of chart instances to destroy before re-render
const CHART_REGISTRY = {};

function destroyChart(id) {
  if (CHART_REGISTRY[id]) {
    CHART_REGISTRY[id].destroy();
    delete CHART_REGISTRY[id];
  }
}

function registerChart(id, instance) {
  CHART_REGISTRY[id] = instance;
  return instance;
}

// ---- Color Palettes ----
const PALETTE = {
  blues:   ['#2563EB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE'],
  sectors: ['#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#F97316','#14B8A6','#6366F1'],
  grad: (ctx, c1, c2) => {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
  },
  alphaArr: (colors, alpha) => colors.map(c => c + Math.round(alpha*255).toString(16).padStart(2,'0'))
};

// =======================================
// SECTOR DONUT CHART
// =======================================
function renderSectorDonut(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const sectors = NIFTY_DATA.getSectors();
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sectors.map(s => s.sector),
      datasets: [{
        data: sectors.map(s => s.count),
        backgroundColor: PALETTE.sectors,
        borderColor: '#0F172A',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '68%',
      plugins: {
        legend: { position: 'right', labels: { padding: 12, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} companies` } }
      }
    }
  }));
}

// =======================================
// TOP ROE – HORIZONTAL BAR
// =======================================
function renderTopROEBar(canvasId, n = 10) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getTopROE(n);
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.company_name),
      datasets: [{
        label: 'ROE %',
        data: data.map(d => d.roe_percentage),
        backgroundColor: PALETTE.blues[0],
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v + '%' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  }));
}

// =======================================
// ROE vs ROCE SCATTER
// =======================================
function renderRoeRoceScatter(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const raw = NIFTY_DATA.getRoeRoce();
  const sectorMap = {};
  raw.forEach(r => {
    const s = r.sector || 'Other';
    if (!sectorMap[s]) sectorMap[s] = [];
    sectorMap[s].push({ x: r.roce_percentage, y: r.roe_percentage, company: r.company_name });
  });
  const datasets = Object.entries(sectorMap).map(([s, pts], i) => ({
    label: s, data: pts,
    backgroundColor: PALETTE.sectors[i % PALETTE.sectors.length] + 'BB',
    pointRadius: 6, pointHoverRadius: 9
  }));
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 8, padding: 10, font: { size: 10 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.raw.company}: ROE ${ctx.raw.y?.toFixed(1)}%, ROCE ${ctx.raw.x?.toFixed(1)}%` } }
      },
      scales: {
        x: { title: { display: true, text: 'ROCE %', color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { title: { display: true, text: 'ROE %', color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  }));
}

// =======================================
// CAPITAL ALLOCATION DONUT
// =======================================
function renderCapAllocDonut(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getCapAllocSummary();
  const colors = ['#10B981','#2563EB','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#EC4899','#F97316'];
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.pattern_label),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: colors,
        borderColor: '#0F172A', borderWidth: 3, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { padding: 10, font: { size: 10 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} records` } }
      }
    }
  }));
}

// =======================================
// DQ RULES – PASS/FAIL/WARN BARS
// =======================================
function renderDQRulesChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const rules = NIFTY_DATA.getDQRules();
  const pass = rules.filter(r => r.status === 'PASS').length;
  const warn = rules.filter(r => r.status === 'WARN').length;
  const fail = rules.filter(r => r.status === 'FAIL').length;
  const info = rules.filter(r => r.status === 'INFO').length;
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pass', 'Warning', 'Fail', 'Info'],
      datasets: [{
        data: [pass, warn, fail, info],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#06B6D4'],
        borderColor: '#0F172A', borderWidth: 3, hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '70%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} rules` } }
      }
    }
  }));
}

// =======================================
// PROFITABILITY TOP 10 NPM BAR
// =======================================
function renderProfitabilityBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getProfitability(10);
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.company_name),
      datasets: [
        { label: 'Net Profit Margin %', data: data.map(d => d.npm), backgroundColor: '#10B981', borderRadius: 4 },
        { label: 'Operating Margin %',  data: data.map(d => d.opm), backgroundColor: '#2563EB', borderRadius: 4 }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v + '%' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  }));
}

// =======================================
// SECTOR ROE BAR
// =======================================
function renderSectorROEBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getSectorROE();
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.sector),
      datasets: [
        { label: 'Avg ROE %',  data: data.map(d => d.avg_roe),  backgroundColor: '#10B981', borderRadius: 4 },
        { label: 'Avg ROCE %', data: data.map(d => d.avg_roce), backgroundColor: '#2563EB', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 30, font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v + '%' } }
      }
    }
  }));
}

// =======================================
// LEVERAGE – D/E BAR
// =======================================
function renderLeverageBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getLeverage(12).filter(d => d.de_ratio !== null);
  const colors = data.map(d => d.de_ratio > 5 ? '#EF4444' : d.de_ratio > 2 ? '#F59E0B' : '#10B981');
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.company_name),
      datasets: [{ label: 'D/E Ratio', data: data.map(d => d.de_ratio), backgroundColor: colors, borderRadius: 4 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  }));
}

// =======================================
// CAGR COMPARISON BAR
// =======================================
function renderCAGRBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const raw = NIFTY_DATA.getCAGR();
  // Parse CAGR strings like "10yr: 18%, 5yr: 22%, 3yr: 28%"
  function parseCAGR(str) {
    if (!str) return null;
    const m = str.match(/([\d.]+)%/);
    return m ? parseFloat(m[1]) : null;
  }
  const data = raw
    .map(d => ({ name: d.company_name, sales: parseCAGR(d.compounded_sales_growth), profit: parseCAGR(d.compounded_profit_growth), stock: parseCAGR(d.stock_price_cagr) }))
    .filter(d => d.sales !== null)
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 10);
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [
        { label: 'Sales CAGR %',  data: data.map(d => d.sales),  backgroundColor: '#2563EB', borderRadius: 4 },
        { label: 'Profit CAGR %', data: data.map(d => d.profit), backgroundColor: '#10B981', borderRadius: 4 },
        { label: 'Stock CAGR %',  data: data.map(d => d.stock),  backgroundColor: '#F59E0B', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 30, font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v + '%' } }
      }
    }
  }));
}

// =======================================
// CASHFLOW TOP COMPANIES
// =======================================
function renderCashflowBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const data = NIFTY_DATA.getCashflow(12);
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.company_name),
      datasets: [
        { label: 'Operating (₹Cr)', data: data.map(d => d.operating_activity), backgroundColor: '#10B981', borderRadius: 4 },
        { label: 'Investing (₹Cr)', data: data.map(d => d.investing_activity), backgroundColor: '#EF4444', borderRadius: 4 },
        { label: 'Financing (₹Cr)', data: data.map(d => d.financing_activity), backgroundColor: '#F59E0B', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 30, font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, title: { display: true, text: '₹ Crore', color: '#94A3B8' } }
      }
    }
  }));
}

// =======================================
// CAPEX INTENSITY DONUT
// =======================================
function renderCapexDonut(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const labels_data = NIFTY_DATA.getCapexLabels();
  const colorMap = { 'Asset Light': '#10B981', 'Moderate': '#F59E0B', 'Capital Intensive': '#EF4444' };
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels_data.map(d => d.capex_label),
      datasets: [{
        data: labels_data.map(d => d.count),
        backgroundColor: labels_data.map(d => colorMap[d.capex_label] || '#8B5CF6'),
        borderColor: '#0F172A', borderWidth: 3, hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '68%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} companies` } }
      }
    }
  }));
}

// =======================================
// ETL TABLE COUNT BAR
// =======================================
function renderETLTableBar(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const counts = NIFTY_DATA.getTableCounts();
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: entries.map(e => e[0]),
      datasets: [{ label: 'Row Count', data: entries.map(e => e[1]), backgroundColor: PALETTE.sectors, borderRadius: 5 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, type: 'logarithmic', ticks: { callback: v => v.toLocaleString() } },
        y: { grid: { display: false } }
      }
    }
  }));
}

// =======================================
// QUALITY SCORE BAR (ranking page)
// =======================================
function renderQualityScoreBar(canvasId, n = 20) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const scores = NIFTY_DATA.computeQualityScores().slice(0, n);
  const colors = scores.map(s => s.score >= 70 ? '#10B981' : s.score >= 50 ? '#F59E0B' : '#EF4444');
  const ctx = canvas.getContext('2d');
  return registerChart(canvasId, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: scores.map(s => s.company_name),
      datasets: [{ label: 'Quality Score', data: scores.map(s => s.score), backgroundColor: colors, borderRadius: 5 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  }));
}
