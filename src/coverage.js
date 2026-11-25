import { coverage } from './data.js';
import { typeText, reduceMotion } from './typing.js';

// Eight finance tracks: auto-cycling tabs with typed proof points
export function initCoverage(root) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  root.innerHTML = `
    <div class="cov-tabs" role="tablist" aria-label="Finance tracks">
      ${coverage
        .map(
          (c, i) => `<button type="button" role="tab" class="cov-tab" data-i="${i}">
            <span class="cov-ic">${c.icon}</span><span class="cov-name">${esc(c.title)}</span><i class="cov-bar"></i>
          </button>`
        )
        .join('')}
    </div>
    <div class="cov-panel" aria-live="polite">
      <div class="cov-metric"><b></b><small></small></div>
      <div class="cov-body">
        <span class="cov-kicker"></span>
        <ul class="cov-points"><li></li><li></li><li></li></ul>
        <a class="cov-link" href="#work" data-model="liquidity">Open the related model <span class="arr">→</span></a>
      </div>
    </div>`;

  const tabs = [...root.querySelectorAll('.cov-tab')];
  const metric = root.querySelector('.cov-metric b');
  const metricLabel = root.querySelector('.cov-metric small');
  const kicker = root.querySelector('.cov-kicker');
  const lis = [...root.querySelectorAll('.cov-points li')];
  const link = root.querySelector('.cov-link');
  const panel = root.querySelector('.cov-panel');
  const DWELL = 6500;
  let cur = 0;
  let timer = null;
  let auto = !reduceMotion;
  let seq = 0;

  function show(i) {
    cur = i;
    const c = coverage[i];
    const my = ++seq;
    tabs.forEach((t, j) => {
      t.classList.toggle('on', j === i);
      t.setAttribute('aria-selected', j === i);
      t.classList.remove('run');
    });
    if (auto) {
      void tabs[i].offsetWidth;
      tabs[i].classList.add('run');
    }
    panel.classList.remove('swap');
    void panel.offsetWidth;
    panel.classList.add('swap');
    metric.textContent = c.metric;
    metricLabel.textContent = c.metricLabel;
    kicker.textContent = c.title;
    link.dataset.model = c.model;
    lis.forEach((li) => (li.textContent = ''));
    // type the three proof points one after another
    const typeNext = (k) => {
      if (k >= lis.length || my !== seq) return;
      typeText(lis[k], c.points[k], { speed: 11, onDone: () => typeNext(k + 1) });
    };
    typeNext(0);
    clearTimeout(timer);
    if (auto) timer = setTimeout(() => show((cur + 1) % coverage.length), DWELL);
  }

  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      auto = false; // user took control: stop auto-cycling
      clearTimeout(timer);
      show(Number(t.dataset.i));
    })
  );

  // only cycle while the section is on screen
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) {
      if (!root.dataset.started) {
        root.dataset.started = '1';
        show(0);
      } else if (auto) timer = setTimeout(() => show((cur + 1) % coverage.length), DWELL);
    } else clearTimeout(timer);
  }, { threshold: 0.3 }).observe(root);
}
