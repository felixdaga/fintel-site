"use client";

import { useState, useMemo } from "react";
import type { ReportData, Party } from "./data";
import { DATES, RUN_KEYS, PARTIES, shortDate } from "./data";
import { RUN_COLORS } from "./ScoreChart";
import reportData from "./geopol-full-0001.json";

const data = reportData as unknown as ReportData;

export function StochasticityCharts() {
  const [party, setParty] = useState<Party>("USA");

  const toolCallData = useMemo(() =>
    DATES.map((date) => ({
      date,
      counts: RUN_KEYS.map((rk) => data.runs[rk].dates[date]?.[party]?.n_reads ?? 0),
    })), [party]);

  const queryVariation = useMemo(() =>
    DATES.map((date) => {
      const allQ = new Set<string>();
      for (const rk of RUN_KEYS) {
        (data.runs[rk].dates[date]?.[party]?.search_queries ?? []).forEach((q) => allQ.add(q));
      }
      return { date, unique: allQ.size };
    }), [party]);

  const w = 1000, h = 240, padL = 50, padR = 30, padT = 15, padB = 35;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const barW = plotW / DATES.length;
  const maxReads = Math.max(...toolCallData.flatMap((d) => d.counts), 1);
  const maxUnique = Math.max(...queryVariation.map((d) => d.unique), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Agent Stochasticity</h3>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {PARTIES.map((p) => (
            <button key={p} onClick={() => setParty(p)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                party === p ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
              }`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Tool call variation */}
      <div className="rounded-2xl border border-border bg-bg/70 p-5">
        <h4 className="mb-3 text-sm font-medium text-text-soft">
          Tool Calls per Date — variation across 3 runs
        </h4>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          {[0, Math.ceil(maxReads / 2), maxReads].map((v) => {
            const yp = padT + plotH - (v / maxReads) * plotH;
            return (
              <g key={v}>
                <line x1={padL} x2={w - padR} y1={yp} y2={yp} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" />
                <text x={padL - 8} y={yp + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{v}</text>
              </g>
            );
          })}
          {toolCallData.map((d, i) => {
            const bx = padL + i * barW;
            return (
              <g key={d.date}>
                {d.counts.map((c, ri) => {
                  const bh = (c / maxReads) * plotH;
                  const bw = (barW - 2) / 3;
                  return (
                    <rect key={ri} x={bx + 1 + ri * bw} y={padT + plotH - bh}
                      width={bw - 1} height={bh} fill={RUN_COLORS[RUN_KEYS[ri]]} opacity={0.8} rx={1} />
                  );
                })}
                {i % 4 === 0 && (
                  <text x={bx + barW / 2} y={h - 8} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                    {shortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex justify-center gap-4">
          {RUN_KEYS.map((rk) => (
            <div key={rk} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RUN_COLORS[rk] }} />
              <span className="text-xs text-text-muted">{rk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search query variation */}
      <div className="rounded-2xl border border-border bg-bg/70 p-5">
        <h4 className="mb-3 text-sm font-medium text-text-soft">
          Unique Search Queries per Date — divergent exploration across runs
        </h4>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          {[0, Math.ceil(maxUnique / 2), maxUnique].map((v) => {
            const yp = padT + plotH - (v / maxUnique) * plotH;
            return (
              <g key={v}>
                <line x1={padL} x2={w - padR} y1={yp} y2={yp} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" />
                <text x={padL - 8} y={yp + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{v}</text>
              </g>
            );
          })}
          {queryVariation.map((d, i) => {
            const bx = padL + i * barW;
            const bh = (d.unique / maxUnique) * plotH;
            return (
              <g key={d.date}>
                <rect x={bx + 1} y={padT + plotH - bh} width={barW - 2} height={bh} fill="#6f93cf" opacity={0.7} rx={1} />
                {i % 4 === 0 && (
                  <text x={bx + barW / 2} y={h - 8} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                    {shortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
