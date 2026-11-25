import './style.css';
import { stats, ticker, experience, projects, skills } from './data.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Ticker (duplicated for a seamless loop)
const tickerHtml = ticker
  .map(([k, v, dir]) => `<span class="tick"><b>${esc(k)}</b> <em class="${dir}">${dir === 'up' ? '▲' : '■'} ${esc(v)}</em></span>`)
  .join('');
$('ticker').innerHTML = tickerHtml + tickerHtml;

// Stats
$('stats').innerHTML = stats
  .map(
    (s) => `<div class="stat">
      <span class="stat-value mono">${esc(s.prefix || '')}<span data-count="${s.value}">0</span>${esc(s.suffix)}</span>
      <span class="stat-label">${esc(s.label)}</span>
    </div>`
  )
  .join('');

// Experience
$('timeline').innerHTML = experience
  .map(
    (e) => `<article class="job reveal">
      <div class="job-head">
        <div>
          <h3>${esc(e.company)} ${e.tag ? `<span class="tag">${esc(e.tag)}</span>` : ''}</h3>
          <p class="role">${esc(e.role)}</p>
        </div>
        <div class="job-meta mono">${esc(e.period)}${e.location ? `<br><span class="muted">${esc(e.location)}</span>` : ''}</div>
      </div>
      <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </article>`
  )
  .join('');

// Projects
$('projects').innerHTML = projects
  .map(
    (p) => `<article class="card reveal">
      <div class="card-kpi"><span class="mono">${esc(p.kpi)}</span><small>${esc(p.kpiLabel)}</small></div>
      <h3>${esc(p.title)}</h3>
      <p class="role">${esc(p.role)} · <span class="muted">${esc(p.period)}</span></p>
      <ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </article>`
  )
  .join('');

// Skills
$('skills-grid').innerHTML = skills
  .map(
    (s) => `<div class="skill reveal">
      <h4>${esc(s.group)}</h4>
      <div class="chips">${s.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>
    </div>`
  )
  .join('');

$('year').textContent = new Date().getFullYear();

// Count-up animation for stats
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduce) return (el.textContent = target);
  const start = performance.now();
  const dur = 1200;
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll?.('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal, #stats').forEach((el) => io.observe(el));
