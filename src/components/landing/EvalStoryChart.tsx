"use client";

import { useMemo } from "react";
import { colorFor } from "@/components/leaderboard/chartPalette";
import { SERIES } from "./whyEvalData";

const BLUE = "#6f93cf";
const BLUE_LIGHT = "#a8c0e4";

const W = 1404;
const H = 420;
const PAD = { l: 248, r: 248, t: 16, b: 10 };
const LABEL_GAP = 16;

export type StorySeries = {
  id: string;
  label: string;
  values: number[];
};

type Props = {
  dates: string[];
  series: StorySeries[];
  /** 0–1 extra series overlay. */
  overlay: number;
  /** 0–1 extra series labels. */
  overlayLabels: number;
  fit?: boolean;
};

function spreadYs(ys: number[], lo: number, hi: number, gap: number) {
  if (ys.length === 0) return ys;
  const order = ys.map((_, i) => i).sort((a, b) => ys[a] - ys[b]);
  const out = [...ys];
  for (let k = 1; k < order.length; k++) {
    const prev = order[k - 1];
    const cur = order[k];
    if (out[cur] < out[prev] + gap) out[cur] = out[prev] + gap;
  }
  const last = order[order.length - 1];
  if (out[last] > hi) {
    const shift = out[last] - hi;
    for (let i = 0; i < out.length; i++) out[i] -= shift;
  }
  if (out[order[0]] < lo) {
    const shift = lo - out[order[0]];
    for (let i = 0; i < out.length; i++) out[i] += shift;
  }
  for (let k = 1; k < order.length; k++) {
    const prev = order[k - 1];
    const cur = order[k];
    if (out[cur] < out[prev] + gap) out[cur] = out[prev] + gap;
  }
  return out;
}

/** One chart: pre/post story, then the rest overlay on the same scale. */
export function EvalStoryChart({
  dates,
  series,
  overlay,
  overlayLabels,
  fit = true,
}: Props) {
  const ids = useMemo(() => series.map((s) => s.id), [series]);

  const layout = useMemo(() => {
    const pre = series.find((s) => s.id === SERIES.openSource.id);
    const post = series.find((s) => s.id === SERIES.proprietary.id);
    const extras = series.filter(
      (s) => s.id !== SERIES.openSource.id && s.id !== SERIES.proprietary.id,
    );
    const all = series.flatMap((s) => s.values);
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
    const last = Math.max(0, n - 1);
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

    return {
      x,
      y,
      n,
      last,
      area,
      pre,
      post,
      prePath: pre ? toPath(pre.values) : "",
      postPath: post ? toPath(post.values) : "",
      preEnd: pre
        ? { x: x(last), y: y(pre.values[last] ?? 1) }
        : { x: 0, y: 0 },
      postEnd: post
        ? { x: x(last), y: y(post.values[last] ?? 1) }
        : { x: 0, y: 0 },
      extras: extras.map((s) => ({
        id: s.id,
        label: s.label,
        color: colorFor(s.id, ids),
        path: toPath(s.values),
        endY: y(s.values[last] ?? 1),
        values: s.values,
      })),
    };
  }, [dates, series, ids]);

  const o = Math.min(1, Math.max(0, overlay));
  const lab = Math.min(1, Math.max(0, overlayLabels));
  const clipExtra = PAD.l + o * (W - PAD.l - PAD.r);

  const extraItems = layout.extras.map((s) => ({
    id: s.id,
    label: s.label,
    color: s.color,
    yTrue: s.endY,
  }));
  const spreadSource = [
    layout.preEnd.y,
    layout.postEnd.y,
    ...extraItems.map((it) => it.yTrue),
  ];
  const spread = spreadYs(spreadSource, PAD.t + 8, H - PAD.b - 8, LABEL_GAP);
  const extraYs = spread.slice(2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={fit ? "h-full w-full" : "h-auto w-full"}
      role="img"
      aria-label="Agent returns before and after evaluation through fintel"
    >
      <defs>
        <clipPath id="eval-story-extra">
          <rect x="0" y="0" width={clipExtra} height={H} />
        </clipPath>
        <linearGradient id="eval-story-fill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.04" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <line
        x1={PAD.l}
        x2={PAD.l}
        y1={PAD.t}
        y2={H - PAD.b}
        stroke="var(--border-strong)"
        strokeWidth={1}
      />
      <line
        x1={PAD.l}
        x2={W - PAD.r}
        y1={H - PAD.b}
        y2={H - PAD.b}
        stroke="var(--border-strong)"
        strokeWidth={1}
      />

      {layout.prePath ? (
        <path
          d={layout.prePath}
          fill="none"
          stroke={BLUE_LIGHT}
          strokeWidth={2}
          opacity={0.95}
        />
      ) : null}
      {layout.area ? (
        <path
          d={layout.area}
          fill="url(#eval-story-fill)"
          opacity={1 - o}
        />
      ) : null}
      {layout.postPath ? (
        <path
          d={layout.postPath}
          fill="none"
          stroke={BLUE}
          strokeWidth={2.5}
        />
      ) : null}

      <g clipPath="url(#eval-story-extra)">
        {layout.extras.map((s) => (
          <path
            key={s.id}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={1.8}
          />
        ))}
      </g>

      <g>
        <text
          x={layout.preEnd.x + 12}
          y={layout.preEnd.y + 4}
          fill={BLUE_LIGHT}
          fontSize={14}
          fontWeight={600}
          fontFamily="var(--font-geist-mono)"
        >
          pre-eval agent
        </text>
        <text
          x={layout.postEnd.x + 12}
          y={layout.postEnd.y + 4}
          fill={BLUE}
          fontSize={14}
          fontWeight={700}
          fontFamily="var(--font-geist-mono)"
        >
          post-eval agent
        </text>
      </g>

      <g opacity={lab}>
        {extraItems.map((it, i) => (
          <g key={it.id}>
            {Math.abs(extraYs[i] - it.yTrue) > 1 ? (
              <path
                d={`M ${layout.preEnd.x} ${it.yTrue} L ${layout.preEnd.x + 6} ${extraYs[i]}`}
                fill="none"
                stroke={it.color}
                strokeWidth={1}
              />
            ) : null}
            <text
              x={layout.preEnd.x + 10}
              y={extraYs[i] + 4}
              fill={it.color}
              fontSize={13}
              fontWeight={700}
              fontFamily="var(--font-geist-mono)"
            >
              {it.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
