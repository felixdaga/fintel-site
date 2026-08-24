"use client";

import { useState, Fragment } from "react";
import type { RunKey, Party, CellData, ConfigKey } from "./data";
import {
  DATES,
  RUN_KEYS,
  PARTIES,
  CONFIGS,
  CONFIG_KEYS,
  CONFIG_LABEL,
  configData,
  OUTCOMES,
  ACTION_LEVEL_COLOR,
  ACTION_LEVEL_LABEL,
  SOURCE_TYPE_COLOR,
  SOURCE_TYPE_LABEL,
  fmtScore,
  fmtDate,
  METRIC,
} from "./data";

export function DateTable() {
  // Main toggle: agent (config). Then run, then party.
  const [config, setConfig] = useState<ConfigKey>(CONFIG_KEYS[0]);
  const [run, setRun] = useState<RunKey>("r1");
  const [party, setParty] = useState<Party>("USA");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const data = configData[config];

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <div className="mb-4 flex flex-wrap gap-2">
          {/* Main toggle: agent / config */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {CONFIGS.map((c) => (
              <button
                key={c.key}
                onClick={() => setConfig(c.key)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  config === c.key ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {RUN_KEYS.map((rk) => (
              <button
                key={rk}
                onClick={() => setRun(rk)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  run === rk ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
                }`}
              >
                {rk}
              </button>
            ))}
          </div>
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
      <div className="overflow-x-auto">
        <table className="min-w-[44rem] w-full table-fixed text-sm">
          <colgroup>
            <col className="w-24" />
            <col className="w-16" />
            <col className="w-16" />
            <col className="w-28" />
            <col />
            <col className="w-16" />
            <col className="w-16" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2 text-right">{METRIC.threat.label}</th>
              <th className="py-2 px-2 text-right">{METRIC.action.label}</th>
              <th className="py-2 px-2">Move</th>
              <th className="py-2 px-2">Advice</th>
              <th className="py-2 px-2 text-right">Factors</th>
              <th className="py-2 px-2 text-right">Sources</th>
            </tr>
          </thead>
          <tbody>
            {DATES.map((date) => {
              const cell = data.runs[run].dates[date]?.[party];
              const outcome = OUTCOMES[date]?.[party];
              if (!cell) return null;
              const expanded = expandedDate === date;
              return (
                <Fragment key={date}>
                  <tr
                    className="border-b border-border/50 cursor-pointer transition-colors hover:bg-accent-soft/30"
                    onClick={() => setExpandedDate(expanded ? null : date)}
                  >
                    <td className="py-2 px-2 font-mono text-xs text-text-soft">{fmtDate(date)}</td>
                    <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(cell.threat_score)}</td>
                    <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(cell.action_score)}</td>
                    <td className="py-2 px-2 overflow-hidden">
                      <span
                        className="block truncate rounded px-1.5 py-0.5 text-xs font-medium"
                        title={ACTION_LEVEL_LABEL[cell.action_level] ?? cell.action_level}
                        style={{
                          backgroundColor: `${ACTION_LEVEL_COLOR[cell.action_level] ?? "#6b7a8e"}22`,
                          color: ACTION_LEVEL_COLOR[cell.action_level] ?? "#6b7a8e",
                        }}
                      >
                        {ACTION_LEVEL_LABEL[cell.action_level] ?? cell.action_level}
                      </span>
                    </td>
                    <td className="py-2 px-2 min-w-0 overflow-hidden text-xs text-text-soft">
                      <span title={cell.rationale} className="block truncate">
                        {cell.rationale}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-xs text-text-muted text-right">{cell.key_factors.length}</td>
                    <td className="py-2 px-2 font-mono text-xs text-text-muted text-right">{cell.sources_cited.length}</td>
                  </tr>
                  {expanded && (
                    <tr className="border-b border-border">
                      <td colSpan={7} className="py-4">
                        <ExpandedDetail cell={cell} outcome={outcome} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpandedDetail({
  cell,
  outcome,
}: {
  cell: CellData;
  outcome: { actual_action: string; actual_action_score: number; rationale: string } | undefined;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Advice</h4>
        <p className="text-sm leading-relaxed text-text-soft">{cell.rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Key Factors</h4>
        <ul className="space-y-1">
          {cell.key_factors.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-soft">
              <span className="text-text-muted">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
          Sources Cited ({cell.sources_cited.length})
        </h4>
        <ul className="space-y-1.5">
          {cell.sources_cited.map((s, i) => {
            const color = SOURCE_TYPE_COLOR[s.source_type] ?? SOURCE_TYPE_COLOR.other;
            return (
              <li key={i} className="flex gap-2 text-sm">
                <span
                  className="shrink-0 w-40 text-center rounded px-1.5 py-0.5 text-xs font-mono whitespace-nowrap"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  {SOURCE_TYPE_LABEL[s.source_type] ?? s.source_type}
                </span>
                <span className="text-text-soft">{s.excerpt}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {outcome && (
        <div className="rounded-lg border border-border bg-bg-soft/50 p-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">What actually happened</h4>
          <p className="text-sm text-text-soft">
            <span className="font-medium text-text">{outcome.actual_action}</span> (score {fmtScore(outcome.actual_action_score)}) — {outcome.rationale}
          </p>
        </div>
      )}
    </div>
  );
}
