"use client";

import { useState, useMemo } from "react";
import type { Party } from "./data";
import {
  DATES,
  RUN_KEYS,
  PARTIES,
  CONFIGS,
  CONFIG_KEYS,
  CONFIG_COLOR,
  configData,
  PARTY_BORDER,
  shortDate,
} from "./data";

export function StochasticityCharts() {
  const [party, setParty] = useState<Party>("USA");

  // Tool calls per date: one bar per (config, run). Same config ⇒ same colour;
  // runs differ by opacity so the 3 bars of a config cluster by colour.
  const toolCallData = useMemo(
    () =>
      DATES.map((date) => ({
        date,
        groups: CONFIG_KEYS.map((ck) => ({
          config: ck,
          counts: RUN_KEYS.map((rk) => configData[ck].runs[rk].dates[date]?.[party]?.n_reads ?? 0),
        })),
      })),
    [party],
  );

  // Unique search queries per date, unioned across runs within each config.
  const queryVariation = useMemo(
    () =>
      DATES.map((date) => {
        const perConfig = CONFIG_KEYS.map((ck) => {
          const allQ = new Set<string>();
          for (const rk of RUN_KEYS) {
            (configData[ck].runs[rk].dates[date]?.[party]?.search_queries ?? []).forEach((q) => allQ.add(q));
          }
          return { config: ck, unique: allQ.size };
        });
        return { date, perConfig };
      }),
    [party],
  );

  const w = 1000, h = 240, padL = 50, padR = 30, padT = 15, padB = 35;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const barW = plotW / DATES.length;
  const maxReads = Math.max(...toolCallData.flatMap((d) => d.groups.flatMap((g) => g.counts)), 1);
  const maxUnique = Math.max(...queryVariation.flatMap((d) => d.perConfig.map((p) => p.unique)), 1);

  // Layout within a date cluster: nConfigs * nRuns bars side by side.
  const nConfigs = CONFIGS.length;
  const nRuns = RUN_KEYS.length;
  const inner = barW - 2;
  const subBarW = inner / (nConfigs * nRuns);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {PARTIES.map((p) => (
            <button
              key={p}
              onClick={() => setParty(p)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                party === p ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tool call variation */}
      <div
        className="rounded-2xl bg-bg/70 p-5"
        style={{ border: `2px solid ${PARTY_BORDER[party]}` }}
      >
        <h4 className="mb-3 text-sm font-medium text-text-soft">
          How often they pulled data — three bars per color are three repeats
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
                {d.groups.map((g, ci) =>
                  g.counts.map((c, ri) => {
                    const bh = (c / maxReads) * plotH;
                    const x0 = bx + 1 + (ci * nRuns + ri) * subBarW;
                    return (
                      <rect
                        key={`${g.config}-${ri}`}
                        x={x0}
                        y={padT + plotH - bh}
                        width={Math.max(subBarW - 0.5, 1)}
                        height={bh}
                        fill={CONFIG_COLOR[g.config]}
                        opacity={0.8}
                        rx={1}
                      />
                    );
                  }),
                )}
                {i % 4 === 0 && (
                  <text x={bx + barW / 2} y={h - 8} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                    {shortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
          {CONFIGS.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-text-muted">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search query variation */}
      <div
        className="rounded-2xl bg-bg/70 p-5"
        style={{ border: `2px solid ${PARTY_BORDER[party]}` }}
      >
        <h4 className="mb-3 text-sm font-medium text-text-soft">
          How many different questions they asked — taller means they did not search the same thing twice
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
            const cfgW = (barW - 2) / nConfigs;
            return (
              <g key={d.date}>
                {d.perConfig.map((p, ci) => {
                  const bh = (p.unique / maxUnique) * plotH;
                  return (
                    <rect
                      key={p.config}
                      x={bx + 1 + ci * cfgW}
                      y={padT + plotH - bh}
                      width={Math.max(cfgW - 1, 1)}
                      height={bh}
                      fill={CONFIG_COLOR[p.config]}
                      opacity={0.75}
                      rx={1}
                    />
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
      </div>
    </div>
  );
}
