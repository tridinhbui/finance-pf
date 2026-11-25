import { frame, kpis, slider, segmented, h } from './ui.js';
import { typeText } from '../typing.js';

// Scalable web-app architecture: drag load up and watch autoscaling, bottlenecks and cost respond
const CLOUD = {
  aws: {
    cdn: 'CloudFront', lb: 'Application Load Balancer', waf: 'Cognito + WAF', app: 'ECS Fargate',
    cache: 'ElastiCache Redis', db: 'RDS PostgreSQL', queue: 'SQS', worker: 'Lambda', lake: 'S3 + Databricks',
  },
  azure: {
    cdn: 'Front Door', lb: 'Application Gateway', waf: 'Entra ID + WAF', app: 'AKS (Kubernetes)',
    cache: 'Azure Cache for Redis', db: 'Azure Database for PostgreSQL', queue: 'Service Bus', worker: 'Azure Functions', lake: 'ADLS + Databricks',
  },
};

const TIERS = [
  ['Edge', [['clients', 'Clients', 'Next.js · Vue.js · mobile'], ['cdn', 'cdn', 'Static assets · edge cache']]],
  ['Gateway', [['lb', 'lb', 'TLS · health checks'], ['waf', 'waf', 'Auth · rate limiting']]],
  ['Compute', [['app', 'app', 'Stateless API + SSR · autoscaling']]],
  ['Data', [['cache', 'cache', 'Hot reads · sessions'], ['db', 'db', 'Primary + read replicas']]],
  ['Async & analytics', [['queue', 'queue', 'Events · jobs'], ['worker', 'worker', 'Emails · scoring · ETL'], ['lake', 'lake', 'Product analytics · ML']]],
];

const toUsers = (v) => Math.round((100 * Math.pow(500, v / 100)) / 10) * 10; // 100 → 50,000

function simulate({ users, cache, replicas }) {
  const rps = users * 0.4;
  const app = Math.min(40, Math.max(2, Math.ceil(rps / 500)));
  const hit = cache ? 0.85 : 0;
  const reads = rps * 0.95 * (1 - hit);
  const writes = rps * 0.05; // heavy writes go through the queue
  const readCap = 1400 * (1 + replicas * 0.9);
  const dbUtil = Math.max(reads / readCap, writes / 2500);
  const appUtil = rps / (app * 600);
  const u = Math.min(dbUtil, 0.97);
  const latency = 38 + (cache ? 6 : 14) + 22 / (1 - u) + 18 * Math.max(0, appUtil - 0.7) * 10;
  const cost = app * 58 + 140 * (1 + replicas) + (cache ? 95 : 0) + 35 + users * 0.004 + 60;
  const uptime = replicas >= 1 && app >= 2 ? '99.95%' : '99.9%';
  return { rps, app, hit, dbUtil, latency, cost, uptime };
}

export function render(root) {
  const ui = frame(root);
  const s = { cloud: 'aws', v: 72, cache: true, replicas: 1 };

  const cloudCtl = h('<div class="ctl"><span class="ctl-top"><span>Cloud</span></span></div>');
  cloudCtl.appendChild(segmented([['aws', 'AWS'], ['azure', 'Azure']], s.cloud, (v) => ((s.cloud = v), update(true))));
  const cacheCtl = h('<div class="ctl"><span class="ctl-top"><span>Redis cache</span></span></div>');
  cacheCtl.appendChild(segmented([['on', 'On'], ['off', 'Off']], 'on', (v) => ((s.cache = v === 'on'), update())));
  ui.controls.append(
    slider({ label: 'Concurrent users', min: 0, max: 100, step: 1, value: s.v, format: (v) => toUsers(v).toLocaleString(), onInput: (v) => ((s.v = v), update()) }),
    slider({ label: 'DB read replicas', min: 0, max: 4, step: 1, value: s.replicas, format: (v) => `${v}`, onInput: (v) => ((s.replicas = v), update()) }),
    cloudCtl,
    cacheCtl
  );

  const set = kpis(ui.kpis, [
    { key: 'rps', label: 'Requests / sec' },
    { key: 'app', label: 'App instances' },
    { key: 'lat', label: 'p95 latency' },
    { key: 'cost', label: 'Est. cloud cost / mo' },
  ]);

  ui.body.innerHTML = `
    <p class="insight"></p>
    <div class="arch">
      ${TIERS.map(
        ([name, nodes], i) => `${i ? '<div class="arch-link" aria-hidden="true"><span></span></div>' : ''}
        <div class="arch-tier">
          <span class="arch-name">${name}</span>
          <div class="arch-nodes">
            ${nodes
              .map(
                ([id, , sub]) => `<div class="anode" data-id="${id}">
                  <b data-svc="${id}"></b><small>${sub}</small>
                  ${id === 'app' ? '<div class="pips" data-pips="app"></div>' : ''}
                  ${id === 'db' ? '<div class="pips db" data-pips="db"></div><span class="meter"><i></i></span>' : ''}
                  ${id === 'cache' ? '<span class="hit"></span>' : ''}
                </div>`
              )
              .join('')}
          </div>
        </div>`
      ).join('')}
    </div>
    <p class="axis-note">Capacity model is a simplified illustration of how the system scales, not a benchmark.</p>`;

  const arch = ui.body.querySelector('.arch');
  const insight = ui.body.querySelector('.insight');
  const appPips = ui.body.querySelector('[data-pips="app"]');
  const dbPips = ui.body.querySelector('[data-pips="db"]');
  const meter = ui.body.querySelector('.meter i');
  const hitEl = ui.body.querySelector('.hit');
  const cacheNode = ui.body.querySelector('[data-id="cache"]');
  const dbNode = ui.body.querySelector('[data-id="db"]');

  function pips(el, n, cls = '') {
    const have = el.children.length;
    for (let i = have; i < n; i++) el.appendChild(h(`<i class="${i === 0 && cls ? cls : ''}"></i>`));
    for (let i = have; i > n; i--) el.lastElementChild.remove();
  }

  function update(relabel = false) {
    const names = CLOUD[s.cloud];
    ui.body.querySelectorAll('[data-svc]').forEach((b) => {
      const id = b.dataset.svc;
      const txt = id === 'clients' ? 'Web & mobile clients' : names[id];
      if (b.textContent !== txt) {
        b.textContent = txt;
        if (relabel) {
          b.classList.remove('swap-in');
          void b.offsetWidth;
          b.classList.add('swap-in');
        }
      }
    });

    const users = toUsers(s.v);
    const r = simulate({ users, cache: s.cache, replicas: s.replicas });
    // request flow speed follows load
    arch.style.setProperty('--speed', `${Math.max(0.25, 1.6 - Math.log10(users) * 0.3)}s`);
    pips(appPips, r.app);
    pips(dbPips, 1 + s.replicas, 'primary');
    meter.style.width = `${Math.min(100, r.dbUtil * 100)}%`;
    const hot = r.dbUtil > 0.85;
    dbNode.classList.toggle('hot', hot);
    meter.parentElement.classList.toggle('hot', hot);
    cacheNode.classList.toggle('off', !s.cache);
    hitEl.textContent = s.cache ? `${Math.round(r.hit * 100)}% hit rate` : 'disabled';

    set('rps', Math.round(r.rps).toLocaleString(), `${users.toLocaleString()} concurrent users`);
    set('app', `${r.app}`, r.app >= 40 ? '⚠ At autoscaling max' : 'autoscaling 2–40', r.app >= 40 ? 'bad' : '');
    const ok = r.latency < 200;
    set('lat', `${Math.round(r.latency)} ms`, ok ? '✓ Under 200 ms SLO' : '⚠ SLO breached', ok ? 'good' : 'bad');
    set('cost', `$${Math.round(r.cost).toLocaleString()}`, `uptime target ${r.uptime}`);

    insight.className = `insight ${hot ? 'bad' : 'good'}`;
    const msg = hot
      ? `Bottleneck: the database is at ${Math.round(r.dbUtil * 100)}% of capacity. ${s.cache ? 'Add read replicas' : 'Turn the Redis cache on'} to bring p95 latency back under 200 ms.`
      : `Healthy: ${r.app} stateless instances behind the load balancer, database at ${Math.round(r.dbUtil * 100)}% of capacity.`;
    // retype only when the verdict flips, otherwise update in place
    if (insight.dataset.state !== String(hot)) {
      insight.dataset.state = String(hot);
      typeText(insight, msg, { speed: 10 });
    } else if (!insight.classList.contains('is-typing')) insight.textContent = msg;
    else typeText(insight, msg, { speed: 6 });
  }
  update();
  return () => {};
}
