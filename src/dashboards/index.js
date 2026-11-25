import * as liquidity from './liquidity.js';
import * as ai from './ai.js';
import * as peers from './peers.js';
import * as bva from './bva.js';
import * as deals from './deals.js';
import * as dcf from './dcf.js';
import * as fund from './fund.js';

export const MODELS = [
  { id: 'liquidity', title: 'Liquidity Forecast', org: 'Smithfield Foods', mod: liquidity,
    blurb: 'Working-capital driven cash forecast. Move DSO, DIO, DPO and watch liquidity and forecast variance respond.' },
  { id: 'ai', title: 'AI-in-Finance ROI', org: 'Smithfield Foods', mod: ai,
    blurb: 'The business case pitched to the Board: automation savings, adoption ramp and payback.' },
  { id: 'peers', title: 'Peer Benchmark', org: 'Smithfield Foods', mod: peers,
    blurb: 'Margin and cost-structure benchmarking against 8 protein peers, used for earnings prep.' },
  { id: 'bva', title: 'Budget vs. Actual', org: 'Smithfield Foods', mod: bva,
    blurb: 'Plant-level variance tracker that flags cost lines beyond ±5% for follow-up.' },
  { id: 'deals', title: 'Deal Screener', org: 'Caprae Capital', mod: deals,
    blurb: '180 targets screened against sector, size, profitability and growth criteria.' },
  { id: 'dcf', title: 'DCF Valuation', org: 'M&A Proposal', mod: dcf,
    blurb: 'A $1.1B acquisition valuation with a live WACC × terminal-growth sensitivity grid.' },
  { id: 'fund', title: 'Fund Performance', org: 'Investment Group', mod: fund,
    blurb: 'The $250K student fund against the S&P 500 since inception.' },
];

export function initDashboards() {
  const nav = document.getElementById('dash-nav');
  const title = document.getElementById('dash-title');
  const org = document.getElementById('dash-org');
  const blurb = document.getElementById('dash-blurb');
  const view = document.getElementById('dash-view');
  let destroy = null;

  nav.innerHTML = MODELS.map(
    (m, i) => `<button type="button" role="tab" data-id="${m.id}">
      <span class="dn-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="dn-text"><b>${m.title}</b><small>${m.org}</small></span>
    </button>`
  ).join('');

  function open(id, scroll = false) {
    const m = MODELS.find((x) => x.id === id) || MODELS[0];
    nav.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.id === m.id;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on);
      if (on && window.innerWidth < 900) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    title.textContent = m.title;
    org.textContent = m.org;
    blurb.textContent = m.blurb;
    if (destroy) destroy();
    view.classList.remove('swap');
    void view.offsetWidth;
    view.classList.add('swap');
    destroy = m.mod.render(view);
    if (scroll) document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  }

  nav.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) open(b.dataset.id);
  });
  document.querySelectorAll('[data-model]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(el.dataset.model, true);
    })
  );
  open(MODELS[0].id);
}
