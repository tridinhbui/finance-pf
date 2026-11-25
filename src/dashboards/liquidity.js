import { Chart, C, fmt, frame, kpis, slider, rng, axisMoney, noGridX, h } from './ui.js';

// Working-capital driven 12-month liquidity forecast ($M)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BASE = { growth: 4, dso: 24, dio: 38, dpo: 30 };
const ACTUAL_MONTHS = 9;

function model({ growth, dso, dio, dpo }) {
  const rev0 = 1100;
  const nwc = (rev) => {
    const cogs = rev * 0.85;
    return (rev * dso) / 30 + (cogs * dio) / 30 - (cogs * dpo) / 30;
  };
  const baseNwc = (() => {
    const cogs = rev0 * 0.85;
    return (rev0 * BASE.dso) / 30 + (cogs * BASE.dio) / 30 - (cogs * BASE.dpo) / 30;
  })();
  let cash = 620;
  let prevNwc = baseNwc;
  return MONTHS.map((_, i) => {
    const rev = rev0 * Math.pow(1 + growth / 100, (i + 1) / 12) * (1 + 0.04 * Math.sin((i / 12) * 2 * Math.PI));
    const ebitda = rev * 0.08;
    const capex = rev * 0.02;
    const w = nwc(rev);
    const fcf = ebitda - capex - (w - prevNwc);
    prevNwc = w;
    cash += fcf;
    return { cash, fcf };
  });
}

// Illustrative "actuals": base forecast with small deterministic noise
const r = rng(42);
const actuals = model(BASE)
  .slice(0, ACTUAL_MONTHS)
  .map((m) => m.cash * (1 + (r() - 0.5) * 0.06));

export function render(root) {
  const ui = frame(root);
  const state = { ...BASE };
  const set = kpis(ui.kpis, [
    { key: 'ccc', label: 'Cash conversion cycle' },
    { key: 'end', label: 'Year-end liquidity' },
    { key: 'fcf', label: 'Full-year FCF' },
    { key: 'var', label: 'Forecast variance vs. actuals' },
  ]);

  const ctls = [
    ['growth', 'Revenue growth (YoY)', -4, 12, 0.5, (v) => fmt.pct(v)],
    ['dso', 'DSO (days)', 15, 40, 1, (v) => `${v}d`],
    ['dio', 'DIO (days)', 25, 55, 1, (v) => `${v}d`],
    ['dpo', 'DPO (days)', 20, 45, 1, (v) => `${v}d`],
  ];
  ctls.forEach(([key, label, min, max, step, format]) =>
    ui.controls.appendChild(
      slider({ label, min, max, step, value: state[key], format, onInput: (v) => ((state[key] = v), update()) })
    )
  );

  ui.body.appendChild(
    h(`<div class="legend"><span><i style="background:${C.s1}"></i>Forecast</span><span><i style="background:${C.s2}"></i>Actual (Jan–Sep)</span><span><i class="band"></i>±5% tolerance</span></div>`)
  );
  const wrap = h('<div class="chart"><canvas></canvas></div>');
  ui.body.appendChild(wrap);

  const chart = new Chart(wrap.querySelector('canvas'), {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'Upper', data: [], borderWidth: 0, pointRadius: 0, fill: '+1', backgroundColor: 'rgba(47,98,184,.08)' },
        { label: 'Lower', data: [], borderWidth: 0, pointRadius: 0, fill: false },
        { label: 'Forecast', data: [], borderColor: C.s1, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.3 },
        {
          label: 'Actual',
          data: actuals,
          borderColor: C.s2,
          backgroundColor: C.s2,
          borderWidth: 2,
          pointRadius: 4,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          filter: (i) => i.dataset.label === 'Forecast' || i.dataset.label === 'Actual',
          callbacks: { label: (c) => ` ${c.dataset.label}: ${fmt.m(c.parsed.y)}` },
        },
      },
      scales: { y: axisMoney(), x: noGridX },
    },
  });

  function update() {
    const m = model(state);
    const cash = m.map((x) => x.cash);
    chart.data.datasets[0].data = cash.map((v) => v * 1.05);
    chart.data.datasets[1].data = cash.map((v) => v * 0.95);
    chart.data.datasets[2].data = cash;
    chart.update();

    const variance =
      (actuals.reduce((s, a, i) => s + Math.abs(a - cash[i]) / cash[i], 0) / ACTUAL_MONTHS) * 100;
    const ccc = state.dso + state.dio - state.dpo;
    set('ccc', `${ccc} days`, `${ccc - (BASE.dso + BASE.dio - BASE.dpo) >= 0 ? '+' : ''}${ccc - (BASE.dso + BASE.dio - BASE.dpo)} vs. plan`);
    set('end', fmt.b(cash[11]));
    set('fcf', fmt.m(m.reduce((s, x) => s + x.fcf, 0)));
    const ok = variance < 5;
    set('var', fmt.pct(variance), ok ? '✓ Within 5% target' : '⚠ Above 5% target', ok ? 'good' : 'bad');
  }
  update();
  return () => chart.destroy();
}
