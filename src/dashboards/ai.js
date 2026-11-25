import { Chart, C, fmt, frame, kpis, slider, axisMoney, noGridX, h } from './ui.js';

// AI-in-Finance business case: savings ramp vs. implementation cost
export function render(root) {
  const ui = frame(root);
  const s = { fte: 120, pct: 15, cost: 110, impl: 750, ramp: 6 };
  const set = kpis(ui.kpis, [
    { key: 'run', label: 'Run-rate annual savings' },
    { key: 'eff', label: 'Capacity freed' },
    { key: 'pay', label: 'Payback' },
    { key: 'net', label: '24-month net value' },
  ]);

  [
    ['fte', 'Finance team (FTE)', 40, 250, 5, (v) => `${v}`],
    ['pct', 'Hours automated', 5, 35, 1, (v) => `${v}%`],
    ['cost', 'Loaded cost per FTE', 70, 180, 5, (v) => `$${v}K`],
    ['impl', 'Implementation cost', 200, 2000, 50, (v) => fmt.k(v * 1000)],
    ['ramp', 'Adoption ramp', 1, 12, 1, (v) => `${v} mo`],
  ].forEach(([key, label, min, max, step, format]) =>
    ui.controls.appendChild(slider({ label, min, max, step, value: s[key], format, onInput: (v) => ((s[key] = v), update()) }))
  );

  ui.body.appendChild(h(`<p class="chart-title">Cumulative net value, $K (savings minus implementation cost)</p>`));
  const wrap = h('<div class="chart"><canvas></canvas></div>');
  ui.body.appendChild(wrap);
  const labels = Array.from({ length: 24 }, (_, i) => `M${i + 1}`);
  const chart = new Chart(wrap.querySelector('canvas'), {
    type: 'bar',
    data: { labels, datasets: [{ data: [], borderRadius: 4, borderSkipped: 'start', categoryPercentage: 0.8, barPercentage: 0.9 }] },
    options: {
      plugins: { tooltip: { callbacks: { label: (c) => ` Net value: ${fmt.k(c.parsed.y * 1000)}` } } },
      scales: {
        y: { ...axisMoney('K') },
        x: { ...noGridX, ticks: { autoSkip: true, maxTicksLimit: 12 } },
      },
    },
  });

  function update() {
    const annual = s.fte * s.cost * (s.pct / 100); // $K
    let cum = -s.impl;
    let payback = null;
    const data = labels.map((_, i) => {
      const adoption = Math.min((i + 1) / s.ramp, 1);
      cum += (annual / 12) * adoption;
      if (payback === null && cum >= 0) payback = i + 1;
      return Math.round(cum);
    });
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = data.map((v) => (v >= 0 ? C.s3 : C.s4));
    chart.update();
    set('run', fmt.m1(annual / 1000));
    set('eff', `${s.pct}%`, `≈ ${Math.round((s.fte * s.pct) / 100)} FTE of capacity`);
    set('pay', payback ? `${payback} months` : '> 24 months', payback && payback <= 12 ? '✓ Under 1 year' : '', payback && payback <= 12 ? 'good' : '');
    set('net', fmt.m1(data[23] / 1000));
  }
  update();
  return () => chart.destroy();
}
