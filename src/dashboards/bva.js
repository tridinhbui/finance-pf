import { fmt, frame, kpis, segmented, rng, h } from './ui.js';

// Plant-level Budget vs. Actual tracker with variance flags (illustrative)
const PLANTS = ['Plant 1 · VA', 'Plant 2 · NC', 'Plant 3 · IA', 'Plant 4 · MO'];
const LINES = [
  ['Raw materials', 42],
  ['Direct labor', 14],
  ['Freight & logistics', 6.5],
  ['Packaging', 4.2],
  ['Utilities', 2.8],
  ['Maintenance', 2.1],
];
const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const r = rng(99);
const DATA = PLANTS.map((_, pi) =>
  MONTHS.map(() =>
    LINES.map(([, b]) => {
      const budget = b * (0.85 + pi * 0.1);
      const actual = budget * (1 + (r() - 0.45) * 0.16);
      return { budget, actual };
    })
  )
);

export function render(root) {
  const ui = frame(root);
  let plant = 0;
  let month = MONTHS.length - 1;
  ui.controls.classList.add('row');
  ui.controls.appendChild(segmented(PLANTS.map((p, i) => [i, p.split(' · ')[0]]), plant, (v) => ((plant = Number(v)), update())));
  ui.controls.appendChild(segmented(MONTHS.map((m, i) => [i, m]), month, (v) => ((month = Number(v)), update())));
  const set = kpis(ui.kpis, [
    { key: 'bud', label: 'Budget' },
    { key: 'act', label: 'Actual' },
    { key: 'var', label: 'Variance' },
    { key: 'flags', label: 'Lines flagged (> ±5%)' },
  ]);
  const table = h('<div class="bva"></div>');
  ui.body.appendChild(table);

  // diverging: favorable (under budget) = blue, unfavorable = red, neutral gray midpoint
  const tone = (pct) => {
    const t = Math.min(Math.abs(pct) / 10, 1);
    if (Math.abs(pct) < 1) return 'hsl(220 10% 96%)';
    return pct < 0 ? `hsl(218 60% ${94 - t * 22}%)` : `hsl(8 65% ${94 - t * 22}%)`;
  };

  function update() {
    const rows = DATA[plant][month];
    const totB = rows.reduce((s, x) => s + x.budget, 0);
    const totA = rows.reduce((s, x) => s + x.actual, 0);
    const tv = ((totA - totB) / totB) * 100;
    let flags = 0;
    table.innerHTML = `<table>
      <thead><tr><th>Cost line</th><th>Budget</th><th>Actual</th><th>Var $</th><th>Var %</th><th></th></tr></thead>
      <tbody>${rows
        .map((x, i) => {
          const v = x.actual - x.budget;
          const p = (v / x.budget) * 100;
          const flag = Math.abs(p) > 5;
          if (flag) flags++;
          return `<tr>
            <td>${LINES[i][0]}</td>
            <td>${fmt.m1(x.budget)}</td>
            <td>${fmt.m1(x.actual)}</td>
            <td>${v >= 0 ? '+' : '−'}${fmt.m1(Math.abs(v))}</td>
            <td><span class="pill" style="background:${tone(p)}">${p >= 0 ? '+' : ''}${p.toFixed(1)}%</span></td>
            <td class="flag">${flag ? (p > 0 ? '⚠ Over' : '▼ Under') : ''}</td>
          </tr>`;
        })
        .join('')}</tbody>
    </table>
    <p class="axis-note">Blue = under budget (favorable), red = over budget. Lines beyond ±5% are flagged for review with Accounting.</p>`;
    set('bud', fmt.m1(totB));
    set('act', fmt.m1(totA));
    set('var', `${tv >= 0 ? '+' : ''}${tv.toFixed(1)}%`, tv > 0 ? 'Unfavorable' : 'Favorable', tv > 0 ? 'bad' : 'good');
    set('flags', `${flags} of ${rows.length}`);
  }
  update();
  return () => {};
}
