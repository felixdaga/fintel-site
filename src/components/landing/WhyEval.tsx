import leaderboard from "@/data/leaderboard.json";
import type { LeaderboardData } from "@/components/leaderboard/types";
import { CHART_START, PAGE_GUTTER, PAGE_PAD, SERIES_LIST } from "./whyEvalData";
import { COPY } from "./main_texts";
import { EvalStoryChart, type StorySeries } from "./EvalStoryChart";
import { SectionHeader } from "./SectionHeader";

export function WhyEval() {
  const data = leaderboard as LeaderboardData;
  const byId = new Map(data.rows.map((r) => [r.id, r]));

  const startIdx = Math.max(
    0,
    data.dates.findIndex((d) => d >= CHART_START),
  );
  const dates = data.dates.slice(startIdx);

  const series: StorySeries[] = SERIES_LIST.flatMap(({ id }) => {
    const row = byId.get(id);
    if (!row) return [];
    const raw = row.nav_residual.slice(startIdx);
    const base = raw[0] || 1;
    return [{ id, values: raw.map((v) => v / base) }];
  });

  return (
    <section id="why-eval" className="bg-bg-soft">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={`${PAGE_GUTTER} flex flex-col gap-8`}>
          <SectionHeader
            kicker={COPY.whyEval.kicker}
            title={COPY.whyEval.title}
            titleAccent={COPY.whyEval.titleAccent}
            lede={COPY.whyEval.lede}
          />

          <EvalStoryChart dates={dates} series={series} />
        </div>
      </div>
    </section>
  );
}
