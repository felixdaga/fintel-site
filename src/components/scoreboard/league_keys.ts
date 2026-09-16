/**
 * Scoreboard structure — which strategy uses which books, which metrics are book results.
 * All editable copy lives in `league_texts.ts`.
 */

import { LEAGUE_COPY } from "./league_texts";

export const LEAGUE_KEYS = {
  strategies: {
    "systematic stockrate": {
      pick: false,
      tableBook: "mvo",
      books: ["mvo", "naive_tilt", "sw_0.0"],
    },
    "fundamental stockpick": {
      pick: true,
      tableBook: "sw_0.0",
      books: ["sw_0.0"],
    },
  },
} as const;

export type LeagueStrategyId = keyof typeof LEAGUE_KEYS.strategies;
export type LeagueTestId = keyof typeof LEAGUE_COPY.tests;
export type LeagueBookId = keyof typeof LEAGUE_COPY.books;

export const BOOK_TEST_IDS = [
  "ann_ir",
  "total",
  "ann_ret",
  "ann_sharpe",
  "ann_vol",
  "max_dd",
] as const satisfies readonly LeagueTestId[];

export const STRATEGY_IDS = Object.keys(LEAGUE_KEYS.strategies) as LeagueStrategyId[];

export function testLabel(id: string, fallback: string): string {
  const row = (LEAGUE_COPY.tests as Record<string, { label: string } | undefined>)[id];
  return row?.label || fallback;
}

export function isBookTest(id: string): boolean {
  return (BOOK_TEST_IDS as readonly string[]).includes(id);
}

export function bookLabel(id: string, fallback?: string): string {
  const row = (LEAGUE_COPY.books as Record<string, { label: string } | undefined>)[id];
  return row?.label || fallback || id;
}

export function tableBookId(strategy?: string | null): string {
  const spec = LEAGUE_KEYS.strategies[strategy as LeagueStrategyId];
  return spec?.tableBook || "mvo";
}
