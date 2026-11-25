import Chart from 'chart.js/auto';

// Validated categorical palette (light surface): navy, gold, teal, coral
export const C = {
  s1: '#2f62b8',
  s2: '#c4892a',
  s3: '#1a9e80',
  s4: '#d0583f',
  muted: '#c9cfd9',
  ink: '#0f1b2d',
  ink2: '#3c4658',
  grid: '#eeeae2',
  axis: '#8a92a1',
};

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = C.axis;
Chart.defaults.borderColor = C.grid;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.animation.duration = 350;
Chart.defaults.plugins.legend.display = false;
Object.assign(Chart.defaults.plugins.tooltip, {
  backgroundColor: '#0f1b2d',
  titleColor: '#fff',
  bodyColor: '#e6ebf5',
  padding: 10,
  cornerRadius: 4,
  boxPadding: 4,
  usePointStyle: true,
});

export { Chart };

export const fmt = {
  m: (v) => `$${Math.round(v).toLocaleString()}M`,
  m1: (v) => `$${v.toFixed(1)}M`,
  b: (v) => `$${(v / 1000).toFixed(2)}B`,
  k: (v) => `$${Math.round(v / 1000).toLocaleString()}K`,
  pct: (v, d = 1) => `${v.toFixed(d)}%`,
  usd: (v) => `$${Math.round(v).toLocaleString()}`,
};

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Range slider with live value label. Returns the <label> element. */
export function slider({ label, min, max, step, value, format, onInput }) {
  const el = h(`<label class="ctl">
    <span class="ctl-top"><span>${label}</span><output></output></span>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
  </label>`);
  const input = el.querySelector('input');
  const out = el.querySelector('output');
  const sync = () => {
    const v = Number(input.value);
    out.textContent = format(v);
    const p = ((v - min) / (max - min)) * 100;
    input.style.setProperty('--p', `${p}%`);
    return v;
  };
  sync();
  input.addEventListener('input', () => onInput(sync()));
  return el;
}

/** Segmented toggle. */
export function segmented(options, active, onChange) {
  const el = h(`<div class="seg" role="tablist"></div>`);
  options.forEach(([value, text]) => {
    const b = h(`<button type="button" role="tab">${text}</button>`);
    b.dataset.value = value;
    if (value === active) b.classList.add('on');
    b.addEventListener('click', () => {
      el.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      onChange(value);
    });
    el.appendChild(b);
  });
  return el;
}

/** KPI tile row; returns setter. */
export function kpis(container, defs) {
  container.innerHTML = defs
    .map(
      (d) => `<div class="kpi" data-k="${d.key}">
        <span class="kpi-label">${d.label}</span>
        <span class="kpi-value">–</span>
        <span class="kpi-sub"></span>
      </div>`
    )
    .join('');
  return (key, value, sub = '', tone = '') => {
    const el = container.querySelector(`[data-k="${key}"]`);
    const v = el.querySelector('.kpi-value');
    if (v.textContent !== value) {
      v.textContent = value;
      // restart the "value changed" pulse
      v.classList.remove('flash');
      void v.offsetWidth;
      v.classList.add('flash');
    }
    const s = el.querySelector('.kpi-sub');
    s.textContent = sub;
    s.className = `kpi-sub ${tone}`;
  };
}

/** Standard dashboard skeleton */
export function frame(root, { controls = true } = {}) {
  root.innerHTML = `
    ${controls ? '<div class="d-controls"></div>' : ''}
    <div class="d-kpis"></div>
    <div class="d-body"></div>`;
  return {
    controls: root.querySelector('.d-controls'),
    kpis: root.querySelector('.d-kpis'),
    body: root.querySelector('.d-body'),
  };
}

// Deterministic PRNG so "illustrative" data is stable between visits
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const axisMoney = (suffix = 'M') => ({
  ticks: { callback: (v) => `$${Number(v).toLocaleString()}${suffix}` },
  grid: { color: C.grid },
  border: { display: false },
});
export const noGridX = { grid: { display: false }, border: { color: C.grid } };
