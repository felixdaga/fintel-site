"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import { Marked } from "@/components/landing/Mark";
import { LeagueUniverseChart } from "./charts";
import { byId, clsNum, displayModel, fillCopy, fmtNum, fmtPct, fmtUsd } from "./format";
import { LeagueHoldings } from "./LeagueHoldings";
import { testLabel } from "./league_keys";
import { LEAGUE_COPY } from "./league_texts";
import { LeagueResume } from "./LeagueResume";
import type { LeaguePublic, LeagueSystem } from "./types";

type SortKey =
  | "model"
  | "harness"
  | "strategy"
  | "data"
  | "ann_ir"
  | "ann_ret"
  | "ann_sharpe"
  | "mean_ic"
  | "residual_ic"
  | "ann_vol"
  | "cost_usd";

const TEXT_KEYS = new Set<SortKey>(["model", "harness", "strategy", "data"]);
const AGENTIC_KEYS: SortKey[] = ["model", "harness", "strategy"];

const COLS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "model", label: "model" },
  { key: "harness", label: "harness" },
  { key: "strategy", label: "strategy" },
  { key: "data", label: "data" },
  { key: "ann_ir", label: testLabel("ann_ir", "IR"), align: "right" },
  { key: "ann_ret", label: testLabel("ann_ret", "ann ret"), align: "right" },
  { key: "ann_sharpe", label: testLabel("ann_sharpe", "sharpe"), align: "right" },
  { key: "mean_ic", label: testLabel("mean_ic", "IC"), align: "right" },
  { key: "residual_ic", label: testLabel("residual_ic", "resid IC"), align: "right" },
  { key: "ann_vol", label: testLabel("ann_vol", "vol"), align: "right" },
  { key: "cost_usd", label: testLabel("cost_usd", "eval cost"), align: "right" },
];

function cellText(s: LeagueSystem, key: SortKey): string {
  if (key === "harness") return s.analysis_harness || s.harness;
  if (key === "model") return displayModel(s.model);
  if (key === "strategy") return s.strategy || "";
  if (key === "data") return s.data || "";
  return "";
}

function cellNum(s: LeagueSystem, key: SortKey): number | null {
  const v = s[key as keyof LeagueSystem];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function searchText(s: LeagueSystem, key: SortKey): string {
  if (TEXT_KEYS.has(key)) {
    if (key === "model") return `${s.model} ${displayModel(s.model)}`;
    return cellText(s, key);
  }
  const n = cellNum(s, key);
  if (n == null) return "";
  if (key === "ann_ret" || key === "ann_vol") return `${fmtPct(n, 1)} ${n}`;
  if (key === "mean_ic" || key === "residual_ic") return `${fmtNum(n, 3)} ${n}`;
  if (key === "cost_usd") return `${fmtUsd(n)} ${n}`;
  return `${fmtNum(n, 2)} ${n}`;
}

function GroupChip({
  label,
  color,
}: {
  label: string;
  color?: string | null;
}) {
  if (!color) return <span className="text-text-soft">{label}</span>;
  return (
    <span
      className="inline-block rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{
        color,
        backgroundColor: `${color}22`,
        boxShadow: `inset 0 0 0 1px ${color}66`,
      }}
    >
      {label}
    </span>
  );
}

function bandText(
  band: { min: number; max: number } | undefined,
  kind: "pct" | "num",
): string | null {
  if (!band || band.min == null || band.max == null) return null;
  if (band.min === band.max) return null;
  if (kind === "pct") return `${(100 * band.min).toFixed(1)}–${fmtPct(band.max, 1)}`;
  return `${fmtNum(band.min, 2)}–${fmtNum(band.max, 2)}`;
}

function MetricWithBand({
  value,
  band,
  kind,
  colorClass,
}: {
  value: number | null | undefined;
  band?: { min: number; max: number };
  kind: "pct" | "num";
  colorClass?: string;
}) {
  const main = kind === "pct" ? fmtPct(value, 1) : fmtNum(value, 2);
  const range = value == null ? null : bandText(band, kind);
  return (
    <span className="block">
      <span className={colorClass || "text-text-soft"}>{main}</span>
      {range ? (
        <span className="mt-0.5 block text-[10px] font-normal text-text-muted">{range}</span>
      ) : null}
    </span>
  );
}

function SortHead({
  col,
  sortKey,
  sortDir,
  filter,
  onSort,
  onFilter,
}: {
  col: (typeof COLS)[number];
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  filter: string;
  onSort: (key: SortKey) => void;
  onFilter: (key: SortKey, value: string) => void;
}) {
  const active = sortKey === col.key;
  const right = col.align === "right";
  return (
    <>
      <button
        type="button"
        onClick={() => onSort(col.key)}
        title="sort"
        className={`inline-flex items-center gap-1 whitespace-nowrap uppercase tracking-wider transition-colors hover:text-text ${
          active ? "text-accent-strong" : ""
        } ${right ? "flex-row-reverse" : ""}`}
      >
        <span>{col.label}</span>
        <span
          className={`text-[10px] not-italic tracking-normal ${
            active ? "opacity-100" : "opacity-35"
          }`}
        >
          {active ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
        </span>
      </button>
      <input
        type="search"
        placeholder="filter"
        value={filter}
        onChange={(e) => onFilter(col.key, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mt-1.5 block w-full min-w-14 appearance-none rounded-[0.3rem] border border-border bg-bg-soft px-1.5 py-0.5 text-[10px] font-normal normal-case tracking-normal text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
    </>
  );
}

export function LeagueTable({ data }: { data: LeaguePublic }) {
  const base = useMemo(() => {
    const map = byId(data.systems);
    return data.table_ids.map((id) => map[id]).filter(Boolean);
  }, [data.systems, data.table_ids]);

  const [filters, setFilters] = useState<Partial<Record<SortKey, string>>>({});
  const [sortKey, setSortKey] = useState<SortKey>("ann_ir");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openId, setOpenId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paneW, setPaneW] = useState<number | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const sync = () => setPaneW(el.clientWidth);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const rows = useMemo(() => {
    const needles = COLS.map((c) => (filters[c.key] || "").trim().toLowerCase());
    const filtered = base.filter((s) =>
      COLS.every((c, i) => {
        const q = needles[i];
        if (!q) return true;
        return searchText(s, c.key).toLowerCase().includes(q);
      }),
    );
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (TEXT_KEYS.has(sortKey)) {
        return cellText(a, sortKey).localeCompare(cellText(b, sortKey)) * dir;
      }
      const av = cellNum(a, sortKey);
      const bv = cellNum(b, sortKey);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * dir;
    });
  }, [base, filters, sortKey, sortDir]);

  const toggleRow = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div>
      <LeagueUniverseChart data={data} />
      <LeagueHoldings data={data} />
      <p className="mb-2 flex items-center justify-center gap-1.5 text-sm leading-none text-text-muted sm:text-[15px]">
        <Marked text={fillCopy(LEAGUE_COPY.table.caption, data.copy)} />
        <span className="inline-flex rotate-90 text-text-muted" aria-hidden>
          <DetailsArrow className="h-2.5 w-2.5 text-current" />
        </span>
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-2">
      <div ref={scrollerRef} className="overflow-x-auto">
        <table className="min-w-[1080px] w-full text-left text-[13px]">
          <thead>
            {(() => {
              const agentic = COLS.filter((c) => AGENTIC_KEYS.includes(c.key));
              const rest = COLS.filter((c) => !AGENTIC_KEYS.includes(c.key));
              const grouped = agentic.length > 0;
              const headClass =
                "bg-surface px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider text-text-muted";
              const sortFilter = (col: (typeof COLS)[number]) => (
                <SortHead
                  col={col}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  filter={filters[col.key] || ""}
                  onSort={onSort}
                  onFilter={(key, value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                />
              );
              return (
                <>
                  <tr className="border-b border-border">
                    {grouped ? (
                      <th
                        colSpan={agentic.length}
                        className="border-r border-border bg-accent-soft px-3 py-2.5 text-center font-mono text-[11px] font-medium uppercase tracking-widest text-accent"
                      >
                        Agentic system
                      </th>
                    ) : null}
                    {rest.map((col) => (
                      <th
                        key={col.key}
                        rowSpan={grouped ? 2 : 1}
                        className={`${headClass} align-bottom ${col.align === "right" ? "text-right" : "text-left"}`}
                      >
                        {sortFilter(col)}
                      </th>
                    ))}
                  </tr>
                  {grouped ? (
                    <tr className="border-b border-border">
                      {agentic.map((col, i) => (
                        <th
                          key={col.key}
                          className={`${headClass} bg-accent-soft/60 align-bottom ${
                            i === agentic.length - 1 ? "border-r border-border" : ""
                          }`}
                        >
                          {sortFilter(col)}
                        </th>
                      ))}
                    </tr>
                  ) : null}
                </>
              );
            })()}
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((s) => {
                const open = openId === s.id;
                return (
                  <Fragment key={s.id}>
                    <tr
                      className={`cursor-pointer border-b border-border/50 hover:bg-accent-soft/50 ${
                        open ? "bg-accent-soft/40" : ""
                      }`}
                      onClick={() => toggleRow(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRow(s.id);
                        }
                      }}
                      tabIndex={0}
                      aria-expanded={open}
                    >
                      {COLS.map((col, i) => (
                        <td
                          key={col.key}
                          className={`px-3 py-2.5 tabular-nums ${
                            col.align === "right" ? "text-right" : ""
                          }`}
                        >
                          <Cell
                            data={data}
                            s={s}
                            col={col.key}
                            open={open}
                            lead={i === 0}
                          />
                        </td>
                      ))}
                    </tr>
                    {open ? (
                      <tr className="border-b border-border bg-bg-soft/80">
                        <td colSpan={COLS.length} className="p-0">
                          <div
                            className="sticky left-0 box-border overflow-x-hidden px-3 py-5 sm:px-5"
                            style={paneW ? { width: paneW, maxWidth: paneW } : undefined}
                          >
                            <LeagueResume key={s.id} data={data} system={s} />
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={COLS.length} className="px-3 py-3.5 text-text-muted">
                  no rows match
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

function Cell({
  data,
  s,
  col,
  open,
  lead,
}: {
  data: LeaguePublic;
  s: LeagueSystem;
  col: SortKey;
  open: boolean;
  lead: boolean;
}) {
  const harnessColor =
    s.harness_color || data.harness_colors[s.analysis_harness] || data.harness_colors[s.harness];
  const strategyColor =
    s.strategy_color || (data.strategy_colors || {})[s.strategy || ""];
  const modelColor = s.model_color || (data.model_colors || {})[s.model];
  const bands = s.repeat_bands || {};
  const chip = (node: ReactNode) =>
    lead ? (
      <span className="inline-flex items-center gap-2">
        <span
          className={`text-[10px] text-text-muted transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          ▸
        </span>
        {node}
      </span>
    ) : (
      node
    );
  switch (col) {
    case "model":
      return chip(
        <GroupChip label={displayModel(s.model)} color={modelColor} />,
      );
    case "harness":
      return chip(
        <GroupChip label={s.analysis_harness || s.harness} color={harnessColor} />,
      );
    case "strategy":
      return chip(
        <GroupChip label={s.strategy || "systematic stockrate"} color={strategyColor} />,
      );
    case "data":
      return chip(<span className="text-text-soft">{s.data || "—"}</span>);
    case "ann_ir":
      return (
        <MetricWithBand
          value={s.ann_ir}
          band={bands.ann_ir}
          kind="num"
          colorClass={clsNum(s.ann_ir)}
        />
      );
    case "ann_ret":
      return (
        <MetricWithBand
          value={s.ann_ret}
          band={bands.ann_ret}
          kind="pct"
          colorClass={clsNum(s.ann_ret)}
        />
      );
    case "ann_sharpe":
      return (
        <MetricWithBand
          value={s.ann_sharpe}
          band={bands.ann_sharpe}
          kind="num"
          colorClass={clsNum(s.ann_sharpe)}
        />
      );
    case "mean_ic":
      return <span className="text-text-soft">{fmtNum(s.mean_ic, 3)}</span>;
    case "residual_ic":
      return <span className="text-text-soft">{fmtNum(s.residual_ic, 3)}</span>;
    case "ann_vol":
      return <MetricWithBand value={s.ann_vol} band={bands.ann_vol} kind="pct" />;
    case "cost_usd":
      return <span className="text-text-soft">{fmtUsd(s.cost_usd)}</span>;
  }
}
