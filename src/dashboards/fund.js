import { Chart, C, fmt, frame, kpis, segmented, rng, noGridX, h } from './ui.js';

// Student fund vs. S&P 500, Oct 2022 – May 2025 (indexed to 100, illustrative path)
const N = 32;
const labels = Array.from({ length: N }, (_, i) => {
  const d = new Date(2022, 9 + i, 1);
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
});

function path(seed, end, vol) {
  const r = rng(seed);
  const raw = [0];
  for (let i = 1; i < N; i++) raw.push(raw[i - 1] + (r() - 0.5) * vol);
  // bridge: force the log path to land exactly on the target end value
  const target = Math.log(end / 100);
  return raw.map((v, i) => 100 * Math.exp(v - (raw[N - 1] - target) * (i / (N - 1))));
}
const FUND = path(11, 185, 0.09);
const SPX = path(5, 155, 0.06);

const maxDD = (s) => {
  let peak = s[0];
  let dd = 0;
  s.forEach((v) => {
    peak = Math.max(peak, v);
    dd = Math.min(dd, v / peak - 1);
  });
  return dd * 100;
};

export function render(root) {
  const ui = frame(root);
  let range = 'all';
  ui.controls.classList.add('row');
  ui.controls.appendChild(
    segmented([['all', 'Since inception'], ['24', 'Last 24M'], ['12', 'Last 12M']], range, (v) => ((range = v), update()))
  );
  const set = kpis(ui.kpis, [
    { key: 'ret', label: 'Fund return' },
    { key: 'spx', label: 'S&P 500 return' },
    { key: 'alpha', label: 'Outperformance' },
    { key: 'dd', label: 'Max drawdown (fund)' },
  ]);
  ui.body.appendChild(
    h(`<div class="legend"><span><i style="background:${C.s1}"></i>Macalester Investment Group</span><span><i style="background:${C.s2}"></i>S&amp;P 500</span></div>`)
  );
  const wrap = h('<div class="chart"><canvas></canvas></div>');
  ui.body.appendChild(wrap);
  const chart = new Chart(wrap.querySelector('canvas'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Fund', data: [], borderColor: C.s1, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.25, fill: { target: 1, above: 'rgba(47,98,184,.08)', below: 'rgba(0,0,0,0)' } },
        { label: 'S&P 500', data: [], borderColor: C.s2, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.25 },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: { tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${c.parsed.y.toFixed(1)}` } } },
      scales: {
        y: { title: { display: true, text: 'Indexed (start = 100)', color: C.axis }, grid: { color: C.grid }, border: { display: false } },
        x: { ...noGridX, ticks: { maxTicksLimit: 8 } },
      },
    },
  });

  function update() {
    const start = range === 'all' ? 0 : N - Number(range);
    const rebase = (s) => s.slice(start).map((v) => (v / s[start]) * 100);
    const f = rebase(FUND);
    const p = rebase(SPX);
    chart.data.labels = labels.slice(start);
    chart.data.datasets[0].data = f;
    chart.data.datasets[1].data = p;
    chart.update();
    const fr = f[f.length - 1] - 100;
    const pr = p[p.length - 1] - 100;
    set('ret', `${fr >= 0 ? '+' : ''}${fr.toFixed(0)}%`, `$250K → ${fmt.k(250000 * (1 + fr / 100))}`);
    set('spx', `${pr >= 0 ? '+' : ''}${pr.toFixed(0)}%`);
    set('alpha', `${fr - pr >= 0 ? '+' : ''}${(fr - pr).toFixed(0)} pts`, fr > pr ? '✓ Beat the index' : '', 'good');
    set('dd', fmt.pct(maxDD(f)));
  }
  update();
  return () => chart.destroy();
}
