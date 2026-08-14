"use client";

import { useState, useMemo } from "react";
import type { EvalData, Party } from "./data";
import {
  DATES,
  CONFIGS,
  CONFIG_KEYS,
  CONFIG_COLOR,
  CONFIG_LABEL,
  configEval,
  fmtScore,
  shortDate,
} from "./data";
import { ChartPartyCard } from "./ChartPartyCard";

type Metric = "score" | "loyalty_score" | "bias_score" | "aggression_score";

const METRICS: { key: Metric; label: string; hint: string; range: [number, number] }[] = [
  { key: "score", label: "Advice quality", hint: "Knowing how the war actually went, was this a good move?", range: [-1, 1] },
  { key: "loyalty_score", label: "Loyalty", hint: "Did the advice serve the side it was briefing?", range: [-1, 1] },
  { key: "bias_score", label: "Bias", hint: "Is the reasoning skewed, or just the evidence?", range: [-1, 1] },
  { key: "aggression_score", label: "Hawkishness", hint: "How far toward escalation is the recommended move?", range: [-1, 1] },
];

export function EvalChart() {
  const [metric, setMetric] = useState<Metric>("score");
  const m = METRICS.find((x) => x.key === metric)!;
  const [lo, hi] = m.range;

  // Only configs that actually have an eval. One series per (config, party).
  const evals = useMemo(
    () => CONFIG_KEYS.map((ck) => ({ config: ck, data: configEval[ck] })).filter((e) => e.data),
    [],
  );

  const w = 1000, h = 340, padL = 60, padR = 30, padT = 20, padB = 45;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const x = (i: number) => padL + (i / (DATES.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * plotH;
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

  const fmtTick = (v: number) => fmtScore(v);

  const seriesFor = (party: Party) =>
    evals.map((e) => ({
      config: e.config,
      points: DATES.map((date) => {
        const rating = (e.data as EvalData).dates[date]?.[party];
        const val = rating ? (rating[metric] as number | null) : null;
        return { val };
      }),
    }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {METRICS.map((mm) => (
          <button
            key={mm.key}
            onClick={() => setMetric(mm.key)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              metric === mm.key ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
            }`}
          >
            {mm.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-muted">{m.hint}</p>

      {(["USA", "CHN"] as Party[]).map((party) => {
        const series = seriesFor(party);
        return (
          <ChartPartyCard key={party} party={party}>
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
                ) : null,
              )}
              {series.map((s) => (
                <path
                  key={s.config}
                  d={pathFor(s.points)}
                  fill="none"
                  stroke={CONFIG_COLOR[s.config]}
                  strokeWidth={2}
                  opacity={0.85}
                />
              ))}
            </svg>
            <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
              {evals.map((e) => (
                <div key={e.config} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: CONFIG_COLOR[e.config] }} />
                  <span className="text-xs text-text-muted">{CONFIG_LABEL[e.config]}</span>
                </div>
              ))}
            </div>
          </ChartPartyCard>
        );
      })}

      {evals.length === 0 && (
        <p className="text-sm text-text-muted">No agent-on-agent eval data available for any config yet.</p>
      )}
    </div>
  );
}
