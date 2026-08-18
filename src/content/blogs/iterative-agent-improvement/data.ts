/**
 * "Practical guide to iteratively improve your AI agent" — content + chart data.
 *
 * Editable text lives under `postContent`. Chart data for the model and harness
 * KPI bar charts is inlined here; the strategy comparison (nav + underwater)
 * series is loaded from `strategy-comparison.json` alongside.
 */

export const postContent = {
  meta: {
    slug: "iterative-agent-improvement",
    title: "Practical guide to improve your AI agents for alpha generation",
    description: "With real examples from our deployed strategy",
    date: "2026-08-17",
  },

  intro: {
    body: `End-to-end walkthrough on how to leverage fintel to evaluate and improve your own agents, using examples from our own strategy — F1 — that actually impacted our final returns.`,
    kicker: "a practical walkthrough",
  },

  /** Step-by-step how we run evals with fintel (mirrors the homepage, with more guidance). */
  steps: [
    {
      n: "01",
      title: "Create a strategy pack",
      body: `A folder that encapsulates your strategy: a mission (how the agent should think and trade), an output schema (what it emits), data (what it can access, point-in-time controlled), a universe, a schedule, and the KPIs (IR, Sharpe or other performance metrics you care about).`,
    },
    {
      n: "02",
      title: "Hook your agent",
      body: `Write one adapter — decide(environment) → AgentResponse — to hook your agent so fintel can feed the right data to the right sub-agents at the right time. It also enables monitoring of how your agent behaves, and surfaces tool errors, during runtime.`,
    },
    {
      n: "03",
      title: "Run evals",
      body: `During runtime, fintel fans out parallel runs (to control for agent stochasticity), trials (multiple tickers on each date), and cells (where the action happens). Within the environment, the agents can only access point-in-time controlled data and guidance. The platform then catches and saves the decisions and traces to designated folders.`,
    },
    {
      n: "04",
      title: "Score and compare",
      body: `fintel then evaluates the performance based on your specified KPIs.`,
    },
    {
      n: "05",
      title: "Iterate one knob at a time",
      body: `Generate iterative strategy packs or agents for separate evals by repeating steps 1–4. Compare across them to identify the optimal strategy or agent.`,
    },
  ],

  /** Example 1 — which model is better. */
  example1: {
    title: "Finding the right model",
    explore: `Most presume that a smarter model = better performance. We did too, until we systematically ran evals on our agents across different models, freezing our strategy. The most notable example is Grok 4.5 vs 4.3, where 4.3 consistently outperformed 4.5 despite a significantly lower intelligence score. We found the culprit in the end — hallucination rate — which tracked nicely with our results. Turns out, when AI is making investment decisions, getting things (especially numbers) less wrong is more important than fancy words.`,
    caption: `Factor-neutralized residual IC for the same scaffold on two Grok checkpoints. Higher is better. Intelligence Index and Hallucination rate published by Artificial Analysis.`,
    takeaway: `Never assume a smarter model = better performance. Moreover, model and harness interact non-monotonically — Claude is not the same in OpenClaw vs Claude Code. The only way to truly be sure is to run ablation evals across other models. You could potentially save a lot of token costs on frontier models too!`,
  },

  /** Example 2 — tool-calling agent vs minimal harness. */
  example2: {
    title: "Finding the right harness",
    explore: `We held the model fixed and compared two harnesses: a tool-calling agent that picks its own tools each turn, and a minimal harness that is fed a point-in-time dossier in a single turn. We caught another surprising finding: sometimes, even across the harness axis, less is more. This was again attributed to hallucination/error rates — in this case the tool-calling capabilities and multi-turn reasoning amplify them; it is like giving bad drivers a manual sports car.`,
    caption: `Factor-neutralized residual IC, same model, same data — only the harness differs.`,
    takeaway: `It is all about net capability gain — what a harness adds in capability minus what it loses to hallucination and its amplification. On the same model the minimal harness beats the tool-calling agent by more than 2× on our KPI, because open tool loops compound mistakes. In the end F1 went with a hybrid — feeding where the data is knowable ex-ante, tooling only where discovery and investigation are actually needed.`,
  },

  /** Example 3 — strategy improving: alpha view vs original biweekly. */
  example3: {
    title: "Fine-tuning your AI-native strategy",
    explore: `Could a strategic prompt improve performance for our agents? We also ran evals, freezing our agents while tweaking the strategy — this time adding a small section called "Alpha View" that steers them away from sentiment-driven headlines. On the broad book, headline performance is similar while volatility and drawdowns fall; at the high-conviction threshold the alpha view pulls ahead on both return and stability — exactly how a fundamental-driven, less sentiment-reactive strategy should behave.`,
    caption: `Net NAV (top) and underwater / drawdown from running peak (bottom) for the score-weighted long book, aligned on the overlapping decision window. Left: score-weighted long > 0.0; right: > 0.3. The stability gap widens at the higher-conviction threshold, since those names attract more sentiment-driven news (e.g. NVDA).`,
    takeaway: `Strategy iterations should be evaluated too; a "better" prompt can also cut both ways. Your eval KPIs should also capture dimensions beyond headline metrics — in particular, how variable the agents are in their behaviour and performance.`,
  },

  closing: {
    kicker: "the loop",
    title: "Evaluate, iterate, improve",
    body: `There is no magic key to spin up a money-making AI trader on day 1. The findings here are the results of dozens of runs, millions of tokens, and years of research experience. But fintel offers the infrastructure and plumbing so that you can improve your AI-native strategy, one step at a time.`,
    cta: "Try it out now →",
  },
} as const;

// ─── Chart data: model comparison (Example 1) ────────────────────────────────

export type ModelBar = {
  label: string;
  sublabel: string;
  residualIc: number;
  intelligence: number;
  hallucination: number; // 0..1
  color: string;
};

export const MODEL_BARS: ModelBar[] = [
  {
    label: "Grok 4.3",
    sublabel: "prior iteration",
    residualIc: 0.0915,
    intelligence: 38,
    hallucination: 0.25,
    color: "#4cae86",
  },
  {
    label: "Grok 4.5",
    sublabel: "smarter, more hallucination",
    residualIc: 0.0576,
    intelligence: 54,
    hallucination: 0.52,
    color: "#d97a6c",
  },
];

// ─── Chart data: harness comparison (Example 2) ──────────────────────────────

export type HarnessBar = {
  label: string;
  sublabel: string;
  residualIc: number;
  color: string;
};

export const HARNESS_BARS: HarnessBar[] = [
  {
    label: "minimal harness",
    sublabel: "fed dossier · single turn",
    residualIc: 0.1674,
    color: "#4cae86",
  },
  {
    label: "tool-calling agent",
    sublabel: "picks tools each turn",
    residualIc: 0.0772,
    color: "#d97a6c",
  },
];

// ─── Strategy comparison (Example 3) — loaded from JSON ───────────────────────

export type StrategySeries = {
  dates: string[];
  nav: number[];
  underwater: number[];
};

export type StrategyComparison = {
  "sw_0.0": {
    alphaview: StrategySeries;
    biweekly: StrategySeries;
  };
  "sw_0.3": {
    alphaview: StrategySeries;
    biweekly: StrategySeries;
  };
};

export const STRATEGY_LABELS = {
  alphaview: "alpha view",
  biweekly: "original",
} as const;

export const STRATEGY_COLORS = {
  alphaview: "#6f93cf",
  biweekly: "#e8945d",
} as const;
