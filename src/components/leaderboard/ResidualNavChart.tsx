"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { LeaderboardRow } from "./types";

const PALETTE = [
  "#6f93cf",
  "#e8924a",
  "#4cae86",
  "#c77dbb",
  "#e8c547",
  "#7eb8c9",
  "#d97a6c",
  "#8aa9df",
  "#a6d189",
  "#f5b078",
  "#9b8fd9",
];

const W = 720;
const H = 340;
const PAD = { l: 48, r: 16, t: 16, b: 44 };

function colorFor(id: string, ids: string[]) {
  const i = ids.indexOf(id);
  return PALETTE[i >= 0 ? i % PALETTE.length : 0];
}

function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}

export function ResidualNavChart({
  dates,
  benchmark,
  rows,
}: {
  dates: string[];
  benchmark: number[];
  rows: LeaderboardRow[];
}) {
  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{
    index: number;
    px: number;
    py: number;
  } | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(
    rows[0]?.id ?? null,
  );

  const toggleHighlight = useCallback((id: string) => {
    setHighlightId((cur) => (cur === id ? null : id));
  }, []);

  const layout = useMemo(() => {
    const all = [...benchmark, ...rows.flatMap((r) => r.nav_residual)];
    const ymin = Math.min(...all) * 0.96;
    const ymax = Math.max(...all) * 1.02;
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

    // Decision dates are already quarterly — label every point.
    const xLabels = dates.map((d, i) => ({
      i,
      x: x(i),
      label: fmtMonth(d),
    }));

    const points = dates.map((_, i) => ({
      i,
      x: x(i),
      date: dates[i],
      bench: benchmark[i],
      values: rows.map((r) => ({
        id: r.id,
        agent: r.chart_label,
        color: colorFor(r.id, ids),
        v: r.nav_residual[i] ?? null,
      })),
    }));

    return {
      iw,
      ih,
      ymin,
      ymax,
      x,
      y,
      pathBench: toPath(benchmark),
      series: rows.map((r) => ({
        id: r.id,
        agent: r.chart_label,
        color: colorFor(r.id, ids),
        path: toPath(r.nav_residual),
        end: r.nav_residual[r.nav_residual.length - 1] ?? 1,
        values: r.nav_residual,
      })),
      yTicks,
      xLabels,
      points,
    };
  }, [dates, benchmark, rows, ids]);

  const onMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || dates.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * W;
      const sy = ((e.clientY - rect.top) / rect.height) * H;
      if (sx < PAD.l || sx > W - PAD.r || sy < PAD.t || sy > H - PAD.b) {
        setHover(null);
        return;
      }
      const n = dates.length;
      const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
      const index = Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))));
      setHover({ index, px: layout.x(index), py: sy });
    },
    [dates.length, layout],
  );

  const tip = hover ? layout.points[hover.index] : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-text">
            cumulative return
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Dollar-neutral proportional tilt on factor-neutralized score · vs
            price-weighted DJIA · quarterly
          </p>
        </div>
        {tip ? (
          <div className="font-mono text-xs text-text-soft">
            {fmtMonth(tip.date)}
          </div>
        ) : null}
      </div>

      <div className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label="Cumulative NAV for naive tilt on factor-neutralized score"
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
                x={PAD.l - 8}
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
              y={H - 14}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
              transform={`rotate(-40 ${t.x} ${H - 14})`}
            >
              {t.label}
            </text>
          ))}

          <path
            d={layout.pathBench}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.75}
          />

          {layout.series.map((s) => (
            <path
              key={s.id}
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth={highlightId === s.id ? 2.75 : 1.6}
              opacity={1}
            />
          ))}

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
            ? tip.values.map((v) =>
                v.v == null ? null : (
                  <circle
                    key={v.id}
                    cx={tip.x}
                    cy={layout.y(v.v)}
                    r={highlightId === v.id ? 4 : 3}
                    fill={v.color}
                    stroke="var(--bg-soft)"
                    strokeWidth={1}
                  />
                ),
              )
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
            className="pointer-events-none absolute z-10 max-h-64 min-w-[220px] overflow-y-auto rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur"
            style={{
              left: `min(${(tip.x / W) * 100}%, calc(100% - 240px))`,
              top: 8,
            }}
          >
            <div className="mb-1.5 font-mono text-text-muted">
              {fmtMonth(tip.date)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-text-muted">
                <span>DJIA pw</span>
                <span className="tabular-nums">{tip.bench?.toFixed(3)}</span>
              </div>
              {[...tip.values]
                .sort((a, b) => (b.v ?? 0) - (a.v ?? 0))
                .map((v) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between gap-4 ${
                      highlightId === v.id ? "text-text" : "text-text-soft"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: v.color }}
                      />
                      <span className="truncate">{v.agent}</span>
                    </span>
                    <span className="tabular-nums font-medium">
                      {v.v?.toFixed(3)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
          <span
            className="inline-block h-px w-4 border-t border-dashed border-text-muted"
            aria-hidden
          />
          DJIA pw
        </span>
        {layout.series.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggleHighlight(s.id)}
            className={`inline-flex items-center gap-1.5 text-[11px] transition-opacity hover:opacity-100 ${
              highlightId === s.id ? "text-text" : "text-text-soft"
            }`}
            style={{ opacity: !highlightId || highlightId === s.id ? 1 : 0.45 }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.agent}
            <span className="text-text-muted">{s.end.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { colorFor, PALETTE };
