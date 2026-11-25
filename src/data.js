// Headline achievements shown at the top of the page
export const impact = [
  { value: 3, prefix: '$', suffix: 'B', org: 'Smithfield Foods', title: 'Liquidity forecast',
    text: 'Rebuilt working-capital and FCF models. Under 5% variance, 80% faster refresh.', model: 'liquidity' },
  { value: 2, prefix: '$', suffix: 'M', org: 'Smithfield Foods', title: 'AI strategy to the Board',
    text: 'Pitched AI-in-Finance to the Board and helped launch the Finance AI Enablement Center.', model: 'ai' },
  { value: 60, suffix: '%', org: 'Smithfield Foods', title: 'Faster executive reporting',
    text: 'Less prep time for monthly Chairman decks and quarterly earnings benchmarking.', model: 'peers' },
  { value: 180, suffix: '+', org: 'Caprae Capital', title: 'M&A targets screened',
    text: 'Screened on 3-statement and operating fit; 12 advanced to deeper review.', model: 'deals' },
  { value: 1.5, prefix: '$', suffix: 'M', dec: 1, org: 'Blackstone · Revantage', title: 'Losses mitigated',
    text: 'Downside and cost-risk analysis across a $350M real estate portfolio.', model: 'dcf' },
  { value: 85, prefix: '+', suffix: '%', org: 'Investment Group', title: 'Student fund return',
    text: 'Ran a $250K fund as President, 30 pts ahead of the S&P 500.', model: 'fund' },
];

// One line per role; `models` link into the interactive dashboards
export const experience = [
  {
    company: 'Smithfield Foods',
    mono: 'SF',
    metric: '$3B',
    metricLabel: 'balance sheet forecast',
    role: 'Corporate Finance Associate',
    period: '2025 – Now',
    line: 'Liquidity forecasting, AI strategy, executive reporting, peer benchmarking.',
    models: [['liquidity', 'Liquidity'], ['ai', 'AI ROI'], ['peers', 'Peers'], ['bva', 'BvA']],
  },
  {
    company: 'Caprae Capital Partners',
    mono: 'CC',
    metric: '180+',
    metricLabel: 'M&A targets screened',
    role: 'Private Equity Analyst',
    period: '2025',
    line: '180+ targets screened, 12 advanced. 3-statement and DCF models.',
    models: [['deals', 'Deal Screener'], ['dcf', 'DCF']],
  },
  {
    company: 'Revantage · Blackstone',
    mono: 'BX',
    metric: '$350M',
    metricLabel: 'portfolio stress-tested',
    role: 'Financial Analyst',
    period: '2024',
    line: 'Asset-level DCF on a $75M portfolio. Downside analysis on $350M.',
    models: [['dcf', 'DCF']],
  },
  {
    company: 'Deloitte',
    mono: 'D',
    metric: '−20%',
    metricLabel: 'reporting discrepancies',
    role: 'Financial Analyst',
    period: '2023',
    line: 'Month-end close, SQL and Tableau KPI reporting, internal controls.',
    models: [['bva', 'BvA']],
  },
  {
    company: 'Macalester Investment Group',
    mono: 'MI',
    metric: '+85%',
    metricLabel: 'fund return',
    role: 'President',
    period: '2022 – 2025',
    line: '$250K fund, 25+ analysts, +30 pts vs. S&P 500.',
    models: [['fund', 'Fund']],
  },
];

export const toolkit = [
  ['Modeling', ['3-Statement', 'DCF', 'FCF', 'Working Capital', 'Scenarios']],
  ['FP&A', ['Forecasting', 'Budgeting', 'Variance', 'Margin & OpEx']],
  ['Systems', ['SAP BPC', 'Workiva', 'Oracle', 'Databricks']],
  ['Code & BI', ['Python', 'SQL', 'VBA', 'Power BI', 'Tableau']],
];

// Products I designed, built and run. Edit descriptions, stacks and links freely.
export const products = [
  {
    name: 'Tự học Tài chính',
    url: 'https://www.tuhoctaichinh.org',
    host: 'tuhoctaichinh.org',
    live: true,
    tagline: 'Free finance-learning platform for Vietnamese learners',
    text: 'Lessons, calculators and real cases from financial statements to DCF valuation, portfolios and CFA prep. Gamified with XP, streaks, live leaderboards and spaced repetition.',
    metrics: [['1,899+', 'lessons & cases'], ['3,600+', 'learners joined'], ['Live', 'leaderboard & XP']],
    stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Databricks', 'AWS'],
  },
  {
    name: 'FinBud',
    url: '',
    host: 'finbud.net',
    live: false,
    tagline: 'Personal-finance web platform',
    text: 'Product, architecture and engineering end to end: responsive web app, API layer, analytics pipeline and cloud deployment built to scale with the user base.',
    metrics: [['5,000+', 'users across products'], ['Cloud', 'AWS · Azure'], ['CI/CD', 'automated deploys']],
    stack: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Azure', 'Databricks', 'Docker'],
  },
];

// Engineering skills, grouped. Edit freely — remove anything you don't use day to day.
export const stack = [
  {
    group: 'Languages',
    icon: '{ }',
    items: ['Python', 'R', 'C / C++', 'Java', 'SQL', 'JavaScript', 'TypeScript'],
  },
  {
    group: 'System Design & Cloud',
    icon: '☁',
    items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Redis caching', 'Queues & autoscaling'],
  },
  {
    group: 'Frontend & Full-stack',
    icon: '</>',
    items: ['React', 'Next.js', 'Vue.js', 'Node.js', 'FastAPI', 'REST & GraphQL', 'CI/CD'],
  },
  {
    group: 'Data Engineering',
    icon: '⇄',
    items: ['Databricks', 'PySpark', 'Delta Lake', 'Airflow', 'dbt', 'Snowflake', 'ETL / ELT'],
  },
  {
    group: 'Machine Learning & AI',
    icon: 'ƒ(x)',
    items: ['pandas', 'scikit-learn', 'PyTorch', 'Time series', 'LLM APIs', 'RAG', 'MLflow'],
  },
  {
    group: 'Databases',
    icon: '⛁',
    items: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'Redis', 'Oracle'],
  },
];

// Lines the hero terminal types out ($ = command, others = output)
export const terminal = [
  '$ whoami',
  'tri bui · finance × computer science',
  '$ python train.py --model ridge --target revenue',
  '✓ model trained · holdout MAPE under 5%',
  '$ spark-submit etl/gl_to_gold.py',
  '✓ bronze → silver → gold · 148/148 checks passed',
  '$ dbt run --select gold.plant_bva',
  '✓ 12 models built',
  '$ terraform apply -var cloud=aws',
  '✓ 14 resources · autoscaling 2–40 tasks · multi-AZ',
  '$ npm run build && git push',
  '✓ deployed to github pages',
];

// Finance tracks the site must cover (mirrors the tailored resume versions)
export const coverage = [
  {
    id: 'corp', title: 'Corporate Finance', icon: '◆', metric: '$3B', metricLabel: 'balance sheet modeled', model: 'liquidity',
    points: [
      'Rebuilt working-capital and FCF models across a $3B balance sheet for liquidity forecasting.',
      'Pitched a long-term AI-in-Finance strategy to the Board of Directors.',
      'Partnered with Accounting and business segments on cost and profitability.',
    ],
  },
  {
    id: 'fpa', title: 'FP&A', icon: '▤', metric: '−60%', metricLabel: 'executive deck prep time', model: 'bva',
    points: [
      'Own 5 core Corporate FP&A sections in the monthly Chairman and management decks.',
      'Monthly budget-vs-actual and plant-level cost and profitability tracking.',
      'Standardized templates and automated checks cut prep time 60% YoY and errors 15%.',
    ],
  },
  {
    id: 'strat', title: 'Strategic Finance', icon: '◎', metric: '$2M', metricLabel: 'projected annual savings', model: 'ai',
    points: [
      'Built the business case for AI in Finance: $2M projected savings, 15% efficiency gain.',
      'Helped launch the Finance AI Enablement Center.',
      'Capital allocation and leverage scenarios on a $1.1B acquisition proposal.',
    ],
  },
  {
    id: 'treasury', title: 'Treasury', icon: '⟲', metric: '<5%', metricLabel: 'forecast variance (10% tolerance)', model: 'liquidity',
    points: [
      'Liquidity and cash-flow forecasting for FP&A and Treasury.',
      'Working-capital drivers (DSO, DIO, DPO) and cash conversion modeled end to end.',
      'Forecast refresh time cut by 80% with a rebuilt model.',
    ],
  },
  {
    id: 'ir', title: 'Investor Relations', icon: '◐', metric: '8', metricLabel: 'peers benchmarked', model: 'peers',
    points: [
      'Peer benchmarking on EBITDA margins and cost structures (incl. Tyson Foods, JBS).',
      'Worked with the CFO and Investor Relations on quarterly earnings prep.',
      'Cut quarterly earnings-prep time by 60%.',
    ],
  },
  {
    id: 'mna', title: 'Valuation & M&A', icon: '⬡', metric: '180+', metricLabel: 'targets screened, 12 advanced', model: 'dcf',
    points: [
      'Screened 180+ M&A targets in private equity; advanced 12 to deeper review.',
      'Integrated 3-statement and DCF models with sensitivities; investment memos for partners.',
      'Built a $1.1B acquisition model (DCF, comps, leverage, synergies).',
    ],
  },
  {
    id: 'transform', title: 'Finance Transformation & Data Analytics', icon: '⌬', metric: 'AI', metricLabel: 'reporting system (CFO Playbook)', model: 'pipeline',
    points: [
      'Worked with IBM and Databricks on the CFO Playbook, an AI reporting system.',
      'Validated GAAP and CAPEX outputs across Workiva and SAP.',
      'SQL, Python, Databricks, Power BI and Tableau for automated KPI reporting.',
    ],
  },
  {
    id: 'rotation', title: 'Smithfield Rotation', icon: '✦', metric: 'FLRP', metricLabel: 'Finance Leadership Rotation', model: 'bva',
    points: [
      'Finance Leadership Rotation at a Fortune 500, working across FP&A, Treasury, Accounting and IR.',
      'Corporate Expense Analysis and plant-level metrics, resolving discrepancies with Accounting.',
      'Executive-facing work: Board, Chairman decks, CFO and VP of Data Analytics.',
    ],
  },
];
