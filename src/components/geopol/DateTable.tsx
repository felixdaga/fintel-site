"use client";

import { useState, Fragment } from "react";
import type { ReportData, RunKey, Party, CellData } from "@/content/blogs/geopol-data";
import { DATES, RUN_KEYS, PARTIES, ACTION_LEVEL_COLOR, fmtScore, fmtDate } from "@/content/blogs/geopol-data";
import reportData from "@/content/blogs/geopol-full-0001.json";

const data = reportData as unknown as ReportData;

export function DateTable() {
  const [run, setRun] = useState<RunKey>("r1");
  const [party, setParty] = useState<Party>("USA");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">Per-Date Decisions</h3>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {RUN_KEYS.map((rk) => (
              <button key={rk} onClick={() => setRun(rk)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  run === rk ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
                }`}>{rk}</button>
            ))}
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {PARTIES.map((p) => (
              <button key={p} onClick={() => setParty(p)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  party === p ? "bg-[#3b6da8] text-white" : "text-text-soft hover:text-text"
                }`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-28" />
            <col className="w-16" />
            <col className="w-16" />
            <col className="w-32" />
            <col className="w-32" />
            <col className="w-12" />
            <col className="w-14" />
            <col className="w-14" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2 text-right">Threat</th>
              <th className="py-2 px-2 text-right">Action</th>
              <th className="py-2 px-2">Level</th>
              <th className="py-2 px-2">Actual</th>
              <th className="py-2 px-2 text-center">Match</th>
              <th className="py-2 px-2 text-right">Reads</th>
              <th className="py-2 px-2 text-right">Factors</th>
            </tr>
          </thead>
          <tbody>
            {DATES.map((date) => {
              const cell = data.runs[run].dates[date]?.[party];
              const outcome = data.outcomes[date]?.[party];
              if (!cell) return null;
              const expanded = expandedDate === date;
              const match = cell.action_level === outcome?.actual_action;
              return (
                <Fragment key={date}>
                  <tr
                    className="border-b border-border/50 cursor-pointer transition-colors hover:bg-accent-soft/30"
                    onClick={() => setExpandedDate(expanded ? null : date)}
                  >
                    <td className="py-2 px-2 font-mono text-xs text-text-soft">{fmtDate(date)}</td>
                    <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(cell.threat_score)}</td>
                    <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(cell.action_score)}</td>
                    <td className="py-2 px-2">
                      <span className="rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: `${ACTION_LEVEL_COLOR[cell.action_level] ?? "#6b7a8e"}22`,
                          color: ACTION_LEVEL_COLOR[cell.action_level] ?? "#6b7a8e",
                        }}>{cell.action_level}</span>
                    </td>
                    <td className="py-2 px-2 text-xs text-text-soft">{outcome?.actual_action ?? "—"}</td>
                    <td className="py-2 px-2 text-center">
                      {match ? <span className="text-xs text-green-400">✓</span> : <span className="text-xs text-red-400">✗</span>}
                    </td>
                    <td className="py-2 px-2 font-mono text-xs text-text-muted text-right">{cell.n_reads}</td>
                    <td className="py-2 px-2 font-mono text-xs text-text-muted text-right">{cell.key_factors.length}</td>
                  </tr>
                  {expanded && (
                    <tr className="border-b border-border">
                      <td colSpan={8} className="py-4">
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
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Recommendation</h4>
        <p className="text-sm leading-relaxed text-text-soft">{cell.rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Key Factors</h4>
        <ul className="space-y-1">
          {cell.key_factors.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-soft">
              <span className="text-text-muted">•</span><span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
          Sources Cited ({cell.sources_cited.length})
        </h4>
        <ul className="space-y-1.5">
          {cell.sources_cited.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 rounded px-1.5 py-0.5 text-xs font-mono"
                style={{
                  backgroundColor: s.source_type === "event_timeline" ? "#6f93cf22" : "#e8c45d22",
                  color: s.source_type === "event_timeline" ? "#6f93cf" : "#e8c45d",
                }}>{s.source_type}</span>
              <span className="text-text-soft">{s.excerpt}</span>
            </li>
          ))}
        </ul>
      </div>
      {outcome && (
        <div className="rounded-lg border border-border bg-bg-soft/50 p-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">What Actually Happened</h4>
          <p className="text-sm text-text-soft">
            <span className="font-medium text-text">{outcome.actual_action}</span>{" "}
            (score {fmtScore(outcome.actual_action_score)}) — {outcome.rationale}
          </p>
        </div>
      )}
    </div>
  );
}
