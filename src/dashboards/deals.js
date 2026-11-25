import { Chart, C, frame, slider, rng, h } from './ui.js';

// PE deal screening: 180 synthetic targets filtered by investment criteria
const SECTORS = ['Business Services', 'Industrial', 'Healthcare Svcs', 'Consumer'];
const r = rng(2025);
const TARGETS = Array.from({ length: 180 }, (_, i) => ({
  id: i + 1,
  sector: SECTORS[Math.floor(r() * 4)],
  rev: Math.round(5 * Math.pow(30, r()) * 10) / 10, // $5M–150M, skewed small
  margin: Math.round((-4 + r() * 32) * 10) / 10, // EBITDA %
  growth: Math.round((-6 + r() * 30) * 10) / 10, // YoY %
}));

export function render(root) {
  const ui = frame(root, { controls: true });
  const s = { rev: 20, margin: 18, growth: 8, sectors: new Set(['Business Services', 'Industrial']) };

  [
    ['rev', 'Min revenue', 5, 80, 1, (v) => `$${v}M`],
    ['margin', 'Min EBITDA margin', 0, 25, 1, (v) => `${v}%`],
    ['growth', 'Min revenue growth', -5, 20, 1, (v) => `${v}%`],
  ].forEach(([key, label, min, max, step, format]) =>
    ui.controls.appendChild(slider({ label, min, max, step, value: s[key], format, onInput: (v) => ((s[key] = v), update()) }))
  );
  const chips = h('<div class="ctl"><span class="ctl-top"><span>Target sectors</span></span><div class="chipset"></div></div>');
  SECTORS.forEach((sec) => {
    const b = h(`<button type="button" class="chip-t">${sec}</button>`);
    if (s.sectors.has(sec)) b.classList.add('on');
    b.addEventListener('click', () => {
      s.sectors.has(sec) ? s.sectors.delete(sec) : s.sectors.add(sec);
      b.classList.toggle('on');
      update();
    });
    chips.querySelector('.chipset').appendChild(b);
  });
  ui.controls.appendChild(chips);
  ui.kpis.remove();

  ui.body.innerHTML = `<div class="split">
    <div>
      <p class="chart-title">Screening funnel</p>
      <div class="funnel"></div>
    </div>
    <div>
      <div class="legend"><span><i style="background:${C.s1}"></i>Advanced</span><span><i style="background:${C.muted}"></i>Screened out</span></div>
      <div class="chart"><canvas></canvas></div>
      <p class="axis-note">Revenue ($M, log scale) vs. EBITDA margin. Hover a dot for target details.</p>
    </div>
  </div>`;
  const funnel = ui.body.querySelector('.funnel');
  const chart = new Chart(ui.body.querySelector('canvas'), {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Screened out', data: [], backgroundColor: C.muted, pointRadius: 4, pointHoverRadius: 6 },
        { label: 'Advanced', data: [], backgroundColor: C.s1, pointRadius: 5, pointHoverRadius: 7, pointBorderColor: '#fff', pointBorderWidth: 1.5 },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => `Target #${items[0].raw.t.id} · ${items[0].raw.t.sector}`,
            label: (c) => {
              const t = c.raw.t;
              return [` Revenue: $${t.rev}M`, ` EBITDA margin: ${t.margin}%`, ` Growth: ${t.growth}%`];
            },
          },
        },
      },
      scales: {
        x: { type: 'logarithmic', min: 4, max: 160, ticks: { maxRotation: 0, autoSkip: false, callback: (v) => ([5, 10, 20, 50, 100, 150].includes(v) ? `$${v}M` : '') }, grid: { color: C.grid }, border: { display: false } },
        y: { ticks: { callback: (v) => `${v}%` }, grid: { color: C.grid }, border: { display: false } },
      },
    },
  });

  function update() {
    const stages = [['Sourced', TARGETS]];
    const sec = TARGETS.filter((t) => s.sectors.has(t.sector));
    stages.push(['Sector fit', sec]);
    const size = sec.filter((t) => t.rev >= s.rev);
    stages.push(['Size fit', size]);
    const prof = size.filter((t) => t.margin >= s.margin);
    stages.push(['Profitability', prof]);
    const fin = prof.filter((t) => t.growth >= s.growth);
    stages.push(['Advanced to review', fin]);

    funnel.innerHTML = stages
      .map(
        ([name, arr], i) => `<div class="f-row">
          <span class="f-name">${name}</span>
          <div class="f-bar"><span style="width:${Math.max((arr.length / 180) * 100, 1.5)}%;background:${i === stages.length - 1 ? C.s1 : i === 0 ? '#9fb3d6' : '#c4d1e8'}"></span></div>
          <span class="f-num">${arr.length}</span>
        </div>`
      )
      .join('');
    const pass = new Set(fin.map((t) => t.id));
    const pt = (t) => ({ x: t.rev, y: t.margin, t });
    chart.data.datasets[0].data = TARGETS.filter((t) => !pass.has(t.id)).map(pt);
    chart.data.datasets[1].data = fin.map(pt);
    chart.update();
  }
  update();
  return () => chart.destroy();
}
