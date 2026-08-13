"use client";

import { useState, useMemo } from "react";
import type { RunKey, Party, ConfigKey } from "./data";
import {
  DATES,
  RUN_KEYS,
  CONFIGS,
  CONFIG_KEYS,
  CONFIG_COLOR,
  configData,
  PARTY_BORDER,
  fmtScore,
  shortDate,
} from "./data";

type Metric = "threat_score" | "action_score";

/** Mean of a metric across the 3 runs for one (config, date, party), ignoring nulls. */
function meanAcrossRuns(ck: ConfigKey, date: string, party: Party, metric: Metric): number | null {
  const vals: number[] = [];
  for (const rk of RUN_KEYS) {
    const cell = configData[ck].runs[rk].dates[date]?.[party];
    const v = cell?.[metric];
    if (typeof v === "number" && !Number.isNaN(v)) vals.push(v);
  }
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function AveragedScoreChart({ party }: { party: Party }) {
  const [metric, setMetric] = useState<Metric>("threat_score");

  // One series per config — the mean across that config's 3 runs for this party.
  const series = useMemo(() => {
    return CONFIG_KEYS.map((ck) => ({
      config: ck,
      points: DATES.map((date) => ({ val: meanAcrossRuns(ck, date, party, metric) })),
    }));
  }, [party, metric]);

  const w = 1000, h = 340, padL = 60, padR = 30, padT = 20, padB = 45;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const x = (i: number) => padL + (i / (DATES.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - (v + 1) / 2) * plotH;

  const pathFor = (pts: { val: number | null }[]) => {
    let d = "", pen = false;
    pts.forEach((p, i) => {
      if (p.val === null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.val).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };

  return (
    <div
      className="rounded-2xl bg-bg/70 p-5"
      style={{ border: `2px solid ${PARTY_BORDER[party]}` }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">{party}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("threat_score")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              metric === "threat_score" ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
            }`}
          >Threat Score</button>
          <button
            onClick={() => setMetric("action_score")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              metric === "action_score" ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
            }`}
          >Action Score</button>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[-1, -0.5, 0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="var(--border)"
              strokeWidth={v === 0 ? 1.5 : 0.5} strokeDasharray={v === 0 ? "" : "4,4"} />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">
              {fmtScore(v)}
            </text>
          </g>
        ))}
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
            strokeOpacity={0.9}
          />
        ))}
      </svg>

      {/* Legend: one swatch per config. */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {CONFIGS.map((c) => (
          <div key={c.key} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: c.color }} />
            <span className="text-xs text-text-muted">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
