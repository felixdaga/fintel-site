"use client";

import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import { LeagueNotesBody } from "./copy";
import { BOOK_PALETTE, isPick } from "./lab";
import { LEAGUE_KEYS, STRATEGY_IDS, type LeagueStrategyId } from "./league_keys";
import { LEAGUE_COPY } from "./league_texts";
import type { LeaguePublic } from "./types";

export function LeagueHoldings({ data }: { data: LeaguePublic }) {
  const hasPick = data.systems.some(isPick);
  const hasRate = data.systems.some((s) => !isPick(s));
  const groups = STRATEGY_IDS.filter((id) => (LEAGUE_KEYS.strategies[id].pick ? hasPick : hasRate));
  const labels = data.lab?.book_labels || {};
  const vars = data.copy || {};
  const copy = LEAGUE_COPY.howToRead;
  return (
    <details className="group mb-4 rounded-2xl border border-border bg-surface-2 text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          {copy.kicker}
        </p>
        <DetailsArrow openRotate="group-open:rotate-90" className="text-text-muted" />
      </summary>
      <div className="space-y-10 border-t border-border px-4 py-4 sm:px-5 sm:py-5">
        <div>
          <p className="max-w-3xl text-[13px] leading-relaxed text-text-muted">
            {copy.lede}
          </p>
          {groups.length ? (
            <div className="mt-6">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
                {copy.strategyTitle}
              </p>
              <div className="grid min-w-0 gap-5 lg:grid-cols-2">
                {groups.map((id) => (
                  <StrategyNote key={id} id={id} labels={labels} color={data.strategy_colors?.[id]} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <LeagueNotesBody vars={vars} groups={LEAGUE_COPY.methodology.groups} />
      </div>
    </details>
  );
}

function StrategyNote({
  id,
  labels,
  color,
}: {
  id: LeagueStrategyId;
  labels: Record<string, string>;
  color?: string;
}) {
  const spec = LEAGUE_KEYS.strategies[id];
  const lede = LEAGUE_COPY.strategies[id].lede;
  return (
    <div>
      <StrategyChip label={id} color={color} />
      <p className="mt-2 text-[12px] leading-relaxed text-text-soft">{lede}</p>
      <ul className="mt-3 space-y-2">
        {spec.books.map((bid) => {
          const book = LEAGUE_COPY.books[bid];
          return (
            <li key={bid} className="flex items-start gap-2 text-[12px] leading-snug text-text-soft">
              <span
                className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: BOOK_PALETTE[bid] }}
              />
              <span>
                <span className="font-medium text-text">
                  {labels[bid] || book.label}
                </span>
                {`. ${book.hint}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StrategyChip({ label, color }: { label: string; color?: string }) {
  if (!color) return <h3 className="text-sm font-semibold tracking-tight text-text">{label}</h3>;
  return (
    <h3
      className="inline-block rounded px-1.5 py-0.5 text-[12px] font-medium"
      style={{
        color,
        backgroundColor: `${color}22`,
        boxShadow: `inset 0 0 0 1px ${color}66`,
      }}
    >
      {label}
    </h3>
  );
}
