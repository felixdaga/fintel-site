/**
 * Geopol trade war 2018 report — all data in one place.
 *
 * This file holds:
 *   - Editable text content (meta, headers, paragraphs, stats) — search for `reportContent`
 *   - Types + helpers + constants (non-text, structural)
 *
 * The extracted run JSON lives alongside: `geopol-full-0001.json`.
 */

// ─── Editable text content ───────────────────────────────────────────────────
// Edit copy here — components read from `reportContent`, not inline.

export const reportContent = {
  /** Blog post metadata (mirrors posts.ts entry) */
  meta: {
    slug: "geopol-trade-war-2018",
    title: "Application of fintel to geopolitical agent evals",
    description:
      "Special series: Which AI is the best advisor during the 2018 US-China Trade War?",
    date: "2026-08-13",
  },

  /** Intro card */
  intro: {
    body: `In mid-2018, the United States and China began an escalating trade war that would reshape global commerce for years. We teleported AI agents back in time to see who is the best political advisor and assess their biases with the information that was publicly accessible at the time - this is our findings:`,
    stats: [
      { label: "Decision Dates", value: "32" },
      { label: "Parties", value: "2" },
      { label: "Runs (K)", value: "3" },
      { label: "Total Cells", value: "192" },
    ],
  },

  /** Section 1: Results and Stochasticity */
  section1: {
    num: "01",
    title: "Results and Stochasticity",
    subtitle: "Threat and action scores over time — how runs could vary",
    caption: `Each line is one independent run. The spread between lines shows the agent's judgment variance — where the lines diverge, the agent was less certain; where they converge, the evidence pointed clearly one way. Toggle between threat scores (how much danger the agent perceived) and action scores (how aggressively it recommended responding).`,
  },

  /** Section 3: Agent-Level Stochasticity */
  section3: {
    num: "05",
    title: "Agent-Level Stochasticity",
    subtitle: "Variation in tool calls and search queries — deep dive angle and depth",
    caption: `The same agent, given the same evidence, doesn't always explore the same way. The top chart shows how many tool calls (data reads) the agent made per date across 3 runs. The bottom chart shows how many unique search queries it issued — when the bars are tall, the agent explored differently each run, diving into different angles; when they're short, it converged on the same questions.`,
  },

  /** Section 2a: Agent-on-Agent Evaluation — Chart */
  sectionEvalChart: {
    num: "02",
    title: "Agent-on-Agent Evaluation",
    subtitle: "How a hindsight rater scored the agent's recommendations across time",
    caption: `An independent rater (MiMo v2.5 Pro) with full hindsight knowledge reviewed each of the 64 cells from run r1. The chart shows four dimensions: recommendation quality (how good the advice was in hindsight), loyalty (how well it served the represented party's interests), bias (degree of systematic skew), and aggression (mild vs aggressive temperament). Toggle between dimensions. Both parties are shown together so cross-party patterns are visible.`,
  },

  /** Section 2b: Agent-on-Agent Evaluation — Rating Table */
  sectionEvalTable: {
    num: "03",
    title: "Rating Rationale",
    subtitle: "The rater's assessment for each date and party",
    caption: `Each row is one cell's rating from the hindsight rater. Click to expand the full rationale for each score dimension.`,
  },

  /** Section 2: Per-Date Decisions (renamed to Raw Output) */
  section2: {
    num: "04",
    title: "Raw Agent Output",
    subtitle: "Recommendation, actions, factors, and sources for each date",
    caption: `The agent's raw output per cell. Toggle between runs (r1/r2/r3) and parties (USA/CHN). Click any row to expand the full recommendation, key factors, cited sources, and what actually happened.`,
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RunKey = "r1" | "r2" | "r3";
export type Party = "USA" | "CHN";

export type SourceCited = {
  source_type: string;
  source_id: string;
  excerpt: string;
};

export type CellData = {
  threat_score: number | null;
  action_score: number | null;
  action_level: string;
  score: number | null;
  rationale: string;
  key_factors: string[];
  sources_cited: SourceCited[];
  n_reads: number;
  n_searches: number;
  search_queries: string[];
  read_kinds: Record<string, number>;
  elapsed_ms: number;
};

export type OutcomeEntry = {
  actual_action: string;
  actual_action_score: number;
  rationale: string;
};

export type ReportData = {
  runs: Record<RunKey, { dates: Record<string, Record<Party, CellData>> }>;
  outcomes: Record<string, Record<Party, OutcomeEntry>>;
};

export type EvalRating = {
  symbol: string;
  loyalty_score: number | null;
  loyalty_rationale: string;
  bias_score: number | null;
  bias_rationale: string;
  aggression_score: number | null;
  aggression_rationale: string;
  bias_flags: string[];
  recommendation_rating: string;
  recommendation_rationale: string;
  score: number | null;
};

export type EvalData = {
  dates: Record<string, Record<Party, EvalRating>>;
  summary: {
    n_rated: number;
    n_failed: number;
    rating_run: string;
    rating_agent: string;
    elapsed_ms: number;
    tokens_in: number;
    tokens_out: number;
    cost_usd: number;
  };
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const DATES = [
  "2018-03-01", "2018-03-22", "2018-04-12", "2018-05-03", "2018-05-24",
  "2018-06-14", "2018-07-05", "2018-07-26", "2018-08-16", "2018-09-06",
  "2018-09-27", "2018-10-18", "2018-11-08", "2018-11-29", "2018-12-20",
  "2019-01-10", "2019-01-31", "2019-02-21", "2019-03-14", "2019-04-04",
  "2019-04-25", "2019-05-16", "2019-06-06", "2019-06-27", "2019-07-18",
  "2019-08-08", "2019-08-29", "2019-09-19", "2019-10-10", "2019-10-31",
  "2019-11-21", "2019-12-12",
];

export const RUN_KEYS: RunKey[] = ["r1", "r2", "r3"];
export const PARTIES: Party[] = ["USA", "CHN"];

export const ACTION_LEVELS = [
  "escalate_tariffs",
  "escalate_non_tariff",
  "retaliate",
  "negotiate",
  "hold",
  "partial_rollback",
  "concede_purchases",
  "full_rollback",
] as const;

/** Color per action level for charts. */
export const ACTION_LEVEL_COLOR: Record<string, string> = {
  escalate_tariffs: "#e85d5d",
  escalate_non_tariff: "#e8945d",
  retaliate: "#e8c45d",
  negotiate: "#6fcfdf",
  hold: "#6b7a8e",
  partial_rollback: "#6fcf9f",
  concede_purchases: "#8ae86f",
  full_rollback: "#6fe8cf",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function fmtScore(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2);
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(2000, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
