import { Chart, C, frame, kpis, segmented, h } from './ui.js';

// Peer benchmarking (illustrative, anonymized)
const COS = ['Company', 'Peer A', 'Peer B', 'Peer C', 'Peer D', 'Peer E', 'Peer F', 'Peer G', 'Peer H'];
const METRICS = {
  ebitda: { label: 'EBITDA margin', vals: [8.9, 11.4, 7.2, 9.8, 6.1, 12.6, 8.4, 5.3, 10.2], higher: true },
  gross: { label: 'Gross margin', vals: [12.8, 14.9, 10.6, 13.7, 9.4, 17.2, 12.1, 8.8, 15.3], higher: true },
  sga: { label: 'SG&A % of revenue', vals: [4.9, 5.6, 4.2, 6.3, 3.8, 7.1, 5.2, 4.4, 6.0], higher: false },
  capex: { label: 'CapEx % of revenue', vals: [2.6, 3.4, 2.1, 3.9, 1.8, 4.2, 2.9, 1.6, 3.1], higher: false },
};
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

export function render(root) {
  const ui = frame(root);
  let key = 'ebitda';
  ui.controls.classList.add('row');
  ui.controls.appendChild(
    segmented(Object.entries(METRICS).map(([k, m]) => [k, m.label]), key, (k) => ((key = k), update()))
  );
  const set = kpis(ui.kpis, [
    { key: 'val', label: 'Company' },
    { key: 'med', label: 'Peer median' },
    { key: 'gap', label: 'Gap to median' },
    { key: 'rank', label: 'Rank of 9' },
  ]);
  ui.body.appendChild(
    h(`<div class="legend"><span><i style="background:${C.s1}"></i>Company</span><span><i style="background:${C.muted}"></i>Peers</span></div>`)
  );
  const wrap = h('<div class="chart"><canvas></canvas></div>');
  ui.body.appendChild(wrap);
  const chart = new Chart(wrap.querySelector('canvas'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], borderRadius: 4, borderSkipped: 'start', barPercentage: 0.75 }] },
    options: {
      indexAxis: 'y',
      plugins: { tooltip: { callbacks: { label: (c) => ` ${METRICS[key].label}: ${c.parsed.x.toFixed(1)}%` } } },
      scales: {
        x: { ticks: { callback: (v) => `${v}%` }, grid: { color: C.grid }, border: { display: false }, beginAtZero: true },
        y: { grid: { display: false }, border: { color: C.grid }, ticks: { color: C.ink2 } },
      },
    },
  });

  function update() {
    const m = METRICS[key];
    const rows = COS.map((c, i) => ({ c, v: m.vals[i] })).sort((a, b) => (m.higher ? b.v - a.v : a.v - b.v));
    chart.data.labels = rows.map((r) => r.c);
    chart.data.datasets[0].data = rows.map((r) => r.v);
    chart.data.datasets[0].backgroundColor = rows.map((r) => (r.c === 'Company' ? C.s1 : C.muted));
    chart.update();
    const me = m.vals[0];
    const med = median(m.vals.slice(1));
    const gap = me - med;
    const better = m.higher ? gap >= 0 : gap <= 0;
    set('val', `${me.toFixed(1)}%`);
    set('med', `${med.toFixed(1)}%`);
    set('gap', `${gap >= 0 ? '+' : ''}${gap.toFixed(1)} pts`, better ? '✓ Better than median' : '⚠ Behind median', better ? 'good' : 'bad');
    set('rank', `#${rows.findIndex((r) => r.c === 'Company') + 1}`, m.higher ? 'higher is better' : 'lower is better');
  }
  update();
  return () => chart.destroy();
}
