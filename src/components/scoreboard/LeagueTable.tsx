"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { byId, clsNum, displayModel, fmtNum, fmtPct, fmtUsd } from "./format";
import { LeagueResume } from "./LeagueResume";
import type { LeaguePublic, LeagueSystem } from "./types";

type SortKey =
  | "system"
  | "harness"
  | "model"
  | "data"
  | "ann_ret"
  | "ann_sharpe"
  | "ann_ir"
  | "mean_ic"
  | "residual_ic"
  | "ann_vol"
  | "cost_usd";

const TEXT_KEYS = new Set<SortKey>(["system", "harness", "model", "data"]);

const COLS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "system", label: "agentic system" },
  { key: "harness", label: "harness" },
  { key: "model", label: "model" },
  { key: "data", label: "data" },
  { key: "ann_ret", label: "ann ret", align: "right" },
  { key: "ann_sharpe", label: "sharpe", align: "right" },
  { key: "ann_ir", label: "IR", align: "right" },
  { key: "mean_ic", label: "IC", align: "right" },
  { key: "residual_ic", label: "resid IC", align: "right" },
  { key: "ann_vol", label: "vol", align: "right" },
  { key: "cost_usd", label: "eval cost", align: "right" },
];

function cellText(s: LeagueSystem, key: SortKey): string {
  if (key === "system") return s.system;
  if (key === "harness") return s.harness;
  if (key === "model") return displayModel(s.model);
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

export function LeagueTable({ data }: { data: LeaguePublic }) {
  const base = useMemo(() => {
    const map = byId(data.systems);
    return data.table_ids.map((id) => map[id]).filter(Boolean);
  }, [data.systems, data.table_ids]);

  const [hidden, setHidden] = useState<Set<SortKey>>(new Set());
  const [filters, setFilters] = useState<Partial<Record<SortKey, string>>>({});
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paneW, setPaneW] = useState<number | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const sync = () => setPaneW(el.clientWidth);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible = COLS.filter((c) => !hidden.has(c.key));

  const onSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const toggleCol = (key: SortKey) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < COLS.length - 1) next.add(key);
      return next;
    });
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

  const nFilt = Object.values(filters).filter((v) => v && v.trim()).length;
  const meta = [
    hidden.size ? `${visible.length}/${COLS.length} cols` : "",
    nFilt ? `${rows.length}/${base.length} rows` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const toggleRow = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-2">
      <div
        ref={barRef}
        className="relative flex items-center gap-3 border-b border-border bg-surface px-3 py-[0.45rem]"
      >
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`rounded-[0.35rem] border px-2 py-0.5 text-[11px] font-medium transition-colors ${
            hidden.size
              ? "border-border-strong text-accent-strong"
              : "border-border bg-surface-2 text-text-soft hover:border-border-strong hover:text-text"
          }`}
        >
          columns
        </button>
        {meta ? <span className="text-[11px] text-text-muted">{meta}</span> : null}
        {menuOpen ? (
          <div className="absolute top-full left-3 z-20 mt-[-2px] max-h-64 min-w-48 overflow-auto rounded-lg border border-border bg-surface py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            {COLS.map((c) => {
              const on = !hidden.has(c.key);
              return (
                <label
                  key={c.key}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1 text-[11px] text-text-soft hover:bg-accent-soft hover:text-text"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleCol(c.key)}
                    className="accent-accent"
                  />
                  {c.label}
                </label>
              );
            })}
          </div>
        ) : null}
      </div>
      <div ref={scrollerRef} className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {visible.map((col) => {
                const active = sortKey === col.key;
                const right = col.align === "right";
                return (
                  <th
                    key={col.key}
                    className={`bg-surface px-3 py-2.5 ${right ? "text-right" : "text-left"}`}
                  >
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
                      value={filters[col.key] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1.5 block w-full min-w-14 appearance-none rounded-[0.3rem] border border-border bg-bg-soft px-1.5 py-0.5 text-[10px] font-normal normal-case tracking-normal text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
                    />
                  </th>
                );
              })}
            </tr>
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
                      {visible.map((col) => (
                        <td
                          key={col.key}
                          className={`px-3 py-2.5 tabular-nums ${
                            col.align === "right" ? "text-right" : ""
                          }`}
                        >
                          <Cell s={s} col={col.key} open={open} />
                        </td>
                      ))}
                    </tr>
                    {open ? (
                      <tr className="border-b border-border bg-bg-soft/80">
                        <td colSpan={Math.max(visible.length, 1)} className="p-0">
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
                <td
                  colSpan={Math.max(visible.length, 1)}
                  className="px-3 py-3.5 text-text-muted"
                >
                  no rows match
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ s, col, open }: { s: LeagueSystem; col: SortKey; open: boolean }) {
  switch (col) {
    case "system":
      return (
        <span className="inline-flex items-center gap-2">
          <span
            className={`text-[10px] text-text-muted transition-transform ${open ? "rotate-90" : ""}`}
            aria-hidden
          >
            ▸
          </span>
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-sm"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-text">{s.system}</span>
        </span>
      );
    case "harness":
      return <span className="text-text-soft">{s.harness}</span>;
    case "model":
      return <span className="text-text-soft">{displayModel(s.model)}</span>;
    case "data":
      return <span className="text-text-soft">{s.data || "—"}</span>;
    case "ann_ret":
      return <span className={clsNum(s.ann_ret)}>{fmtPct(s.ann_ret, 1)}</span>;
    case "ann_sharpe":
      return <span className={clsNum(s.ann_sharpe)}>{fmtNum(s.ann_sharpe, 2)}</span>;
    case "ann_ir":
      return <span className={clsNum(s.ann_ir)}>{fmtNum(s.ann_ir, 2)}</span>;
    case "mean_ic":
      return <span className="text-text-soft">{fmtNum(s.mean_ic, 3)}</span>;
    case "residual_ic":
      return <span className="text-text-soft">{fmtNum(s.residual_ic, 3)}</span>;
    case "ann_vol":
      return <span className="text-text-soft">{fmtPct(s.ann_vol, 1)}</span>;
    case "cost_usd":
      return <span className="text-text-soft">{fmtUsd(s.cost_usd)}</span>;
  }
}
