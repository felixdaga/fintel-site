"use client";

import { useState, type ReactNode } from "react";
import { StrongText, unstrong } from "@/components/landing/Mark";
import { fmtChart } from "./format";
import { overlaySeries, type LineSeries } from "./lab";
import { LEAGUE_COPY } from "./league_texts";
import type {
  LeaguePublic,
  LeagueRadarPack,
  LeagueScatterChart as ScatterSpec,
} from "./types";

function ChartCard({
  title,
  caption,
  hint,
  children,
}: {
  title: string;
  caption?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <figure className="min-w-0 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        <StrongText text={title} />
      </figcaption>
      {hint ? (
        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
          <StrongText text={hint} />
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
      {caption ? (
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{caption}</p>
      ) : null}
    </figure>
  );
}

function LeagueLegend({
  series,
}: {
  series: { label: string; color: string; dashed?: boolean }[];
}) {
  if (!series.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => (
        <span key={s.label} className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          {s.dashed ? (
            <span
              className="inline-block h-0 w-3 border-t-2 border-dashed"
              style={{ borderColor: s.color }}
            />
          ) : (
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
          )}
          <StrongText text={s.label} />
        </span>
      ))}
    </div>
  );
}

const TIME_W = 760;
const TIME_H = 360;
const TIME_PAD = { l: 52, r: 16, t: 20, b: 48 };

function yFmtPct(v: number) {
  return `${(100 * v).toFixed(1)}%`;
}
function yFmtNum(v: number) {
  return v.toFixed(2);
}

export function LeagueTimeChart({
  title,
  hint,
  series,
  yPct,
  zero,
  height = TIME_H,
  action,
}: {
  title: string;
  hint?: string;
  series: LineSeries[];
  yPct?: boolean;
  zero?: boolean;
  height?: number;
  action?: ReactNode;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const allPts = series.flatMap((s) => s.pts);
  const fmt = yPct ? yFmtPct : yFmtNum;
  if (!allPts.length) {
    return (
      <figure className="min-w-0 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
        <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          <StrongText text={title} />
        </figcaption>
        <p className="mt-3 text-sm text-text-muted">no series</p>
      </figure>
    );
  }
  const ts = allPts.map((p) => Date.parse(p.x));
  const ys = allPts.map((p) => p.y).filter((v) => v != null);
  const t0 = Math.min(...ts);
  const t1 = Math.max(...ts);
  let ymin = Math.min(...ys);
  let ymax = Math.max(...ys);
  if (zero) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  const span = ymax - ymin || 1;
  ymin -= span * 0.03;
  ymax += span * 0.03;
  const iw = TIME_W - TIME_PAD.l - TIME_PAD.r;
  const ih = height - TIME_PAD.t - TIME_PAD.b;
  const x = (iso: string) => TIME_PAD.l + ((Date.parse(iso) - t0) / (t1 - t0 || 1)) * iw;
  const y = (v: number) => TIME_PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const months: string[] = [];
  const start = new Date(t0);
  const end = new Date(t1);
  for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d <= end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`);
  }
  const step = months.length > 10 ? 2 : 1;
  const dates = [...new Set(series.flatMap((s) => s.pts.map((p) => p.x)))].sort();
  const active = hover && dates.includes(hover) ? hover : null;

  return (
    <figure className="min-w-0 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          <StrongText text={title} />
        </figcaption>
        {action}
      </div>
      <svg
        viewBox={`0 0 ${TIME_W} ${height}`}
        className="mt-3 h-auto w-full"
        role="img"
        aria-label={unstrong(title)}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const sx = ((e.clientX - rect.left) / rect.width) * TIME_W;
          if (sx < TIME_PAD.l || sx > TIME_W - TIME_PAD.r) {
            setHover(null);
            return;
          }
          const tMouse = t0 + ((sx - TIME_PAD.l) / iw) * (t1 - t0 || 1);
          let best = dates[0];
          let bestD = Infinity;
          dates.forEach((d) => {
            const dd = Math.abs(Date.parse(d) - tMouse);
            if (dd < bestD) {
              bestD = dd;
              best = d;
            }
          });
          setHover(best);
        }}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={TIME_PAD.l} x2={TIME_W - TIME_PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text
              x={TIME_PAD.l - 10}
              y={y(t) + 3}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {months.map((iso, i) =>
          i % step ? null : (
            <text
              key={iso}
              x={x(iso)}
              y={height - 16}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
              transform={`rotate(-35 ${x(iso)} ${height - 16})`}
            >
              {iso.slice(0, 7)}
            </text>
          ),
        )}
        {series.map((s) => {
          const d = s.pts
            .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`)
            .join(" ");
          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={s.dashed ? 1.6 : 2.1}
              strokeDasharray={s.dashed ? "4 4" : undefined}
              opacity={s.dashed ? 0.85 : 1}
            />
          );
        })}
        {active ? (
          <>
            <line
              x1={x(active)}
              x2={x(active)}
              y1={TIME_PAD.t}
              y2={height - TIME_PAD.b}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
            {series.map((s) => {
              const p = s.pts.reduce((a, b) =>
                Math.abs(Date.parse(b.x) - Date.parse(active)) <
                Math.abs(Date.parse(a.x) - Date.parse(active))
                  ? b
                  : a,
              );
              return (
                <circle
                  key={s.id}
                  cx={x(p.x)}
                  cy={y(p.y)}
                  r={4}
                  fill={s.color}
                  stroke="var(--bg-soft)"
                  strokeWidth={1}
                >
                  <title>{`${unstrong(s.label)} ${p.x}: ${fmt(p.y)}`}</title>
                </circle>
              );
            })}
          </>
        ) : null}
      </svg>
      {active ? (
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          {active}
          {series.map((s) => {
            const p = s.pts.reduce((a, b) =>
              Math.abs(Date.parse(b.x) - Date.parse(active)) <
              Math.abs(Date.parse(a.x) - Date.parse(active))
                ? b
                : a,
            );
            return ` · ${unstrong(s.label)} ${fmt(p.y)}`;
          })}
        </p>
      ) : (
        <LeagueLegend series={series} />
      )}
      {hint ? (
        <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
          <StrongText text={hint} />
        </p>
      ) : null}
    </figure>
  );
}

export function LeagueUniverseChart({
  data,
  height = 320,
}: {
  data: LeaguePublic;
  height?: number;
}) {
  const series = overlaySeries(data);
  if (!series.length) return null;
  return (
    <div className="mb-6">
      <LeagueTimeChart
        title={LEAGUE_COPY.charts.overlay.title}
        hint={LEAGUE_COPY.charts.overlay.hint}
        series={series}
        yPct
        zero
        height={height}
      />
    </div>
  );
}

export type CatSeries = {
  id: string;
  label: string;
  color: string;
  values: (number | null)[];
};

export function LeagueCatBars({
  title,
  categories,
  series,
  format = "number",
  stack,
  zero = true,
  yMin,
  yMax,
  height = 280,
  rotateX,
  labelStep,
  note,
}: {
  title?: string;
  categories: string[];
  series: CatSeries[];
  format?: "pct" | "number" | "usd" | "abs_pct";
  stack?: boolean;
  zero?: boolean;
  yMin?: number;
  yMax?: number;
  height?: number;
  rotateX?: boolean;
  labelStep?: number;
  note?: string;
}) {
  const W = 760;
  const denseLabels = rotateX && labelStep === 1 && categories.length > 16;
  const PAD = { l: 52, r: 16, t: 20, b: rotateX ? (denseLabels ? 80 : 56) : 40 };
  const n = categories.length;
  const ng = series.length;
  const num = (v: number | null | undefined) => (v == null ? 0 : Number(v) || 0);
  const sums = categories.map((_, i) => series.reduce((acc, s) => acc + num(s.values[i]), 0));
  let ymin: number;
  let ymax: number;
  if (stack) {
    ymin = yMin ?? 0;
    ymax = yMax ?? Math.max(0, ...sums);
  } else {
    const live = series.flatMap((s) => s.values.filter((v): v is number => v != null));
    ymin = yMin ?? (live.length ? Math.min(...live) : 0);
    ymax = yMax ?? (live.length ? Math.max(...live) : 1);
  }
  if (zero) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  const span = ymax - ymin || 1;
  if (yMin == null) ymin -= span * 0.05;
  if (yMax == null) ymax += span * 0.05;
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const groupW = n ? iw / n : iw;
  const barW = stack
    ? Math.min(56, Math.max(18, groupW * 0.42))
    : Math.min(14, (groupW * 0.78) / Math.max(ng, 1));
  const x = (i: number, g: number) =>
    stack
      ? PAD.l + i * groupW + (groupW - barW) / 2
      : PAD.l + i * groupW + (groupW - barW * ng) / 2 + g * barW;
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const step = labelStep ?? (n > 14 ? Math.ceil(n / 8) : 1);
  const xLab = (s: string) => (s.length >= 7 && /^\d{4}-\d{2}/.test(s) ? s.slice(0, 7) : s);

  const body = !n || !ng ? null : (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" role="img" aria-label={unstrong(title || "bars")}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
          <text
            x={PAD.l - 10}
            y={y(t) + 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
          >
            {fmtChart(t, format)}
          </text>
        </g>
      ))}
      {ymin < 0 && ymax > 0 ? (
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={y(0)}
          y2={y(0)}
          stroke="var(--border-strong)"
          strokeWidth={1}
        />
      ) : null}
      {categories.map((cat, i) => {
        const xx = PAD.l + i * groupW + groupW / 2;
        const show = i % step === 0 || i === n - 1;
        return (
          <g key={`${cat}-${i}`}>
            {stack
              ? (() => {
                  let y0 = 0;
                  return series.map((s) => {
                    const v = num(s.values[i]);
                    const top = y0 + v;
                    const prev = y0;
                    y0 = top;
                    if (!v) return null;
                    const bh = Math.abs(y(top) - y(prev));
                    return (
                      <rect
                        key={s.id}
                        x={x(i, 0)}
                        y={y(top)}
                        width={barW}
                        height={bh}
                        fill={s.color}
                      >
                        <title>{`${cat} · ${unstrong(s.label)}: ${fmtChart(v, format)}`}</title>
                      </rect>
                    );
                  });
                })()
              : series.map((s, g) => {
                  const v = s.values[i];
                  if (v == null) return null;
                  const by = y(Math.max(v, 0));
                  const bh = Math.abs(y(v) - y(0));
                  return (
                    <rect key={s.id} x={x(i, g)} y={by} width={barW} height={bh} fill={s.color}>
                      <title>{`${cat} · ${unstrong(s.label)}: ${fmtChart(v, format)}`}</title>
                    </rect>
                  );
                })}
            {show ? (
              <text
                x={xx}
                y={height - 16}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize={9}
                fontFamily="var(--font-geist-mono)"
                transform={rotateX ? `rotate(-35 ${xx} ${height - 16})` : undefined}
              >
                {xLab(cat)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  if (!title) {
    return (
      <div>
        {body}
        <LeagueLegend series={series} />
      </div>
    );
  }

  return (
    <figure className="min-w-0 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        <StrongText text={title} />
      </figcaption>
      {note ? (
        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
          <StrongText text={note} />
        </p>
      ) : null}
      <div className="mt-3">{body}</div>
      <LeagueLegend series={series} />
    </figure>
  );
}

const W = 280;
const H = 250;
const CX = 140;
const CY = 125;
const R = 62;
const LABEL_R = 92;

function pt(i: number, n: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

export function LeagueRadar({
  pack,
  values,
  color,
  label,
  series,
  maxWidth = 240,
  shade = true,
}: {
  pack: LeagueRadarPack;
  values?: (number | null)[];
  color?: string;
  label?: string;
  series?: { id: string; label: string; color: string; values: (number | null)[] }[];
  maxWidth?: number;
  shade?: boolean;
}) {
  const drawn = series?.length
    ? series
    : [
        {
          id: label || "series",
          label: label || "",
          color: color || "#6f93cf",
          values: values || [],
        },
      ];
  const n = pack.axes.length;
  const span = pack.hi - pack.lo || 1;
  const mag = (v: number | null) => {
    const x = v == null || !Number.isFinite(v) ? 0 : v;
    return Math.min(1, Math.max(0, (x - pack.lo) / span));
  };
  const poly = (scale: number) =>
    pack.axes.map((_, i) => pt(i, n, R * scale).join(",")).join(" ");
  const aria = drawn.map((s) => unstrong(s.label)).filter(Boolean).join(" vs ") || "active tilt";

  return (
    <figure className="min-w-0">
      {drawn.length === 1 && drawn[0].label ? (
        <figcaption className="mb-1 text-center font-mono text-[10px] uppercase tracking-widest text-text-soft">
          {drawn[0].label}
        </figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full"
        style={{ maxWidth }}
        role="img"
        aria-label={aria}
      >
        <polygon
          points={poly(mag(0))}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <polygon
          points={poly(1)}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={1.25}
        />
        {pack.axes.map((ax, i) => {
          const [x, y] = pt(i, n, R);
          return (
            <line
              key={ax.id}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}
        {drawn.map((s) => {
          const dataPts = s.values.map((v, i) => pt(i, n, R * mag(v)).join(",")).join(" ");
          const fill = shade ? `color-mix(in srgb, ${s.color} 28%, transparent)` : "none";
          return (
            <g key={s.id}>
              <polygon points={dataPts} fill={fill} stroke={s.color} strokeWidth={1.6} />
              {pack.axes.map((ax, i) => {
                const [dx, dy] = pt(i, n, R * mag(s.values[i] ?? 0));
                const tip = drawn.length > 1 ? `${unstrong(s.label)} · ${ax.label}` : ax.label;
                return (
                  <circle key={ax.id} cx={dx} cy={dy} r={3.2} fill={s.color}>
                    <title>{`${tip}: ${fmtChart(s.values[i], pack.format)}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}
        {pack.axes.map((ax, i) => {
          const [lx, ly] = pt(i, n, LABEL_R);
          return (
            <text
              key={ax.id}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {ax.label}
            </text>
          );
        })}
      </svg>
      {drawn.length > 1 ? <LeagueLegend series={drawn} /> : null}
    </figure>
  );
}

const SCATTER_W = 760;
const SCATTER_H = 248;
const SCATTER_PAD = { l: 72, r: 48, t: 12, b: 52 };

export function LeagueScatter({ chart }: { chart: ScatterSpec }) {
  const pts = chart.points;
  if (!pts.length) {
    return (
      <ChartCard title={chart.title} caption={chart.caption} hint={chart.hint}>
        <p className="text-sm text-text-muted">no overlapping points</p>
      </ChartCard>
    );
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  let xmin = Math.min(...xs);
  let xmax = Math.max(...xs);
  let ymin = Math.min(...ys);
  let ymax = Math.max(...ys);
  if (xmin === xmax) {
    xmin -= 1;
    xmax += 1;
  }
  if (ymin === ymax) {
    ymin -= Math.abs(ymin) * 0.05 || 0.05;
    ymax += Math.abs(ymax) * 0.05 || 0.05;
  }
  const xspan = xmax - xmin;
  const yspan = ymax - ymin;
  xmin -= xspan * 0.08;
  xmax += xspan * 0.08;
  ymin -= yspan * 0.08;
  ymax += yspan * 0.08;
  const iw = SCATTER_W - SCATTER_PAD.l - SCATTER_PAD.r;
  const ih = SCATTER_H - SCATTER_PAD.t - SCATTER_PAD.b;
  const x = (v: number) => SCATTER_PAD.l + ((v - xmin) / (xmax - xmin)) * iw;
  const y = (v: number) => SCATTER_PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const xTicks = Array.from({ length: 5 }, (_, i) => xmin + ((xmax - xmin) * i) / 4);
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const fit = chart.fit;

  return (
    <ChartCard title={chart.title} caption={chart.caption} hint={chart.hint}>
      <svg
        viewBox={`0 0 ${SCATTER_W} ${SCATTER_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.title}
      >
        {yTicks.map((t) => (
          <g key={`y-${t}`}>
            <line
              x1={SCATTER_PAD.l}
              x2={SCATTER_W - SCATTER_PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={SCATTER_PAD.l - 8}
              y={y(t) + 3}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {fmtChart(t, chart.y_format)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text
            key={`x-${t}`}
            x={x(t)}
            y={SCATTER_H - 28}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
          >
            {fmtChart(t, chart.x_format)}
          </text>
        ))}
        {chart.y_name ? (
          <text
            x={14}
            y={SCATTER_H / 2}
            transform={`rotate(-90 14 ${SCATTER_H / 2})`}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={11}
            fontFamily="var(--font-geist-mono)"
          >
            {chart.y_name}
          </text>
        ) : null}
        {chart.x_name ? (
          <text
            x={SCATTER_PAD.l + (SCATTER_W - SCATTER_PAD.l - SCATTER_PAD.r) / 2}
            y={SCATTER_H - 8}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={11}
            fontFamily="var(--font-geist-mono)"
          >
            {chart.x_name}
          </text>
        ) : null}
        {fit ? (
          <line
            x1={x(xmin)}
            y1={y(fit.intercept + fit.slope * xmin)}
            x2={x(xmax)}
            y2={y(fit.intercept + fit.slope * xmax)}
            stroke="var(--orange)"
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />
        ) : null}
        {pts.map((p) => (
          <g key={p.id}>
            <circle
              cx={x(p.x)}
              cy={y(p.y)}
              r={5}
              fill={p.color}
              stroke="var(--bg-soft)"
              strokeWidth={1}
            >
              <title>{`${p.label}: ${chart.x_name} ${fmtChart(p.x, chart.x_format)}, ${chart.y_name} ${fmtChart(p.y, chart.y_format)}`}</title>
            </circle>
            <text
              x={x(p.x) + 7}
              y={y(p.y) - 7}
              fill="var(--text-soft)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </ChartCard>
  );
}
