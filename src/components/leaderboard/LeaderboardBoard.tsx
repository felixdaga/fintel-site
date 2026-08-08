"use client";

import { useMemo, useState } from "react";
import type { LeaderboardData, LeaderboardRow } from "./types";

type SortKey =
  | "agent"
  | "model"
  | "runs"
  | "residual_ic"
  | "residual_nwt"
  | "factor_neutralization_delta"
  | "cost_usd";

function fmtIc(n: number) {
  return n.toFixed(3);
}

function fmtDelta(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(3)}`;
}

/** Asymmetric per-run span around the ensembled factor-neutralized IC. */
function fmtPerRunRange(row: LeaderboardRow) {
  if (row.per_run_mean_ic_min == null || row.per_run_mean_ic_max == null) {
    return null;
  }
  const up = row.per_run_mean_ic_max - row.residual_ic;
  const down = row.residual_ic - row.per_run_mean_ic_min;
  const upStr = `${up >= 0 ? "+" : ""}${up.toFixed(3)}`;
  const downStr =
    down >= 0 ? `-${down.toFixed(3)}` : `+${Math.abs(down).toFixed(3)}`;
  return `(${upStr}, ${downStr})`;
}

function NwtCell({ t }: { t: number }) {
  const abs = Math.abs(t);
  const flag = abs >= 3 ? "★" : abs >= 1.96 ? "✓" : "";
  return (
    <span className="tabular-nums">
      {t.toFixed(2)}
      {flag ? <span className="ml-1 text-accent">{flag}</span> : null}
    </span>
  );
}

function SortHeader({
  label,
  col,
  sortKey,
  sortDir,
  align = "left",
  onSort,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  align?: "left" | "right";
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <th
      className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-text ${
          active ? "text-text" : "text-text-muted"
        } ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        <span>{label}</span>
        <span className="font-mono text-[10px] text-accent">
          {active ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
        </span>
      </button>
    </th>
  );
}

export function LeaderboardBoard({ data }: { data: LeaderboardData }) {
  const [sortKey, setSortKey] = useState<SortKey>("residual_nwt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "agent" || key === "model" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => {
    const rows = [...data.rows];
    const dir = sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return av.localeCompare(bv) * dir;
      }
      return ((av as number) - (bv as number)) * dir;
    });
    return rows;
  }, [data.rows, sortKey, sortDir]);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface-2">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-xs font-medium">
              <SortHeader
                label="agent"
                col="agent"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                label="model"
                col="model"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                label="runs"
                col="runs"
                sortKey={sortKey}
                sortDir={sortDir}
                align="right"
                onSort={onSort}
              />
              <SortHeader
                label="factor-neutralized IC"
                col="residual_ic"
                sortKey={sortKey}
                sortDir={sortDir}
                align="right"
                onSort={onSort}
              />
              <SortHeader
                label="NWt"
                col="residual_nwt"
                sortKey={sortKey}
                sortDir={sortDir}
                align="right"
                onSort={onSort}
              />
              <SortHeader
                label="factor neut. Δ"
                col="factor_neutralization_delta"
                sortKey={sortKey}
                sortDir={sortDir}
                align="right"
                onSort={onSort}
              />
              <SortHeader
                label="cost"
                col="cost_usd"
                sortKey={sortKey}
                sortDir={sortDir}
                align="right"
                onSort={onSort}
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const delta = r.factor_neutralization_delta;
              const range = fmtPerRunRange(r);
              return (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-surface"
                >
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-text">{r.harness}</div>
                    {r.iterations ? (
                      <div className="mt-0.5 text-[11px] text-text-muted">
                        {r.iterations}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-text-soft">
                    {r.model}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-text-soft">
                    {r.runs}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    <div className="font-medium text-text">
                      {fmtIc(r.residual_ic)}
                    </div>
                    {range ? (
                      <div className="mt-0.5 font-mono text-[11px] text-text-muted">
                        {range}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-text">
                    <NwtCell t={r.residual_nwt} />
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right tabular-nums font-medium ${
                      delta > 0
                        ? "text-positive"
                        : delta < 0
                          ? "text-negative"
                          : "text-text-soft"
                    }`}
                  >
                    {fmtDelta(delta)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-text-soft">
                    ${r.cost_usd.toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
