"use client";

import { useState } from "react";
import { LeagueLegend } from "./LeagueLegend";
import type { LineSeries } from "./lab";

const W = 760;
const H = 360;
const PAD = { l: 52, r: 16, t: 20, b: 48 };

function yFmtPct(v: number) {
  return `${(100 * v).toFixed(1)}%`;
}
function yFmtNum(v: number) {
  return v.toFixed(2);
}

export function LeagueTimeChart({
  title,
  series,
  yPct,
  zero,
  height = H,
}: {
  title: string;
  series: LineSeries[];
  yPct?: boolean;
  zero?: boolean;
  height?: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const allPts = series.flatMap((s) => s.pts);
  const fmt = yPct ? yFmtPct : yFmtNum;
  if (!allPts.length) {
    return (
      <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
        <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          {title}
        </figcaption>
        <p className="mt-3 text-sm text-text-muted">no series</p>
      </figure>
    );
  }
  const ts = allPts.map((p) => Date.parse(p.x));
  const ys = allPts.map((p) => p.y).filter((v) => v != null);
  const t0 = Math.min(...ts);
  const t1 = Math.max(...ts);
  let ymin = Math.min(...ys);
  let ymax = Math.max(...ys);
  if (zero) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  const span = ymax - ymin || 1;
  ymin -= span * 0.03;
  ymax += span * 0.03;
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const x = (iso: string) => PAD.l + ((Date.parse(iso) - t0) / (t1 - t0 || 1)) * iw;
  const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const months: string[] = [];
  const start = new Date(t0);
  const end = new Date(t1);
  for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d <= end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`);
  }
  const step = months.length > 10 ? 2 : 1;
  const dates = [...new Set(series.flatMap((s) => s.pts.map((p) => p.x)))].sort();
  const active = hover && dates.includes(hover) ? hover : null;

  return (
    <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="mt-3 h-auto w-full"
        role="img"
        aria-label={title}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const sx = ((e.clientX - rect.left) / rect.width) * W;
          if (sx < PAD.l || sx > W - PAD.r) {
            setHover(null);
            return;
          }
          const tMouse = t0 + ((sx - PAD.l) / iw) * (t1 - t0 || 1);
          let best = dates[0];
          let bestD = Infinity;
          dates.forEach((d) => {
            const dd = Math.abs(Date.parse(d) - tMouse);
            if (dd < bestD) {
              bestD = dd;
              best = d;
            }
          });
          setHover(best);
        }}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text
              x={PAD.l - 10}
              y={y(t) + 3}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {months.map((iso, i) =>
          i % step ? null : (
            <text
              key={iso}
              x={x(iso)}
              y={height - 16}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
              transform={`rotate(-35 ${x(iso)} ${height - 16})`}
            >
              {iso.slice(0, 7)}
            </text>
          ),
        )}
        {series.map((s) => {
          const d = s.pts
            .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`)
            .join(" ");
          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={s.dashed ? 1.6 : 2.1}
              strokeDasharray={s.dashed ? "4 4" : undefined}
              opacity={s.dashed ? 0.85 : 1}
            />
          );
        })}
        {active ? (
          <>
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.t}
              y2={height - PAD.b}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
            {series.map((s) => {
              const p = s.pts.reduce((a, b) =>
                Math.abs(Date.parse(b.x) - Date.parse(active)) <
                Math.abs(Date.parse(a.x) - Date.parse(active))
                  ? b
                  : a,
              );
              return (
                <circle
                  key={s.id}
                  cx={x(p.x)}
                  cy={y(p.y)}
                  r={4}
                  fill={s.color}
                  stroke="var(--bg-soft)"
                  strokeWidth={1}
                >
                  <title>{`${s.label} ${p.x}: ${fmt(p.y)}`}</title>
                </circle>
              );
            })}
          </>
        ) : null}
      </svg>
      {active ? (
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          {active}
          {series.map((s) => {
            const p = s.pts.reduce((a, b) =>
              Math.abs(Date.parse(b.x) - Date.parse(active)) <
              Math.abs(Date.parse(a.x) - Date.parse(active))
                ? b
                : a,
            );
            return ` · ${s.label} ${fmt(p.y)}`;
          })}
        </p>
      ) : (
        <LeagueLegend series={series} />
      )}
    </figure>
  );
}
