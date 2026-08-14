export const HEADLINE =
  "whitespace-nowrap text-[clamp(0.72rem,calc((100vw-2rem)/34),2.25rem)] font-semibold tracking-tight text-text";

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
    label: "Proprietary agent + feedback",
  },
  highIntel: {
    id: "floor_llm_grok_4_5_memory",
    label: "High-intelligence model",
  },
  lowHallucination: {
    id: "floor_llm_grok_4_3_memory",
    label: "Low-hallucination model",
  },
  alternative: {
    id: "tradingagent_v2",
    label: "Alternative strategy",
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
  parts?: { text: string; seriesId: string }[];
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
    seriesId: SERIES.openSource.id,
    tag: "they interact non-monotonically",
    title: "which model and harness is optimal",
    parts: [
      { text: "which ", seriesId: SERIES.highIntel.id },
      { text: "model", seriesId: SERIES.lowHallucination.id },
      { text: " and ", seriesId: SERIES.highIntel.id },
      { text: "harness", seriesId: SERIES.openSource.id },
      { text: " is optimal", seriesId: SERIES.highIntel.id },
    ],
  },
  {
    seriesId: SERIES.feedback.id,
    tag: "different model, extra tools, feedbacl loops",
    title: "How to quantify each iteration",
  },
];
