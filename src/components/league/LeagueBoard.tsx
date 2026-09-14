"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LeagueAxisTable } from "./LeagueAxisTable";
import { LeagueCatBars } from "./LeagueCatBars";
import { LeaguePills } from "./LeaguePills";
import { LeagueRadar } from "./LeagueRadar";
import { LeagueScatter } from "./LeagueScatter";
import { LeagueSimHeat } from "./LeagueSimHeat";
import { LeagueTimeChart } from "./LeagueTimeChart";
import { clsNum, displayModel, fmtNum, fmtPct, fmtUsd } from "./format";
import {
  HX_INVERT,
  HX_METRIC_IDS,
  availableCharts,
  cumRet,
  driverScatter,
  harnessTwins,
  needsBook,
  tsMean,
  underwater,
  yCols,
  yValue,
  type LgMetric,
  type LineSeries,
  type YCol,
} from "./lab";
import type { LeaguePublic, LeagueRadarPack } from "./types";

function tiltScale(values: (number | null)[]): { lo: number; hi: number } {
  const abs = values.filter((v): v is number => v != null && Number.isFinite(v)).map((v) => Math.abs(v));
  const peak = abs.length ? Math.max(...abs) : 0;
  const x = Math.max(peak * 1.08, 1e-6);
  const exp = 10 ** Math.floor(Math.log10(x));
  const n = x / exp;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  const a = nice * exp;
  return { lo: -a, hi: a };
}

function bookLab(data: LeaguePublic, book: string) {
  const lab = data.lab;
  if (!lab) return book;
  return lab.book_labels[book] || lab.books.find((b) => b.id === book)?.label || book;
}

function hxFmt(col: YCol, v: number | null) {
  if (v == null || Number.isNaN(v)) return "—";
  if (col.id === "mean_ic" || col.id === "residual_ic") return fmtNum(v, 4);
  if (col.kind === "pct") return fmtPct(v, 1);
  if (col.kind === "usd") return fmtUsd(v);
  if (col.kind === "int") return String(Math.round(v));
  return fmtNum(v, 2);
}

export function LeagueBoard({ data }: { data: LeaguePublic }) {
  const lab = data.lab;
  const charts = useMemo(() => availableCharts(data), [data]);
  const [metric, setMetric] = useState<LgMetric>(charts[0]?.id ?? "ret");
  const [book, setBook] = useState(lab?.default_book || "mvo");
  const [h, setH] = useState(lab?.horizons?.[0] || "1");
  const [simMetric, setSimMetric] = useState(lab?.sim.metrics?.[0]?.id || "xs");
  const [harness, setHarness] = useState("all");
  const [company, setCompany] = useState(lab?.ratings.universe?.[0] || "");
  const [yCol, setYCol] = useState("ann_ir");

  if (!lab) {
    return <p className="text-sm text-text-muted">Rebuild the eval snapshot to load charts.</p>;
  }

  const active = charts.find((c) => c.id === metric) || charts[0];
  const current: LgMetric = active?.id ?? "ret";
  const ids = data.table_ids.filter((id) => data.systems.some((s) => s.id === id));
  const books =
    current === "factor" || current === "sector"
      ? lab.books.filter((b) => ids.some((k) => lab.exposure.runs[k]?.[b.id]))
      : needsBook(current)
        ? lab.books
        : [];
  const setBookSafe = books.some((b) => b.id === book) ? book : books[0]?.id || lab.default_book;
  const cols = yCols(data);
  const ySpec = cols.find((c) => c.id === yCol) || cols[0];
  const bookLabel = bookLab(data, setBookSafe);

  const runSeries = (ptsFn: (id: string) => { x: string; y: number }[]): LineSeries[] =>
    ids
      .map((id) => {
        const s = data.systems.find((row) => row.id === id);
        return {
          id,
          label: s?.system || id,
          color: s?.color || "#6f93cf",
          pts: ptsFn(id) || [],
        };
      })
      .filter((s) => s.pts.length);

  let title: string = active?.label || "charts";
  let hint = "";
  let body: ReactNode = null;

  if (current === "ret") {
    title = `cumulative return — ${bookLabel}`;
    hint = "Every run on one holdings book, plus the price-weighted DJIA (dashed).";
    const series = runSeries((k) => cumRet(lab.runs[k]?.nav?.[setBookSafe]));
    if (lab.pw_nav.length) {
      series.push({
        id: "pw",
        label: "DJIA PW",
        color: "#6b7a8e",
        dashed: true,
        pts: cumRet(lab.pw_nav),
      });
    }
    body = <LeagueTimeChart title={title} series={series} yPct zero />;
  } else if (current === "dd") {
    title = `underwater — ${bookLabel}`;
    hint = "Drawdown from peak NAV. One series per run.";
    body = (
      <LeagueTimeChart
        title={title}
        series={runSeries((k) => underwater(lab.runs[k]?.nav?.[setBookSafe]))}
        yPct
        zero
      />
    );
  } else if (current === "ic") {
    title = `Spearman IC — h=${h}`;
    hint = "h is decision-grid steps, not calendar time. Rank correlation (not annualized).";
    const series = runSeries((k) =>
      (lab.runs[k]?.ic?.[h] || []).map((p) => ({ x: p.date, y: p.ic })),
    );
    const dates = [...new Set(series.flatMap((s) => s.pts.map((p) => p.x)))].sort();
    body = (
      <LeagueCatBars
        title={title}
        categories={dates}
        series={series.map((s) => ({
          id: s.id,
          label: s.label,
          color: s.color,
          values: dates.map((d) => s.pts.find((p) => p.x === d)?.y ?? null),
        }))}
        format="number"
        zero
        rotateX
        height={360}
      />
    );
  } else if (current === "resid") {
    title = "residual IC";
    hint = `FF6-neutralized Spearman on h=1 only.${lab.residual_note ? ` ${lab.residual_note}` : ""}`;
    const series = runSeries((k) =>
      (lab.runs[k]?.residual_ic || []).map((p) => ({ x: p.date, y: p.ic })),
    );
    const dates = [...new Set(series.flatMap((s) => s.pts.map((p) => p.x)))].sort();
    body = (
      <LeagueCatBars
        title={title}
        categories={dates}
        series={series.map((s) => ({
          id: s.id,
          label: s.label,
          color: s.color,
          values: dates.map((d) => s.pts.find((p) => p.x === d)?.y ?? null),
        }))}
        format="number"
        zero
        rotateX
        height={360}
      />
    );
  } else if (current === "factor" || current === "sector") {
    const kind = current;
    const keys = kind === "factor" ? lab.exposure.factors : lab.exposure.sectors;
    const labs = kind === "factor" ? lab.exposure.factor_labels : lab.exposure.sector_codes;
    title = `mean active ${kind} exposure — ${bookLabel}`;
    hint =
      kind === "factor"
        ? "One radar per agent: mean holdings-weighted PIT FF6 beta minus DJIA PW. Corners share one axis. Grouped bars below."
        : "One radar per agent: mean GICS weight minus DJIA PW. Corners share one axis. Grouped bars below.";
    const isPct = kind === "sector";
    const profiles = ids
      .map((k) => {
        const s = data.systems.find((row) => row.id === k);
        const pack = lab.exposure.runs[k]?.[setBookSafe];
        const values = keys.map((key) => tsMean((pack?.[kind] || {})[key]));
        return {
          id: k,
          label: s?.system || k,
          color: s?.color || "#6f93cf",
          values,
        };
      })
      .filter((p) => p.values.some((v) => v != null));
    const { lo, hi } = tiltScale(profiles.flatMap((p) => p.values));
    const radarPack: LeagueRadarPack = {
      title,
      caption: "",
      lo,
      hi,
      format: isPct ? "pct" : "number",
      axes: keys.map((key) => ({ id: key, label: labs[key] || key })),
      series: profiles,
    };
    const fmt = (v: number | null) =>
      v == null ? "—" : isPct ? `${(100 * v).toFixed(1)}%` : v.toFixed(3);
    body = (
      <div>
        <p className="text-[11px] text-text-muted">
          Shared corners across every agent. Outer ring = +{fmt(hi)} vs DJIA PW · dashed = 0 ·
          center = {fmt(lo)}.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {profiles.map((p) => (
            <LeagueRadar
              key={p.id}
              pack={radarPack}
              values={p.values}
              color={p.color}
              label={p.label}
            />
          ))}
        </div>
        <div className="mt-6">
          <LeagueCatBars
            title={title}
            categories={keys.map((key) => labs[key] || key)}
            series={profiles.map((p) => ({
              id: p.id,
              label: p.label,
              color: p.color,
              values: p.values,
            }))}
            format={isPct ? "pct" : "number"}
            zero
            height={360}
          />
        </div>
      </div>
    );
  } else if (current === "rating") {
    const names = lab.ratings.universe || [];
    const sym = names.includes(company) ? company : names[0] || "";
    title = sym ? `${sym} rating` : "company rating";
    hint =
      "Agent score (−1 to +1) for the selected name. Dropdown picks the company; each series is one agentic system.";
    body = (
      <LeagueTimeChart
        title={title}
        series={runSeries((k) =>
          (lab.ratings.runs[k]?.[sym] || []).map((p) => ({ x: p.date, y: p.score })),
        )}
        zero
      />
    );
  } else if (current === "sim") {
    const nSys = lab.sim.order.length;
    hint = `${nSys} systems, grouped fintel_GFA then OpenClaw. Opt is fintel_GFA. ${
      lab.sim.n_dates ? `${lab.sim.n_dates} overlapping dates. ` : ""
    }Same-harness blocks vs same-model twins.`;
    const twins = lab.sim.twins || [];
    body = (
      <div className="space-y-4">
        <LeagueSimHeat sim={lab.sim} metric={simMetric} />
        <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            which axis moves the book
          </h3>
          <p className="mt-1 text-[11px] text-text-muted">
            Mean off-diagonal similarity. Opt is fintel_GFA. Driven by whichever class is higher.
          </p>
          <div className="mt-3">
            <LeagueAxisTable rows={lab.sim.axis.length ? lab.sim.axis : data.axis} />
          </div>
        </div>
        {twins.length ? (
          <LeagueCatBars
            title="same model, different harness"
            categories={twins.map((t) => displayModel(t.model))}
            series={(lab.sim.metrics || []).map((m, i) => ({
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
            height={220}
          />
        ) : null}
      </div>
    );
  } else if (current === "hx") {
    const pack = harnessTwins(data);
    const hxCols = HX_METRIC_IDS.map((id) => cols.find((c) => c.id === id)).filter(
      (c): c is YCol => !!c,
    );
    const nH = pack.harnesses.length;
    hint = `${pack.twins.length} models on ${nH} harnesses. Grouped bars = same model. Holdings metrics use ${bookLabel}. Δ = ${pack.harnesses[1] || "B"} − ${pack.harnesses[0] || "A"}.`;
    const aH = pack.harnesses[0];
    const bH = pack.harnesses[1];
    body = (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
            {bH ? `${bH} − ${aH}` : "harness delta"}
          </h3>
          <p className="mt-1 text-[11px] text-text-muted">
            {bH
              ? `Same model on both harnesses. Green Δ means ${bH} is better (vol and cost inverted). Holdings metrics use the selected book.`
              : "Need two harnesses for a delta."}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="px-3 py-2 font-medium">model</th>
                  {hxCols.map((c) => (
                    <th key={c.id} className="px-3 py-2 text-right font-medium">
                      Δ {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pack.twins.map((t) => (
                  <tr key={t.model} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2 text-text">{displayModel(t.model)}</td>
                    {hxCols.map((col) => {
                      const a = aH ? yValue(data, t.keys[aH], col.id, setBookSafe) : null;
                      const b = bH ? yValue(data, t.keys[bH], col.id, setBookSafe) : null;
                      if (a == null || b == null) {
                        return (
                          <td key={col.id} className="px-3 py-2 text-right text-text-muted">
                            —
                          </td>
                        );
                      }
                      const d = b - a;
                      const invert = !!HX_INVERT[col.id];
                      return (
                        <td
                          key={col.id}
                          className={`px-3 py-2 text-right tabular-nums ${invert ? clsNum(-d) : clsNum(d)}`}
                        >
                          {hxFmt(col, d)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {hxCols.map((col) => (
            <LeagueCatBars
              key={col.id}
              title={col.label}
              categories={pack.twins.map((t) => displayModel(t.model))}
              series={pack.harnesses.map((hName) => ({
                id: hName,
                label: hName,
                color: data.harness_colors[hName] || "#6f93cf",
                values: pack.twins.map((t) => yValue(data, t.keys[hName], col.id, setBookSafe)),
              }))}
              format={col.kind === "pct" ? "pct" : col.kind === "usd" ? "usd" : "number"}
              zero
              height={240}
            />
          ))}
        </div>
      </div>
    );
  } else if (current === "drivers") {
    const axes = lab.aa_axes || [];
    const visibleN =
      harness === "all"
        ? ids.length
        : ids.filter((k) => data.systems.find((s) => s.id === k)?.analysis_harness === harness)
            .length;
    hint = `X = Artificial Analysis model metric (6 charts). Y = league table “${ySpec?.label || "column"}”. Harness ${harness} (${visibleN} systems). SW Long >0.0. OLS dashed. Source: Artificial Analysis.`;
    body = (
      <div className="grid gap-4 lg:grid-cols-2">
        {axes.map((ax) => (
          <LeagueScatter key={ax.id} chart={driverScatter(data, ax, ySpec || cols[0], harness)} />
        ))}
      </div>
    );
  } else if (current === "tools") {
    title = "data tool calls";
    hint =
      "Fintel data-tool calls by the agent (not submit_views). One stacked bar per tool-calling run; segments are tool kinds. Includes in-run retries and backfill. Pack-channel jobs have no agent tools.";
    const keys = ids.filter((k) => lab.tools.runs[k]?.n_calls);
    const cats = keys.map((k) => data.systems.find((s) => s.id === k)?.system || k);
    body = (
      <LeagueCatBars
        title={title}
        categories={cats}
        series={lab.tools.kinds.map((kind, i) => ({
          id: kind,
          label: kind,
          color: ["#6f93cf", "#e8924a", "#4cae86", "#c77dbb", "#e8c547", "#7eb8c9", "#d97a6c"][
            i % 7
          ],
          values: keys.map((k) => lab.tools.runs[k]?.by_tool?.[kind] || 0),
        }))}
        format="number"
        stack
        zero
        height={360}
      />
    );
  }

  const harnesses = [
    "all",
    ...[...new Set(data.systems.map((s) => s.analysis_harness))].sort((a, b) => {
      const pref = ["fintel_GFA", "OpenClaw"];
      const ia = pref.indexOf(a);
      const ib = pref.indexOf(b);
      return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib) || a.localeCompare(b);
    }),
  ];

  const showBooks = books.length > 0;
  const showH = current === "ic" && lab.horizons.length >= 2;
  const showSim = current === "sim" && (lab.sim.metrics || []).length > 0;
  const showHarness = current === "drivers";
  const showCompany = current === "rating" && lab.ratings.universe.length > 0;
  const showY = current === "drivers" && cols.length > 0;
  const showExtra = showBooks || showH || showSim || showHarness || showCompany || showY;

  return (
    <div>
      <h3 className="text-sm font-medium text-text">{active?.label}</h3>
      {hint ? <p className="mt-1 text-[12px] leading-relaxed text-text-muted">{hint}</p> : null}

      <div className="mt-4">
        <LeaguePills
          items={charts.map((c) => ({ id: c.id, label: c.label }))}
          value={current}
          onChange={(id) => setMetric(id as LgMetric)}
        />
        {showExtra ? (
          <div
            className={`mt-3 space-y-3 ${
              showBooks ? "border-t border-border pt-3" : ""
            }`}
          >
            <LeaguePills
              hidden={!showBooks}
              items={books.map((b) => ({ id: b.id, label: b.label }))}
              value={setBookSafe}
              onChange={setBook}
            />
            <LeaguePills
              hidden={!showH}
              items={lab.horizons.map((hz) => ({ id: hz, label: `h=${hz}` }))}
              value={h}
              onChange={setH}
            />
            <LeaguePills
              hidden={!showSim}
              items={(lab.sim.metrics || []).map((m) => ({ id: m.id, label: m.label }))}
              value={simMetric}
              onChange={setSimMetric}
            />
            <LeaguePills
              hidden={!showHarness}
              items={harnesses.map((hName) => ({ id: hName, label: hName }))}
              value={harness}
              onChange={setHarness}
            />
            {showCompany ? (
              <label className="flex items-center gap-2 text-xs text-text-muted">
                company
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-md border border-border bg-surface-2 px-2 py-1 text-text"
                >
                  {lab.ratings.universe.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {showY ? (
              <label className="flex items-center gap-2 text-xs text-text-muted">
                table column
                <select
                  value={ySpec?.id}
                  onChange={(e) => setYCol(e.target.value)}
                  className="rounded-md border border-border bg-surface-2 px-2 py-1 text-text"
                >
                  {cols.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6">{body}</div>
    </div>
  );
}
