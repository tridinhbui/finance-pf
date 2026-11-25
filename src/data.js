// Headline achievements shown at the top of the page
export const impact = [
  { value: 3, prefix: '$', suffix: 'B', org: 'Smithfield Foods', title: 'Liquidity forecast',
    text: 'Rebuilt working-capital and FCF models. Under 5% variance, 80% faster refresh.', model: 'liquidity' },
  { value: 2, prefix: '$', suffix: 'M', org: 'Smithfield Foods', title: 'AI strategy to the Board',
    text: 'Pitched AI-in-Finance to the Board and helped launch the Finance AI Enablement Center.', model: 'ai' },
  { value: 5000, suffix: '+', sep: true, org: 'Founder · Engineer', title: 'Users on my products',
    text: 'Designed, built and scaled tuhoctaichinh.org and FinBud end to end.', href: '#products', link: 'See the products' },
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
    role: 'Corporate Finance Associate',
    period: '2025 – Now',
    line: 'Liquidity forecasting, AI strategy, executive reporting, peer benchmarking.',
    models: [['liquidity', 'Liquidity'], ['ai', 'AI ROI'], ['peers', 'Peers'], ['bva', 'BvA']],
  },
  {
    company: 'Caprae Capital Partners',
    role: 'Private Equity Analyst',
    period: '2025',
    line: '180+ targets screened, 12 advanced. 3-statement and DCF models.',
    models: [['deals', 'Deal Screener'], ['dcf', 'DCF']],
  },
  {
    company: 'Revantage · Blackstone',
    role: 'Financial Analyst',
    period: '2024',
    line: 'Asset-level DCF on a $75M portfolio. Downside analysis on $350M.',
    models: [['dcf', 'DCF']],
  },
  {
    company: 'Deloitte',
    role: 'Financial Analyst',
    period: '2023',
    line: 'Month-end close, SQL and Tableau KPI reporting, internal controls.',
    models: [['bva', 'BvA']],
  },
  {
    company: 'Macalester Investment Group',
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
    items: ['Python', 'R', 'C / C++', 'Java', 'SQL', 'JavaScript', 'TypeScript', 'VBA', 'Data structures & algorithms'],
  },
  {
    group: 'System Design & Cloud',
    icon: '☁',
    items: ['AWS (EC2, S3, Lambda, RDS, CloudFront)', 'Azure (App Service, Functions, AKS, Blob)', 'Docker', 'Kubernetes', 'Terraform', 'Load balancing', 'Caching (Redis)', 'Message queues', 'Microservices', 'Autoscaling', 'CI/CD'],
  },
  {
    group: 'Frontend & Full-stack',
    icon: '</>',
    items: ['React', 'Next.js', 'Vue.js', 'Node.js', 'Express', 'FastAPI', 'REST & GraphQL', 'Tailwind CSS', 'Vite', 'Git & GitHub Actions'],
  },
  {
    group: 'Data Engineering',
    icon: '⇄',
    items: ['Databricks', 'Apache Spark / PySpark', 'Delta Lake', 'ETL / ELT pipelines', 'Airflow', 'dbt', 'Snowflake', 'Data modeling', 'Power Query'],
  },
  {
    group: 'Machine Learning & AI',
    icon: 'ƒ(x)',
    items: ['pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'Time-series forecasting', 'LLM APIs', 'RAG & embeddings', 'Prompt engineering', 'MLflow'],
  },
  {
    group: 'Databases',
    icon: '⛁',
    items: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'Redis', 'Oracle', 'Query optimization', 'Indexing & replication'],
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
