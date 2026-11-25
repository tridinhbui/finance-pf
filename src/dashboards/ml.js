import { Chart, C, fmt, frame, kpis, slider, segmented, rng, axisMoney, noGridX, h } from './ui.js';

// Revenue forecasting with models fit in the browser (OLS / ridge via normal equations)
const N = 48; // Jan 2022 – Dec 2025
const label = (t) => new Date(2022, t, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
const r = rng(321);
const Y = Array.from({ length: N }, (_, t) => {
  const m = t % 12;
  return 1000 + 9 * t + 70 * Math.sin((2 * Math.PI * m) / 12) + 35 * Math.cos((4 * Math.PI * m) / 12) + (r() - 0.5) * 70;
});

const MODELS = {
  naive: { name: 'Seasonal naive', features: 'y(t − 12)' },
  trend: { name: 'Linear trend', features: '1, t' },
  season: { name: 'Trend + seasonality', features: '1, t, 11 month dummies' },
};

function features(t, kind) {
  if (kind === 'trend') return [1, t / 12];
  const d = Array.from({ length: 11 }, (_, i) => (t % 12 === i + 1 ? 1 : 0));
  return [1, t / 12, ...d];
}

// Solve (XᵀX + λI)β = Xᵀy with Gaussian elimination
function fit(ts, kind, lambda) {
  const X = ts.map((t) => features(t, kind));
  const p = X[0].length;
  const A = Array.from({ length: p }, () => new Array(p).fill(0));
  const b = new Array(p).fill(0);
  X.forEach((row, i) => {
    for (let j = 0; j < p; j++) {
      b[j] += row[j] * Y[ts[i]];
      for (let k = 0; k < p; k++) A[j][k] += row[j] * row[k];
    }
  });
  for (let j = 1; j < p; j++) A[j][j] += lambda; // don't penalize intercept
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let i = c + 1; i < p; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i;
    [A[c], A[piv]] = [A[piv], A[c]];
    [b[c], b[piv]] = [b[piv], b[c]];
    for (let i = c + 1; i < p; i++) {
      const f = A[i][c] / A[c][c];
      for (let k = c; k < p; k++) A[i][k] -= f * A[c][k];
      b[i] -= f * b[c];
    }
  }
  const beta = new Array(p).fill(0);
  for (let i = p - 1; i >= 0; i--) {
    let s = b[i];
    for (let k = i + 1; k < p; k++) s -= A[i][k] * beta[k];
    beta[i] = s / A[i][i];
  }
  return (t) => features(t, kind).reduce((s, x, i) => s + x * beta[i], 0);
}

function predictor(kind, trainEnd, lambda, series) {
  if (kind === 'naive') {
    return (t) => {
      let k = t - 12;
      while (k >= trainEnd) k -= 12; // only use observed history
      return series[k];
    };
  }
  return fit(Array.from({ length: trainEnd }, (_, i) => i), kind, lambda);
}

// Shade the holdout window behind the lines
const holdoutPlugin = {
  id: 'holdout',
  beforeDatasetsDraw(chart, _a, opts) {
    if (opts.from == null) return;
    const { ctx, chartArea, scales } = chart;
    const x0 = scales.x.getPixelForValue(opts.from) - 4;
    const x1 = scales.x.getPixelForValue(opts.to) + 4;
    ctx.save();
    ctx.fillStyle = 'rgba(196,137,42,.08)';
    ctx.fillRect(x0, chartArea.top, x1 - x0, chartArea.bottom - chartArea.top);
    ctx.fillStyle = '#8a92a1';
    ctx.font = '11px Inter, sans-serif';
    if (x1 - x0 > 54) ctx.fillText('holdout', x0 + 6, chartArea.top + 14);
    if (opts.future != null) {
      const xf = scales.x.getPixelForValue(opts.future) - 4;
      if (chartArea.right - xf > 58) ctx.fillText('forecast', xf + 6, chartArea.top + 14);
    }
    ctx.restore();
  },
};

export function render(root) {
  const ui = frame(root);
  const s = { kind: 'season', test: 12, horizon: 12, lambda: 0.2 };
  const seg = h('<div class="ctl"><span class="ctl-top"><span>Model</span></span></div>');
  seg.appendChild(segmented(Object.entries(MODELS).map(([k, m]) => [k, m.name]), s.kind, (k) => ((s.kind = k), update())));
  seg.style.gridColumn = '1 / -1';
  ui.controls.appendChild(seg);
  [
    ['test', 'Holdout window', 6, 18, 1, (v) => `${v} months`],
    ['horizon', 'Forecast horizon', 0, 12, 1, (v) => `${v} months`],
    ['lambda', 'Ridge penalty λ', 0, 5, 0.1, (v) => v.toFixed(1)],
  ].forEach(([key, lbl, min, max, step, format]) =>
    ui.controls.appendChild(slider({ label: lbl, min, max, step, value: s[key], format, onInput: (v) => ((s[key] = v), update()) }))
  );
  const set = kpis(ui.kpis, [
    { key: 'mape', label: 'Holdout MAPE' },
    { key: 'rmse', label: 'Holdout RMSE' },
    { key: 'r2', label: 'In-sample R²' },
    { key: 'feat', label: 'Features' },
  ]);
  ui.body.appendChild(
    h(`<div class="legend"><span><i style="background:${C.s2}"></i>Actual revenue</span><span><i style="background:${C.s1}"></i>Model (fit on train)</span><span><i class="dash-i"></i>Forecast</span></div>`)
  );
  const wrap = h('<div class="chart"><canvas></canvas></div>');
  ui.body.appendChild(wrap);
  ui.body.appendChild(h('<p class="axis-note">Fit live in your browser: ridge regression solved with the normal equations. Monthly revenue, $M (synthetic).</p>'));

  const chart = new Chart(wrap.querySelector('canvas'), {
    type: 'line',
    plugins: [holdoutPlugin],
    data: {
      labels: [],
      datasets: [
        { label: 'Actual', data: [], borderColor: C.s2, backgroundColor: C.s2, borderWidth: 2, pointRadius: 2, pointHoverRadius: 5, tension: 0.2 },
        { label: 'Model', data: [], borderColor: C.s1, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.2 },
        { label: 'Forecast', data: [], borderColor: C.s1, borderDash: [6, 5], borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.2 },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: {
        holdout: {},
        tooltip: { callbacks: { label: (c) => (c.parsed.y == null ? null : ` ${c.dataset.label}: ${fmt.m(c.parsed.y)}`) } },
      },
      scales: { y: axisMoney(), x: { ...noGridX, ticks: { maxTicksLimit: 8, maxRotation: 0, autoSkip: true, autoSkipPadding: 14 } } },
    },
  });

  function update() {
    const trainEnd = N - s.test;
    const pTest = predictor(s.kind, trainEnd, s.lambda, Y);
    const pAll = predictor(s.kind, N, s.lambda, Y);
    const total = N + s.horizon;
    chart.data.labels = Array.from({ length: total }, (_, t) => label(t));
    chart.data.datasets[0].data = Array.from({ length: total }, (_, t) => (t < N ? Y[t] : null));
    chart.data.datasets[1].data = Array.from({ length: total }, (_, t) => (t >= 12 && t < N ? (t < trainEnd ? pAll(t) : pTest(t)) : null));
    chart.data.datasets[2].data = Array.from({ length: total }, (_, t) => (t >= N - 1 && s.horizon ? (t === N - 1 ? pTest(t) : pAll(t)) : null));
    chart.options.plugins.holdout = { from: trainEnd, to: N - 1, future: s.horizon ? N : null };
    chart.update();

    const errs = [];
    let sse = 0;
    for (let t = trainEnd; t < N; t++) {
      const e = Y[t] - pTest(t);
      errs.push(Math.abs(e) / Y[t]);
      sse += e * e;
    }
    // goodness of fit on the training window
    const trainTs = Array.from({ length: trainEnd - 12 }, (_, i) => i + 12);
    const mean = trainTs.reduce((a, t) => a + Y[t], 0) / trainTs.length;
    let ssRes = 0;
    let ssTot = 0;
    trainTs.forEach((t) => {
      ssRes += (Y[t] - pTest(t)) ** 2;
      ssTot += (Y[t] - mean) ** 2;
    });
    const mape = (errs.reduce((a, b) => a + b, 0) / errs.length) * 100;
    const ok = mape < 5;
    set('mape', fmt.pct(mape), ok ? '✓ Within 5% target' : '⚠ Above 5% target', ok ? 'good' : 'bad');
    set('rmse', fmt.m1(Math.sqrt(sse / errs.length)));
    set('r2', s.kind === 'naive' ? 'n/a' : (1 - ssRes / ssTot).toFixed(2), s.kind === 'naive' ? 'no fitted parameters' : 'on training window');
    set('feat', `${s.kind === 'naive' ? 1 : s.kind === 'trend' ? 2 : 13}`, MODELS[s.kind].features);
  }
  update();
  return () => chart.destroy();
}
