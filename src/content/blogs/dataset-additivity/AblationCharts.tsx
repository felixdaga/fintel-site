"use client";

import seriesJson from "./series.json";
import { postContent } from "./data";
import { StrongText } from "@/components/landing/Mark";
import { LeagueCatBars, LeagueTimeChart } from "@/components/scoreboard/charts";
import { cumRet, underwater, type LineSeries } from "@/components/scoreboard/lab";
import exposureJson from "./exposure.json";
import nameScatterJson from "./name_scatter.json";

type BookSeries = {
  dates: string[];
  base: number[];
  bii: number[];
  pw: number[];
};

const BOOKS = seriesJson.books as Record<string, BookSeries>;
const IC = seriesJson.ic as { dates: string[]; base: number[]; bii: number[] };

function points(dates: string[], nav: number[]) {
  return dates.map((date, i) => ({ date, nav: nav[i] }));
}

function pathSeries(data: BookSeries, panel: "nav" | "dd"): LineSeries[] {
  const { series } = postContent;
  const map = panel === "nav" ? cumRet : underwater;
  const lines: LineSeries[] = [
    { id: "base", label: series.base, color: series.colors.base, pts: map(points(data.dates, data.base)) },
    { id: "bii", label: series.bii, color: series.colors.bii, pts: map(points(data.dates, data.bii)) },
  ];
  if (panel === "nav") {
    lines.push({
      id: "pw",
      label: series.pw,
      color: series.colors.pw,
      dashed: true,
      pts: map(points(data.dates, data.pw)),
    });
  }
  return lines;
}

export function AblationCharts({ books, panel }: { books: readonly string[]; panel: "nav" | "dd" }) {
  const shown = postContent.charts.books.filter((book) => books.includes(book.id));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {shown.map((book) => (
        <LeagueTimeChart
          key={book.id}
          title={book.title}
          series={pathSeries(BOOKS[book.id], panel)}
          yPct
          zero
          height={240}
        />
      ))}
    </div>
  );
}

type ExposureSide = {
  axes: { id: string; label: string }[];
  base: number[];
  bii: number[];
};

const EXPOSURE = exposureJson as {
  factor: ExposureSide;
  sector: ExposureSide;
};

export function ExposureChart({ kind, note }: { kind: "factor" | "sector"; note?: string }) {
  const side = kind === "factor" ? EXPOSURE.factor : EXPOSURE.sector;
  const { series } = postContent;
  return (
    <LeagueCatBars
      title={kind === "factor" ? "Mean active factor exposure" : "Mean active sector exposure"}
      categories={side.axes.map((axis) => axis.label)}
      series={[
        { id: "base", label: series.base, color: series.colors.base, values: side.base },
        { id: "bii", label: series.bii, color: series.colors.bii, values: side.bii },
      ]}
      format={kind === "factor" ? "number" : "pct"}
      zero
      height={280}
      note={note}
    />
  );
}

const SCATTER = nameScatterJson as {
  names: { symbol: string; sector: string; delta_bps: number; note_bps: number; ret: number | null }[];
};

const SECTOR_COLOR: Record<string, [string, string]> = {
  "Information Technology": ["IT", "#6f93cf"],
  Financials: ["FIN", "#e8924a"],
  "Health Care": ["HC", "#4cae86"],
  "Consumer Discretionary": ["CD", "#c77dbb"],
  Industrials: ["IND", "#e8c547"],
  "Consumer Staples": ["CS", "#7eb8c9"],
  "Communication Services": ["COMM", "#d97a6c"],
  Materials: ["MAT", "#8aa9df"],
  Energy: ["EN", "#b7c4a1"],
};

export function NameScatter() {
  const rows = SCATTER.names.filter((row) => row.ret != null);
  const W = 760;
  const H = 420;
  const pad = { l: 58, r: 28, t: 28, b: 52 };
  const xs = rows.map((row) => row.delta_bps);
  const ys = rows.map((row) => 100 * (row.ret as number));
  let xmin = Math.min(...xs, 0);
  let xmax = Math.max(...xs, 0);
  let ymin = Math.min(...ys, 0);
  let ymax = Math.max(...ys, 0);
  const xspan = xmax - xmin || 1;
  const yspan = ymax - ymin || 1;
  xmin -= xspan * 0.08;
  xmax += xspan * 0.12;
  ymin -= yspan * 0.08;
  ymax += yspan * 0.1;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (v: number) => pad.l + ((v - xmin) / (xmax - xmin)) * iw;
  const y = (v: number) => pad.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const maxAbs = rows.reduce((max, row) => Math.max(max, Math.abs(row.note_bps)), 1);
  const radius = (bps: number) => 5 + 20 * Math.sqrt(Math.abs(bps) / maxAbs);
  const ticks = (lo: number, hi: number) => Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  const seen = [...new Set(rows.map((row) => row.sector))];

  return (
    <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        <StrongText text="Weight gap vs stock return" />
      </figcaption>
      <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
        <StrongText text="Score-weighted portfolio. The horizontal axis is the Commentary active weight minus the basic-fundamental active weight. The vertical axis is the stock's compounded return. Bubble size is the absolute Commentary active weight." />
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-auto w-full" role="img" aria-label="Weight gap versus stock return">
        {ticks(ymin, ymax).map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={pad.l} x2={W - pad.r} y1={y(tick)} y2={y(tick)} stroke="var(--border)" strokeWidth={1} />
            <text x={pad.l - 8} y={y(tick) + 3} textAnchor="end" fill="var(--text-muted)" fontSize={10}>
              {`${tick.toFixed(0)}%`}
            </text>
          </g>
        ))}
        {ticks(xmin, xmax).map((tick) => (
          <text key={`x-${tick}`} x={x(tick)} y={H - 18} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>
            {`${tick.toFixed(0)}`}
          </text>
        ))}
        {xmin < 0 && xmax > 0 ? (
          <line x1={x(0)} x2={x(0)} y1={pad.t} y2={H - pad.b} stroke="var(--border-strong)" strokeWidth={1} />
        ) : null}
        {ymin < 0 && ymax > 0 ? (
          <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="var(--border-strong)" strokeWidth={1} />
        ) : null}
        {rows.map((row) => {
          const color = SECTOR_COLOR[row.sector]?.[1] ?? "#6f93cf";
          const r = radius(row.note_bps);
          const cx = x(row.delta_bps);
          const cy = y(100 * (row.ret as number));
          return (
            <g key={row.symbol}>
              <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.85} stroke="var(--bg)" strokeWidth={1} />
              <text x={cx + r + 3} y={cy - 4} fill="var(--text-soft)" fontSize={11}>
                {row.symbol}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-muted">
        {seen.map((sector) => (
          <span key={sector} className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full" style={{ background: SECTOR_COLOR[sector]?.[1] ?? "#6f93cf" }} />
            {SECTOR_COLOR[sector]?.[0] ?? sector}
          </span>
        ))}
      </div>
    </figure>
  );
}

export function IcChart() {
  const { series } = postContent;
  return (
    <LeagueCatBars
      title={postContent.charts.icTitle}
      categories={IC.dates}
      series={[
        { id: "base", label: series.base, color: series.colors.base, values: [...IC.base] },
        { id: "bii", label: series.bii, color: series.colors.bii, values: [...IC.bii] },
      ]}
      format="number"
      zero
      rotateX
      height={240}
    />
  );
}
