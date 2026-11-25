export const stats = [
  { value: 3, prefix: '$', suffix: 'B', label: 'Balance sheet forecast' },
  { value: 2, prefix: '$', suffix: 'M', label: 'AI savings pitched to Board' },
  { value: 180, suffix: '+', label: 'M&A targets screened' },
  { value: 85, prefix: '+', suffix: '%', label: 'Student fund return' },
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
