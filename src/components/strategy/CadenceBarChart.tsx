"use client";

import { useMemo } from "react";
import { PALETTE } from "@/components/leaderboard/chartPalette";

export type CadenceBarChartProps = {
  cadences: { id: string; label: string; period?: string }[];
  metrics: { id: string; label: string; values: Record<string, number> }[];
  /** id of the cadence to emphasise; others are muted */
  highlightId?: string;
  title?: string;
  /** small category header rendered above the title */
  eyebrow?: string;
  caption?: string;
};

const W = 760;
const H = 340;
const PAD = { l: 48, r: 16, t: 16, b: 56 };
const GAP = 28; // gap between the two metric panels

export function CadenceBarChart({
  cadences,
  metrics,
  highlightId,
  title,
  eyebrow,
  caption,
}: CadenceBarChartProps) {
  const colors = useMemo(
    () => cadences.map((_, i) => PALETTE[i % PALETTE.length]),
    [cadences],
  );

  const panels = useMemo(() => {
    const nPanels = metrics.length;
    const innerW = W - PAD.l - PAD.r;
    const panelW = (innerW - GAP * (nPanels - 1)) / nPanels;
    return metrics.map((m, pi) => {
      const x0 = PAD.l + pi * (panelW + GAP);
      const vals = cadences.map((c) => Number(m.values[c.id] ?? 0));
      const ymax = Math.max(...vals, 0) * 1.18 || 1;
      const ymin = 0;
      const ih = H - PAD.t - PAD.b;
      const barW = Math.min(54, panelW / (cadences.length + 1));
      const slot = panelW / cadences.length;
      const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
      const yTicks = Array.from({ length: 4 }, (_, i) => {
        const v = ymin + ((ymax - ymin) * i) / 3;
        return { v, y: y(v) };
      });
      const bars = cadences.map((c, ci) => {
        const v = Number(m.values[c.id] ?? 0);
        const bx = x0 + slot * ci + (slot - barW) / 2;
        const by = y(v);
        const bh = PAD.t + ih - by;
        return { id: c.id, label: c.label, v, bx, by, bh };
      });
      return { m, x0, panelW, y, yTicks, bars, barW };
    });
  }, [metrics, cadences]);

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3 sm:p-5">
      {(eyebrow || title) && (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            {eyebrow ? (
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h3 className="text-sm font-medium leading-snug text-text">{title}</h3>
            ) : null}
          </div>
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={title ?? "cadence bar chart"}
        >
          {panels.map((p) => (
            <g key={p.m.id}>
              {/* y grid + ticks (per panel, own scale) */}
              {p.yTicks.map((t) => (
                <g key={t.v}>
                  <line
                    x1={p.x0}
                    x2={p.x0 + p.panelW}
                    y1={t.y}
                    y2={t.y}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  <text
                    x={p.x0 - 8}
                    y={t.y + 3}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    fontSize={10}
                    fontFamily="var(--font-geist-mono)"
                  >
                    {p.m.id === "ann_cost"
                      ? t.v.toFixed(2)
                      : t.v.toFixed(1)}
                  </text>
                </g>
              ))}
              {/* metric label */}
              <text
                x={p.x0 + p.panelW / 2}
                y={H - 30}
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
              >
                {p.m.label}
              </text>
              {/* bars */}
              {p.bars.map((b, ci) => {
                const muted = highlightId && b.id !== highlightId;
                return (
                <g key={b.id} opacity={muted ? 0.35 : 1}>
                  <rect
                    x={b.bx}
                    y={b.by}
                    width={p.barW}
                    height={Math.max(0, b.bh)}
                    fill={colors[ci]}
                    rx={2}
                  />
                  <text
                    x={b.bx + p.barW / 2}
                    y={b.by - 6}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono)"
                  >
                    {p.m.id === "ann_cost"
                      ? b.v.toFixed(2)
                      : b.v.toFixed(1)}
                  </text>
                  <text
                    x={b.bx + p.barW / 2}
                    y={H - 14}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize={9}
                    fontFamily="var(--font-geist-mono)"
                  >
                    {b.label}
                  </text>
                </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {cadences.map((c, i) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1.5 text-[11px] text-text-soft"
            style={{ opacity: highlightId && c.id !== highlightId ? 0.4 : 1 }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: colors[i] }}
            />
            {c.label}
          </span>
        ))}
      </div>

      {caption ? (
        <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
