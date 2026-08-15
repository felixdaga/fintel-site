export const DISPLAY =
  "block font-semibold tracking-tight leading-[1.05] text-4xl sm:text-6xl";

export const LEAD =
  "text-base leading-relaxed text-text-soft sm:text-lg";

export const HEADLINE =
  "font-semibold tracking-tight text-text text-2xl sm:text-3xl";

export const KICKER =
  "font-mono text-xs uppercase tracking-widest text-accent";

export const LEDE =
  "mx-auto max-w-2xl text-base leading-relaxed text-text-soft sm:text-lg";

export const PAGE_GUTTER = "mx-auto w-full max-w-6xl";

export const PAGE_PAD = "px-5";

export const SERIES = {
  proprietary: {
    id: "optimized_agent_full",
  },
  openSource: {
    id: "agent_v1_memory",
  },
} as const;

export const SERIES_LIST = [SERIES.openSource, SERIES.proprietary] as const;

export const LINE_COLOR: Record<string, string> = {
  [SERIES.openSource.id]: "var(--accent)",
  [SERIES.proprietary.id]: "var(--orange)",
};
