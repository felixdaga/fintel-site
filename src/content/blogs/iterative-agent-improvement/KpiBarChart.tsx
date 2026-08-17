"use client";

import { useId } from "react";

export type Bar = {
  label: string;
  sublabel: string;
  residualIc: number;
  color: string;
};

const W = 720;
const H = 360;
const PAD = { l: 56, r: 24, t: 28, b: 64 };

function fmtIc(v: number) {
  return v.toFixed(3);
}

export type ExtraRow<T extends Bar> = {
  label: string;
  value: (b: T) => number;
  format: (b: T) => string;
  /** 0..1 normalized for a thin inline meter; omit for plain text. */
  meter?: (b: T) => number;
  meterColor?: (b: T) => string;
};

/**
 * Horizontal bar chart of factor-neutralized residual IC across a small set
 * of configurations. Used for the model comparison (Example 1) and the harness
 * comparison (Example 2). Optional extra rows rendered under each bar.
 */
export function KpiBarChart<T extends Bar>({
  bars,
  extraRows,
}: {
  bars: T[];
  extraRows?: ExtraRow<T>[];
}) {
  const gid = useId();
  const maxVal = Math.max(...bars.map((b) => b.residualIc));
  const minVal = 0;
  const padL = PAD.l;
  const padR = PAD.r;
  const padT = PAD.t;
  const padB = PAD.b;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // bar geometry
  const n = bars.length;
  const slot = plotW / n;
  const barW = Math.min(140, slot * 0.5);

  const yFor = (v: number) =>
    padT + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  // y ticks — 5 stops from 0 to max (rounded up to a nice step)
  const step = niceStep(maxVal / 4);
  const tickMax = Math.max(step * Math.ceil(maxVal / step), step);
  const ticks = Array.from(
    { length: Math.round(tickMax / step) + 1 },
    (_, i) => i * step,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          factor-neutralized residual IC
        </h3>
        <span className="text-[11px] text-text-muted">higher is better · h1</span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Factor-neutralized residual IC by configuration"
        >
          {/* y grid + labels */}
          {ticks.map((t) => {
            const yy = yFor(t);
            if (yy < padT - 0.5 || yy > padT + plotH + 0.5) return null;
            return (
              <g key={t}>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={yy}
                  y2={yy}
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray={t === 0 ? "" : "4 4"}
                />
                <text
                  x={padL - 10}
                  y={yy + 3.5}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize={10}
                  fontFamily="var(--font-geist-mono)"
                >
                  {fmtIc(t)}
                </text>
              </g>
            );
          })}

          {/* bars */}
          {bars.map((b, i) => {
            const cx = padL + slot * (i + 0.5);
            const x = cx - barW / 2;
            const top = yFor(b.residualIc);
            const h = padT + plotH - top;
            return (
              <g key={b.label}>
                <defs>
                  <linearGradient id={`${gid}-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={b.color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={b.color} stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <rect
                  x={x}
                  y={top}
                  width={barW}
                  height={Math.max(0, h)}
                  fill={`url(#${gid}-grad-${i})`}
                  rx={6}
                />
                {/* value label above bar */}
                <text
                  x={cx}
                  y={top - 8}
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize={13}
                  fontWeight={700}
                  fontFamily="var(--font-geist-mono)"
                >
                  {fmtIc(b.residualIc)}
                </text>
                {/* x label below axis */}
                <text
                  x={cx}
                  y={padT + plotH + 22}
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize={12}
                  fontWeight={600}
                >
                  {b.label}
                </text>
                <text
                  x={cx}
                  y={padT + plotH + 38}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize={10}
                >
                  {b.sublabel}
                </text>
              </g>
            );
          })}

          {/* x axis baseline */}
          <line
            x1={padL}
            x2={W - padR}
            y1={padT + plotH}
            y2={padT + plotH}
            stroke="var(--border-strong)"
            strokeWidth={1.25}
          />
        </svg>
      </div>

      {/* extra rows (intelligence / hallucination, etc.) */}
      {extraRows && extraRows.length > 0 ? (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {bars.map((b) => (
            <div
              key={b.label}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-xs font-semibold text-text">
                  {b.label}
                </span>
              </div>
              <div className="space-y-1.5">
                {extraRows.map((row) => {
                  const text = row.format(b);
                  const meter = row.meter?.(b);
                  const meterColor = row.meterColor?.(b) ?? "var(--accent)";
                  return (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 text-[11px]"
                    >
                      <span className="w-28 shrink-0 uppercase tracking-wider text-text-muted">
                        {row.label}
                      </span>
                      {meter != null ? (
                        <span className="flex flex-1 items-center gap-2">
                          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft">
                            <span
                              className="absolute left-0 top-0 h-full rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(0, meter * 100))}%`,
                                backgroundColor: meterColor,
                              }}
                            />
                          </span>
                          <span className="tabular-nums text-text-soft">{text}</span>
                        </span>
                      ) : (
                        <span className="tabular-nums text-text-soft">{text}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 0.01;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  let step: number;
  if (n < 1.5) step = 1;
  else if (n < 3) step = 2;
  else if (n < 7) step = 5;
  else step = 10;
  return step * pow;
}
