"use client";

import { useMemo, useState } from "react";
import type { ConfigKey, Party } from "./data";
import {
  CONFIGS,
  CONFIG_LABEL,
  DATES,
  PARTIES,
  configEval,
} from "./data";
import { ChartPartyCard } from "./ChartPartyCard";

const BIAS_TYPE_COLOR: Record<string, string> = {
  evidence_gap: "#f59e0b",
  narrative_bias: "#fb923c",
  aggression_bias: "#ef4444",
  home_party_bias: "#4a90d9",
  passivity_bias: "#8a5dab",
  recency_bias: "#3db8b0",
  hallucination: "#ec4899",
};

const BIAS_TYPE_LABEL: Record<string, string> = {
  evidence_gap: "evidence gap",
  narrative_bias: "narrative",
  aggression_bias: "aggression",
  home_party_bias: "home party",
  passivity_bias: "passivity",
  recency_bias: "recency",
  hallucination: "hallucination",
};

function aggregateBiasCounts(party: Party) {
  const byAgent: Record<ConfigKey, Record<string, number>> = {} as Record<
    ConfigKey,
    Record<string, number>
  >;
  const typeTotals: Record<string, number> = {};

  for (const cfg of CONFIGS.filter((c) => c.hasEval)) {
    const data = configEval[cfg.key];
    if (!data) continue;

    const counts: Record<string, number> = {};
    for (const date of DATES) {
      const rating = data.dates[date]?.[party];
      if (!rating) continue;
      for (const flag of rating.bias_flags) {
        if (flag === "none") continue;
        counts[flag] = (counts[flag] ?? 0) + 1;
        typeTotals[flag] = (typeTotals[flag] ?? 0) + 1;
      }
    }
    byAgent[cfg.key] = counts;
  }

  const types = Object.keys(typeTotals).sort(
    (a, b) => typeTotals[b] - typeTotals[a] || a.localeCompare(b),
  );

  return { byAgent, types, typeTotals };
}

export function EvalBiasChart() {
  const [party, setParty] = useState<Party>("USA");

  const { byAgent, types, typeTotals } = useMemo(
    () => aggregateBiasCounts(party),
    [party],
  );

  const agents = CONFIGS.filter((c) => c.hasEval);
  const maxTotal = Math.max(
    1,
    ...agents.map((cfg) =>
      Object.values(byAgent[cfg.key] ?? {}).reduce((sum, n) => sum + n, 0),
    ),
  );

  const w = 760;
  const labelW = 132;
  const padR = 24;
  const rowH = 34;
  const gap = 10;
  const chartW = w - labelW - padR;
  const h = agents.length * (rowH + gap) + 8;

  const x = (count: number) => labelW + (count / maxTotal) * chartW;

  return (
    <ChartPartyCard
      party={party}
      controls={
        <div className="flex rounded-lg border border-border overflow-hidden">
          {PARTIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setParty(p)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                party === p ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      }
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Bias flag counts by agent and type">
        {agents.map((cfg, i) => {
          const counts = byAgent[cfg.key] ?? {};
          const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
          const y = 4 + i * (rowH + gap);
          let x0 = labelW;

          return (
            <g key={cfg.key}>
              <text
                x={labelW - 8}
                y={y + rowH / 2 + 4}
                textAnchor="end"
                fill="var(--text-soft)"
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
              >
                {CONFIG_LABEL[cfg.key]}
              </text>
              <rect
                x={labelW}
                y={y}
                width={chartW}
                height={rowH}
                rx={4}
                fill="var(--bg-soft)"
                stroke="var(--border)"
                strokeWidth={1}
              />
              {types.map((type) => {
                const n = counts[type] ?? 0;
                if (n === 0) return null;
                const segW = (n / maxTotal) * chartW;
                const rect = (
                  <rect
                    key={type}
                    x={x0}
                    y={y}
                    width={segW}
                    height={rowH}
                    fill={BIAS_TYPE_COLOR[type] ?? "#6b7a8e"}
                    opacity={0.9}
                  />
                );
                x0 += segW;
                return rect;
              })}
              <text
                x={x(total) + 6}
                y={y + rowH / 2 + 4}
                fill="var(--text-muted)"
                fontSize={10}
                fontFamily="var(--font-geist-mono)"
              >
                {total}
              </text>
            </g>
          );
        })}
      </svg>

      {types.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {types.map((type) => (
            <span key={type} className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: BIAS_TYPE_COLOR[type] ?? "#6b7a8e" }}
              />
              {BIAS_TYPE_LABEL[type] ?? type.replace(/_/g, " ")}
              <span className="font-mono text-text-muted">({typeTotals[type]})</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">No bias flags for this side.</p>
      )}
    </ChartPartyCard>
  );
}
