"use client";

import { useMemo } from "react";
import {
  DATES,
  RUN_KEYS,
  PARTIES,
  CONFIG_KEYS,
  configData,
  METRIC_COLOR,
} from "./data";

type Metric = "threat_score" | "action_score";

export function SignFlipChart() {
  const rates = useMemo(() => {
    const out: Record<Metric, number> = { threat_score: 0, action_score: 0 };
    for (const metric of Object.keys(out) as Metric[]) {
      let total = 0, flips = 0;
      for (const ck of CONFIG_KEYS) {
        const d = configData[ck];
        for (const party of PARTIES) {
          for (const date of DATES) {
            const vals = RUN_KEYS.map(
              (rk) => d.runs[rk].dates[date]?.[party]?.[metric],
            ).filter((v): v is number => v != null);
            if (vals.length < 2) continue;
            total++;
            const signs = new Set(vals.map((v) => (v > 0 ? "+" : v < 0 ? "-" : "0")));
            if (signs.size > 1) flips++;
          }
        }
      }
      out[metric] = total > 0 ? (flips / total) * 100 : 0;
    }
    return out;
  }, []);

  const bars: { label: string; value: number; color: string }[] = [
    { label: "Threat", value: rates.threat_score, color: METRIC_COLOR.threat },
    { label: "Action", value: rates.action_score, color: METRIC_COLOR.action },
  ];

  const w = 1000, padL = 60, padR = 30, padT = 20, padB = 35;
  const plotW = w - padL - padR;
  const h = 160;
  const plotH = h - padT - padB;
  const maxVal = 50;
  const barW = 80;
  const gap = (plotW - bars.length * barW) / (bars.length + 1);

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <h4 className="mb-3 text-sm font-medium text-text-soft">
        Sign flips across 3 identical repeats — % of briefs where the agent disagrees with itself on direction
      </h4>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[0, 25, 50].map((v) => {
          const yp = padT + plotH - (v / maxVal) * plotH;
          return (
            <g key={v}>
              <line
                x1={padL}
                x2={w - padR}
                y1={yp}
                y2={yp}
                stroke="var(--border)"
                strokeWidth={0.5}
                strokeDasharray="4,4"
              />
              <text x={padL - 8} y={yp + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                {v}%
              </text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const bh = (b.value / maxVal) * plotH;
          const x0 = padL + gap + i * (barW + gap);
          const y0 = padT + plotH - bh;
          return (
            <g key={b.label}>
              <rect
                x={x0}
                y={y0}
                width={barW}
                height={bh}
                fill={b.color}
                opacity={0.85}
                rx={3}
              />
              <text
                x={x0 + barW / 2}
                y={y0 - 6}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={b.color}
              >
                {b.value.toFixed(0)}%
              </text>
              <text
                x={x0 + barW / 2}
                y={padT + plotH + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-soft)"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
