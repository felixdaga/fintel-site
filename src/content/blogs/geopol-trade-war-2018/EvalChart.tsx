"use client";

import { useState, useMemo } from "react";
import type { EvalData, Party } from "./data";
import { DATES, fmtScore, shortDate } from "./data";
import evalData from "./eval-r1.json";

const data = evalData as unknown as EvalData;

type Metric =
  | "score"
  | "loyalty_score"
  | "bias_score"
  | "aggression_score";

const METRICS: { key: Metric; label: string; range: [number, number] }[] = [
  { key: "score", label: "Recommendation", range: [0, 1] },
  { key: "loyalty_score", label: "Loyalty", range: [-1, 1] },
  { key: "bias_score", label: "Bias", range: [-1, 1] },
  { key: "aggression_score", label: "Aggression", range: [-1, 1] },
];

const PARTY_COLORS: Record<Party, string> = {
  USA: "#4a90d9",
  CHN: "#d94a4a",
};

export function EvalChart() {
  const [metric, setMetric] = useState<Metric>("score");
  const m = METRICS.find((x) => x.key === metric)!;
  const [lo, hi] = m.range;

  const series = useMemo(() => {
    return (["USA", "CHN"] as Party[]).map((party) => ({
      party,
      points: DATES.map((date) => {
        const rating = data.dates[date]?.[party];
        const val = rating ? (rating[metric] as number | null) : null;
        return { val };
      }),
    }));
  }, [metric]);

  const w = 1000, h = 340, padL = 60, padR = 30, padT = 20, padB = 45;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const x = (i: number) => padL + (i / (DATES.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * plotH;

  // Gridlines: 5 evenly spaced ticks within [lo, hi]
  const ticks = [0, 1, 2, 3, 4, 5].map((i) => lo + ((hi - lo) * i) / 5);

  const pathFor = (pts: { val: number | null }[]) => {
    let d = "", pen = false;
    pts.forEach((p, i) => {
      if (p.val === null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.val).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };

  const fmtTick = (v: number) =>
    metric === "score" ? v.toFixed(2) : fmtScore(v);

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Eval Scores Over Time</h3>
        <div className="flex gap-2">
          {METRICS.map((mm) => (
            <button
              key={mm.key}
              onClick={() => setMetric(mm.key)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                metric === mm.key ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
              }`}
            >{mm.label}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {ticks.map((v, i) => {
          const isMid = Math.abs(v - (lo + hi) / 2) < 1e-9;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="var(--border)"
                strokeWidth={isMid ? 1.5 : 0.5} strokeDasharray={isMid ? "" : "4,4"} />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">
                {fmtTick(v)}
              </text>
            </g>
          );
        })}
        {DATES.map((d, i) =>
          i % 4 === 0 ? (
            <text key={d} x={x(i)} y={h - 10} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
              {shortDate(d)}
            </text>
          ) : null
        )}
        {series.map((s) => (
          <path key={s.party} d={pathFor(s.points)} fill="none"
            stroke={PARTY_COLORS[s.party]} strokeWidth={2} opacity={0.85} />
        ))}
      </svg>
      <div className="mt-3 flex justify-center gap-6">
        {(["USA", "CHN"] as Party[]).map((p) => (
          <div key={p} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} />
            <span className="text-xs text-text-muted">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
