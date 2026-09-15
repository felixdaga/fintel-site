"use client";

import { useState } from "react";
import { clsNum, displayModel, fmtNum, fmtPct, fmtUsd } from "./format";
import { holdingSeries, tiltScale, tsMean, type LineSeries } from "./lab";
import { LeagueCatBars, LeagueRadar, LeagueTimeChart } from "./charts";
import type { LeaguePublic, LeagueRadarPack, LeagueSystem } from "./types";

type MetricFmt = "pct" | "num" | "usd" | "int" | "ic" | "t";

const RESUME_METRICS: { key: keyof LeagueSystem; label: string; fmt: MetricFmt }[] = [
  { key: "total", label: "total ret", fmt: "pct" },
  { key: "ann_ret", label: "ann ret", fmt: "pct" },
  { key: "ann_sharpe", label: "sharpe", fmt: "num" },
  { key: "ann_vol", label: "vol", fmt: "pct" },
  { key: "max_dd", label: "max dd", fmt: "pct" },
  { key: "mean_ic", label: "IC", fmt: "ic" },
  { key: "t_stat", label: "IC t", fmt: "t" },
  { key: "residual_ic", label: "resid IC", fmt: "ic" },
  { key: "residual_t", label: "resid t", fmt: "t" },
  { key: "ff_r2", label: "FF R²", fmt: "num" },
  { key: "cost_usd", label: "eval cost", fmt: "usd" },
  { key: "n_periods", label: "periods", fmt: "int" },
  { key: "n_cells", label: "cells", fmt: "int" },
  { key: "intelligence_index", label: "AA IQ", fmt: "num" },
  { key: "omniscience_accuracy", label: "accuracy", fmt: "pct" },
  { key: "hallucination_rate", label: "halluc.", fmt: "pct" },
];

export function LeagueResume({ data, system: s }: { data: LeaguePublic; system: LeagueSystem }) {
  const lab = data.lab;
  const book = data.book;
  const ret = lab
    ? holdingSeries(lab, s.id, "ret", { agentColor: s.color, highlightBook: book })
    : [];
  const dd = lab
    ? holdingSeries(lab, s.id, "dd", { agentColor: s.color, highlightBook: book })
    : [];
  const icRows = lab?.runs[s.id]?.ic?.["1"] || [];
  const residRows = lab?.runs[s.id]?.residual_ic || [];

  return (
    <div className="space-y-5 px-1 py-2 sm:px-2">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">resume</p>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-text sm:text-lg">
          {s.system}
        </h3>
        <p className="mt-1 text-[12px] text-text-muted">
          {s.harness} · {displayModel(s.model)} · {s.data || "—"}
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="min-w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {RESUME_METRICS.map((m) => (
                <th key={m.key} className="whitespace-nowrap px-2.5 py-2 text-right font-medium">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {RESUME_METRICS.map((m) => (
                <td key={m.key} className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">
                  <Metric s={s} field={m} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {ret.length ? <HoldingsKey series={ret} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <LeagueTimeChart title="cumulative return" series={ret} yPct zero height={240} />
        <LeagueTimeChart title="underwater" series={dd} yPct zero height={240} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LeagueCatBars
          title="Spearman IC · h=1"
          categories={icRows.map((p) => p.date)}
          series={[
            {
              id: s.id,
              label: s.short || s.system,
              color: s.color,
              values: icRows.map((p) => p.ic),
            },
          ]}
          format="number"
          zero
          rotateX
          height={240}
        />
        <LeagueCatBars
          title="residual IC · FF6"
          categories={residRows.map((p) => p.date)}
          series={[
            {
              id: `${s.id}-resid`,
              label: s.short || s.system,
              color: s.color,
              values: residRows.map((p) => p.ic),
            },
          ]}
          format="number"
          zero
          rotateX
          height={240}
        />
      </div>

      {lab ? <ExposureCorners lab={lab} system={s} book={book} /> : null}
      {lab ? <RatingLine lab={lab} system={s} /> : null}
      <SummaryTable rows={s.summary || []} />
    </div>
  );
}

const HOLDING_HINTS: Record<string, string> = {
  "sw_0.0": "Long every name scored above zero; bigger score, bigger weight. This is the scoreboard book.",
  "sw_0.3": "Same construction, but only high-conviction names (score > 0.3).",
  naive_tilt: "Overweight names the agent likes and underweight names it dislikes versus the benchmark — no optimizer.",
  mvo: "Mean-variance optimized portfolio from the agent rating: concentrates where return versus risk looks best.",
  pw: "Price-weighted DJIA on the same dates.",
};

function HoldingsKey({ series }: { series: LineSeries[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">holdings</p>
      <ul className="mt-2 space-y-1.5">
        {series.map((row) => (
          <li key={row.id} className="flex items-start gap-2 text-[12px] leading-snug text-text-soft">
            {row.dashed ? (
              <span
                className="mt-2 inline-block h-0 w-3 shrink-0 border-t-2 border-dashed"
                style={{ borderColor: row.color }}
              />
            ) : (
              <span
                className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: row.color }}
              />
            )}
            <span>
              <span className="font-medium text-text">{row.label}.</span>
              {HOLDING_HINTS[row.id] ? ` ${HOLDING_HINTS[row.id]}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({
  s,
  field,
}: {
  s: LeagueSystem;
  field: (typeof RESUME_METRICS)[number];
}) {
  const raw = s[field.key];
  const v = typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  if (field.fmt === "t") {
    if (v == null) return <span className="text-text-muted">—</span>;
    return <span className={v > 3 ? "text-positive" : clsNum(v)}>{v.toFixed(2)}</span>;
  }
  if (field.fmt === "ic") return <span className="text-text-soft">{fmtNum(v, 3)}</span>;
  if (field.fmt === "pct") return <span className={clsNum(v)}>{fmtPct(v, 1)}</span>;
  if (field.fmt === "usd") return <span className="text-text-soft">{fmtUsd(v)}</span>;
  if (field.fmt === "int") {
    return <span className="text-text-muted">{v == null ? "—" : String(Math.round(v))}</span>;
  }
  return <span className={clsNum(v)}>{fmtNum(v, 2)}</span>;
}

function ExposureCorners({
  lab,
  system: s,
  book,
}: {
  lab: NonNullable<LeaguePublic["lab"]>;
  system: LeagueSystem;
  book: string;
}) {
  const pack = lab.exposure.runs[s.id];
  const bookId = pack?.[book] ? book : Object.keys(pack || {})[0];
  if (!bookId || !pack?.[bookId]) return null;
  const bookLabel = lab.book_labels[bookId] || bookId;

  const factorColor = "#6f93cf";
  const sectorColor = "#e8924a";
  const factor = cornerPack({
    title: `active factor exposure — ${bookLabel}`,
    keys: lab.exposure.factors,
    labels: lab.exposure.factor_labels,
    rows: pack[bookId].factor,
    format: "number",
    color: factorColor,
    label: s.short || s.system,
  });
  const sector = cornerPack({
    title: `active sector exposure — ${bookLabel}`,
    keys: lab.exposure.sectors,
    labels: lab.exposure.sector_codes,
    rows: pack[bookId].sector,
    format: "pct",
    color: sectorColor,
    label: s.short || s.system,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {factor ? (
        <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            {factor.pack.title}
          </figcaption>
          <p className="mt-1 text-[11px] text-text-muted">
            Mean holdings-weighted PIT FF6 beta minus DJIA PW. Dashed ring is zero.
          </p>
          <div className="mt-3">
            <LeagueRadar
              pack={factor.pack}
              values={factor.values}
              color={factorColor}
              label={s.short || s.system}
            />
          </div>
        </figure>
      ) : null}
      {sector ? (
        <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            {sector.pack.title}
          </figcaption>
          <p className="mt-1 text-[11px] text-text-muted">
            Mean GICS weight minus DJIA PW. Dashed ring is zero.
          </p>
          <div className="mt-3">
            <LeagueRadar
              pack={sector.pack}
              values={sector.values}
              color={sectorColor}
              label={s.short || s.system}
            />
          </div>
        </figure>
      ) : null}
    </div>
  );
}

function cornerPack({
  title,
  keys,
  labels,
  rows,
  format,
  color,
  label,
}: {
  title: string;
  keys: string[];
  labels: Record<string, string>;
  rows: Record<string, { date: string; y: number }[]>;
  format: "number" | "pct";
  color: string;
  label: string;
}): { pack: LeagueRadarPack; values: (number | null)[] } | null {
  const values = keys.map((key) => tsMean(rows?.[key]));
  if (!values.some((v) => v != null)) return null;
  const { lo, hi } = tiltScale(values);
  return {
    values,
    pack: {
      title,
      caption: "",
      lo,
      hi,
      format,
      axes: keys.map((key) => ({ id: key, label: labels[key] || key })),
      series: [{ id: label, label, color, values }],
    },
  };
}

function RatingLine({
  lab,
  system: s,
}: {
  lab: NonNullable<LeaguePublic["lab"]>;
  system: LeagueSystem;
}) {
  const byName = lab.ratings.runs[s.id] || {};
  const names = (lab.ratings.universe || []).filter((n) => byName[n]?.length);
  const [ticker, setTicker] = useState(names[0] || "");
  const sym = names.includes(ticker) ? ticker : names[0] || "";
  const pts = (byName[sym] || []).map((p) => ({ x: p.date, y: p.score }));
  if (!names.length) return null;
  return (
    <LeagueTimeChart
      title="company rating"
      series={[{ id: s.id, label: sym, color: s.color, pts }]}
      zero
      height={240}
      action={
        <label className="flex items-center gap-2 text-xs text-text-muted">
          ticker
          <select
            value={sym}
            onChange={(e) => setTicker(e.target.value)}
            className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[12px] text-text"
          >
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      }
    />
  );
}

function SummaryTable({
  rows,
}: {
  rows: NonNullable<LeagueSystem["summary"]>;
}) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <p className="px-3 pt-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        strengths and weaknesses
      </p>
      <table className="mt-1 min-w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-border text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <th className="whitespace-nowrap px-3 py-2 font-medium">side</th>
            <th className="whitespace-nowrap px-3 py-2 font-medium">aspect</th>
            <th className="px-3 py-2 font-medium">pattern</th>
            <th className="px-3 py-2 font-medium">evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.side}-${row.aspect}-${i}`} className="border-b border-border last:border-0">
              <td className="whitespace-nowrap px-3 py-2 align-top">
                <span className={row.side.toLowerCase() === "strength" ? "text-positive" : "text-negative"}>
                  {row.side}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-2 align-top font-medium text-text">{row.aspect}</td>
              <td className="px-3 py-2 align-top leading-snug text-text-soft">{row.pattern}</td>
              <td className="px-3 py-2 align-top leading-snug text-text-muted">{row.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
