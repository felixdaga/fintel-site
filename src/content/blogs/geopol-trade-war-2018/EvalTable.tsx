"use client";

import { useState, Fragment } from "react";
import type { EvalRating, Party, ConfigKey } from "./data";
import {
  DATES,
  PARTIES,
  CONFIGS,
  CONFIG_KEYS,
  CONFIG_LABEL,
  configEval,
  fmtScore,
  fmtDate,
} from "./data";

const RATING_COLORS: Record<string, string> = {
  excellent: "#4ade80",
  good: "#a3e635",
  fair: "#fbbf24",
  poor: "#fb923c",
  bad: "#f87171",
};

export function EvalTable() {
  // Main toggle: agent (config). Then party.
  const [config, setConfig] = useState<ConfigKey>(CONFIGS.find((c) => c.hasEval)?.key ?? CONFIG_KEYS[0]);
  const [party, setParty] = useState<Party>("USA");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const data = configEval[config];

  return (
    <div className="rounded-2xl border border-border bg-bg/70 p-5">
      <div className="mb-4 flex flex-wrap gap-2">
          {/* Main toggle: agent / config */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {CONFIGS.filter((c) => c.hasEval).map((c) => (
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

      {!data ? (
        <p className="py-8 text-center text-sm text-text-muted">
          No agent-on-agent eval has been run for {CONFIG_LABEL[config]} yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-28" />
              <col className="w-16" />
              <col className="w-16" />
              <col className="w-16" />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-16" />
            </colgroup>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2 text-right">Loyalty</th>
                <th className="py-2 px-2 text-right">Bias</th>
                <th className="py-2 px-2 text-right">Aggr.</th>
                <th className="py-2 px-2">Rec Rating</th>
                <th className="py-2 px-2">Bias Flags</th>
                <th className="py-2 px-2 text-center">Look-ahead</th>
              </tr>
            </thead>
            <tbody>
              {DATES.map((date) => {
                const rating = data.dates[date]?.[party];
                if (!rating) return null;
                const expanded = expandedDate === date;
                return (
                  <Fragment key={date}>
                    <tr
                      className="border-b border-border/50 cursor-pointer transition-colors hover:bg-accent-soft/30"
                      onClick={() => setExpandedDate(expanded ? null : date)}
                    >
                      <td className="py-2 px-2 font-mono text-xs text-text-soft">{fmtDate(date)}</td>
                      <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(rating.loyalty_score)}</td>
                      <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(rating.bias_score)}</td>
                      <td className="py-2 px-2 font-mono text-text text-right">{fmtScore(rating.aggression_score)}</td>
                      <td className="py-2 px-2">
                        <span
                          className="rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: `${RATING_COLORS[rating.recommendation_rating] ?? "#6b7a8e"}22`,
                            color: RATING_COLORS[rating.recommendation_rating] ?? "#6b7a8e",
                          }}
                        >
                          {rating.recommendation_rating}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-xs text-text-muted">
                        {rating.bias_flags.length === 0 || rating.bias_flags[0] === "none" ? (
                          <span className="text-text-muted">none</span>
                        ) : (
                          <span className="text-amber-500">{rating.bias_flags.join(", ")}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {rating.lookahead_bias ? (
                          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs font-medium text-red-400">flagged</span>
                        ) : (
                          <span className="text-xs text-text-muted">none</span>
                        )}
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-b border-border">
                        <td colSpan={7} className="py-4">
                          <ExpandedRating rating={rating} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ExpandedRating({ rating }: { rating: EvalRating }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Loyalty Score: {fmtScore(rating.loyalty_score)}</h4>
        <p className="text-sm leading-relaxed text-text-soft">{rating.loyalty_rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Bias Score: {fmtScore(rating.bias_score)}</h4>
        <p className="text-sm leading-relaxed text-text-soft">{rating.bias_rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Aggression Score: {fmtScore(rating.aggression_score)}</h4>
        <p className="text-sm leading-relaxed text-text-soft">{rating.aggression_rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Recommendation Rating: {rating.recommendation_rating}</h4>
        <p className="text-sm leading-relaxed text-text-soft">{rating.recommendation_rationale}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
          Look-ahead Bias: {rating.lookahead_bias ? "Flagged" : "Not detected"}
        </h4>
        <p className="text-sm leading-relaxed text-text-soft">
          {rating.lookahead_bias
            ? rating.lookahead_bias_rationale || "Flagged but no rationale provided."
            : rating.lookahead_bias_rationale || "No look-ahead bias detected — the recommendation does not appear to rely on future information."}
        </p>
      </div>
    </div>
  );
}
