import { frame, kpis, h } from './ui.js';

// Animated lakehouse architecture for an AI finance-reporting system (illustrative)
const STAGES = [
  {
    name: 'Sources',
    nodes: [
      { id: 'sap', t: 'SAP BPC', s: 'GL · cost centers · CAPEX' },
      { id: 'oracle', t: 'Oracle', s: 'AR / AP subledgers' },
      { id: 'wdesk', t: 'Workiva', s: 'GAAP reporting' },
    ],
  },
  {
    name: 'Ingest',
    nodes: [{ id: 'ingest', t: 'Spark ingestion', s: 'Incremental · schema checks' }],
  },
  {
    name: 'Lakehouse',
    nodes: [
      { id: 'bronze', t: 'Bronze', s: 'Raw, append-only' },
      { id: 'silver', t: 'Silver', s: 'Cleaned, conformed' },
      { id: 'gold', t: 'Gold', s: 'Finance marts' },
    ],
  },
  {
    name: 'ML & AI',
    nodes: [
      { id: 'forecast', t: 'Forecast models', s: 'Cash · margin · variance' },
      { id: 'llm', t: 'LLM narratives', s: 'RAG over gold tables' },
    ],
  },
  {
    name: 'Serve',
    nodes: [
      { id: 'bi', t: 'Power BI', s: 'Executive dashboards' },
      { id: 'playbook', t: 'CFO Playbook', s: 'AI reporting app' },
    ],
  },
];

const DETAIL = {
  sap: { tech: ['SAP BPC', 'JDBC', 'Service accounts'], lang: 'sql',
    code: `-- nightly extract of posted GL lines
SELECT company_code, cost_center, gl_account,
       posting_date, amount_lc, currency
FROM   bpc.fact_gl
WHERE  posting_date >= :last_watermark;` },
  oracle: { tech: ['Oracle', 'SQL', 'CDC'], lang: 'sql',
    code: `SELECT invoice_id, customer_id, due_date,
       amount, status
FROM   ar.open_invoices
WHERE  last_update > :watermark;` },
  wdesk: { tech: ['Workiva API', 'REST', 'JSON'], lang: 'python',
    code: `resp = requests.get(f"{WDESK}/v1/sheets/{SHEET}/values",
                    headers=auth, timeout=30)
rows = pd.json_normalize(resp.json()["data"])` },
  ingest: { tech: ['PySpark', 'Auto Loader', 'Airflow', 'Great Expectations'], lang: 'python',
    code: `raw = (spark.readStream.format("cloudFiles")
         .option("cloudFiles.format", "parquet")
         .load("/landing/gl/"))
raw.writeStream.toTable("bronze.gl_entries")` },
  bronze: { tech: ['Delta Lake', 'Unity Catalog'], lang: 'sql',
    code: `CREATE TABLE bronze.gl_entries
USING DELTA
TBLPROPERTIES (delta.appendOnly = true);` },
  silver: { tech: ['PySpark', 'Delta Lake', 'Data quality'], lang: 'python',
    code: `silver = (bronze.dropDuplicates(["entry_id"])
  .join(fx, ["currency", "period"])
  .withColumn("amount_usd", F.col("amount_lc") * F.col("rate"))
  .filter(F.col("amount_usd").isNotNull()))` },
  gold: { tech: ['dbt', 'SQL', 'Star schema'], lang: 'sql',
    code: `-- models/gold/plant_bva.sql
SELECT plant_id, period,
       SUM(actual_usd)  AS actual,
       SUM(budget_usd)  AS budget,
       SUM(actual_usd) / SUM(budget_usd) - 1 AS var_pct
FROM {{ ref('silver_gl') }}
GROUP BY 1, 2` },
  forecast: { tech: ['scikit-learn', 'MLflow', 'Time series'], lang: 'python',
    code: `model = Pipeline([("feat", SeasonalFeatures()),
                  ("ridge", Ridge(alpha=0.5))])
model.fit(X_train, y_train)
mlflow.sklearn.log_model(model, "cash_forecast")` },
  llm: { tech: ['LLM API', 'RAG', 'Embeddings', 'Vector search'], lang: 'python',
    code: `ctx = retriever.search("Q3 plant variance drivers", k=8)
summary = llm.generate(
    system="You are an FP&A analyst. Cite every figure.",
    context=ctx, max_tokens=400)` },
  bi: { tech: ['Power BI', 'DAX', 'DirectQuery'], lang: 'dax',
    code: `Var % =
DIVIDE ( [Actual] - [Budget], [Budget] )` },
  playbook: { tech: ['React', 'TypeScript', 'Node.js', 'REST API'], lang: 'ts',
    code: `app.get("/api/variance/:plant", async (req, res) => {
  const rows = await gold.query(SQL_BVA, [req.params.plant]);
  res.json({ rows, narrative: await summarize(rows) });
});` },
};

const nodeName = (id) => STAGES.flatMap((s) => s.nodes).find((n) => n.id === id);

export function render(root) {
  const ui = frame(root, { controls: false });
  const set = kpis(ui.kpis, [
    { key: 'rows', label: 'Rows processed today' },
    { key: 'fresh', label: 'Data freshness' },
    { key: 'dq', label: 'Quality checks' },
    { key: 'runs', label: 'Pipeline runs' },
  ]);

  ui.body.innerHTML = `
    <div class="pipe-top">
      <p class="chart-title">Lakehouse architecture · click any node</p>
      <button type="button" class="run-btn"><span class="run-dot"></span>Run pipeline</button>
    </div>
    <div class="pipe">
      ${STAGES.map(
        (st, i) => `${i ? '<div class="pipe-link" aria-hidden="true"><span></span></div>' : ''}
        <div class="pipe-col" data-stage="${i}">
          <span class="pipe-stage">${st.name}</span>
          ${st.nodes.map((n) => `<button type="button" class="pnode" data-id="${n.id}"><b>${n.t}</b><small>${n.s}</small></button>`).join('')}
        </div>`
      ).join('')}
    </div>
    <div class="pdetail">
      <div class="pd-head"><b class="pd-title"></b><span class="pd-tech"></span></div>
      <pre class="code"><code></code></pre>
    </div>`;

  const nodes = [...ui.body.querySelectorAll('.pnode')];
  const title = ui.body.querySelector('.pd-title');
  const tech = ui.body.querySelector('.pd-tech');
  const code = ui.body.querySelector('code');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let typer = null;

  function select(id) {
    nodes.forEach((n) => n.classList.toggle('sel', n.dataset.id === id));
    const d = DETAIL[id];
    title.textContent = nodeName(id).t;
    tech.innerHTML = d.tech.map((t) => `<span>${t}</span>`).join('');
    clearInterval(typer);
    if (reduce) return (code.textContent = d.code);
    let i = 0;
    code.textContent = '';
    typer = setInterval(() => {
      i += 3;
      code.textContent = d.code.slice(0, i);
      if (i >= d.code.length) clearInterval(typer);
    }, 16);
  }
  nodes.forEach((n) => n.addEventListener('click', () => select(n.dataset.id)));
  select('silver');

  // live counters
  let rows = 1_843_220;
  let runs = 96;
  let fresh = 2;
  const tick = () => {
    rows += Math.floor(800 + Math.random() * 2400);
    set('rows', rows.toLocaleString());
  };
  tick();
  set('fresh', `${fresh} min`, '✓ SLA under 15 min', 'good');
  set('dq', '148 / 148', '✓ All passed', 'good');
  set('runs', `${runs}`, 'today, every 15 min');
  const live = setInterval(tick, 900);

  // "Run pipeline": light up each stage in order
  const cols = [...ui.body.querySelectorAll('.pipe-col')];
  const links = [...ui.body.querySelectorAll('.pipe-link')];
  const btn = ui.body.querySelector('.run-btn');
  const timers = [];
  btn.addEventListener('click', () => {
    if (btn.classList.contains('busy')) return;
    btn.classList.add('busy');
    btn.lastChild.textContent = 'Running…';
    [...cols, ...links].forEach((el) => el.classList.remove('done', 'active'));
    cols.forEach((col, i) => {
      timers.push(
        setTimeout(() => {
          col.classList.add('active');
          if (links[i - 1]) links[i - 1].classList.add('active');
          if (i > 0) cols[i - 1].classList.replace('active', 'done');
        }, i * 650)
      );
    });
    timers.push(
      setTimeout(() => {
        cols.forEach((c) => c.classList.replace('active', 'done'));
        runs += 1;
        rows += 52_000;
        fresh = 0;
        set('runs', `${runs}`, 'today, every 15 min');
        set('fresh', 'just now', '✓ SLA under 15 min', 'good');
        set('rows', rows.toLocaleString());
        btn.classList.remove('busy');
        btn.lastChild.textContent = 'Run pipeline';
      }, cols.length * 650)
    );
  });

  return () => {
    clearInterval(live);
    clearInterval(typer);
    timers.forEach(clearTimeout);
  };
}
