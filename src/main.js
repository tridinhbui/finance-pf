import './style.css';
import { stats, experience, projects, skills } from './data.js';
import { initChat } from './chat.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const list = (items) => `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

// Stats
$('stats').innerHTML = stats
  .map(
    (s) => `<div class="stat">
      <span class="stat-value">${esc(s.prefix || '')}<span data-count="${s.value}">0</span>${esc(s.suffix)}</span>
      <span class="stat-label">${esc(s.label)}</span>
    </div>`
  )
  .join('');

// Experience
$('timeline').innerHTML = experience
  .map(
    (e) => `<article class="job reveal">
      <div class="job-meta">
        <span class="period">${esc(e.period)}</span>
        ${e.location ? `<span class="muted">${esc(e.location)}</span>` : ''}
      </div>
      <div>
        <h3>${esc(e.company)}${e.tag ? `<span class="tag">${esc(e.tag)}</span>` : ''}</h3>
        <p class="role">${esc(e.role)}</p>
        ${list(e.bullets)}
      </div>
    </article>`
  )
  .join('');

// Projects
$('projects').innerHTML = projects
  .map(
    (p) => `<article class="card reveal">
      <div class="card-kpi"><span>${esc(p.kpi)}</span><small>${esc(p.kpiLabel)}</small></div>
      <h3>${esc(p.title)}</h3>
      <p class="role">${esc(p.role)} <span class="muted">· ${esc(p.period)}</span></p>
      ${list(p.bullets)}
    </article>`
  )
  .join('');

// Skills
$('skills-grid').innerHTML = skills
  .map((s) => `<div class="skill reveal"><h4>${esc(s.group)}</h4>${list(s.items)}</div>`)
  .join('');

$('year').textContent = new Date().getFullYear();

// Count-up for stats
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
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal, #stats').forEach((el) => io.observe(el));

initChat();
