"use client";

import { useMemo, useState, type MouseEvent } from "react";

const W = 720;
const H = 440;
const PAD = { l: 60, r: 20, t: 18, b: 56 };

const POS = "#5cb88a";
const NEG = "#d97a6a";
const NEUTRAL = "#6b7a8e";

const X_AXIS_TITLE = "agent score (higher score = higher weight)";
const Y_AXIS_TITLE = "period return";

export type ScoreRow = {
  symbol: string;
  score: number;
  active_w: number;
  ret: number;
  contrib: number;
};

export function ScoreVsReturnChart({ data }: { data: ScoreRow[] }) {
  const [hover, setHover] = useState<string | null>(null);

  const layout = useMemo(() => {
    const scores = data.map((d) => d.score);
    const rets = data.map((d) => d.ret);
    const sMin = Math.min(...scores);
    const sMax = Math.max(...scores);
    const rMin = Math.min(...rets);
    const rMax = Math.max(...rets);
    // symmetrical x around 0 so the zero line is centered
    const sAbs = Math.max(Math.abs(sMin), Math.abs(sMax));
    const rPad = (rMax - rMin) * 0.08;
    const xMin = -sAbs * 1.08;
    const xMax = sAbs * 1.08;
    const yMin = rMin - rPad;
    const yMax = rMax + rPad;

    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const x = (v: number) => PAD.l + ((v - xMin) / (xMax - xMin)) * iw;
    const y = (v: number) => PAD.t + ih - ((v - yMin) / (yMax - yMin)) * ih;

    const maxAbsW = Math.max(...data.map((d) => Math.abs(d.active_w)));
    const r = (w: number) => 3 + (Math.abs(w) / maxAbsW) * 11;

    // x ticks: 0 plus the extremes
    const xTicks = [xMin, 0, xMax].map((v) => ({ v, x: x(v) }));
    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = yMin + ((yMax - yMin) * i) / 4;
      return { v, y: y(v) };
    });

    return { x, y, r, xTicks, yTicks, xMin, xMax, yMin, yMax };
  }, [data]);

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const sy = ((e.clientY - rect.top) / rect.height) * H;
    if (sx < PAD.l || sx > W - PAD.r || sy < PAD.t || sy > H - PAD.b) {
      setHover(null);
      return;
    }
    // nearest point
    let best: string | null = null;
    let bestD = Infinity;
    for (const d of data) {
      const dx = layout.x(d.score) - sx;
      const dy = layout.y(d.ret) - sy;
      const dist = dx * dx + dy * dy;
      if (dist < bestD) {
        bestD = dist;
        best = d.symbol;
      }
    }
    setHover(bestD < 900 ? best : null);
  };

  const tip = hover ? data.find((d) => d.symbol === hover) : null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text sm:text-base">
          Period return vs agent score — full DJIA-30
        </h3>
        <span className="text-[11px] text-text-muted">bubble size = active weight · color = added / detracted</span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label="Agent score versus period return for the DJIA-30 universe"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* y grid + ticks */}
          {layout.yTicks.map((t) => (
            <g key={t.v}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={t.y}
                y2={t.y}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={PAD.l - 10}
                y={t.y + 3}
                textAnchor="end"
                fill="var(--text-soft)"
                fontSize={10}
                fontWeight={600}
                fontFamily="var(--font-geist-mono)"
              >
                {t.v.toFixed(0)}%
              </text>
            </g>
          ))}

          {/* y-axis title (centered, bold, rotated) */}
          <text
            x={-(PAD.t + (H - PAD.t - PAD.b) / 2)}
            y={16}
            textAnchor="middle"
            fill="var(--text)"
            fontSize={11}
            fontWeight={700}
            fontFamily="var(--font-geist-mono)"
            transform="rotate(-90)"
          >
            {Y_AXIS_TITLE}
          </text>

          {/* x axis line at score=0 */}
          <line
            x1={layout.x(0)}
            x2={layout.x(0)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />
          {layout.xTicks.map((t) => (
            <text
              key={t.v}
              x={t.x}
              y={H - 34}
              textAnchor="middle"
              fill="var(--text-soft)"
              fontSize={10}
              fontWeight={600}
              fontFamily="var(--font-geist-mono)"
            >
              {t.v === 0 ? "0" : t.v.toFixed(2)}
            </text>
          ))}
          {/* x-axis title (centered, bold) */}
          <text
            x={PAD.l + (W - PAD.l - PAD.r) / 2}
            y={H - 12}
            textAnchor="middle"
            fill="var(--text)"
            fontSize={11}
            fontWeight={700}
            fontFamily="var(--font-geist-mono)"
          >
            {X_AXIS_TITLE}
          </text>

          {/* points */}
          {data.map((d) => {
            const isHover = hover === d.symbol;
            const color = d.contrib >= 0 ? POS : NEG;
            return (
              <g key={d.symbol} opacity={hover && !isHover ? 0.35 : 1}>
                <circle
                  cx={layout.x(d.score)}
                  cy={layout.y(d.ret)}
                  r={layout.r(d.active_w)}
                  fill={color}
                  fillOpacity={isHover ? 0.42 : 0.22}
                  stroke={color}
                  strokeWidth={isHover ? 1.5 : 1}
                />
                {(isHover || Math.abs(d.active_w) > 4) && (
                  <text
                    x={layout.x(d.score)}
                    y={layout.y(d.ret) - layout.r(d.active_w) - 3}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize={10}
                    fontFamily="var(--font-geist-mono)"
                    fontWeight={isHover ? 600 : 500}
                  >
                    {d.symbol}
                  </text>
                )}
              </g>
            );
          })}

          {tip ? (
            <circle
              cx={layout.x(tip.score)}
              cy={layout.y(tip.ret)}
              r={layout.r(tip.active_w) + 2}
              fill="none"
              stroke="var(--text)"
              strokeWidth={1.25}
            />
          ) : null}
        </svg>

        {tip ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[200px] rounded-lg border border-border bg-surface/95 px-3 py-2 text-[11px] backdrop-blur"
            style={{
              left: `min(${(layout.x(tip.score) / W) * 100}%, calc(100% - 220px))`,
              top: 8,
            }}
          >
            <div className="mb-1.5 font-mono font-semibold text-text">{tip.symbol}</div>
            <div className="space-y-0.5 text-text-soft">
              <Row label="score" v={tip.score.toFixed(2)} />
              <Row label="active weight" v={`${tip.active_w >= 0 ? "+" : ""}${tip.active_w.toFixed(1)}%`} />
              <Row label="period return" v={`${tip.ret >= 0 ? "+" : ""}${tip.ret.toFixed(2)}%`} />
              <Row label="active bps" v={`${tip.contrib >= 0 ? "+" : ""}${tip.contrib.toFixed(1)} bps`} colored={tip.contrib} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: POS }} />
          added to alpha
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: NEG }} />
          detracted from alpha
        </span>
      </div>
    </div>
  );
}

function Row({ label, v, colored }: { label: string; v: string; colored?: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-text-muted">{label}</span>
      <span
        className="tabular-nums font-medium"
        style={colored !== undefined ? { color: colored >= 0 ? "var(--positive)" : "var(--negative)" } : undefined}
      >
        {v}
      </span>
    </div>
  );
}
