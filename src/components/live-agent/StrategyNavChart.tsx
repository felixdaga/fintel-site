"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";

const W = 760;
const H = 360;
const PAD = { l: 52, r: 16, t: 20, b: 48 };

const ACCENT = "#e8924a";
const BENCH = "#6f93cf";
const MCAP = "#6b7a8e";

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

function fmtTipPct(level: number) {
  const n = (level - 1) * 100;
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

/** Percent axis on a 1.0 = 0% scale, so a level of 1.2 reads as 20%. */
function pctAxis(values: number[]) {
  const lo = (Math.min(...values) - 1) * 100;
  const hi = (Math.max(...values) - 1) * 100;
  const span = Math.max(hi - lo, 1);
  const step = span >= 15 ? 5 : span >= 8 ? 2 : 1;
  let start = Math.floor(lo / step) * step;
  let end = Math.ceil(hi / step) * step;
  if (lo - start < step * 0.25) start -= step;
  if (end - hi < step * 0.25) end += step;
  const ticks: number[] = [];
  for (let p = start; p <= end + step * 1e-6; p += step) ticks.push(p);
  return { start, end, ticks };
}

export function StrategyNavChart({
  dates,
  f1,
  benchmark,
  benchmarkMcap,
  title,
  titleShort,
  aria,
  agentLabel,
  agentShortLabel,
  benchmarkLabel,
  benchmarkShortLabel,
  benchmarkMcapLabel,
  benchmarkMcapShortLabel,
  navBubble,
}: {
  dates: string[];
  f1: number[];
  benchmark: number[];
  benchmarkMcap?: number[];
  title: string;
  titleShort: string;
  aria: string;
  agentLabel: string;
  agentShortLabel: string;
  benchmarkLabel: string;
  benchmarkShortLabel: string;
  benchmarkMcapLabel?: string;
  benchmarkMcapShortLabel?: string;
  navBubble?: { value: string; label: string };
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);
  const mcap = benchmarkMcap && benchmarkMcap.length === f1.length ? benchmarkMcap : null;

  const layout = useMemo(() => {
    const navVals = mcap ? [...f1, ...benchmark, ...mcap] : [...f1, ...benchmark];
    const axis = pctAxis(navVals);
    const ymin = 1 + axis.start / 100;
    const ymax = 1 + axis.end / 100;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const n = dates.length;

    const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
    const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin || 1)) * ih;

    const toPath = (vals: number[]) =>
      vals
        .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
        .join(" ");

    const yTicks = axis.ticks.map((pct) => {
      const v = 1 + pct / 100;
      return { pct, v, y: y(v) };
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
      y,
      pathF1: toPath(f1),
      pathBench: toPath(benchmark),
      pathMcap: mcap ? toPath(mcap) : null,
      yTicks,
      xLabels,
    };
  }, [dates, f1, benchmark, mcap]);

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
        mcap: mcap ? mcap[hover.index] : null,
        x: layout.x(hover.index),
      }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 pt-1 text-sm font-medium leading-snug text-text">
          <span className="sm:hidden">{titleShort}</span>
          <span className="hidden sm:inline">{title}</span>
        </h2>
        {navBubble ? (
          <div className="inline-flex shrink-0 items-baseline gap-2 rounded-xl border border-orange/50 bg-orange-soft/55 px-3 py-1.5">
            <span className="text-base font-bold tabular-nums tracking-tight text-white sm:text-lg">
              {navBubble.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange/80">
              {navBubble.label}
            </span>
          </div>
        ) : null}
      </div>

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
            <g key={t.pct}>
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
                {t.pct}%
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

          {layout.pathMcap ? (
            <path
              d={layout.pathMcap}
              fill="none"
              stroke={MCAP}
              strokeWidth={2.25}
              strokeDasharray="1.2 4.5"
              strokeLinecap="round"
            />
          ) : null}
          <path
            d={layout.pathBench}
            fill="none"
            stroke={BENCH}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.85}
          />
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
              {tip.mcap != null ? (
                <circle
                  cx={tip.x}
                  cy={layout.y(tip.mcap)}
                  r={3}
                  fill={MCAP}
                  stroke="var(--bg-soft)"
                  strokeWidth={1}
                />
              ) : null}
            </>
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
              <Row color={ACCENT} label={agentShortLabel} value={fmtTipPct(tip.f1)} strong />
              <Row color={BENCH} label={benchmarkShortLabel} value={fmtTipPct(tip.bench)} />
              {tip.mcap != null && benchmarkMcapShortLabel ? (
                <Row color={MCAP} label={benchmarkMcapShortLabel} value={fmtTipPct(tip.mcap)} />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
          <span className="inline-block h-0.5 w-5" style={{ background: ACCENT }} />
          {agentLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span
            className="inline-block h-px w-5 border-t border-dashed"
            style={{ borderColor: BENCH }}
          />
          {benchmarkLabel}
        </span>
        {mcap && benchmarkMcapLabel ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
            <span
              className="inline-block w-5 border-t-2 border-dotted"
              style={{ borderColor: MCAP }}
            />
            {benchmarkMcapLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Row({
  color,
  label,
  value,
  strong,
}: {
  color: string;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${strong ? "text-text" : "text-text-soft"}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className={`tabular-nums ${strong ? "font-medium" : ""}`}>{value}</span>
    </div>
  );
}
