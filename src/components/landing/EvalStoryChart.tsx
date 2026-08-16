"use client";

import { useId, useMemo } from "react";
import { LINE_COLOR, SERIES } from "./whyEvalData";
import { COPY } from "./copy";

const PRE = LINE_COLOR[SERIES.openSource.id];
const POST = LINE_COLOR[SERIES.proprietary.id];

const W = 1100;
const H = 380;
const PAD = { l: 52, r: 16, t: 12, b: 36 };

export type StorySeries = {
  id: string;
  values: number[];
};

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
}: {
  dates: string[];
  series: StorySeries[];
}) {
  const fillId = `eval-story-fill-${useId().replace(/:/g, "")}`;

  const layout = useMemo(() => {
    const pre = series.find((s) => s.id === SERIES.openSource.id);
    const post = series.find((s) => s.id === SERIES.proprietary.id);
    const all = [pre, post].flatMap((s) => s?.values ?? []);
    const ymin = Math.min(...all) * 0.97;
    const ymax = Math.max(...all) * 1.03;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const n = dates.length;
    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
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
      area,
      yTicks,
      xLabels: yearTicks(dates, x),
      prePath: pre ? toPath(pre.values) : "",
      postPath: post ? toPath(post.values) : "",
    };
  }, [dates, series]);

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-4">
      <h3 className="text-sm font-medium text-text">{COPY.whyEval.chartTitle}</h3>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mt-3 h-auto w-full"
        role="img"
        aria-label={COPY.whyEval.chartAria}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={POST} stopOpacity="0.04" />
            <stop offset="100%" stopColor={POST} stopOpacity="0.28" />
          </linearGradient>
        </defs>

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
              {t.v.toFixed(2)}
            </text>
          </g>
        ))}

        {layout.xLabels.map((t, i) => (
          <text
            key={t.i}
            x={t.x}
            y={H - 12}
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

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span
            className="inline-block h-0.5 w-5"
            style={{ background: PRE }}
          />
          {COPY.whyEval.preLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
          <span
            className="inline-block h-0.5 w-5"
            style={{ background: POST }}
          />
          {COPY.whyEval.postLabel}
        </span>
      </div>
    </div>
  );
}
