import './style.css';
import { stats, experience, toolkit } from './data.js';
import { initChat } from './chat.js';
import { initDashboards } from './dashboards/index.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

$('stats').innerHTML = stats
  .map(
    (s) => `<div class="stat">
      <span class="stat-value">${esc(s.prefix || '')}<span data-count="${s.value}">0</span>${esc(s.suffix)}</span>
      <span class="stat-label">${esc(s.label)}</span>
    </div>`
  )
  .join('');

$('xp').innerHTML = experience
  .map(
    (e) => `<article class="xp-row reveal">
      <span class="xp-period">${esc(e.period)}</span>
      <div class="xp-main">
        <h3>${esc(e.company)}</h3>
        <p><span class="xp-role">${esc(e.role)}</span> · ${esc(e.line)}</p>
      </div>
      <div class="xp-links">${e.models
        .map(([id, label]) => `<a href="#work" data-model="${id}">${esc(label)} →</a>`)
        .join('')}</div>
    </article>`
  )
  .join('');

$('toolkit').innerHTML = toolkit
  .map(([g, items]) => `<div class="tk"><h4>${esc(g)}</h4><div class="tk-items">${items.map((i) => `<span>${esc(i)}</span>`).join('')}</div></div>`)
  .join('');

$('year').textContent = new Date().getFullYear();

initDashboards();
initChat();

// Count-up + reveal
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduce) return (el.textContent = target);
  const start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal, #stats').forEach((el) => io.observe(el));
