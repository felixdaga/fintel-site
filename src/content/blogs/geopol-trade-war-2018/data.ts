/**
 * Geopol trade war 2018 report — all data in one place.
 *
 * This file holds:
 *   - Editable text content (meta, headers, paragraphs, stats) — search for `reportContent`
 *   - Types + helpers + constants (non-text, structural)
 *
 * Extracted run JSON lives alongside, one file per config:
 *   geopol-abl-mimo-llm.json / geopol-abl-mimo-oc.json /
 *   geopol-abl-deepseek-oc.json / geopol-abl-grok-oc.json
 */

// ─── Editable text content ───────────────────────────────────────────────────
// Edit copy here — components read from `reportContent`, not inline.

export const reportContent = {
  /** Blog post metadata (mirrors posts.ts entry) */
  meta: {
    slug: "geopol-trade-war-2018",
    title: "Application of fintel to situation rooms",
    description:
      "Special series: Which AI is the best advisor during the 2018 US-China Trade War?",
    date: "2026-08-13",
  },

  /** Intro card */
  intro: {
    body: `In mid-2018, the United States and China began an escalating trade war that would reshape global commerce for years. We teleported AI agents back in time to see who is the best political advisor and assess their inherent tendencies. The agents could only access information that was publicly available at the time. This is our findings:`,
    stats: [
      { label: "Decision Dates", value: "32" },
      { label: "Parties", value: "2" },
      { label: "Configs", value: "4" },
      { label: "Runs / Config", value: "3" },
    ],
  },

  /** Full curated timeline (collapsible, bottom of the intro card) */
  timeline: {
    label: "Full timeline",
    teaser: "Key events in the trade war",
    entries: [
    { date: "2017-08-14", text: "Trump signs memorandum directing USTR to investigate China's IP and technology-transfer practices under Section 301. USTR investigation initiated." },
    { date: "2017-11-08", text: "Trump visits Beijing; large package of commercial deals announced (many MOUs). No substantive concessions on structural IP / tech-transfer issues." },
    { date: "2018-01-22", text: "Trump approves Section 201 safeguard tariffs on solar panels and washing machines (China among suppliers hit). First major tariff action of the administration." },
    { date: "2018-03-01", text: "Trump announces plan to impose 25% tariff on steel and 10% on aluminum imports (Section 232). Global scope; China is a smaller direct supplier share than some other exporters." },
    { date: "2018-03-02", text: "Trump tweets: \"trade wars are good, and easy to win.\"" },
    { date: "2018-03-08", text: "Trump signs Section 232 proclamations imposing the steel (25%) and aluminum (10%) tariffs." },
    { date: "2018-03-22", text: "USTR releases Section 301 report finding China's IP/tech-transfer practices unreasonable or discriminatory. Trump signs presidential memorandum directing tariffs on Chinese imports, a WTO case, and investment restrictions. USTR to publish a proposed tariff list." },
    { date: "2018-04-02", text: "China imposes retaliatory tariffs on about $3B of US goods (pork, fruit, nuts, wine, and related items) in response to Section 232 steel/aluminum tariffs." },
    { date: "2018-04-03", text: "USTR publishes proposed Section 301 tariff list: ~1,300 Chinese product lines (~$50B), targeting aerospace, ICT, robotics, machinery and related sectors. Public comment process opens." },
    { date: "2018-04-04", text: "China announces proposed retaliatory tariffs on ~$50B of US goods (including soybeans, automobiles, and aircraft) in response to the Section 301 list." },
    { date: "2018-04-16", text: "US Commerce Department bans ZTE from buying US components (denial order). ZTE faces operational shutdown. Major non-tariff escalation." },
    { date: "2018-05-19", text: "US and China release joint statement after talks: China agrees to \"significantly increase\" purchases of US goods and services. Mnuchin says trade war is \"on hold.\" Markets rally." },
    { date: "2018-05-29", text: "White House announces the US will proceed with Section 301 actions, including 25% tariffs on ~$50B of Chinese imports. Truce collapses." },
    { date: "2018-06-15", text: "USTR announces final two-stage $50B tariff plan: 25% on List 1 (~$34B, 818 lines, effective July 6) and List 2 (~$16B, later). China announces matching retaliation the same day." },
    { date: "2018-06-18", text: "Trump directs USTR to identify an additional ~$200B of Chinese imports for 10% tariffs if China retaliates against the $50B action." },
    { date: "2018-07-06", text: "List 1 tariffs take effect: US 25% on ~$34B of Chinese goods. China imposes matching ~$34B retaliation the same day." },
    { date: "2018-07-10", text: "USTR publishes proposed List 3: ~$200B of Chinese imports for an additional 10% tariff (~6,000 product lines). Public comment / hearing process begins." },
    { date: "2018-08-01", text: "At Trump's direction, USTR says it is considering raising the proposed List 3 rate from 10% to 25%." },
    { date: "2018-08-23", text: "List 2 tariffs take effect: US 25% on ~$16B (completing the $50B package). China imposes matching ~$16B retaliation." },
    { date: "2018-09-17", text: "Trump directs USTR to finalize List 3: 10% tariffs on ~$200B of Chinese imports effective Sept 24, scheduled to rise to 25% on Jan 1, 2019." },
    { date: "2018-09-18", text: "USTR publishes the finalized List 3 (5,745 lines after removing some consumer/electronics and other products from the July proposal)." },
    { date: "2018-09-24", text: "List 3 takes effect at 10%. China imposes retaliatory tariffs (5–10%) on ~$60B of US goods. Combined US Section 301 coverage now ~$250B of Chinese imports." },
    { date: "2018-11-01", text: "Trump and Xi hold a phone call focused on trade; agree to meet at the G20 in Argentina." },
    { date: "2018-12-01", text: "G20 Buenos Aires dinner: Trump and Xi agree to a 90-day negotiation window. Planned Jan 1, 2019 hike of List 3 from 10% to 25% is suspended (tariffs remain at 10%). Same day: Canada arrests Huawei CFO Meng Wanzhou in Vancouver on a US provisional extradition request. China demands her release." },
    { date: "2018-12-10", text: "China detains Canadians Michael Kovrig and Michael Spavor (widely viewed as retaliation for the Meng arrest; Beijing denies linkage)." },
    { date: "2019-01-07", text: "Trade talks resume in Beijing (working / mid-level). China discusses increased purchases of US goods; structural issues remain open." },
    { date: "2019-01-28", text: "US DOJ unseals fraud and sanctions-related charges against Huawei and Meng; US formally requests Meng's extradition from Canada (deadline under Canadian law was Jan 30)." },
    { date: "2019-01-30", text: "Lighthizer and Mnuchin in Beijing for high-level talks. Purchase commitments discussed; enforcement and structural IP/tech-transfer issues unresolved." },
    { date: "2019-02-14", text: "Another round of talks (through Feb 15). Progress reported on purchases; enforcement mechanism still disputed." },
    { date: "2019-02-24", text: "Trump tweets that talks have made substantial progress and further delays the scheduled List 3 hike from 10% to 25% (previously tied to the March 1 end of the 90-day window)." },
    { date: "2019-03-01", text: "The original 90-day tariff-hike deadline passes without an increase (already delayed on Feb 24)." },
    { date: "2019-04-03", text: "Intensive Washington talks between US and Chinese negotiators; both sides report progress on text, including enforcement language. No final deal signed." },
    { date: "2019-05-05", text: "Trump tweets that negotiations are going \"too slowly\" and that China is attempting to \"renegotiate.\" Orders List 3 raised from 10% to 25% on May 10 and directs preparation of tariffs on remaining Chinese imports (~$300B)." },
    { date: "2019-05-10", text: "List 3 tariff rate rises from 10% to 25%." },
    { date: "2019-05-13", text: "China announces it will raise retaliatory tariff rates on its ~$60B US-goods list (higher rates phased in; many effective June 1)." },
    { date: "2019-05-15", text: "Trump signs Executive Order 13873 (securing information/communications technology supply chains). Commerce moves to restrict Huawei." },
    { date: "2019-05-16", text: "US Commerce Department adds Huawei and affiliates to the Entity List. US firms generally barred from selling to Huawei without a license." },
    { date: "2019-05-20", text: "Google suspends Huawei's access to Android updates / GMS; major US chip suppliers pause sales. Same day: Xi Jinping visits a rare-earth facility in Jiangxi (widely read as a signal on rare-earth leverage)." },
    { date: "2019-05-31", text: "China announces it will establish an \"unreliable entity list\" targeting foreign firms that cut supplies to Chinese companies for non-commercial reasons." },
    { date: "2019-06-18", text: "Trump and Xi agree by phone to meet at the G20 in Osaka." },
    { date: "2019-06-29", text: "G20 Osaka: Trump and Xi agree to resume talks. Existing tariffs remain; no new tariffs \"for the time being.\" Trump says he will ease some Huawei restrictions (Huawei remains on the Entity List; scope of any relief later unclear)." },
    { date: "2019-07-30", text: "Trade talks in Shanghai (through July 31). Little progress reported." },
    { date: "2019-08-01", text: "After the Shanghai round, Trump announces 10% tariffs on the remaining ~$300B of Chinese goods (List 4), effective Sept 1." },
    { date: "2019-08-05", text: "After CNY breaks 7 per USD, US Treasury designates China a currency manipulator (first such designation since 1994)." },
    { date: "2019-08-13", text: "USTR splits List 4: List 4A (~consumer/industrial mix) effective Sept 1; List 4B (including many cell phones, laptops, toys, apparel items) delayed to Dec 15. Some sensitive items (e.g. certain pharma, rare earths, critical minerals) excluded from List 4." },
    { date: "2019-08-23", text: "China announces retaliation on ~$75B of US goods (5–10%, split Sept 1 / Dec 15), including re-imposing tariffs on US autos. Trump orders US companies to \"immediately start looking for an alternative to China\" and directs a 5-point increase on the planned List 4 rate (to 15%) and threatened hikes on existing lists." },
    { date: "2019-08-30", text: "USTR formally implements List 4 rate at 15% (up from the originally announced 10%)." },
    { date: "2019-09-01", text: "List 4A takes effect at 15% (~$110–125B of Chinese imports). China's first tranche of the ~$75B retaliation also takes effect." },
    { date: "2019-09-11", text: "China announces first tariff-exemption list for some US products (16 categories; industrial inputs / chemicals / related — not a broad farm rollback)." },
    { date: "2019-09-13", text: "Chinese state media reports soybeans, pork, and some other farm goods will be excluded from additional retaliatory tariffs (goodwill signal ahead of talks)." },
    { date: "2019-10-11", text: "After Washington talks, Trump announces a \"Phase One\" deal in principle: China to buy roughly $40–50B of US agricultural products annually; IP and currency issues also cited. Planned mid-October tariff hike delayed." },
    { date: "2019-12-13", text: "US and China announce Phase One text agreed. China commits to increase purchases of US goods and services by at least ~$200B over two years versus 2017 baselines. US suspends the Dec 15 List 4B tariffs; keeps most existing tariffs. No settlement of the Huawei/Meng issues in the deal." },
    { date: "2020-01-15", text: "Phase One Economic and Trade Agreement signed in Washington. Most Section 301 tariffs remain in place. Text addresses IP, tech transfer, financial services, agriculture, and currency, with a bilateral dispute-resolution mechanism; enforcement strength debated by observers." },
    ],
  },
  novelty: {
    label: "Novelty",
    teaser: "What this eval does differently from a typical situation-room benchmark.",
    points: [
      {
        title: "Stochasticity is the finding, not the noise.",
        body: "Run the same agent twice and it can swing from escalation to concession. Modern LLMs are inherently stochastic, so a single eval run is one draw from a distribution — not a verdict. We run each agent 3× under identical conditions to show that distribution.",
      },
      {
        title: "Real history, not hypothetical games.",
        body: "Strategy-room games, however sophisticated, can't reproduce the complexity of actual geopolitics. Historical replay does by nature — and gives clear hindsight criteria from how events unfolded. Point-in-time control keeps look-ahead in check, and matters less when you're comparing characteristics across agents.",
      },
      {
        title: "Agents, not models.",
        body: "You don't assess a car by its engine. Model and harness interact non-monotonically — Claude in a chat app isn't Claude in an agent loop. Tool use unlocks country_health (structured economic data) and web_search, all point-in-time enforced for another layer of realism.",
      },
      {
        title: "Own the pipeline.",
        body: "This event is a demo. fintel runs any historical eval on any of your agents in a few steps. Situation rooms should evaluate on the events that matter to them — not outsource judgment to a generic benchmark.",
      },
    ],
  },

  /** Section 1: Results and Stochasticity */
  section1: {
    num: "01",
    title: "Agent Stochasticity",
    subtitle: "",
    finding: `Agents are much more variable when they play the US — the proactive position. Threat perception spreads far more in the US role (avg var 0.14–0.27) than in the China role (0.02–0.04); recommended action moves the same way, though the gap is smaller. The proactive side has more options, so identical conditions produce different runs; the reactive side is tighter. There is no US-vs-Chinese model split: MiMo, DeepSeek, and Grok (OpenClaw) show nearly the same US-role threat variation (0.14–0.15). What splits is setup: on action, OpenClaw agents are more variable than MiMo (LLM) (0.06–0.09 vs ~0.03). More thinking turns and tools mean more paths — more agentic capability is more stochasticity you have to factor in.`,
    caption: `Each mini-chart is one config; the three lines are independent runs under identical conditions. Spread within a chart is judgment variance; compare charts for config differences. Toggle threat (perceived danger: −1 opportunity, +1 existential) vs action (−1 escalate, +1 concede). Blue border = USA, red = CHN. “avg var” is mean absolute deviation from the per-date mean, then averaged across dates.`,
  },

  /** Section 3: Agent-Level Stochasticity */
  section3: {
    num: "04",
    title: "Agent-Level Stochasticity",
    subtitle: "",
    finding: `MiMo (LLM) has no exploration variance by design — every date gets the same “China US trade war” web_search. OpenClaw agents choose their own queries, and that is where personality shows: Grok varies most (767 unique queries), DeepSeek least (389). The LLM-vs-OpenClaw gap (1 vs 389–767) dwarfs the cross-model gap. More agentic capability is more stochasticity in what the agent even looks at.`,
    caption: `Top: tool calls (data reads) per date, clustered by config. Bottom: unique search queries per config — tall bars mean the agent asked different questions across runs; short bars mean it converged.`,
  },

  /** Section 2a: Eval Results — averaged agent scores, then hindsight rater */
  sectionEvalChart: {
    num: "03",
    title: "Agent-on-Agent Eval",
    subtitle: "",
    finding: `We then run an independent rater with access to all current information. A recommendation scores well if, knowing how the trade war actually unfolded, it turns out to have been a good move. Ratings are similar in the reactive (China) role (0.52–0.67). In the proactive (US) role, Grok (OpenClaw) is rated higher (0.73) than MiMo and DeepSeek (OpenClaw) (0.53–0.58). MiMo (LLM) is the outlier on the US side (0.32): with no access to country_health — structured economic data — only web_search, it repeatedly recommends maximal tariff escalation. The worst call is 27 Sep 2018: cover all $505B of Chinese exports, rated −1.0 / “poor” — far beyond what the administration actually did, and without pricing retaliation or domestic cost.`,
    caption: `Independent rater (MiMo) with hindsight, scoring run r1. Toggle recommendation quality, loyalty, bias, and aggression. Blue border = USA, red = CHN. Recommendation is −1 (bad) to +1 (excellent).`,
  },

  /** Section 2a-pre: Averaged agent scores (threat / action) */
  sectionEvalMean: {
    title: "Average Agent Threat Perception and Action Level",
    finding: `Averaging the three runs, agents agree much more in the reactive (China) role than the proactive (US) role. Grok perceives less threat than the Chinese models (US −0.22 vs −0.11 to +0.08; China +0.42 vs +0.47 to +0.51). On action, MiMo (LLM) locks onto maximal escalation (≈ −0.97 / −0.90, where −1 is escalate and +1 is concede). The OpenClaw agents sit near hold/negotiate (≈ −0.12 to +0.06). That is not a more hawkish model. MiMo (LLM) has no access to country_health — structured economic data — only web_search, like a chat app. OpenClaw agents can read country_health (consumer sentiment, industrial production, farm exports, FX). Those economic ties complicate the decision and hold them back. web_search is enough to see “trade war”; without country_health it is not enough to price going all-in.`,
    caption: `Each line is one config’s mean across its 3 runs, so within-config noise is averaged out and colour gaps are the config signal. Toggle threat (−1 opportunity, +1 existential) vs action (−1 escalate, +1 concede). Blue border = USA, red = CHN.`,
  },

  /** Section 2b: Agent-on-Agent Evaluation — Rating Table */
  sectionEvalTable: {
    num: "03",
    title: "Rating Rationale",
    subtitle: "",
    finding: `MiMo (LLM) picks up 8 evidence-gap flags — what web_search without country_health misses. Zero look-ahead bias across all 128 rated cells. DeepSeek has the most diverse flag mix (including one hallucination); Grok is cleanest.`,
    caption: `Each row is one cell’s hindsight rating. Toggle config, then party. Click a row for the full rationale.`,
  },

  /** Section 2: Per-Date Decisions (renamed to Raw Output) */
  section2: {
    num: "02",
    title: "Raw Outputs",
    subtitle: "",
    finding: `Why Grok looks calmer on the chart above, and why MiMo (LLM) goes all-in, is in the recommendations below. With country_health, Grok reads the US side as leverage, not crisis: the US economy still firm, China under FX and export strain, Lists 1–3 already in place as unused pressure, farm-belt pain real but not a recession. So it almost always recommends hold or negotiate — keep the tariffs, don’t hit remaining consumer goods, trade only for IP text. MiMo (LLM) has no access to country_health, only web_search. Those articles keep serving the same RAND 4:1 ammunition story ($505B in vs $130B out), which becomes a standing case to cover all remaining Chinese exports. Without structured economic data, nothing holds it back.`,
    caption: `Toggle config, then run and party. Click a row for the full recommendation, factors, sources, and what actually happened — this is the evidence behind the chart above.`,
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RunKey = "r1" | "r2" | "r3";
export type Party = "USA" | "CHN";

/** Ablation config — one model + agent-setup combination. Same config ⇒ same
 * chart colour; its 3 runs share that colour (distinguished by opacity/dash)
 * so within-config spread reads as stochasticity and between-colour gaps read
 * as config differences. */
export type ConfigKey = "mimo-oc" | "mimo-llm" | "grok-oc" | "deepseek-oc";

export type ConfigDef = {
  key: ConfigKey;
  label: string;
  /** Chart colour for this config (shared by all its runs). */
  color: string;
  /** JSON file basename inside this folder. */
  file: string;
  /** Whether an agent-on-agent eval exists for this config's r1. */
  hasEval: boolean;
};

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
  lookahead_bias: boolean;
  lookahead_bias_rationale: string;
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

/** Colour per cited-source type (raw-output table). Each badge is a fixed
 *  width so different source types align; the colour distinguishes them. */
export const SOURCE_TYPE_COLOR: Record<string, string> = {
  event_timeline: "#6f93cf",
  country_health: "#8ae86f",
  web_search: "#e8c45d",
  other: "#9aa3b2",
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

// ─── Ablation configs ─────────────────────────────────────────────────────────
// One entry per (model, agent-setup) cell in the ablation grid. Order = legend
// order. Same config ⇒ one colour across all its runs; the 3 runs of a config
// are drawn in that colour with varying opacity so the within-config spread
// (stochasticity) and the between-config gaps (ablation signal) are both
// visible on one chart.

import mimoLlm from "./geopol-abl-mimo-llm.json";
import mimoOc from "./geopol-abl-mimo-oc.json";
import deepseekOc from "./geopol-abl-deepseek-oc.json";
import grokOc from "./geopol-abl-grok-oc.json";

export const CONFIGS: ConfigDef[] = [
  { key: "mimo-llm", label: "MiMo (LLM)", color: "#3db8b0", file: "geopol-abl-mimo-llm.json", hasEval: true },
  { key: "mimo-oc", label: "MiMo (OpenClaw)", color: "#4a90d9", file: "geopol-abl-mimo-oc.json", hasEval: true },
  { key: "deepseek-oc", label: "DeepSeek (OpenClaw)", color: "#8a5dab", file: "geopol-abl-deepseek-oc.json", hasEval: true },
  { key: "grok-oc", label: "Grok (OpenClaw)", color: "#e8945d", file: "geopol-abl-grok-oc.json", hasEval: true },
];

export const CONFIG_KEYS: ConfigKey[] = CONFIGS.map((c) => c.key);

export const CONFIG_COLOR: Record<ConfigKey, string> = Object.fromEntries(
  CONFIGS.map((c) => [c.key, c.color]),
) as unknown as Record<ConfigKey, string>;

export const CONFIG_LABEL: Record<ConfigKey, string> = Object.fromEntries(
  CONFIGS.map((c) => [c.key, c.label]),
) as unknown as Record<ConfigKey, string>;

/** Per-config run data (the {runs, outcomes} payload). */
export const configData: Record<ConfigKey, ReportData> = {
  "mimo-oc": mimoOc as unknown as ReportData,
  "mimo-llm": mimoLlm as unknown as ReportData,
  "grok-oc": grokOc as unknown as ReportData,
  "deepseek-oc": deepseekOc as unknown as ReportData,
};

/** Outcomes are pack-owned (identical across configs) — take from the first. */
export const OUTCOMES: Record<string, Record<Party, OutcomeEntry>> =
  (mimoOc as unknown as ReportData).outcomes;

// ─── Per-config agent-on-agent eval (r1) ─────────────────────────────────────
import evalMimoOc from "./eval-r1-mimo-oc.json";
import evalMimoLlm from "./eval-r1-mimo-llm.json";
import evalGrokOc from "./eval-r1-grok-oc.json";
import evalDeepseekOc from "./eval-r1-deepseek-oc.json";

export const configEval: Record<ConfigKey, EvalData | null> = {
  "mimo-oc": evalMimoOc as unknown as EvalData,
  "mimo-llm": evalMimoLlm as unknown as EvalData,
  "grok-oc": evalGrokOc as unknown as EvalData,
  "deepseek-oc": evalDeepseekOc as unknown as EvalData,
};

// ─── US / CHN chart borders ───────────────────────────────────────────────────
// Every per-party chart gets a coloured border so USA vs CHN is instantly
// distinguishable: blue for USA, red for CHN. Applied to the chart card.
export const PARTY_BORDER: Record<Party, string> = {
  USA: "#4a90d9",
  CHN: "#d94a4a",
};

