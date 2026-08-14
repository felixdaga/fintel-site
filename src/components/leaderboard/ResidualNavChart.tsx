"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { LeaderboardRow } from "./types";
import { colorFor } from "./chartPalette";

const LABEL_GAP = 13;
const SIZE = {
  box: { W: 720, H: 340, pad: { l: 48, r: 16, t: 16, b: 44 } },
  end: { W: 1180, H: 440, pad: { l: 128, r: 210, t: 16, b: 44 } },
} as const;

type Pad = { l: number; r: number; t: number; b: number };

type ChartProps = {
  dates: string[];
  benchmark: number[];
  rows: LeaderboardRow[];
  caption?: string | false;
  legend?: "box" | "end";
  framed?: boolean;
  benchmarkLabel?: string;
};

function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}

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

function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return phone;
}

export function ResidualNavChart({
  dates,
  benchmark,
  rows,
  caption,
  legend = "box",
  framed = true,
  benchmarkLabel = "DJIA pw",
}: ChartProps) {
  const phone = usePhone();
  const mode = phone && legend === "end" ? "box" : legend;
  const { W, H, pad } = SIZE[mode];
  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ index: number; px: number } | null>(
    null,
  );
  const [highlightId, setHighlightId] = useState<string | null>(
    legend === "end" ? null : (rows[0]?.id ?? null),
  );

  const toggleHighlight = useCallback((id: string) => {
    setHighlightId((cur) => (cur === id ? null : id));
  }, []);

  const layout = useMemo(
    () => buildLayout({ dates, benchmark, rows, ids, W, H, pad }),
    [dates, benchmark, rows, ids, W, H, pad],
  );

  const endLabels = useMemo(() => {
    if (mode !== "end") return [];
    const last = dates.length - 1;
    const items = [
      {
        id: "__bench",
        label: benchmarkLabel,
        color: "var(--text-muted)",
        yTrue: layout.y(benchmark[last] ?? 1),
      },
      ...layout.series.map((s) => ({
        id: s.id,
        label: s.agent,
        color: s.color,
        yTrue: layout.y(s.end),
      })),
    ];
    const ys = spreadYs(
      items.map((it) => it.yTrue),
      pad.t + 6,
      H - pad.b - 6,
      LABEL_GAP,
    );
    const x0 = layout.x(Math.max(0, last));
    return items.map((it, i) => ({ ...it, y: ys[i], x: x0 }));
  }, [mode, dates.length, benchmark, layout, pad, H, benchmarkLabel]);

  const onMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || dates.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * W;
      const sy = ((e.clientY - rect.top) / rect.height) * H;
      if (sx < pad.l || sx > W - pad.r || sy < pad.t || sy > H - pad.b) {
        setHover(null);
        return;
      }
      const n = dates.length;
      const t = (sx - pad.l) / (W - pad.l - pad.r);
      const index = Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))));
      setHover({ index, px: layout.x(index) });
    },
    [dates.length, layout, W, H, pad],
  );

  const tip = hover ? layout.points[hover.index] : null;

  return (
    <div
      className={
        framed
          ? "w-full rounded-2xl border border-border bg-surface-2 p-5"
          : "w-full"
      }
    >
      <div
        className={`flex flex-wrap items-baseline justify-between gap-2 ${
          framed ? "" : "justify-center text-center"
        }`}
      >
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text">
            cumulative returns
          </h2>
          {caption !== false ? (
            <p className="mt-1 text-xs text-text-muted">
              {caption ??
                "Dollar-neutral proportional tilt on factor-neutralized score · vs price-weighted DJIA · quarterly"}
            </p>
          ) : null}
        </div>
        {tip ? (
          <div className="font-mono text-xs text-text-soft">
            {fmtMonth(tip.date)}
          </div>
        ) : null}
      </div>

      <div className={framed ? "relative mt-4" : "relative"}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label="Cumulative return vs portfolio benchmark"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {layout.yTicks.map((t) => (
            <g key={t.v}>
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={t.y}
                y2={t.y}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={pad.l - 8}
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
            opacity={!highlightId ? 0.75 : 0.3}
          />

          {layout.series.map((s) => (
            <path
              key={s.id}
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth={highlightId === s.id ? 2.75 : 1.6}
              opacity={!highlightId || highlightId === s.id ? 1 : 0.35}
            />
          ))}

          {endLabels.map((lab) => (
            <g
              key={lab.id}
              opacity={!highlightId || highlightId === lab.id ? 1 : 0.4}
              className={lab.id === "__bench" ? undefined : "cursor-pointer"}
              onClick={
                lab.id === "__bench" ? undefined : () => toggleHighlight(lab.id)
              }
            >
              {Math.abs(lab.y - lab.yTrue) > 1 ? (
                <path
                  d={`M ${lab.x} ${lab.yTrue} L ${lab.x + 5} ${lab.y}`}
                  fill="none"
                  stroke={lab.color}
                  strokeWidth={1}
                />
              ) : null}
              <text
                x={lab.x + 8}
                y={lab.y + 3.5}
                fill={lab.color}
                fontSize={10}
                fontWeight={700}
                fontFamily="var(--font-geist-mono)"
                stroke="var(--surface-2)"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {lab.label}
              </text>
            </g>
          ))}

          {hover ? (
            <line
              x1={hover.px}
              x2={hover.px}
              y1={pad.t}
              y2={H - pad.b}
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
          <HoverTip
            date={tip.date}
            bench={tip.bench}
            values={tip.values}
            highlightId={highlightId}
            benchmarkLabel={benchmarkLabel}
            leftPct={(tip.x / W) * 100}
          />
        ) : null}
      </div>

      {mode === "box" ? (
        <BoxLegend
          series={layout.series}
          highlightId={highlightId}
          benchmarkLabel={benchmarkLabel}
          onToggle={toggleHighlight}
        />
      ) : null}
    </div>
  );
}

function buildLayout({
  dates,
  benchmark,
  rows,
  ids,
  W,
  H,
  pad,
}: {
  dates: string[];
  benchmark: number[];
  rows: LeaderboardRow[];
  ids: string[];
  W: number;
  H: number;
  pad: Pad;
}) {
  const all = [...benchmark, ...rows.flatMap((r) => r.nav_residual)];
  const ymin = Math.min(...all) * 0.96;
  const ymax = Math.max(...all) * 1.02;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const n = dates.length;
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
  const y = (v: number) => pad.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const toPath = (vals: number[]) =>
    vals
      .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(" ");

  return {
    x,
    y,
    pathBench: toPath(benchmark),
    series: rows.map((r) => ({
      id: r.id,
      agent: r.chart_label,
      color: colorFor(r.id, ids),
      path: toPath(r.nav_residual),
      end: r.nav_residual[r.nav_residual.length - 1] ?? 1,
    })),
    yTicks: Array.from({ length: 5 }, (_, i) => {
      const v = ymin + ((ymax - ymin) * i) / 4;
      return { v, y: y(v) };
    }),
    xLabels: dates.map((d, i) => ({ i, x: x(i), label: fmtMonth(d) })),
    points: dates.map((_, i) => ({
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
    })),
  };
}

function HoverTip({
  date,
  bench,
  values,
  highlightId,
  benchmarkLabel,
  leftPct,
}: {
  date: string;
  bench: number;
  values: { id: string; agent: string; color: string; v: number | null }[];
  highlightId: string | null;
  benchmarkLabel: string;
  leftPct: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 max-h-64 min-w-[220px] overflow-y-auto rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur"
      style={{ left: `min(${leftPct}%, calc(100% - 240px))`, top: 8 }}
    >
      <div className="mb-1.5 font-mono text-text-muted">{fmtMonth(date)}</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4 text-text-muted">
          <span>{benchmarkLabel}</span>
          <span className="tabular-nums">{bench?.toFixed(3)}</span>
        </div>
        {[...values]
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
  );
}

function BoxLegend({
  series,
  highlightId,
  benchmarkLabel,
  onToggle,
}: {
  series: { id: string; agent: string; color: string; end: number }[];
  highlightId: string | null;
  benchmarkLabel: string;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
        <span
          className="inline-block h-px w-4 border-t border-dashed border-text-muted"
          aria-hidden
        />
        {benchmarkLabel}
      </span>
      {series.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onToggle(s.id)}
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
  );
}
