"use client";

import { LeagueCatBars, LeagueScatter } from "./charts";
import { displayModel } from "./format";
import {
  driverScatter,
  harnessTwins,
  yValue,
  type YCol,
} from "./lab";
import { testLabel } from "./league_keys";
import type { LeaguePublic } from "./types";

const IR_Y: YCol = { id: "ann_ir", label: testLabel("ann_ir", "IR"), kind: "num" };

const HX_COLS: YCol[] = [
  { id: "ann_sharpe", label: testLabel("ann_sharpe", "Sharpe"), kind: "num" },
  { id: "ann_ir", label: testLabel("ann_ir", "IR"), kind: "num" },
  { id: "mean_ic", label: testLabel("mean_ic", "IC"), kind: "num" },
];

export function FindingCharts({
  itemId,
  data,
}: {
  itemId: string;
  data: LeaguePublic;
}) {
  if (!data.lab) return null;
  if (itemId === "system") return <TwinHarnessChart data={data} />;
  if (itemId === "model") return <IndexCharts data={data} />;
  if (itemId === "harness") return <HxMetricCharts data={data} />;
  return null;
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
  const book = data.book || "mvo";
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
