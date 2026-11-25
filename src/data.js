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
