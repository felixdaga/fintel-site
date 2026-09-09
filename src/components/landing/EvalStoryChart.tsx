"use client";

import { useId, useMemo } from "react";
import { LINE_COLOR, SERIES } from "./whyEvalData";
import { COPY } from "./main_texts";
import type { StorySeries } from "./evalStory";
import { ChartLegend } from "./IcPairChart";

export type { StorySeries };

const PRE = LINE_COLOR[SERIES.openSource.id];
const POST = LINE_COLOR[SERIES.proprietary.id];

const W = 1100;
const H = 380;
const PAD = { l: 52, r: 16, t: 12, b: 36 };

function yearTicks(dates: string[], x: (i: number) => number) {
  const seen = new Set<string>();
  const ticks: { i: number; x: number; label: string }[] = [];
  dates.forEach((d, i) => {
    const year = d.slice(0, 4);
    if (seen.has(year)) return;
    seen.add(year);
    ticks.push({ i, x: x(i), label: year });
  });
  return ticks;
}

export function EvalStoryChart({
  dates,
  series,
  title = COPY.whyEval.chartTitle,
  aria = COPY.whyEval.chartAria,
  preLabel = COPY.whyEval.preLabel,
  postLabel = COPY.whyEval.postLabel,
  height = H,
  embedded = false,
  hideGrid = false,
}: {
  dates: string[];
  series: StorySeries[];
  title?: string;
  aria?: string;
  preLabel?: string;
  postLabel?: string;
  height?: number;
  embedded?: boolean;
  hideGrid?: boolean;
}) {
  const fillId = `eval-story-fill-${useId().replace(/:/g, "")}`;

  const layout = useMemo(() => {
    const pad = hideGrid ? { l: 12, r: 12, t: 10, b: 32 } : PAD;
    const plotW = hideGrid ? 720 : W;
    const pre = series.find((s) => s.id === SERIES.openSource.id);
    const post = series.find((s) => s.id === SERIES.proprietary.id);
    const all = [pre, post].flatMap((s) => s?.values ?? []);
    const ymin = Math.min(...all) * 0.97;
    const ymax = Math.max(...all) * 1.03;
    const iw = plotW - pad.l - pad.r;
    const ih = height - pad.t - pad.b;
    const n = dates.length;
    const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) => pad.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
    const toPath = (vals: number[]) =>
      vals
        .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
        .join(" ");
    const area =
      pre && post
        ? [
            ...post.values.map(
              (v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`,
            ),
            ...pre.values
              .map((v, i) => ({ v, i }))
              .reverse()
              .map(({ v, i }) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`),
            "Z",
          ].join(" ")
        : "";
    const yTicks = Array.from({ length: 4 }, (_, i) => {
      const v = ymin + ((ymax - ymin) * i) / 3;
      return { v, y: y(v) };
    });

    return {
      pad,
      plotW,
      area,
      yTicks,
      xLabels: yearTicks(dates, x),
      prePath: pre ? toPath(pre.values) : "",
      postPath: post ? toPath(post.values) : "",
    };
  }, [dates, series, height, hideGrid]);

  return (
    <div
      className={
        embedded
          ? "min-w-0"
          : "rounded-2xl border border-border bg-surface-2 p-3 sm:p-4"
      }
    >
      {title ? (
        embedded ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-orange">
            {title}
          </p>
        ) : (
          <h3 className="text-sm font-medium text-text">{title}</h3>
        )
      ) : null}

      <svg
        viewBox={`0 0 ${layout.plotW} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className={`h-auto w-full shrink-0 ${embedded ? "mt-2" : "mt-3"}`}
        role="img"
        aria-label={aria}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={POST} stopOpacity="0.04" />
            <stop offset="100%" stopColor={POST} stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {hideGrid
          ? null
          : layout.yTicks.map((t) => (
              <g key={t.v}>
                <line
                  x1={layout.pad.l}
                  x2={layout.plotW - layout.pad.r}
                  y1={t.y}
                  y2={t.y}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={layout.pad.l - 10}
                  y={t.y + 3}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize={10}
                  fontFamily="var(--font-geist-mono)"
                >
                  {t.v.toFixed(2)}
                </text>
              </g>
            ))}

        {layout.xLabels.map((t, i) => (
          <text
            key={t.i}
            x={t.x}
            y={height - 12}
            textAnchor={
              i === 0 ? "start" : i === layout.xLabels.length - 1 ? "end" : "middle"
            }
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
          >
            {t.label}
          </text>
        ))}

        {layout.prePath ? (
          <path
            d={layout.prePath}
            fill="none"
            stroke={PRE}
            strokeWidth={2}
          />
        ) : null}
        {layout.area ? (
          <path d={layout.area} fill={`url(#${fillId})`} />
        ) : null}
        {layout.postPath ? (
          <path
            d={layout.postPath}
            fill="none"
            stroke={POST}
            strokeWidth={2.5}
          />
        ) : null}
      </svg>

      {embedded ? (
        <ChartLegend preLabel={preLabel} postLabel={postLabel} />
      ) : (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
            <span
              className="inline-block h-0.5 w-5"
              style={{ background: PRE }}
            />
            {preLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
            <span
              className="inline-block h-0.5 w-5"
              style={{ background: POST }}
            />
            {postLabel}
          </span>
        </div>
      )}
    </div>
  );
}
