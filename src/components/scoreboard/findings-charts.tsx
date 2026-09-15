"use client";

import { LeagueCatBars, LeagueScatter, LeagueTimeChart } from "./charts";
import { displayModel } from "./format";
import {
  cumRet,
  driverScatter,
  harnessTwins,
  yValue,
  type LineSeries,
  type YCol,
} from "./lab";
import type { LeaguePublic } from "./types";

const IR_Y: YCol = { id: "ann_ir", label: "IR", kind: "num" };

const HX_COLS: YCol[] = [
  { id: "ann_sharpe", label: "Sharpe", kind: "num" },
  { id: "ann_ir", label: "IR", kind: "num" },
  { id: "mean_ic", label: "IC", kind: "num" },
];

export function FindingCharts({
  itemId,
  data,
}: {
  itemId: string;
  data: LeaguePublic;
}) {
  if (!data.lab) return null;
  if (itemId === "skill") return <CumRetChart data={data} />;
  if (itemId === "system") return <TwinHarnessChart data={data} />;
  if (itemId === "model") return <IndexCharts data={data} />;
  if (itemId === "harness") return <HxMetricCharts data={data} />;
  return null;
}

function CumRetChart({ data }: { data: LeaguePublic }) {
  const lab = data.lab!;
  const book = data.book || "sw_0.0";
  const ids = data.table_ids.filter((id) => data.systems.some((s) => s.id === id));
  const series: LineSeries[] = ids
    .map((id) => {
      const s = data.systems.find((row) => row.id === id);
      return {
        id,
        label: s?.short || s?.system || id,
        color: s?.color || "#6f93cf",
        pts: cumRet(lab.runs[id]?.nav?.[book]),
      };
    })
    .filter((s) => s.pts.length);
  if (lab.pw_nav.length) {
    series.push({
      id: "pw",
      label: "DJIA PW",
      color: "#6b7a8e",
      dashed: true,
      pts: cumRet(lab.pw_nav),
    });
  }
  if (!series.length) return null;
  return (
    <div className="mt-6">
      <LeagueTimeChart
        title={`cumulative return — ${data.book_label || book}`}
        series={series}
        yPct
        zero
        height={280}
      />
    </div>
  );
}

function TwinHarnessChart({ data }: { data: LeaguePublic }) {
  const twins = data.lab?.sim.twins || [];
  const metrics = data.lab?.sim.metrics || [];
  if (!twins.length || !metrics.length) return null;
  return (
    <div className="mt-6">
      <LeagueCatBars
        title="same model, different harness — correlation"
        categories={twins.map((t) => displayModel(t.model))}
        series={metrics.map((m, i) => ({
          id: m.id,
          label: m.label,
          color: ["#6f93cf", "#e8924a", "#4cae86", "#c77dbb"][i % 4],
          values: twins.map((t) => {
            const raw = t[m.id as "xs" | "resid" | "factor" | "sector"];
            return typeof raw === "number" ? raw : null;
          }),
        }))}
        format="number"
        yMin={0}
        yMax={1}
        zero
        height={240}
      />
    </div>
  );
}

function IndexCharts({ data }: { data: LeaguePublic }) {
  const axes = (data.lab?.aa_axes || []).filter(
    (ax) => ax.id === "intelligence_index" || ax.id === "omniscience_index",
  );
  if (!axes.length) return null;
  const titles: Record<string, string> = {
    intelligence_index: "IR vs AA Intelligence Index",
    omniscience_index: "IR vs AA-Omniscience Index",
  };
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {axes.map((ax) => {
        const chart = driverScatter(data, ax, IR_Y, "all");
        const xName = ax.id === "omniscience_index" ? "AA-Omniscience Index" : "AA Intelligence Index";
        return (
          <LeagueScatter
            key={ax.id}
            chart={{
              ...chart,
              title: titles[ax.id] || ax.label,
              x_name: xName,
              y_name: "IR",
            }}
          />
        );
      })}
    </div>
  );
}

function HxMetricCharts({ data }: { data: LeaguePublic }) {
  const pack = harnessTwins(data);
  const book = data.book || "sw_0.0";
  if (!pack.twins.length) return null;
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {HX_COLS.map((col) => (
        <LeagueCatBars
          key={col.id}
          title={col.label}
          categories={pack.twins.map((t) => displayModel(t.model))}
          series={pack.harnesses.map((hName) => ({
            id: hName,
            label: hName,
            color: data.harness_colors[hName] || "#6f93cf",
            values: pack.twins.map((t) => yValue(data, t.keys[hName], col.id, book)),
          }))}
          format={col.kind === "pct" ? "pct" : "number"}
          zero
          height={220}
        />
      ))}
    </div>
  );
}
