"use client";

import { LeagueCatBars, LeagueScatter } from "./charts";
import { displayModel } from "./format";
import {
  driverScatter,
  strategyTwins,
  yValue,
  type YCol,
} from "./lab";
import { testLabel } from "./league_keys";
import type { LeaguePublic } from "./types";

const IR_Y: YCol = { id: "ann_ir", label: testLabel("ann_ir", "IR"), kind: "num" };

const STRATEGY_COLS: YCol[] = [
  { id: "ann_ir", label: testLabel("ann_ir", "IR"), kind: "num" },
  { id: "ann_vol", label: testLabel("ann_vol", "vol"), kind: "pct" },
  { id: "max_dd", label: testLabel("max_dd", "max dd"), kind: "pct" },
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
  if (itemId === "strategy") return <StrategyTwinCharts data={data} />;
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

function StrategyTwinCharts({ data }: { data: LeaguePublic }) {
  const pack = strategyTwins(data);
  if (!pack.twins.length) return null;
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {STRATEGY_COLS.map((col) => (
        <LeagueCatBars
          key={col.id}
          title={col.label}
          categories={pack.twins.map((t) => displayModel(t.model))}
          series={pack.strategies.map((strategy) => ({
            id: strategy,
            label: strategy,
            color: (data.strategy_colors || {})[strategy] || "#6f93cf",
            values: pack.twins.map((t) => {
              const id = t.keys[strategy];
              const book =
                data.systems.find((s) => s.id === id)?.book || data.book || "mvo";
              return id ? yValue(data, id, col.id, book) : null;
            }),
          }))}
          format={col.kind === "pct" ? "pct" : "number"}
          zero
          height={220}
        />
      ))}
    </div>
  );
}
