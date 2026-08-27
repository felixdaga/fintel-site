"use client";

import { useMemo, useState, type MouseEvent } from "react";

const W = 720;
const H = 280;
const PAD = { l: 48, r: 16, t: 18, b: 30 };

const ACCENT_UP = "#5cb88a";
const ACCENT_DOWN = "#d97a6a";
const BENCH = "#6b7a8e";

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

export type CumPoint = { date: string; f1: number; djia: number };

export function CumulativeReturnChart({
  data,
  tone = "up",
  title,
}: {
  data: CumPoint[];
  tone?: "up" | "down";
  title?: string;
}) {
  const ACCENT = tone === "up" ? ACCENT_UP : ACCENT_DOWN;
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);

  const layout = useMemo(() => {
    const all = [...data.map((d) => d.f1), ...data.map((d) => d.djia)];
    const ymin = Math.min(...all) * 0.99;
    const ymax = Math.max(...all) * 1.01;
    const n = data.length;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;

    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;

    const toPath = (vals: number[]) =>
      vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

    const yTicks = Array.from({ length: 4 }, (_, i) => {
      const v = ymin + ((ymax - ymin) * i) / 3;
      return { v, y: y(v) };
    });

    const step = Math.max(1, Math.ceil((n - 1) / 6));
    const labelIdx = new Set<number>();
    for (let i = 0; i < n; i += step) labelIdx.add(i);
    if (n > 0) labelIdx.add(n - 1);
    const xLabels = [...labelIdx]
      .sort((a, b) => a - b)
      .map((i) => ({ i, x: x(i), label: fmtDate(data[i].date) }));

    return {
      x,
      y,
      pathF1: toPath(data.map((d) => d.f1)),
      pathDjia: toPath(data.map((d) => d.djia)),
      yTicks,
      xLabels,
      n,
    };
  }, [data]);

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    if (layout.n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    if (sx < PAD.l || sx > W - PAD.r) {
      setHover(null);
      return;
    }
    const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
    const index = Math.min(layout.n - 1, Math.max(0, Math.round(t * (layout.n - 1))));
    setHover({ index, px: layout.x(index) });
  };

  const tip = hover
    ? {
        date: data[hover.index].date,
        f1: data[hover.index].f1,
        djia: data[hover.index].djia,
        x: layout.x(hover.index),
      }
    : null;

  return (
    <div
      className="rounded-2xl border bg-surface-2 p-4 sm:p-5"
      style={{
        borderColor: tone === "up" ? "var(--positive)" : "var(--negative)",
        borderWidth: 1,
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          {title ?? "F1 vs DJIA — cumulative return"}
        </h3>
        <span className="text-[11px] text-text-muted">rebased to 1.0 at period start</span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label="F1 cumulative return vs DJIA over the period"
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
                {((t.v - 1) * 100).toFixed(1)}%
              </text>
            </g>
          ))}

          {layout.xLabels.map((t) => (
            <text
              key={t.i}
              x={t.x}
              y={H - 10}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
            >
              {t.label}
            </text>
          ))}

          <path d={layout.pathDjia} fill="none" stroke={BENCH} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.75} />
          <path d={layout.pathF1} fill="none" stroke={ACCENT} strokeWidth={2.25} />

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

          {tip ? (
            <>
              <circle cx={tip.x} cy={layout.y(tip.f1)} r={3.5} fill={ACCENT} stroke="var(--bg-soft)" strokeWidth={1} />
              <circle cx={tip.x} cy={layout.y(tip.djia)} r={3} fill={BENCH} stroke="var(--bg-soft)" strokeWidth={1} />
            </>
          ) : null}
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[170px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 190px))`,
              top: 6,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">{tip.date}</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-text">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                  F1
                </span>
                <span className="tabular-nums font-medium">{((tip.f1 - 1) * 100).toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-text-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: BENCH }} />
                  DJIA
                </span>
                <span className="tabular-nums">{((tip.djia - 1) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
          <span className="inline-block h-0.5 w-5" style={{ background: ACCENT }} />
          F1
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-px w-5 border-t border-dashed" style={{ borderColor: BENCH }} />
          DJIA
        </span>
      </div>
    </div>
  );
}
