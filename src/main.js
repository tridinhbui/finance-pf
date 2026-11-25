import './style.css';
import { impact, experience, toolkit, stack, terminal } from './data.js';
import { initChat } from './chat.js';
import { initDashboards } from './dashboards/index.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Render ----------
$('impact-grid').innerHTML = impact
  .map(
    (c, i) => `<a class="impact-card reveal" href="#work" data-model="${c.model}" style="--i:${i}">
      <span class="ic-org">${esc(c.org)}</span>
      <span class="ic-value">${esc(c.prefix || '')}<span data-count="${c.value}" data-dec="${c.dec || 0}">0</span>${esc(c.suffix)}</span>
      <span class="ic-title">${esc(c.title)}</span>
      <span class="ic-text">${esc(c.text)}</span>
      <span class="ic-link">Open the model <span class="arr">→</span></span>
    </a>`
  )
  .join('');

$('xp').innerHTML = experience
  .map(
    (e, i) => `<article class="xp-row reveal" style="--i:${i}">
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
  .map(
    ([g, items]) =>
      `<div class="tk"><h4>${esc(g)}</h4><div class="tk-items">${items
        .map((it, j) => `<span style="--j:${j}">${esc(it)}</span>`)
        .join('')}</div></div>`
  )
  .join('');

$('stack').innerHTML = stack
  .map(
    (g, i) => `<div class="stack-card reveal" style="--i:${i}">
      <div class="sc-head"><span class="sc-icon">${esc(g.icon)}</span><h4>${esc(g.group)}</h4><span class="sc-count">${g.items.length}</span></div>
      <div class="sc-items">${g.items.map((it, j) => `<span style="--j:${j}">${esc(it)}</span>`).join('')}</div>
    </div>`
  )
  .join('');

$('year').textContent = new Date().getFullYear();

initDashboards();
initChat();

// ---------- Count-up ----------
function countUp(el) {
  const target = Number(el.dataset.count);
  const dec = Number(el.dataset.dec || 0);
  if (reduce) return (el.textContent = target.toFixed(dec));
  const start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / 1600, 1);
    el.textContent = (target * (1 - Math.pow(1 - p, 4))).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------- Scroll progress + nav shadow ----------
const bar = $('progress');
const nav = document.querySelector('.nav');
let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = `scaleX(${p})`;
      nav.classList.toggle('scrolled', h.scrollTop > 8);
      ticking = false;
    });
  },
  { passive: true }
);

// ---------- Subtle photo parallax (desktop pointer only) ----------
const photo = document.querySelector('.hero-photo');
if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelector('.hero').addEventListener('pointermove', (e) => {
    const r = photo.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    photo.style.setProperty('--px', `${x * 14}px`);
    photo.style.setProperty('--py', `${y * 14}px`);
  });
}

// ---------- Typing terminal ----------
const term = $('term');
function runTerminal() {
  if (reduce) {
    term.innerHTML = terminal.map((l) => `<span class="${l.startsWith('$') ? 'cmd' : 'out'}">${esc(l)}</span>`).join('\n');
    return;
  }
  let line = 0;
  let html = '';
  const next = () => {
    if (line >= terminal.length) {
      setTimeout(() => ((html = ''), (line = 0), next()), 4000);
      return;
    }
    const text = terminal[line];
    if (!text.startsWith('$')) {
      html += `<span class="out">${esc(text)}</span>\n`;
      term.innerHTML = html + '<span class="caret"></span>';
      line++;
      return setTimeout(next, 450);
    }
    let i = 0;
    const type = () => {
      i++;
      term.innerHTML = html + `<span class="cmd">${esc(text.slice(0, i))}</span><span class="caret"></span>`;
      if (i < text.length) return setTimeout(type, 28 + Math.random() * 40);
      html += `<span class="cmd">${esc(text)}</span>\n`;
      line++;
      setTimeout(next, 350);
    };
    type();
  };
  next();
}
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) {
    runTerminal();
    obs.disconnect();
  }
}).observe(term);
