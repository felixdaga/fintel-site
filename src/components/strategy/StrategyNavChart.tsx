"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";

const W = 760;
const H = 360;
const PAD = { l: 52, r: 16, t: 20, b: 48 };

const ACCENT = "#6f93cf";
const BENCH = "#6b7a8e";
const ALPHA = "#5cb88a";

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

export function StrategyNavChart({
  dates,
  f1,
  benchmark,
}: {
  dates: string[];
  f1: number[];
  benchmark: number[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);

  const alpha = useMemo(
    () => f1.map((v, i) => v / benchmark[i]),
    [f1, benchmark],
  );

  const layout = useMemo(() => {
    const all = [...f1, ...benchmark, ...alpha];
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

    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = ymin + ((ymax - ymin) * i) / 4;
      return { v, y: y(v) };
    });

    // Daily series is dense; keep ~8 labels plus the last point
    const step = Math.max(1, Math.ceil((n - 1) / 8));
    const labelIdx = new Set<number>();
    for (let i = 0; i < n; i += step) labelIdx.add(i);
    if (n > 0) labelIdx.add(n - 1);
    const xLabels = [...labelIdx]
      .sort((a, b) => a - b)
      .map((i) => ({ i, x: x(i), label: fmtDate(dates[i]) }));

    return {
      x,
      y,
      pathF1: toPath(f1),
      pathBench: toPath(benchmark),
      pathAlpha: toPath(alpha),
      yTicks,
      xLabels,
      n,
    };
  }, [dates, f1, benchmark, alpha]);

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
        f1: f1[hover.index],
        bench: benchmark[hover.index],
        alpha: alpha[hover.index],
        x: layout.x(hover.index),
      }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium leading-snug text-text">
            <span className="sm:hidden">F1 gross return since deployment</span>
            <span className="hidden sm:inline">
              F1 gross cumulative return since deployment
            </span>
          </h2>
        </div>
        {tip ? (
          <div className="font-mono text-xs text-text-soft">{tip.date}</div>
        ) : null}
      </div>

      <div className="relative mt-3 sm:mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y cursor-crosshair"
          role="img"
          aria-label="F1 strategy cumulative return vs DJIA benchmark and relative alpha"
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
                {t.v.toFixed(2)}
              </text>
            </g>
          ))}

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

          <path
            d={layout.pathBench}
            fill="none"
            stroke={BENCH}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.7}
          />
          <path
            d={layout.pathF1}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.25}
          />
          <path
            d={layout.pathAlpha}
            fill="none"
            stroke={ALPHA}
            strokeWidth={1.75}
            strokeDasharray="6 3"
          />

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
              <circle
                cx={tip.x}
                cy={layout.y(tip.f1)}
                r={4}
                fill={ACCENT}
                stroke="var(--bg-soft)"
                strokeWidth={1}
              />
              <circle
                cx={tip.x}
                cy={layout.y(tip.bench)}
                r={3}
                fill={BENCH}
                stroke="var(--bg-soft)"
                strokeWidth={1}
              />
              <circle
                cx={tip.x}
                cy={layout.y(tip.alpha)}
                r={3}
                fill={ALPHA}
                stroke="var(--bg-soft)"
                strokeWidth={1}
              />
            </>
          ) : null}
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[180px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 200px))`,
              top: 8,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">{tip.date}</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-text">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                  F1
                </span>
                <span className="tabular-nums font-medium">{tip.f1.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-text-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: BENCH }} />
                  DJIA
                </span>
                <span className="tabular-nums">{tip.bench.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-text-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ALPHA }} />
                  Alpha
                </span>
                <span className="tabular-nums">
                  {tip.alpha.toFixed(4)}{" "}
                  <span className="text-text-muted">
                    ({((tip.alpha - 1) * 100).toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
          <span className="inline-block h-0.5 w-5" style={{ background: ACCENT }} />
          F1 (gross)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-px w-5 border-t border-dashed" style={{ borderColor: BENCH }} />
          DJIA
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span
            className="inline-block h-px w-5 border-t border-dashed"
            style={{ borderColor: ALPHA }}
          />
          Alpha (F1 ÷ DJIA)
        </span>
      </div>
    </div>
  );
}
