import { Conversation, Message, ModelOption, Project } from './types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    badge: 'Hybrid Reasoning',
    description: 'Most intelligent model with hybrid reasoning. Produces instantaneous responses or extended, visible thinking.',
    isReasoning: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    badge: 'Deep Engineering',
    description: 'Frontier code intelligence and depth across software architecture, writing, and multi-step tasks.',
    isReasoning: true,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    badge: 'Fast & Lightweight',
    description: 'Ultra-fast model for instantaneous answers, quick code edits, and everyday lightweight tasks.',
    isReasoning: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    badge: 'Deep Analysis',
    description: 'Powerful model for highly complex synthesis, nuanced long-form writing, and deep research.',
    isReasoning: true,
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Interactive Sales Funnel Dashboard',
    modelId: 'claude-3-7-sonnet',
    isStarred: true,
    createdAt: '2026-11-16T10:00:00Z',
    updatedAt: '2026-11-16T10:15:00Z',
  },
  {
    id: 'conv-2',
    title: 'PostgreSQL Database Optimization Plan',
    modelId: 'claude-3-5-sonnet',
    createdAt: '2026-11-15T14:30:00Z',
    updatedAt: '2026-11-15T15:00:00Z',
  },
  {
    id: 'conv-3',
    title: 'Customer Onboarding Flow Redesign',
    modelId: 'claude-3-7-sonnet',
    projectId: 'proj-1',
    createdAt: '2026-11-14T09:20:00Z',
    updatedAt: '2026-11-14T09:45:00Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Product Growth 2026',
    description: 'Retention strategies, conversion funnels, and customer interview synthesis.',
    customInstructions: 'Act as a principal product manager. Be concise, data-driven, and challenge assumptions.',
    fileCount: 4,
    tokenCount: 48500,
    isStarred: true,
  },
  {
    id: 'proj-2',
    title: 'System Architecture',
    description: 'Next.js 15, Drizzle ORM, and Supabase RLS specifications.',
    customInstructions: 'Focus strictly on clean-room architecture and accessible design tokens.',
    fileCount: 2,
    tokenCount: 18200,
  },
];

export const SAMPLE_CHAT_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm1',
      conversationId: 'conv-1',
      role: 'user',
      content: 'Can you build a self-contained interactive sales dashboard in HTML and SVG? I want KPI cards for MRR, Churn, and CAC, plus a conversion funnel chart.',
      createdAt: '2026-11-16T10:00:00Z',
    },
    {
      id: 'm2',
      conversationId: 'conv-1',
      role: 'assistant',
      content: "I have designed and built an interactive **SaaS Sales Funnel & KPI Dashboard** for you. It includes live hover states, key performance metrics, and a clean SVG conversion funnel. You can interact with it in the Artifacts canvas on the right.",
      thinkingContent: "1. Decompose user request: Needs MRR, Churn, CAC KPI cards, and an interactive conversion funnel.\n2. Visual styling: Adopt warm alabaster/stone aesthetic consistent with our design tokens.\n3. Implementation: Construct standalone HTML with embedded CSS and responsive SVG diagrams with hover tooltip interaction.\n4. Output as an interactive artifact.",
      thinkingTimeSeconds: 8,
      artifacts: [
        {
          id: 'art-1-v1',
          identifier: 'saas-sales-dashboard',
          title: 'SaaS Sales & Conversion Funnel Dashboard',
          type: 'html',
          version: 1,
          content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sales Funnel Dashboard</title>
<style>
  :root {
    --bg: #faf9f5;
    --surface: #ffffff;
    --border: #e2e0d5;
    --text: #1f1e1b;
    --muted: #615f57;
    --accent: #7c3aed;
    --accent-light: #f5f3ff;
    --accent-hover: #6d28d9;
    --success: #15803d;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  body { background: var(--bg); color: var(--text); padding: 24px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  h1 { font-size: 20px; font-weight: 700; }
  .badge { background: var(--accent-light); color: var(--accent); padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .kpi-label { font-size: 12px; color: var(--muted); text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }
  .kpi-val { font-size: 26px; font-weight: 700; }
  .kpi-sub { font-size: 12px; color: var(--success); font-weight: 600; margin-top: 4px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .card-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; }
  .funnel-bar { fill: var(--accent); opacity: 0.85; transition: all 0.2s; cursor: pointer; }
  .funnel-bar:hover { opacity: 1; fill: #6d28d9; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>SaaS Revenue & Conversion Funnel</h1>
      <p style="font-size: 13px; color: var(--muted); margin-top: 2px;">Q4 Performance Overview</p>
    </div>
    <span class="badge">Live Simulated Data</span>
  </div>

  <div class="kpis">
    <div class="kpi-card">
      <div class="kpi-label">Monthly Recurring Rev</div>
      <div class="kpi-val">$148,200</div>
      <div class="kpi-sub">+14.2% vs last month</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Customer Churn Rate</div>
      <div class="kpi-val">1.8%</div>
      <div class="kpi-sub">-0.4% improvement</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Customer Acquisition Cost</div>
      <div class="kpi-val">$320</div>
      <div class="kpi-sub">LTV:CAC 4.8x</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">User Acquisition to Paid Conversion Funnel</div>
    <svg viewBox="0 0 700 240" width="100%" height="240">
      <g>
        <rect class="funnel-bar" x="40" y="20" width="620" height="36" rx="6"></rect>
        <text x="55" y="44" fill="#ffffff" font-size="13" font-weight="600">1. Website Visitors</text>
        <text x="645" y="44" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">84,200 (100%)</text>
      </g>
      <g>
        <rect class="funnel-bar" x="90" y="70" width="520" height="36" rx="6"></rect>
        <text x="105" y="94" fill="#ffffff" font-size="13" font-weight="600">2. Free Signups</text>
        <text x="595" y="94" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">12,630 (15.0%)</text>
      </g>
      <g>
        <rect class="funnel-bar" x="150" y="120" width="400" height="36" rx="6"></rect>
        <text x="165" y="144" fill="#ffffff" font-size="13" font-weight="600">3. Activated Workspaces</text>
        <text x="535" y="144" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">6,315 (7.5%)</text>
      </g>
      <g>
        <rect class="funnel-bar" x="220" y="170" width="260" height="36" rx="6"></rect>
        <text x="235" y="194" fill="#ffffff" font-size="13" font-weight="600">4. Paid Subscriptions</text>
        <text x="465" y="194" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">2,105 (2.5%)</text>
      </g>
    </svg>
  </div>
</body>
</html>`,
        },
      ],
      createdAt: '2026-11-16T10:00:15Z',
    },
  ],
};
