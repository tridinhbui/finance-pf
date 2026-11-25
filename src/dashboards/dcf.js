import { Chart, C, fmt, frame, kpis, slider, axisMoney, noGridX, h } from './ui.js';

// 5-year unlevered DCF with live WACC × terminal-growth sensitivity
const REV0 = 1185; // $M

function dcf({ growth, margin, wacc, tg }) {
  const w = wacc / 100;
  const g = tg / 100;
  let rev = REV0;
  let pv = 0;
  const years = [];
  for (let y = 1; y <= 5; y++) {
    const prev = rev;
    rev = rev * (1 + growth / 100);
    const ebitda = rev * (margin / 100);
    const da = rev * 0.03;
    const nopat = (ebitda - da) * (1 - 0.25);
    const capex = rev * 0.035;
    const dNwc = (rev - prev) * 0.1;
    const fcf = nopat + da - capex - dNwc;
    pv += fcf / Math.pow(1 + w, y);
    years.push({ y, fcf, ebitda });
  }
  const tv = (years[4].fcf * (1 + g)) / (w - g);
  const pvTv = tv / Math.pow(1 + w, 5);
  return { years, ev: pv + pvTv, pvFcf: pv, pvTv };
}

export function render(root) {
  const ui = frame(root);
  const s = { growth: 4, margin: 11, wacc: 8.5, tg: 2.5 };
  const set = kpis(ui.kpis, [
    { key: 'ev', label: 'Enterprise value' },
    { key: 'mult', label: 'Implied EV / EBITDA' },
    { key: 'tv', label: 'Terminal value share' },
    { key: 'fcf', label: 'Year-5 unlevered FCF' },
  ]);
  [
    ['growth', 'Revenue growth', 0, 10, 0.5, (v) => fmt.pct(v)],
    ['margin', 'EBITDA margin', 6, 18, 0.5, (v) => fmt.pct(v)],
    ['wacc', 'WACC', 6, 12, 0.25, (v) => fmt.pct(v, 2)],
    ['tg', 'Terminal growth', 0.5, 4, 0.25, (v) => fmt.pct(v, 2)],
  ].forEach(([key, label, min, max, step, format]) =>
    ui.controls.appendChild(slider({ label, min, max, step, value: s[key], format, onInput: (v) => ((s[key] = v), update()) }))
  );

  ui.body.innerHTML = `<div class="split">
    <div>
      <p class="chart-title">Unlevered free cash flow, $M</p>
      <div class="chart short"><canvas></canvas></div>
    </div>
    <div>
      <p class="chart-title">EV sensitivity ($M): WACC × terminal growth</p>
      <div class="sens"></div>
    </div>
  </div>`;
  const chart = new Chart(ui.body.querySelector('canvas'), {
    type: 'bar',
    data: { labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'], datasets: [{ data: [], backgroundColor: C.s1, borderRadius: 4, borderSkipped: 'start', barPercentage: 0.6 }] },
    options: {
      plugins: { tooltip: { callbacks: { label: (c) => ` UFCF: ${fmt.m(c.parsed.y)}` } } },
      scales: { y: { ...axisMoney(), beginAtZero: true }, x: noGridX },
    },
  });
  const sens = ui.body.querySelector('.sens');

  function update() {
    const out = dcf(s);
    chart.data.datasets[0].data = out.years.map((y) => Math.round(y.fcf));
    chart.update();
    set('ev', fmt.b(out.ev));
    set('mult', `${(out.ev / out.years[0].ebitda).toFixed(1)}x`, 'on forward EBITDA');
    const tvShare = (out.pvTv / out.ev) * 100;
    set('tv', fmt.pct(tvShare, 0), tvShare > 80 ? "⚠ Heavy reliance on terminal value" : "Typical for a stable business", tvShare > 80 ? 'bad' : 'good');
    set('fcf', fmt.m(out.years[4].fcf));

    const waccs = [-1, -0.5, 0, 0.5, 1].map((d) => +(s.wacc + d).toFixed(2));
    const tgs = [-1, -0.5, 0, 0.5, 1].map((d) => +(s.tg + d).toFixed(2));
    const grid = waccs.map((w) => tgs.map((g) => (w / 100 > g / 100 + 0.005 ? dcf({ ...s, wacc: w, tg: g }).ev : null)));
    const flat = grid.flat().filter((v) => v !== null);
    const lo = Math.min(...flat);
    const hi = Math.max(...flat);
    const shade = (v) => {
      // sequential single-hue ramp (light → dark blue)
      const t = hi === lo ? 0.5 : (v - lo) / (hi - lo);
      const l = 96 - t * 50;
      return `hsl(218 58% ${l}%)`;
    };
    sens.innerHTML = `<table>
      <thead><tr><th>WACC \\ g</th>${tgs.map((g) => `<th>${g.toFixed(2)}%</th>`).join('')}</tr></thead>
      <tbody>${grid
        .map(
          (row, i) => `<tr><th>${waccs[i].toFixed(2)}%</th>${row
            .map((v, j) => {
              if (v === null) return '<td class="na">n/a</td>';
              const dark = (v - lo) / (hi - lo || 1) > 0.55;
              return `<td class="${i === 2 && j === 2 ? 'cur' : ''}" style="background:${shade(v)};color:${dark ? '#fff' : C.ink}" title="WACC ${waccs[i]}%, g ${tgs[j]}%: ${fmt.m(v)}">${Math.round(v).toLocaleString()}</td>`;
            })
            .join('')}</tr>`
        )
        .join('')}</tbody></table>`;
  }
  update();
  return () => chart.destroy();
}
