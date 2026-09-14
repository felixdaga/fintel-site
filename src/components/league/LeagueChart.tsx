import { LeagueAxisTable } from "./LeagueAxisTable";
import { LeagueBarChart } from "./LeagueBarChart";
import { LeagueGroupedBar } from "./LeagueGroupedBar";
import { LeagueScatter } from "./LeagueScatter";
import { fillCopy } from "./format";
import { LEAGUE_COPY } from "./league_texts";
import type {
  LeagueBarChart as BarSpec,
  LeagueGroupedChart,
  LeaguePublic,
  LeagueScatterChart,
} from "./types";

function overlay<T extends { title: string; caption?: string; hint?: string }>(
  chart: T,
  spec: { title: string; caption?: string; hint?: string } | undefined,
  vars: Record<string, string>,
): T {
  if (!spec) return chart;
  return {
    ...chart,
    title: fillCopy(spec.title, vars),
    caption: spec.caption ? fillCopy(spec.caption, vars) : chart.caption,
    hint: spec.hint ? fillCopy(spec.hint, vars) : chart.hint,
  };
}

export function LeagueChart({
  id,
  data,
}: {
  id: string;
  data: LeaguePublic;
}) {
  const c = data.charts;
  const vars = data.copy;
  const copy = LEAGUE_COPY.charts;
  switch (id) {
    case "total":
      return <LeagueBarChart chart={overlay(c.total, copy.total, vars) as BarSpec} />;
    case "ic_t":
      return <LeagueBarChart chart={overlay(c.ic_t, copy.ic_t, vars) as BarSpec} />;
    case "residual_t":
      return (
        <LeagueBarChart chart={overlay(c.residual_t, copy.residual_t, vars) as BarSpec} />
      );
    case "max_dd":
      return <LeagueBarChart chart={overlay(c.max_dd, copy.max_dd, vars) as BarSpec} />;
    case "twin_cost":
      return (
        <LeagueGroupedBar
          chart={overlay(c.twin_cost, copy.twin_cost, vars) as LeagueGroupedChart}
        />
      );
    case "twin_similarity":
      return (
        <LeagueGroupedBar
          chart={
            overlay(c.twin_similarity, copy.twin_similarity, vars) as LeagueGroupedChart
          }
        />
      );
    case "omni_ic":
      return (
        <LeagueScatter
          chart={overlay(c.omni_ic, copy.omni_ic, vars) as LeagueScatterChart}
        />
      );
    case "acc_ic":
      return (
        <LeagueScatter
          chart={overlay(c.acc_ic, copy.acc_ic, vars) as LeagueScatterChart}
        />
      );
    case "axis":
      return (
        <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            {copy.axis.title}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
            {copy.axis.hint}
          </p>
          <div className="mt-3">
            <LeagueAxisTable rows={data.axis} />
          </div>
        </div>
      );
    default:
      return null;
  }
}
