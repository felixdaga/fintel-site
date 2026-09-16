"use client";

import { useState, type ReactNode } from "react";
import { clsNum, displayModel, fmtNum, fmtPct, fmtUsd } from "./format";
import { cumRet, holdingSeries, isPick, tiltScale, tsMean, type LineSeries } from "./lab";
import { bookLabel, isBookTest, tableBookId, testLabel } from "./league_keys";
import { LEAGUE_COPY } from "./league_texts";
import { LeagueCatBars, LeagueRadar, LeagueTimeChart } from "./charts";
import type { LeaguePublic, LeagueRadarPack, LeagueStochasticity, LeagueSystem } from "./types";

type MetricFmt = "pct" | "num" | "usd" | "int" | "ic" | "t";

const IC_METRIC_KEYS = new Set<keyof LeagueSystem>([
  "mean_ic",
  "t_stat",
  "residual_ic",
  "residual_t",
  "ff_r2",
]);

const RESUME_METRICS: { key: keyof LeagueSystem; label: string; fmt: MetricFmt }[] = [
  { key: "ann_ir", label: testLabel("ann_ir", "IR"), fmt: "num" },
  { key: "total", label: testLabel("total", "total ret"), fmt: "pct" },
  { key: "ann_ret", label: testLabel("ann_ret", "ann ret"), fmt: "pct" },
  { key: "ann_sharpe", label: testLabel("ann_sharpe", "sharpe"), fmt: "num" },
  { key: "ann_vol", label: testLabel("ann_vol", "vol"), fmt: "pct" },
  { key: "max_dd", label: testLabel("max_dd", "max dd"), fmt: "pct" },
  { key: "mean_ic", label: testLabel("mean_ic", "IC"), fmt: "ic" },
  { key: "t_stat", label: testLabel("t_stat", "IC t"), fmt: "t" },
  { key: "residual_ic", label: testLabel("residual_ic", "resid IC"), fmt: "ic" },
  { key: "residual_t", label: testLabel("residual_t", "resid t"), fmt: "t" },
  { key: "ff_r2", label: testLabel("ff_r2", "FF R²"), fmt: "num" },
  { key: "cost_usd", label: testLabel("cost_usd", "eval cost"), fmt: "usd" },
  { key: "n_periods", label: testLabel("n_periods", "periods"), fmt: "int" },
  { key: "n_cells", label: testLabel("n_cells", "cells"), fmt: "int" },
  { key: "intelligence_index", label: testLabel("intelligence_index", "AA IQ"), fmt: "num" },
  { key: "omniscience_accuracy", label: testLabel("omniscience_accuracy", "accuracy"), fmt: "pct" },
  { key: "hallucination_rate", label: testLabel("hallucination_rate", "halluc."), fmt: "pct" },
];

const REPEAT_COLORS = ["#8aa9df", "#e8c547", "#d97a6c", "#4cae86", "#c77dbb"];
const ENSEMBLE_COLOR = "#6b7a8e";

export function LeagueResume({ data, system: s }: { data: LeaguePublic; system: LeagueSystem }) {
  const lab = data.lab;
  const pick = isPick(s);
  const metrics = pick ? RESUME_METRICS.filter((m) => !IC_METRIC_KEYS.has(m.key)) : RESUME_METRICS;
  const book = s.book || tableBookId(s.strategy);
  const bookName = bookLabel(book);
  const ret = lab
    ? holdingSeries(lab, s.id, "ret", { agentColor: s.color, highlightBook: book })
    : [];
  const dd = lab
    ? holdingSeries(lab, s.id, "dd", { agentColor: s.color, highlightBook: book })
    : [];
  const icRows = lab?.runs[s.id]?.ic?.["1"] || [];
  const residRows = lab?.runs[s.id]?.residual_ic || [];
  const sto = lab?.runs[s.id]?.stochasticity;

  return (
    <div className="min-w-0 max-w-full space-y-5 py-2">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">resume</p>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-text sm:text-lg">
          {s.system}
        </h3>
        <p className="mt-1 text-[12px] text-text-muted">
          {[s.analysis_harness || s.harness, displayModel(s.model), s.strategy, s.data, ...setupBits(data)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-border bg-surface px-3 py-3 sm:hidden">
        {metrics.map((m) => (
          <div key={m.key} className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {m.label}
            </p>
            <p className="mt-0.5 truncate text-[13px] tabular-nums">
              <Metric s={s} field={m} note={isBookTest(String(m.key)) ? bookName : undefined} />
            </p>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface sm:block">
        <table className="min-w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {metrics.map((m) => (
                <th key={m.key} className="whitespace-nowrap px-2.5 py-2 text-right font-medium">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {metrics.map((m) => (
                <td key={m.key} className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">
                  <Metric s={s} field={m} note={isBookTest(String(m.key)) ? bookName : undefined} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <LeagueTimeChart
          title={LEAGUE_COPY.charts.cum_ret.title}
          hint={LEAGUE_COPY.charts.cum_ret.hint}
          series={ret}
          yPct
          zero
          height={240}
        />
        <LeagueTimeChart title={LEAGUE_COPY.charts.underwater.title} series={dd} yPct zero height={240} />
      </div>

      {pick ? (
        <PickStochasticity sto={sto} />
      ) : (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <LeagueCatBars
            title={LEAGUE_COPY.charts.ic.title}
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
            title={LEAGUE_COPY.charts.residual.title}
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
      )}

      {lab ? <ExposureCorners lab={lab} system={s} book={book} /> : null}
      {lab && !pick ? <RatingLine lab={lab} system={s} /> : null}
      <SummaryTable rows={s.summary || []} />
    </div>
  );
}

function PickStochasticity({ sto }: { sto: LeagueStochasticity | undefined }) {
  if (!sto || sto.nav.length < 2) return null;
  const series: LineSeries[] = sto.nav.map((row, i) => ({
    id: row.label || `r${row.k || i + 1}`,
    label: row.label || `r${row.k || i + 1}`,
    color: REPEAT_COLORS[i % REPEAT_COLORS.length],
    pts: cumRet(row.pts),
  }));
  if (sto.ensemble?.length) {
    series.push({
      id: "ensemble",
      label: "ensemble",
      color: ENSEMBLE_COLOR,
      dashed: true,
      pts: cumRet(sto.ensemble),
    });
  }
  const labels = sto.labels?.length ? sto.labels : sto.nav.map((r) => r.label);
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <LeagueTimeChart
        title={LEAGUE_COPY.charts.sto_return.title}
        hint={LEAGUE_COPY.charts.sto_return.hint}
        series={series}
        yPct
        zero
        height={240}
      />
      <HoldCorrTable labels={labels} matrix={sto.hold} />
    </div>
  );
}

function corrHeat(v: number | null): string {
  if (v == null) return "transparent";
  const t = Math.max(-1, Math.min(1, v));
  if (t >= 0) return `color-mix(in srgb, #4cae86 ${Math.round(t * 55)}%, var(--surface))`;
  return `color-mix(in srgb, #d97a6c ${Math.round(-t * 55)}%, var(--surface))`;
}

function HoldCorrTable({
  labels,
  matrix,
}: {
  labels: string[];
  matrix: (number | null)[][] | null | undefined;
}) {
  if (!labels.length || !matrix?.length) return null;
  return (
    <figure className="min-w-0 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        {LEAGUE_COPY.charts.hold_corr.title}
      </figcaption>
      <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
        {LEAGUE_COPY.charts.hold_corr.hint}
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-center text-[12px] tabular-nums">
          <thead>
            <tr>
              <th className="px-2 py-1.5 text-left text-[10px] font-medium uppercase tracking-wider text-text-muted" />
              {labels.map((lab) => (
                <th
                  key={lab}
                  className="whitespace-nowrap px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted"
                >
                  {lab}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((lab, i) => (
              <tr key={lab}>
                <th className="whitespace-nowrap px-2 py-1.5 text-left text-[11px] font-medium text-text">
                  {lab}
                </th>
                {labels.map((_, j) => {
                  const v = matrix[i]?.[j] ?? null;
                  return (
                    <td
                      key={`${i}-${j}`}
                      className={`px-2 py-1.5 ${i === j ? "text-text-muted" : "text-text"}`}
                      style={{ background: corrHeat(v) }}
                    >
                      {v == null ? "—" : v.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function cadenceFromGap(days: number): string {
  if (days <= 9) return "weekly";
  if (days <= 18) return "biweekly";
  if (days <= 40) return "monthly";
  if (days <= 120) return "quarterly";
  return `${Math.round(days)}-day`;
}

function medianGapDays(dates: string[]): number | null {
  const days = [...new Set(dates)]
    .map((d) => Date.parse(d.slice(0, 10)))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  if (days.length < 2) return null;
  const gaps = [];
  for (let i = 1; i < days.length; i += 1) {
    gaps.push((days[i] - days[i - 1]) / 86400000);
  }
  gaps.sort((a, b) => a - b);
  return gaps[Math.floor(gaps.length / 2)] ?? null;
}

function runDates(data: LeaguePublic): string[] {
  const out: string[] = [];
  for (const run of Object.values(data.lab?.runs || {})) {
    for (const pts of Object.values(run.nav || {})) {
      for (const p of pts) if (p.date) out.push(p.date);
    }
  }
  return out;
}

function setupBits(data: LeaguePublic): string[] {
  const w = data.window;
  const gap = w.median_gap_days ?? medianGapDays(runDates(data));
  const cadence = w.cadence || (gap != null ? cadenceFromGap(gap) : null);
  const nNames =
    w.n_cells && w.n_dates
      ? Math.round(w.n_cells / w.n_dates)
      : (w.universe?.length || data.lab?.ratings.universe.length || 0);
  const bits: string[] = [];
  if (w.start && w.end) bits.push(`${w.start} → ${w.end}`);
  else if (w.label) bits.push(w.label);
  if (cadence) bits.push(cadence);
  if (nNames) bits.push(`${nNames} names`);
  return bits;
}

function Metric({
  s,
  field,
  note,
}: {
  s: LeagueSystem;
  field: (typeof RESUME_METRICS)[number];
  note?: string;
}) {
  const raw = s[field.key];
  const v = typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  let value: ReactNode;
  if (field.fmt === "t") {
    value =
      v == null ? (
        <span className="text-text-muted">—</span>
      ) : (
        <span className={v > 3 ? "text-positive" : clsNum(v)}>{v.toFixed(2)}</span>
      );
  } else if (field.fmt === "ic") {
    value = <span className="text-text-soft">{fmtNum(v, 3)}</span>;
  } else if (field.fmt === "pct") {
    value = <span className={clsNum(v)}>{fmtPct(v, 1)}</span>;
  } else if (field.fmt === "usd") {
    value = <span className="text-text-soft">{fmtUsd(v)}</span>;
  } else if (field.fmt === "int") {
    value = <span className="text-text-muted">{v == null ? "—" : String(Math.round(v))}</span>;
  } else {
    value = <span className={clsNum(v)}>{fmtNum(v, 2)}</span>;
  }
  if (!note || v == null) return value;
  return (
    <span className="block">
      {value}
      <span className="mt-0.5 block text-[10px] font-normal text-text-muted">({note})</span>
    </span>
  );
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
  const heldLabel = lab.book_labels[bookId] || bookLabel(bookId);

  const factorColor = "#6f93cf";
  const sectorColor = "#e8924a";
  const factor = cornerPack({
    title: `${LEAGUE_COPY.charts.factor.title} — ${heldLabel}`,
    keys: lab.exposure.factors,
    labels: lab.exposure.factor_labels,
    rows: pack[bookId].factor,
    format: "number",
    color: factorColor,
    label: s.short || s.system,
  });
  const sector = cornerPack({
    title: `${LEAGUE_COPY.charts.sector.title} — ${heldLabel}`,
    keys: lab.exposure.sectors,
    labels: lab.exposure.sector_codes,
    rows: pack[bookId].sector,
    format: "pct",
    color: sectorColor,
    label: s.short || s.system,
  });

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {factor ? (
        <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            {factor.pack.title}
          </figcaption>
          <p className="mt-1 text-[11px] text-text-muted">
            {LEAGUE_COPY.charts.factor.hint}
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
            {LEAGUE_COPY.charts.sector.hint}
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
      title={LEAGUE_COPY.charts.rating.title}
      series={[{ id: s.id, label: sym, color: s.color, pts }]}
      zero
      height={240}
      action={
        <label className="flex min-w-0 max-w-full items-center gap-2 text-xs text-text-muted">
          ticker
          <select
            value={sym}
            onChange={(e) => setTicker(e.target.value)}
            className="max-w-[9rem] rounded-md border border-border bg-surface px-2 py-1 font-mono text-[12px] text-text"
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
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
      <p className="px-3 pt-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        strengths and weaknesses
      </p>
      <div className="space-y-3 px-3 py-3 sm:hidden">
        {rows.map((row, i) => (
          <div key={`${row.side}-${row.aspect}-${i}`} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] font-medium text-text">{row.aspect}</p>
              <p
                className={`shrink-0 text-[11px] ${
                  row.side.toLowerCase() === "strength" ? "text-positive" : "text-negative"
                }`}
              >
                {row.side}
              </p>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-text-soft">{row.pattern}</p>
            <p className="mt-1 text-[12px] leading-snug text-text-muted">{row.evidence}</p>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
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
    </div>
  );
}
