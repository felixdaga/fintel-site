import leaderboard from "@/data/leaderboard.json";
import { ResidualNavChart } from "@/components/leaderboard/ResidualNavChart";
import { colorFor } from "@/components/leaderboard/chartPalette";
import type { LeaderboardData, LeaderboardRow } from "@/components/leaderboard/types";
import { EVAL_CARDS, HEADLINE, SERIES_LIST, type EvalCard } from "./whyEvalData";

export function WhyEval() {
  const data = leaderboard as LeaderboardData;
  const byId = new Map(data.rows.map((r) => [r.id, r]));
  const rows: LeaderboardRow[] = SERIES_LIST.flatMap(({ id, label }) => {
    const row = byId.get(id);
    return row ? [{ ...row, chart_label: label, agent: label }] : [];
  });
  const ids = rows.map((r) => r.id);

  return (
    <section id="why-eval" className="bg-bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-24">
        <blockquote className="mx-auto flex w-full flex-col items-center text-center">
          <p className={HEADLINE}>When coding agents fail, you retry.</p>
          <p className={`mt-2 sm:mt-3 ${HEADLINE}`}>
            When financial agents fail, you{" "}
            <span className="text-orange">lose money</span>.
          </p>
        </blockquote>

        <div className="mx-auto mt-12 w-full sm:mt-14">
          <ResidualNavChart
            dates={data.dates}
            benchmark={data.benchmark_nav}
            rows={rows}
            caption={false}
            legend="end"
            framed={false}
            benchmarkLabel="portfolio benchmark"
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-2">
          {EVAL_CARDS.map((card) => (
            <EvalBubble key={card.title} card={card} ids={ids} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EvalBubble({ card, ids }: { card: EvalCard; ids: string[] }) {
  const parts = card.parts ?? [{ text: card.title, seriesId: card.seriesId }];

  return (
    <div className="rounded-3xl border border-border bg-surface-2 px-5 py-5 text-center">
      <h3 className="text-sm font-semibold leading-snug sm:text-base">
        {parts.map((part, i) => (
          <span key={i} style={{ color: colorFor(part.seriesId, ids) }}>
            {part.text}
          </span>
        ))}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{card.tag}</p>
    </div>
  );
}
