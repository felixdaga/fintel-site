"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";

const W = 760;
const H = 280;
const PAD = { l: 52, r: 16, t: 16, b: 48 };

const ALPHA = "#5cb88a";
const ALPHA_NEG = "#c47d72";

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

function fmtBps(v: number) {
  const n = Math.round(v);
  if (n > 0) return `+${n}`;
  return String(n);
}

/** Basis-point axis that always includes zero, with a handful of round ticks. */
function bpsAxis(values: number[]) {
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const raw = Math.max(hi - lo, 1) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = (n >= 7.5 ? 10 : n >= 3.5 ? 5 : n >= 1.5 ? 2 : 1) * pow;
  const start = Math.floor(lo / step) * step;
  const end = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step * 1e-6; v += step) ticks.push(v);
  return { start, end, ticks };
}

export function AlphaBarChart({
  dates,
  f1,
  benchmark,
  title,
  titleShort,
  aria,
  alphaLabel,
  alphaShortLabel,
}: {
  dates: string[];
  f1: number[];
  benchmark: number[];
  title: string;
  titleShort: string;
  aria: string;
  alphaLabel: string;
  alphaShortLabel: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);

  const bps = useMemo(
    () => f1.map((v, i) => (v / benchmark[i] - 1) * 10000),
    [f1, benchmark],
  );

  const layout = useMemo(() => {
    const axis = bpsAxis(bps);
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const n = dates.length;
    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) =>
      PAD.t + ih - ((v - axis.start) / (axis.end - axis.start || 1)) * ih;
    const zeroY = y(0);
    const slot = n <= 1 ? iw : iw / Math.max(1, n - 1);
    const bw = Math.max(1.25, slot * 0.62);
    const bars = bps.map((v, i) => {
      const cx = x(i);
      const bx = Math.max(PAD.l, Math.min(cx - bw / 2, W - PAD.r - bw));
      const yv = y(v);
      const top = Math.min(zeroY, yv);
      return { i, v, bx, top, h: Math.abs(yv - zeroY), cx: bx + bw / 2 };
    });
    const step = Math.max(1, Math.ceil((n - 1) / 8));
    const labelIdx = new Set<number>();
    for (let i = 0; i < n; i += step) labelIdx.add(i);
    if (n > 0) labelIdx.add(n - 1);
    const xLabels = [...labelIdx]
      .sort((a, b) => a - b)
      .map((i) => ({ i, x: x(i), label: fmtDate(dates[i]) }));
    return {
      x,
      bars,
      barW: bw,
      zeroY,
      xLabels,
      yTicks: axis.ticks.map((v) => ({ v, y: y(v) })),
    };
  }, [bps, dates]);

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
    ? { date: dates[hover.index], bps: bps[hover.index], x: layout.x(hover.index) }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-5">
      <h2 className="pt-1 text-sm font-medium leading-snug text-text">
        <span className="sm:hidden">{titleShort}</span>
        <span className="hidden sm:inline">{title}</span>
      </h2>

      <div className="relative mt-3 sm:mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y cursor-crosshair"
          role="img"
          aria-label={aria}
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
                {fmtBps(t.v)}
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

          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={layout.zeroY}
            y2={layout.zeroY}
            stroke={ALPHA}
            strokeWidth={1}
            opacity={0.45}
          />
          {layout.bars.map((b) =>
            b.h < 0.4 ? null : (
              <rect
                key={b.i}
                x={b.bx}
                y={b.top}
                width={layout.barW}
                height={b.h}
                fill={b.v >= 0 ? ALPHA : ALPHA_NEG}
                opacity={hover?.index === b.i ? 0.95 : 0.72}
              />
            ),
          )}

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
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[160px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 180px))`,
              top: 8,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">{tip.date}</div>
            <div className="flex items-center justify-between gap-4 text-text">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-[2px]"
                  style={{ background: tip.bps >= 0 ? ALPHA : ALPHA_NEG }}
                />
                {alphaShortLabel}
              </span>
              <span className="tabular-nums font-medium">{fmtBps(tip.bps)} bps</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: ALPHA }} />
          {alphaLabel}
        </span>
      </div>
    </div>
  );
}
