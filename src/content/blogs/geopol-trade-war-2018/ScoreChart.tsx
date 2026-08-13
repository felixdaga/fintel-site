"use client";

import { useState, useMemo } from "react";
import type { ReportData, RunKey, Party } from "./data";
import { DATES, RUN_KEYS, fmtScore, shortDate } from "./data";
import reportData from "./geopol-full-0001.json";

const data = reportData as unknown as ReportData;

export const RUN_COLORS: Record<RunKey, string> = {
  r1: "#6f93cf",
  r2: "#e8c45d",
  r3: "#cf6f9f",
};

export function ScoreChart({ party }: { party: Party }) {
  const [showAction, setShowAction] = useState(false);

  const series = useMemo(() => {
    return RUN_KEYS.map((rk) => ({
      run: rk,
      points: DATES.map((date) => {
        const cell = data.runs[rk].dates[date]?.[party];
        const score = showAction ? cell?.action_score : cell?.threat_score;
        return { score: score ?? null };
      }),
    }));
  }, [party, showAction]);

  const w = 1000, h = 340, padL = 60, padR = 30, padT = 20, padB = 45;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const x = (i: number) => padL + (i / (DATES.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - (v + 1) / 2) * plotH;

  const pathFor = (pts: { score: number | null }[]) => {
    let d = "", pen = false;
    pts.forEach((p, i) => {
      if (p.score === null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.score).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">{party}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAction(false)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              !showAction ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
            }`}
          >Threat Score</button>
          <button
            onClick={() => setShowAction(true)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              showAction ? "bg-[#3b6da8] text-white" : "border border-border text-text-soft hover:text-text"
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
          ) : null
        )}
        {series.map((s) => (
          <path key={s.run} d={pathFor(s.points)} fill="none"
            stroke={RUN_COLORS[s.run]} strokeWidth={1.8} opacity={0.85} />
        ))}
      </svg>
      <div className="mt-3 flex justify-center gap-4">
        {RUN_KEYS.map((rk) => (
          <div key={rk} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RUN_COLORS[rk] }} />
            <span className="text-xs text-text-muted">{rk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
