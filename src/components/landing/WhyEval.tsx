import leaderboard from "@/data/leaderboard.json";
import type { LeaderboardData } from "@/components/leaderboard/types";
import { PAGE_GUTTER, PAGE_PAD, SERIES_LIST } from "./whyEvalData";
import { COPY } from "./copy";
import { EvalStoryChart, type StorySeries } from "./EvalStoryChart";
import { SectionHeader } from "./SectionHeader";

export function WhyEval() {
  const data = leaderboard as LeaderboardData;
  const byId = new Map(data.rows.map((r) => [r.id, r]));

  const series: StorySeries[] = SERIES_LIST.flatMap(({ id }) => {
    const row = byId.get(id);
    return row ? [{ id, values: row.nav_residual }] : [];
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

          <EvalStoryChart dates={data.dates} series={series} />
        </div>
      </div>
    </section>
  );
}
