import * as liquidity from './liquidity.js';
import * as ai from './ai.js';
import * as peers from './peers.js';
import * as bva from './bva.js';
import * as deals from './deals.js';
import * as dcf from './dcf.js';
import * as fund from './fund.js';
import * as ml from './ml.js';
import * as pipeline from './pipeline.js';
import * as sysdesign from './sysdesign.js';
import { typeText } from '../typing.js';

// group: which dashboard shell a model lives in (finance first, then engineering)
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
  { id: 'sysdesign', group: 'tech', title: 'System Design', org: 'Cloud Architecture', mod: sysdesign,
    blurb: 'How my products scale to thousands of users. Raise the load, switch AWS and Azure, and find the bottleneck.' },
  { id: 'pipeline', group: 'tech', title: 'Data Pipeline', org: 'Data Engineering', mod: pipeline,
    blurb: 'Lakehouse behind an AI reporting system: SAP and Oracle to Databricks, ML and LLM layers, then BI and an app.' },
  { id: 'ml', group: 'tech', title: 'ML Forecast', org: 'Machine Learning', mod: ml,
    blurb: 'Revenue forecasting models trained live in your browser, scored on a holdout window.' },
];

const groupOf = (m) => m.group || 'finance';

export function initDashboards() {
  const openers = {};

  document.querySelectorAll('[data-dash]').forEach((shell) => {
    const group = shell.dataset.dash;
    const models = MODELS.filter((m) => groupOf(m) === group);
    const nav = shell.querySelector('.dash-nav');
    const title = shell.querySelector('.dash-title');
    const org = shell.querySelector('.dash-org');
    const blurb = shell.querySelector('.dash-blurb');
    const view = shell.querySelector('.dash-view');
    let destroy = null;

    nav.innerHTML = models
      .map(
        (m, i) => `<button type="button" role="tab" data-id="${m.id}">
          <span class="dn-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="dn-text"><b>${m.title}</b><small>${m.org}</small></span>
        </button>`
      )
      .join('');

    function open(id, { scroll = false, user = false } = {}) {
      const m = models.find((x) => x.id === id) || models[0];
      nav.querySelectorAll('button').forEach((b) => {
        const on = b.dataset.id === m.id;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', on);
        // center the active tab in the horizontal nav (phones) without moving the page
        if (on && (user || scroll) && nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({ left: b.offsetLeft - (nav.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
        }
      });
      typeText(org, m.org, { speed: 30, caret: false });
      typeText(title, m.title, { speed: 38 });
      typeText(blurb, m.blurb, { speed: 12, caret: false });
      if (destroy) destroy();
      view.classList.remove('swap');
      void view.offsetWidth;
      view.classList.add('swap');
      destroy = m.mod.render(view);
      if (scroll) shell.closest('section').scrollIntoView({ behavior: 'smooth' });
    }

    nav.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) open(b.dataset.id, { user: true });
    });
    models.forEach((m) => (openers[m.id] = open));
    open(models[0].id);
  });

  document.querySelectorAll('[data-model]').forEach((el) =>
    el.addEventListener('click', (e) => {
      const fn = openers[el.dataset.model];
      if (!fn) return;
      e.preventDefault();
      fn(el.dataset.model, { scroll: true });
    })
  );
}
