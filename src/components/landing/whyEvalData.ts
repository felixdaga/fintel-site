export const DISPLAY =
  "block font-semibold tracking-tight leading-[1.02] text-[clamp(2.6rem,12.5vw,3.75rem)] sm:whitespace-nowrap sm:text-[clamp(2.25rem,5.2vw,3.75rem)]";

export const LEAD =
  "text-sm leading-snug text-text-soft sm:text-lg sm:whitespace-nowrap";

export const HEADLINE =
  "font-semibold tracking-tight text-text leading-[1.15] text-[clamp(1.85rem,8vw,2.25rem)] sm:whitespace-nowrap sm:text-[clamp(1.5rem,calc((100vw-2.5rem)/32),2.25rem)]";

export const SERIES = {
  proprietary: {
    id: "optimized_agent_full",
    label: "Proprietary agent",
  },
  openSource: {
    id: "agent_v1_memory",
    label: "Open-source agent",
  },
  feedback: {
    id: "optimized_agent_feedback",
    label: "post-eval agent + memory",
  },
  highIntel: {
    id: "floor_llm_grok_4_5_memory",
    label: "high-intelligence model",
  },
  lowHallucination: {
    id: "floor_llm_grok_4_3_memory",
    label: "low-hallucination model",
  },
  alternative: {
    id: "tradingagent_v2",
    label: "alternative strategy",
  },
} as const;

export const SERIES_LIST = [
  SERIES.proprietary,
  SERIES.openSource,
  SERIES.feedback,
  SERIES.highIntel,
  SERIES.lowHallucination,
  SERIES.alternative,
] as const;

export type EvalCard = {
  seriesId: string;
  tag: string;
  title: string;
};

export const EVAL_CARDS: EvalCard[] = [
  {
    seriesId: SERIES.alternative.id,
    tag: "Systematic vs Fundamental",
    title: "Which AI-native investment strategy could work",
  },
  {
    seriesId: SERIES.proprietary.id,
    tag: "backtesting your agent",
    title: "How would your agent perform historically",
  },
  {
    seriesId: SERIES.highIntel.id,
    tag: "they interact non-monotonically",
    title: "Which model and harness is optimal",
  },
  {
    seriesId: SERIES.feedback.id,
    tag: "A different model, an extra tool.",
    title: "How to quantify each iteration",
  },
];
