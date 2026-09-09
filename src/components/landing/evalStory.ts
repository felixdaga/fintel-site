import leaderboard from "@/data/leaderboard.json";
import type { LeaderboardData } from "@/components/leaderboard/types";
import { SERIES_LIST } from "./whyEvalData";

export type StorySeries = {
  id: string;
  values: number[];
};

export function evalStoryWindow(start: string): {
  dates: string[];
  series: StorySeries[];
} {
  const data = leaderboard as LeaderboardData;
  const byId = new Map(data.rows.map((r) => [r.id, r]));
  const startIdx = Math.max(
    0,
    data.dates.findIndex((d) => d >= start),
  );
  const dates = data.dates.slice(startIdx);
  const series: StorySeries[] = SERIES_LIST.flatMap(({ id }) => {
    const row = byId.get(id);
    if (!row) return [];
    const raw = row.nav_residual.slice(startIdx);
    const base = raw[0] || 1;
    return [{ id, values: raw.map((v) => v / base) }];
  });
  return { dates, series };
}
