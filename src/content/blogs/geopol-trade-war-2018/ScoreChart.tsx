"use client";

import { useState, useMemo } from "react";
import type { RunKey, Party, ConfigKey } from "./data";
import {
  DATES,
  RUN_KEYS,
  CONFIGS,
  CONFIG_KEYS,
  configData,
  fmtScore,
  shortDate,
} from "./data";
import { ChartPartyCard, ThreatActionToggles } from "./ChartPartyCard";

export function ScoreChart({ party }: { party: Party }) {
  const [showAction, setShowAction] = useState(false);

  // Per-config: 3 runs, each a series of scores.
  const configSeries = useMemo(() => {
    const out: Record<ConfigKey, { run: RunKey; points: (number | null)[] }[]> = {} as never;
    for (const ck of CONFIG_KEYS) {
      const d = configData[ck];
      out[ck] = RUN_KEYS.map((rk) => ({
        run: rk,
        points: DATES.map((date) => {
          const cell = d.runs[rk].dates[date]?.[party];
          const score = showAction ? cell?.action_score : cell?.threat_score;
          return score ?? null;
        }),
      }));
    }
    return out;
  }, [party, showAction]);

  // Per-config average variation: for each date, mean absolute deviation
  // of the 3 runs from their mean; then average across dates.
  const configVariation = useMemo(() => {
    const out: Record<ConfigKey, number> = {} as never;
    for (const ck of CONFIG_KEYS) {
      const series = configSeries[ck];
      const perDateDevs: number[] = [];
      for (let i = 0; i < DATES.length; i++) {
        const vals = series.map((s) => s.points[i]).filter((v): v is number => v !== null);
        if (vals.length < 2) continue;
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const mad = vals.reduce((a, b) => a + Math.abs(b - mean), 0) / vals.length;
        perDateDevs.push(mad);
      }
      out[ck] = perDateDevs.length > 0
        ? perDateDevs.reduce((a, b) => a + b, 0) / perDateDevs.length
        : 0;
    }
    return out;
  }, [configSeries]);

  // Layout constants. Y-axis is always [-1, +1].
  const LO = -1, HI = 1;
  const w = 1000, padL = 80, padR = 20, padT = 6, padB = 6;
  const plotW = w - padL - padR;
  const miniH = 110;
  const miniPlotH = miniH - padT - padB;
  const gap = 6;
  const axisH = 20;
  const totalH = CONFIGS.length * miniH + (CONFIGS.length - 1) * gap + axisH;

  const x = (i: number) => padL + (i / (DATES.length - 1)) * plotW;

  // All y coords are local to the mini-chart group (already translated by yOff).
  const yLocal = (v: number) => padT + (1 - (v - LO) / (HI - LO)) * miniPlotH;

  const pathFor = (pts: (number | null)[]) => {
    let d = "", pen = false;
    pts.forEach((p, i) => {
      if (p === null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${yLocal(p).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };

  // Split label into model name + type part.
  const splitLabel = (label: string) => {
    const idx = label.lastIndexOf(" (");
    if (idx > 0) return { model: label.slice(0, idx), type: label.slice(idx + 1) };
    return { model: label, type: "" };
  };

  return (
    <ChartPartyCard
      party={party}
      controls={
        <ThreatActionToggles
          metric={showAction ? "action" : "threat"}
          onThreat={() => setShowAction(false)}
          onAction={() => setShowAction(true)}
        />
      }
    >
      <svg viewBox={`0 0 ${w} ${totalH}`} className="w-full overflow-visible">
        {CONFIGS.map((cfg, ci) => {
          const yOff = ci * (miniH + gap);
          const ticks = [LO, HI];
          const lbl = splitLabel(cfg.label);
          const clipId = `score-clip-${party}-${cfg.key}`;
          return (
            <g key={cfg.key} transform={`translate(0, ${yOff})`}>
              <clipPath id={clipId}>
                <rect x={padL} y={padT} width={plotW} height={miniPlotH} />
              </clipPath>

              {/* Config label: model / (type) / avg var: / highlighted number */}
              <text x={4} y={miniH / 2 - 20} fontSize="11" fontWeight="600" fill={cfg.color}>
                {lbl.model}
              </text>
              {lbl.type && (
                <text x={4} y={miniH / 2 - 6} fontSize="9" fill="var(--text-muted)">
                  {lbl.type}
                </text>
              )}
              <text x={4} y={miniH / 2 + 10} fontSize="9" fill="var(--text-muted)">
                disagree:
              </text>
              <text x={4} y={miniH / 2 + 24} fontSize="11" fontWeight="700" fill={cfg.color}>
                {configVariation[cfg.key].toFixed(3)}
              </text>

              {/* Y-axis ticks: -1 and +1 only, no mid line */}
              {ticks.map((tv) => {
                const ty = yLocal(tv);
                return (
                  <g key={tv}>
                    <text x={padL - 6} y={ty + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)">
                      {fmtScore(tv)}
                    </text>
                  </g>
                );
              })}

              {/* Run lines — clipped to this mini-chart */}
              <g clipPath={`url(#${clipId})`}>
                {configSeries[cfg.key].map((s) => (
                  <path
                    key={s.run}
                    d={pathFor(s.points)}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth={1.6}
                    strokeOpacity={0.8}
                  />
                ))}
              </g>

              {/* Mini-chart border */}
              <rect x={padL} y={padT} width={plotW} height={miniPlotH}
                fill="none" stroke="var(--border)" strokeWidth={0.5} rx={4} />
            </g>
          );
        })}

        {/* Shared date labels — below all mini-charts with generous gap */}
        <g transform={`translate(0, ${CONFIGS.length * (miniH + gap) - gap + 4})`}>
          {DATES.map((d, i) =>
            i % 4 === 0 ? (
              <text key={d} x={x(i)} y={12} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                {shortDate(d)}
              </text>
            ) : null,
          )}
        </g>
      </svg>
    </ChartPartyCard>
  );
}
