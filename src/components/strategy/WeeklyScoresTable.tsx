"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { StrategyWeek } from "./types";

function scoreColor(score: number): string {
  if (score > 0.3) return "text-positive";
  if (score < -0.3) return "text-negative";
  return "text-text-soft";
}

function fmtTab(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

export function WeeklyScoresTable({ weeks }: { weeks: StrategyWeek[] }) {
  // Chronological for prev/next (earlier ← left, later → right)
  const chrono = weeks;
  const [activeDate, setActiveDate] = useState(chrono[chrono.length - 1]?.date ?? "");
  const [expanded, setExpanded] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const week = chrono.find((w) => w.date === activeDate) ?? chrono[chrono.length - 1];
  const activeIdx = week ? chrono.findIndex((w) => w.date === week.date) : -1;
  const canGoEarlier = activeIdx > 0;
  const canGoLater = activeIdx >= 0 && activeIdx < chrono.length - 1;

  const toggle = (key: string) => setExpanded((cur) => (cur === key ? null : key));

  const selectWeek = (date: string) => {
    setActiveDate(date);
    setExpanded(null);
  };

  const goEarlier = () => {
    if (!canGoEarlier) return;
    selectWeek(chrono[activeIdx - 1].date);
  };

  const goLater = () => {
    if (!canGoLater) return;
    selectWeek(chrono[activeIdx + 1].date);
  };

  // Keep the active tab visible in the strip — scroll the strip only, never the page.
  useEffect(() => {
    if (!week) return;
    const el = tabRefs.current[week.date];
    const scroller = el?.parentElement;
    if (!el || !scroller) return;
    const left = el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [week?.date]);

  if (!week) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      {/* Week tabs with ← / → to reach earlier / later dates */}
      <div className="flex items-center gap-1 border-b border-border px-1 py-2 sm:px-2">
        <button
          type="button"
          aria-label="Earlier week"
          disabled={!canGoEarlier}
          onClick={goEarlier}
          className="shrink-0 rounded-md px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-25"
        >
          ‹
        </button>

        <div
          role="tablist"
          aria-label="Decision weeks"
          className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {chrono.map((w) => {
            const active = w.date === week.date;
            return (
              <button
                key={w.date}
                ref={(el) => {
                  tabRefs.current[w.date] = el;
                }}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectWeek(w.date)}
                className={`shrink-0 rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors sm:px-3 sm:text-xs ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-text-muted hover:bg-surface hover:text-text-soft"
                }`}
              >
                {fmtTab(w.date)}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Later week"
          disabled={!canGoLater}
          onClick={goLater}
          className="shrink-0 rounded-md px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-25"
        >
          ›
        </button>
      </div>

      {/* Active week header */}
      <div className="space-y-2 border-b border-border px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-text-muted">{week.date}</span>
          <span className="text-xs text-text-soft">
            {week.holdings.length} holding{week.holdings.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {week.holdings.map((h) => (
            <span
              key={h.symbol}
              className="rounded border border-positive/30 bg-positive/10 px-1.5 py-0.5 font-mono text-[10px] text-positive"
            >
              {h.symbol}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="divide-y divide-border md:hidden">
        {week.decisions.map((dec) => {
          const key = `${week.date}-${dec.symbol}`;
          const isOpen = expanded === key;
          return (
            <div key={key}>
              <button
                type="button"
                className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors active:bg-surface"
                onClick={() => toggle(key)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-text">
                      {dec.symbol}
                    </span>
                    {dec.in_book ? (
                      <span className="rounded border border-positive/30 bg-positive/10 px-1.5 py-0.5 text-[10px] text-positive">
                        long
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-soft">
                    {dec.rationale}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-sm tabular-nums ${scoreColor(dec.score)}`}
                >
                  {dec.score.toFixed(2)}
                </span>
              </button>
              {isOpen ? (
                <div className="space-y-3 bg-bg-soft px-3 pb-4 pt-1">
                  <p className="text-sm leading-relaxed text-text-soft">
                    {dec.rationale}
                  </p>
                  {dec.key_factors.length > 0 ? (
                    <div>
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                        key factors
                      </p>
                      <ul className="space-y-1.5">
                        {dec.key_factors.map((f, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-xs leading-relaxed text-text-soft"
                          >
                            <span className="text-text-muted">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {dec.conviction != null ? (
                    <div className="pt-1 text-[11px] text-text-muted">
                      conviction: {dec.conviction}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="px-4 py-2 font-mono font-normal">symbol</th>
              <th className="px-2 py-2 font-mono font-normal">score</th>
              <th className="px-2 py-2 font-mono font-normal">book</th>
              <th className="px-4 py-2 font-mono font-normal">rationale</th>
            </tr>
          </thead>
          <tbody>
            {week.decisions.map((dec) => {
              const key = `${week.date}-${dec.symbol}`;
              const isOpen = expanded === key;
              return (
                <Fragment key={key}>
                  <tr
                    className="cursor-pointer border-b border-border/50 transition-colors hover:bg-surface"
                    onClick={() => toggle(key)}
                  >
                    <td className="px-4 py-2.5 font-mono font-medium text-text">
                      {dec.symbol}
                    </td>
                    <td className={`px-2 py-2.5 font-mono tabular-nums ${scoreColor(dec.score)}`}>
                      {dec.score.toFixed(2)}
                    </td>
                    <td className="px-2 py-2.5">
                      {dec.in_book ? (
                        <span className="inline-block rounded border border-positive/30 bg-positive/10 px-1.5 py-0.5 text-[10px] text-positive">
                          long
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-text-soft">
                      <span className="line-clamp-1 max-w-md">
                        {dec.rationale.slice(0, 120)}
                        {dec.rationale.length > 120 ? "…" : ""}
                      </span>
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr className="bg-bg-soft">
                      <td colSpan={4} className="px-4 py-4">
                        <div className="max-w-3xl space-y-3">
                          <p className="text-sm leading-relaxed text-text-soft">
                            {dec.rationale}
                          </p>
                          {dec.key_factors.length > 0 ? (
                            <div>
                              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                                key factors
                              </p>
                              <ul className="space-y-1">
                                {dec.key_factors.map((f, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-2 text-xs leading-relaxed text-text-soft"
                                  >
                                    <span className="text-text-muted">·</span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {dec.conviction != null ? (
                            <div className="pt-1 text-[11px] text-text-muted">
                              conviction: {dec.conviction}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
