import { streamHTML } from './typing.js';

// Resume assistant: answers visitor questions from Tri's resume.
// Runs fully in the browser (no API key), so it is safe to host as a static site.

const EMAIL = 'tridinhbui0901@gmail.com';
const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;

const intents = [
  {
    id: 'about',
    chip: 'Who is Tri?',
    keys: ['who', 'about', 'introduce', 'summary', 'yourself', 'background', 'tri bui', 'overview', 'ai la', 'gioi thieu'],
    answer:
      "Tri Bui is a Corporate Finance Associate in the Finance Leadership Rotation at Smithfield Foods (Fortune 500). He works on FP&A, liquidity forecasting and valuation, and leads work on bringing AI into finance.\n\nBefore that he was at Caprae Capital (private equity), Revantage, a Blackstone portfolio company, and Deloitte. He studied Quantitative Finance & Computer Science at Macalester College (GPA 3.85).",
  },
  {
    id: 'smithfield',
    chip: 'Current role',
    keys: ['smithfield', 'current', 'now', 'today', 'present', 'job', 'role', 'work', 'rotation', 'associate', 'hien tai'],
    answer:
      'At Smithfield Foods (Jun 2025 – present), Tri:\n• Rebuilt working-capital and FCF models across a $3B balance sheet, with forecast variance under 5% and 80% faster refresh\n• Pitched an AI-in-Finance strategy to the Board ($2M projected annual savings)\n• Owns 5 FP&A sections in the monthly Chairman executive decks\n• Benchmarks 8 peers (incl. Tyson, JBS) on EBITDA margins with the CFO and IR',
  },
  {
    id: 'ai',
    chip: 'AI in finance',
    keys: ['ai', 'artificial', 'automation', 'databricks', 'ibm', 'copilot', 'machine', 'cfo playbook', 'enablement'],
    answer:
      "AI in finance is a big focus for Tri. At Smithfield he pitched a long-term AI-in-Finance strategy to the Board of Directors ($2M projected annual savings, 15% efficiency gain) and helped launch the Finance AI Enablement Center.\n\nHe also works with the VP of Data Analytics, IBM and Databricks on the CFO Playbook, an AI reporting system whose GAAP and CAPEX outputs are validated across Workiva and SAP.",
  },
  {
    id: 'pe',
    chip: 'Private equity',
    keys: ['private equity', 'pe', 'caprae', 'm&a', 'merger', 'acquisition', 'deal', 'investment banking', 'buyout'],
    answer:
      'As a Private Equity Analyst at Caprae Capital Partners (Jan – Apr 2025), Tri evaluated 180+ M&A targets and advanced 12 to deeper review. He built and stress-tested 3-statement and DCF models and wrote investment memos for senior partners.\n\nHe also built a $1.1B acquisition model for a General Mills × The Andersons M&A proposal.',
  },
  {
    id: 'blackstone',
    keys: ['blackstone', 'revantage', 'real estate', 'noi', 'property', 'properties'],
    answer:
      'At Revantage, a Blackstone portfolio company (summer 2024), Tri built asset-level DCF and cash-flow models across a $75M portfolio of 15+ properties. He also ran downside and cost-risk analyses on a $350M portfolio, helping mitigate $1.5M in potential losses.',
  },
  {
    id: 'deloitte',
    keys: ['deloitte', 'audit', 'controls', 'coso', 'basel', 'tableau', 'oracle', 'month-end', 'close'],
    answer:
      'At Deloitte (summer 2023), Tri supported month-end close for banking clients, cutting reporting discrepancies by 20%. He built Tableau KPI reports from SQL and Oracle data and evaluated internal controls under COSO and Basel.',
  },
  {
    id: 'coverage',
    chip: 'Finance areas',
    keys: ['treasury', 'investor relations', 'ir', 'strategic finance', 'strategy', 'fp&a', 'fpa', 'planning', 'transformation', 'analytics', 'corporate finance', 'corp fin', 'areas', 'tracks', 'cover', 'm&a', 'valuation', 'rotation', 'liquidity', 'cash'],
    answer:
      'Tri covers the full corporate-finance stack:\n• Corporate Finance: $3B working-capital and FCF models\n• FP&A: Chairman decks, budget vs. actual, plant-level variance\n• Strategic Finance: $2M AI-in-Finance business case to the Board\n• Treasury: liquidity forecasting within 5%\n• Investor Relations: 8-peer benchmarking with the CFO and IR\n• Valuation & M&A: 180+ targets, DCF, $1.1B deal model\n• Finance Transformation: CFO Playbook AI reporting with IBM and Databricks\n\nSee the Finance coverage section for details.',
  },
  {
    id: 'skills',
    chip: 'Skills',
    keys: ['skill', 'tool', 'excel', 'python', 'sql', 'model', 'modeling', 'dcf', 'valuation', 'sap', 'power bi', 'vba', 'stack', 'ky nang'],
    answer:
      'Core skills:\n• FP&A: budgeting & forecasting, working capital, liquidity & cash flow, margin & OpEx analysis\n• Valuation: 3-statement models, DCF, FCF, public comps, leverage & scenario analysis\n• Accounting & ERP: US GAAP, consolidation, month-end close, SAP BPC, Workiva, Oracle\n• Data: advanced Excel (Power Query, VBA), SQL, Python, Databricks, Tableau, Power BI',
  },
  {
    id: 'education',
    keys: ['education', 'school', 'college', 'university', 'macalester', 'degree', 'gpa', 'cfa', 'study', 'studied', 'award', 'hoc'],
    answer:
      "Tri earned a B.A. in Quantitative Finance & Computer Science from Macalester College (2021 – 2025), with a 3.85/4.00 GPA and Dean's List honors. He is a CFA Level I candidate (Feb 2027) and won the Quant Modeling (2023) and Financial Analytics (2022) competitions.",
  },
  {
    id: 'leadership',
    keys: ['leadership', 'lead', 'president', 'fund', 'investment group', 'club', 'portfolio', 'return', 's&p', 'mentor'],
    answer:
      'As President of the Macalester Investment Group (2022 – 2025), Tri ran a $250K student fund that returned +85% cumulatively, 30% ahead of the S&P 500. He organized 25+ analysts into research teams and led investment committee reviews and valuation training.',
  },
  {
    id: 'hire',
    chip: 'Is he open to roles?',
    keys: ['hire', 'hiring', 'available', 'open to', 'relocat', 'opportunit', 'interview', 'recruit', 'position', 'move', 'location', 'where'],
    answer: `Yes. Tri is based in Smithfield, VA and open to relocating. He's interested in corporate finance, FP&A, strategy and investment roles.\n\nThe best way to reach him is ${mail}.`,
  },
  {
    id: 'products',
    chip: 'Products',
    keys: ['product', 'products', 'built', 'startup', 'founder', 'users', 'tuhoctaichinh', 'tu hoc', 'finbud', 'app', 'website', 'platform', 'side project'],
    answer:
      'Tri designed, built and scaled products used by 5,000+ people:\n• <a href="https://www.tuhoctaichinh.org" target="_blank" rel="noopener">tuhoctaichinh.org</a>: a free finance-learning platform with 1,899+ lessons and cases, 3,600+ learners, XP, streaks and live leaderboards\n• FinBud: a personal-finance web platform\n\nThe System Design model in the Work section shows how they scale.',
  },
  {
    id: 'tech',
    chip: 'Tech stack',
    keys: ['tech', 'stack', 'engineer', 'engineering', 'fullstack', 'full-stack', 'full stack', 'react', 'node', 'javascript', 'typescript', 'machine learning', 'ml', 'data engineer', 'spark', 'pyspark', 'dbt', 'airflow', 'pipeline', 'coding', 'code', 'developer', 'computer science', 'cs', 'llm', 'rag', 'cong nghe', 'aws', 'azure', 'cloud', 'system design', 'kubernetes', 'docker', 'vue', 'next', 'nextjs', 'java', 'c++', 'scalab'],
    answer:
      "Tri pairs finance with a Computer Science degree:\n• Languages: Python, R, C/C++, Java, SQL, JavaScript/TypeScript\n• System design & cloud: AWS, Azure, Docker, Kubernetes, Terraform, Redis, queues, autoscaling\n• Full-stack: React, Next.js, Vue.js, Node.js, FastAPI\n• Data & ML: Databricks, Spark, dbt, Airflow, scikit-learn, PyTorch, LLMs/RAG\n\nTry the System Design, Data Pipeline and ML Forecast models in the Work section.",
  },
  {
    id: 'contact',
    chip: 'Contact',
    keys: ['contact', 'email', 'phone', 'call', 'reach', 'linkedin', 'connect', 'lien he'],
    answer: `You can reach Tri at:\n• Email: ${mail}\n• Phone: +1 763-353-8782\n• LinkedIn: <a href="https://linkedin.com/in/tribuidinh" target="_blank" rel="noopener">linkedin.com/in/tribuidinh</a>`,
  },
  {
    id: 'hello',
    keys: ['hi', 'hello', 'hey', 'xin chao', 'chao', 'good morning', 'good afternoon'],
    answer: "Hello! I can tell you about Tri's experience, skills, education or how to get in touch. What would you like to know?",
  },
  {
    id: 'thanks',
    keys: ['thank', 'thanks', 'cam on', 'great', 'awesome', 'cool'],
    answer: `You're welcome! If you'd like to talk with Tri directly, email him at ${mail}.`,
  },
];

const fallback = `I don't have that detail. I can answer questions about Tri's experience, skills, education and leadership. For anything else, you can email Tri directly at ${mail}.`;

const normalize = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

function reply(question) {
  const q = ` ${normalize(question).replace(/[^a-z0-9&$%+\s-]/g, ' ')} `;
  let best = null;
  let bestScore = 0;
  for (const intent of intents) {
    let score = 0;
    for (const key of intent.keys) {
      const k = normalize(key);
      // short keys must match whole words; longer ones may match as prefixes
      const hit = k.length <= 3 ? q.includes(` ${k} `) : q.includes(k);
      if (hit) score += k.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best ? best.answer : fallback;
}

export function initChat() {
  const panel = document.getElementById('chat');
  const body = document.getElementById('chat-body');
  const chips = document.getElementById('chat-chips');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const fab = document.querySelector('.chat-fab');
  let started = false;

  const scroll = () => (body.scrollTop = body.scrollHeight);

  function addMsg(html, who) {
    const el = document.createElement('div');
    el.className = `msg ${who}`;
    if (who === 'user') el.textContent = html;
    else el.innerHTML = html;
    body.appendChild(el);
    scroll();
    return el;
  }

  function botSay(html) {
    const t = addMsg('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    const delay = 500 + Math.random() * 400;
    setTimeout(() => {
      t.classList.add('live');
      streamHTML(t, html, { speed: 26, onTick: scroll });
    }, delay);
  }

  function ask(text) {
    const q = text.trim();
    if (!q) return;
    addMsg(q, 'user');
    botSay(reply(q));
  }

  chips.innerHTML = intents
    .filter((i) => i.chip)
    .map((i) => `<button type="button">${i.chip}</button>`)
    .join('');
  chips.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') ask(e.target.textContent);
  });

  function open() {
    panel.hidden = false;
    fab.classList.add('hide');
    document.body.classList.add('chat-open');
    if (!started) {
      started = true;
      botSay("Hi, I'm Tri's assistant. Ask me about his experience, skills, education, or how to reach him.");
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    fab.classList.remove('hide');
    document.body.classList.remove('chat-open');
  }

  document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', open));
  panel.querySelector('.chat-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && close());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });
}
