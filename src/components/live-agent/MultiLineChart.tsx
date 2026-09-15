"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import { PALETTE } from "@/components/leaderboard/chartPalette";

export type DiffSeries = {
  id: string;
  label: string;
  values: number[];
  color?: string;
};

export type MultiLineChartProps = {
  dates: string[];
  /** each series must carry a numeric array at `valueKey` (default "values") */
  series: Record<string, unknown>[];
  benchmark?: { label: string; values: number[] };
  valueKey?: string;
  /** id of the series to emphasise; others are muted */
  highlightId?: string;
  title?: string;
  /** small category header rendered above the title */
  eyebrow?: string;
  caption?: string;
  /** tick style for the x axis */
  xTick?: "year" | "month" | "date";
  /** emphasise y=0 (drawdown, cumulative-from-zero) */
  zeroLine?: boolean;
  /** fixed y floor / ceiling (optional) */
  yMin?: number;
  yMax?: number;
  height?: number;
  /** number of decimals for y ticks + tooltip */
  decimals?: number;
};

const W = 760;
const PAD = { l: 56, r: 18, t: 16, b: 48 };

function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}
function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

function yearTicks(dates: string[], x: (i: number) => number) {
  const seen = new Set<string>();
  const ticks: { i: number; x: number; label: string }[] = [];
  dates.forEach((d, i) => {
    const y = d.slice(0, 4);
    if (seen.has(y)) return;
    seen.add(y);
    ticks.push({ i, x: x(i), label: y });
  });
  return ticks;
}

function monthTicks(dates: string[], x: (i: number) => number) {
  const seen = new Set<string>();
  const ticks: { i: number; x: number; label: string }[] = [];
  dates.forEach((d, i) => {
    const k = d.slice(0, 7);
    if (seen.has(k)) return;
    seen.add(k);
    ticks.push({ i, x: x(i), label: fmtMonth(d) });
  });
  return ticks;
}

function dateTicks(dates: string[], x: (i: number) => number) {
  // sparse: ~8 labels plus the last
  const n = dates.length;
  const step = Math.max(1, Math.ceil((n - 1) / 8));
  const idx = new Set<number>();
  for (let i = 0; i < n; i += step) idx.add(i);
  if (n > 0) idx.add(n - 1);
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => ({ i, x: x(i), label: fmtDate(dates[i]) }));
}

export function MultiLineChart({
  dates,
  series,
  benchmark,
  valueKey = "values",
  highlightId,
  title,
  eyebrow,
  caption,
  xTick = "year",
  zeroLine = false,
  yMin,
  yMax,
  height = 340,
  decimals = 2,
}: MultiLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);

  const norm = useMemo(
    () =>
      series.map((s) => ({
        id: String(s.id),
        label: String(s.label),
        values: (s[valueKey] as number[]) ?? [],
        color: s.color as string | undefined,
      })),
    [series, valueKey],
  );

  const H = height;
  const colors = useMemo(
    () => norm.map((s, i) => s.color ?? PALETTE[i % PALETTE.length]),
    [norm],
  );

  const layout = useMemo(() => {
    const all: number[] = [];
    norm.forEach((s) => all.push(...s.values));
    if (benchmark) all.push(...benchmark.values);
    const lo = yMin ?? Math.min(...all);
    const hi = yMax ?? Math.max(...all);
    // pad a touch, but keep a tight zero anchor when zeroLine
    const span = hi - lo || 1;
    const ymin = zeroLine ? Math.min(0, lo) : lo - span * 0.03;
    const ymax = hi + span * 0.03;

    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const n = dates.length;
    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
    const toPath = (vals: number[]) =>
      vals
        .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
        .join(" ");

    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = ymin + ((ymax - ymin) * i) / 4;
      return { v, y: y(v) };
    });

    const ticks =
      xTick === "year"
        ? yearTicks(dates, x)
        : xTick === "month"
          ? monthTicks(dates, x)
          : dateTicks(dates, x);

    return {
      x,
      y,
      ymin,
      ymax,
      yTicks,
      xLabels: ticks,
      paths: norm.map((s) => toPath(s.values)),
      benchPath: benchmark ? toPath(benchmark.values) : "",
    };
  }, [dates, norm, benchmark, yMin, yMax, zeroLine, H, xTick]);

  const onMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || dates.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * W;
      if (sx < PAD.l || sx > W - PAD.r) {
        setHover(null);
        return;
      }
      const n = dates.length;
      const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
      const index = Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))));
      setHover({ index, px: layout.x(index) });
    },
    [dates.length, layout],
  );

  const tip = hover
    ? {
        date: dates[hover.index],
        x: layout.x(hover.index),
        series: norm.map((s, i) => ({
          id: s.id,
          label: s.label,
          color: colors[i],
          v: s.values[hover.index],
        })),
        bench: benchmark ? benchmark.values[hover.index] : null,
      }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-5">
      {(eyebrow || title || caption) && (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            {eyebrow ? (
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h3 className="text-sm font-medium leading-snug text-text">{title}</h3>
            ) : null}
          </div>
          {tip ? (
            <div className="font-mono text-xs text-text-soft">{tip.date}</div>
          ) : null}
        </div>
      )}

      <div className="relative mt-3 sm:mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y cursor-crosshair"
          role="img"
          aria-label={title ?? "chart"}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {layout.yTicks.map((t) => (
            <g key={t.v}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={t.y}
                y2={t.y}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={PAD.l - 10}
                y={t.y + 3}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize={10}
                fontFamily="var(--font-geist-mono)"
              >
                {t.v.toFixed(decimals)}
              </text>
            </g>
          ))}

          {zeroLine ? (
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={layout.y(0)}
              y2={layout.y(0)}
              stroke="var(--border-strong)"
              strokeWidth={1.25}
            />
          ) : null}

          {layout.xLabels.map((t) => (
            <text
              key={t.i}
              x={t.x}
              y={H - 16}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
              transform={`rotate(-35 ${t.x} ${H - 16})`}
            >
              {t.label}
            </text>
          ))}

          {benchmark ? (
            <path
              d={layout.benchPath}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.75}
            />
          ) : null}

          {norm.map((s, i) => {
            const muted = highlightId && s.id !== highlightId;
            return (
              <path
                key={s.id}
                d={layout.paths[i]}
                fill="none"
                stroke={colors[i]}
                strokeWidth={highlightId && !muted ? 2.6 : 2}
                opacity={muted ? 0.32 : 1}
              />
            );
          })}

          {hover ? (
            <line
              x1={hover.px}
              x2={hover.px}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
          ) : null}

          {tip
            ? tip.series.map((s) => (
                <circle
                  key={s.id}
                  cx={tip.x}
                  cy={layout.y(s.v)}
                  r={3}
                  fill={s.color}
                  stroke="var(--bg-soft)"
                  strokeWidth={1}
                />
              ))
            : null}
          {tip && tip.bench != null ? (
            <circle
              cx={tip.x}
              cy={layout.y(tip.bench)}
              r={3}
              fill="var(--text-muted)"
              stroke="var(--bg-soft)"
              strokeWidth={1}
            />
          ) : null}
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[200px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 220px))`,
              top: 8,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">{tip.date}</div>
            <div className="space-y-1">
              {tip.series.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 text-text"
                >
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <span className="tabular-nums font-medium">
                    {s.v.toFixed(decimals)}
                  </span>
                </div>
              ))}
              {tip.bench != null ? (
                <div className="flex items-center justify-between gap-4 text-text-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-px w-3 border-t border-dashed border-text-muted" />
                    {benchmark?.label}
                  </span>
                  <span className="tabular-nums">{tip.bench.toFixed(decimals)}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {benchmark ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="inline-block h-px w-4 border-t border-dashed border-text-muted" aria-hidden />
            {benchmark.label}
          </span>
        ) : null}
        {norm.map((s, i) => {
          const muted = highlightId && s.id !== highlightId;
          return (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 text-[11px] text-text-soft"
              style={{ opacity: muted ? 0.4 : 1 }}
            >
              <span
                className="inline-block h-0.5 w-5"
                style={{ background: colors[i] }}
              />
              {s.label}
            </span>
          );
        })}
      </div>

      {caption ? (
        <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
