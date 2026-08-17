"use client";

import { useMemo, useState, type MouseEvent } from "react";
import type { StrategyComparison, StrategySeries } from "./data";
import { STRATEGY_COLORS, STRATEGY_LABELS } from "./data";

const W = 460;
const NAV_H = 220;
const DD_H = 110;
const PAD = { l: 48, r: 16, t: 16, b: 28 };
const GAP = 18;

function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

/**
 * A pair of charts (net NAV on top, underwater below) comparing two strategy
 * variants on a single score-weighted threshold. Two of these side by side
 * give the sw > 0.0 and sw > 0.3 comparison for Example 3.
 */
export function StrategyComparisonChart({
  threshold,
  data,
}: {
  threshold: string;
  data: { alphaview: StrategySeries; biweekly: StrategySeries };
}) {
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);
  const totalH = NAV_H + GAP + DD_H;

  const series = useMemo(
    () => [
      {
        key: "alphaview" as const,
        label: STRATEGY_LABELS.alphaview,
        color: STRATEGY_COLORS.alphaview,
        dates: data.alphaview.dates,
        nav: data.alphaview.nav,
        underwater: data.alphaview.underwater,
      },
      {
        key: "biweekly" as const,
        label: STRATEGY_LABELS.biweekly,
        color: STRATEGY_COLORS.biweekly,
        dates: data.biweekly.dates,
        nav: data.biweekly.nav,
        underwater: data.biweekly.underwater,
      },
    ],
    [data],
  );

  const dates = series[0].dates;
  const n = dates.length;

  const layout = useMemo(() => {
    const allNav = series.flatMap((s) => s.nav);
    const navMin = Math.min(...allNav) * 0.985;
    const navMax = Math.max(...allNav) * 1.015;

    const allDd = series.flatMap((s) => s.underwater);
    const ddMin = Math.min(...allDd, 0) * 1.05;
    const ddMax = 0.005;

    const iw = W - PAD.l - PAD.r;

    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);

    const navY = (v: number) =>
      PAD.t + (NAV_H - PAD.t - PAD.b) - ((v - navMin) / (navMax - navMin)) * (NAV_H - PAD.t - PAD.b);
    const ddY = (v: number) => {
      const top = NAV_H + GAP + PAD.t;
      const h = DD_H - PAD.t - PAD.b;
      return top + h - ((v - ddMin) / (ddMax - ddMin)) * h;
    };

    const toPath = (vals: number[], yFn: (v: number) => number) =>
      vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yFn(v).toFixed(1)}`).join(" ");
    const toArea = (vals: number[], yFn: (v: number) => number) => {
      const base = yFn(0);
      const top = vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yFn(v).toFixed(1)}`).join(" ");
      return `${top} L${x(n - 1).toFixed(1)},${base.toFixed(1)} L${x(0).toFixed(1)},${base.toFixed(1)} Z`;
    };

    const navTicks = Array.from({ length: 4 }, (_, i) => {
      const v = navMin + ((navMax - navMin) * i) / 3;
      return { v, y: navY(v) };
    });
    const ddTicks = Array.from({ length: 3 }, (_, i) => {
      const v = ddMin + ((ddMax - ddMin) * i) / 2;
      return { v, y: ddY(v) };
    });

    const step = Math.max(1, Math.ceil((n - 1) / 6));
    const labelIdx = new Set<number>();
    for (let i = 0; i < n; i += step) labelIdx.add(i);
    if (n > 0) labelIdx.add(n - 1);
    const xLabels = [...labelIdx]
      .sort((a, b) => a - b)
      .map((i) => ({ i, x: x(i), label: fmtDate(dates[i]) }));

    return {
      x,
      navY,
      ddY,
      navPaths: series.map((s) => ({ key: s.key, path: toPath(s.nav, navY) })),
      ddAreas: series.map((s) => ({ key: s.key, path: toArea(s.underwater, ddY) })),
      ddPaths: series.map((s) => ({ key: s.key, path: toPath(s.underwater, ddY) })),
      navTicks,
      ddTicks,
      xLabels,
      navMin,
      navMax,
    };
  }, [series, dates, n]);

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    if (n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    if (sx < PAD.l || sx > W - PAD.r) {
      setHover(null);
      return;
    }
    const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
    const index = Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))));
    setHover({ index, px: layout.x(index) });
  };

  const tip = hover
    ? {
        date: dates[hover.index],
        x: layout.x(hover.index),
        nav: series.map((s) => ({ key: s.key, label: s.label, color: s.color, v: s.nav[hover.index] })),
        dd: series.map((s) => ({
          key: s.key,
          label: s.label,
          color: s.color,
          v: s.underwater[hover.index],
        })),
      }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          score-weighted long {threshold}
        </h3>
        <span className="text-[11px] text-text-muted">net of cost · aligned window</span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${totalH}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label={`Net NAV and underwater for score-weighted long ${threshold}`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* ── NAV panel ── */}
          <text
            x={PAD.l - 10}
            y={PAD.t - 4}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={9}
            fontFamily="var(--font-geist-mono)"
          >
            NAV
          </text>
          {layout.navTicks.map((t) => (
            <g key={`nav-${t.v}`}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={t.y}
                y2={t.y}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray={t.v === 1 ? "" : "4 4"}
              />
              <text
                x={PAD.l - 8}
                y={t.y + 3}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize={9}
                fontFamily="var(--font-geist-mono)"
              >
                {t.v.toFixed(2)}
              </text>
            </g>
          ))}
          {layout.navPaths.map((s) => (
            <path
              key={s.key}
              d={s.path}
              fill="none"
              stroke={STRATEGY_COLORS[s.key]}
              strokeWidth={2}
            />
          ))}

          {/* ── Underwater panel ── */}
          <text
            x={PAD.l - 10}
            y={NAV_H + GAP + PAD.t - 4}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={9}
            fontFamily="var(--font-geist-mono)"
          >
            DD
          </text>
          {layout.ddTicks.map((t) => {
            const top = NAV_H + GAP + PAD.t;
            const isBase = Math.abs(t.v) < 1e-9;
            return (
              <g key={`dd-${t.v}`}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={t.y}
                  y2={t.y}
                  stroke="var(--border)"
                  strokeWidth={isBase ? 1.25 : 1}
                  strokeDasharray={isBase ? "" : "4 4"}
                />
                <text
                  x={PAD.l - 8}
                  y={t.y + 3}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize={9}
                  fontFamily="var(--font-geist-mono)"
                >
                  {(t.v * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
          {layout.ddAreas.map((s) => (
            <path
              key={`ddarea-${s.key}`}
              d={s.path}
              fill={STRATEGY_COLORS[s.key]}
              opacity={0.18}
            />
          ))}
          {layout.ddPaths.map((s) => (
            <path
              key={`ddpath-${s.key}`}
              d={s.path}
              fill="none"
              stroke={STRATEGY_COLORS[s.key]}
              strokeWidth={1.5}
            />
          ))}

          {/* x labels (under underwater panel) */}
          {layout.xLabels.map((t) => (
            <text
              key={`xl-${t.i}`}
              x={t.x}
              y={totalH - 8}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
            >
              {t.label}
            </text>
          ))}

          {/* hover guide */}
          {hover ? (
            <line
              x1={hover.px}
              x2={hover.px}
              y1={PAD.t}
              y2={NAV_H - PAD.b + GAP + DD_H}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
          ) : null}
          {tip
            ? tip.nav.map((v) => (
                <circle
                  key={`nv-${v.key}`}
                  cx={tip.x}
                  cy={layout.navY(v.v)}
                  r={3}
                  fill={v.color}
                  stroke="var(--bg-soft)"
                  strokeWidth={1}
                />
              ))
            : null}
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[180px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 200px))`,
              top: 6,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">{fmtMonth(tip.date)}</div>
            <div className="space-y-1">
              {tip.nav.map((v) => (
                <div
                  key={v.key}
                  className="flex items-center justify-between gap-4 text-text"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: v.color }}
                    />
                    {v.label}
                  </span>
                  <span className="tabular-nums font-medium">{v.v.toFixed(3)}</span>
                </div>
              ))}
              <div className="my-1 border-t border-border" />
              {tip.dd.map((v) => (
                <div
                  key={v.key}
                  className="flex items-center justify-between gap-4 text-text-soft"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: v.color }}
                    />
                    {v.label}
                  </span>
                  <span className="tabular-nums">{(v.v * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {series.map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-1.5 text-[11px] text-text"
          >
            <span
              className="inline-block h-0.5 w-5"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export type { StrategyComparison };
