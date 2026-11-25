// Headline achievements shown at the top of the page
export const impact = [
  { value: 3, prefix: '$', suffix: 'B', org: 'Smithfield Foods', title: 'Liquidity forecast',
    text: 'Working-capital and FCF models: <5% variance, 80% faster.', model: 'liquidity' },
  { value: 2, prefix: '$', suffix: 'M', org: 'Smithfield Foods', title: 'AI strategy to the Board',
    text: 'Pitched to the Board; launched the AI Enablement Center.', model: 'ai' },
  { value: 60, suffix: '%', org: 'Smithfield Foods', title: 'Faster executive reporting',
    text: 'Faster Chairman decks and earnings prep.', model: 'peers' },
  { value: 180, suffix: '+', org: 'Caprae Capital', title: 'M&A targets screened',
    text: '12 advanced to deeper diligence.', model: 'deals' },
  { value: 1.5, prefix: '$', suffix: 'M', dec: 1, org: 'Blackstone · Revantage', title: 'Losses mitigated',
    text: 'Downside analysis on a $350M portfolio.', model: 'dcf' },
  { value: 85, prefix: '+', suffix: '%', org: 'Investment Group', title: 'Student fund return',
    text: '$250K fund, 30 pts ahead of the S&P 500.', model: 'fund' },
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
    line: '3-statement and DCF models; 12 deals advanced.',
    models: [['deals', 'Deal Screener'], ['dcf', 'DCF']],
  },
  {
    company: 'Revantage · Blackstone',
    mono: 'BX',
    metric: '$350M',
    metricLabel: 'portfolio stress-tested',
    role: 'Financial Analyst',
    period: '2024',
    line: 'Asset-level DCF on $75M; risk review on $350M.',
    models: [['dcf', 'DCF']],
  },
  {
    company: 'Deloitte',
    mono: 'D',
    metric: '−20%',
    metricLabel: 'reporting discrepancies',
    role: 'Financial Analyst',
    period: 'Summer 2023',
    line: 'Month-end close, SQL/Tableau KPIs, controls.',
    models: [['bva', 'BvA']],
  },
  {
    company: 'DetectAuto',
    mono: 'DA',
    metric: 'CV',
    metricLabel: 'smart-vision camera platform',
    role: 'Software Engineer',
    period: 'Summer 2023',
    line: 'Fargo, ND. Smart-camera platform: computer vision, Next.js, Python, AWS.',
    models: [['sysdesign', 'System Design'], ['ml', 'ML']],
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
    text: 'Lessons, calculators and real cases from statements to DCF and CFA prep, gamified with XP and leaderboards.',
    metrics: [['1,899+', 'lessons & cases'], ['3,600+', 'learners joined'], ['Live', 'leaderboard & XP']],
    stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Databricks', 'AWS'],
  },
  {
    name: 'FinBud',
    url: '',
    host: 'finbud.net',
    live: false,
    tagline: 'Personal-finance web platform',
    text: 'Built end to end: web app, API, analytics pipeline and cloud deployment.',
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
    items: ['PyTorch', 'Computer vision (CNNs)', 'scikit-learn', 'pandas', 'Time series', 'LLM APIs', 'RAG', 'MLflow'],
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
  '$ python detect.py --model cnn --source camera_01',
  '✓ vision model serving on AWS · Next.js dashboard live',
  '$ npm run build && git push',
  '✓ deployed to github pages',
];

// Finance tracks the site must cover (mirrors the tailored resume versions)
export const coverage = [
  {
    id: 'corp', title: 'Corporate Finance', icon: '◆', metric: '$3B', metricLabel: 'balance sheet modeled', model: 'liquidity',
    points: [
      '$3B working-capital and FCF models for liquidity.',
      'AI-in-Finance strategy pitched to the Board.',
      'Cost and profitability work with Accounting.',
    ],
  },
  {
    id: 'fpa', title: 'FP&A', icon: '▤', metric: '−60%', metricLabel: 'executive deck prep time', model: 'bva',
    points: [
      'Own 5 FP&A sections in monthly Chairman decks.',
      'Plant-level budget vs. actual tracking.',
      'Prep time −60%, errors −15%.',
    ],
  },
  {
    id: 'strat', title: 'Strategic Finance', icon: '◎', metric: '$2M', metricLabel: 'projected annual savings', model: 'ai',
    points: [
      '$2M AI business case, 15% efficiency gain.',
      'Helped launch the AI Enablement Center.',
      'Capital allocation on a $1.1B deal model.',
    ],
  },
  {
    id: 'treasury', title: 'Treasury', icon: '⟲', metric: '<5%', metricLabel: 'forecast variance (10% tolerance)', model: 'liquidity',
    points: [
      'Liquidity and cash-flow forecasting.',
      'DSO, DIO and DPO driver models.',
      'Forecast refresh 80% faster.',
    ],
  },
  {
    id: 'ir', title: 'Investor Relations', icon: '◐', metric: '8', metricLabel: 'peers benchmarked', model: 'peers',
    points: [
      'EBITDA benchmarking vs. Tyson, JBS and 6 more.',
      'Earnings prep with the CFO and IR.',
      'Earnings-prep time cut 60%.',
    ],
  },
  {
    id: 'mna', title: 'Valuation & M&A', icon: '⬡', metric: '180+', metricLabel: 'targets screened, 12 advanced', model: 'dcf',
    points: [
      '180+ PE targets screened, 12 advanced.',
      '3-statement and DCF models, investment memos.',
      '$1.1B acquisition model with synergies.',
    ],
  },
  {
    id: 'transform', title: 'Finance Transformation & Data Analytics', icon: '⌬', metric: 'AI', metricLabel: 'reporting system (CFO Playbook)', model: 'pipeline',
    points: [
      'CFO Playbook AI reporting with IBM and Databricks.',
      'GAAP and CAPEX checks across Workiva and SAP.',
      'SQL, Python and Power BI automation.',
    ],
  },
  {
    id: 'rotation', title: 'Smithfield Rotation', icon: '✦', metric: 'FLRP', metricLabel: 'Finance Leadership Rotation', model: 'bva',
    points: [
      'Fortune 500 Finance Leadership Rotation.',
      'FP&A, Treasury, Accounting and IR exposure.',
      'Work with the Board, Chairman and CFO.',
    ],
  },
];
