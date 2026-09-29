"use client";

import { Fragment, useState } from "react";
import { postContent } from "./data";
import raw from "./raw.json";

const copy = postContent.raw;
const names = postContent.names;

type Source = { type: string; id: string; excerpt: string };
type Row = {
  repeat: string;
  score: number | null;
  rationale: string;
  factors: string[];
  sources: Source[];
};
type Week = { date: string; rows: Row[] };

const WEEKS = raw as { openclaw: Week[]; fintel: Week[] };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string) {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year.slice(2)}`;
}

function scoreClass(score: number | null) {
  if (score == null || score === 0) return "text-text-soft";
  return score > 0 ? "text-positive" : "text-negative";
}

export function RawScores() {
  const [harness, setHarness] = useState<"openclaw" | "fintel">("fintel");
  const weeks = WEEKS[harness];
  const [date, setDate] = useState(weeks[weeks.length - 1]?.date ?? "");
  const [open, setOpen] = useState<string | null>(null);
  const shown = weeks.some((week) => week.date === date) ? date : weeks[weeks.length - 1]?.date ?? "";
  const index = weeks.findIndex((week) => week.date === shown);
  const week = weeks[index];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex items-center gap-1 border-b border-border px-1 py-2 sm:px-2">
        <div className="flex shrink-0 gap-1">
          {(
            [
              ["openclaw", names.openclaw],
              ["fintel", names.fintel],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setHarness(id);
                setOpen(null);
              }}
              className={`shrink-0 rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors sm:px-3 sm:text-xs ${
                harness === id
                  ? "bg-accent/15 text-accent"
                  : "text-text-muted hover:bg-surface hover:text-text-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={copy.earlier}
          disabled={index <= 0}
          onClick={() => {
            setDate(weeks[index - 1].date);
            setOpen(null);
          }}
          className="shrink-0 rounded-md px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-25"
        >
          ‹
        </button>
        <div className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {weeks.map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => {
                setDate(item.date);
                setOpen(null);
              }}
              className={`shrink-0 rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors sm:px-3 sm:text-xs ${
                item.date === shown
                  ? "bg-accent/15 text-accent"
                  : "text-text-muted hover:bg-surface hover:text-text-soft"
              }`}
            >
              {shortDate(item.date)}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={copy.later}
          disabled={index >= weeks.length - 1}
          onClick={() => {
            setDate(weeks[index + 1].date);
            setOpen(null);
          }}
          className="shrink-0 rounded-md px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-25"
        >
          ›
        </button>
      </div>
      <div className="border-b border-border px-4 py-3">
        <span className="font-mono text-xs text-text-muted">{shown}</span>
      </div>
      <table className="w-full table-fixed text-left text-xs">
        <thead>
          <tr className="border-b border-border text-text-muted">
            {copy.columns.map((name, i) => (
              <th key={name} className={`px-4 py-2 font-mono font-normal ${i === 1 ? "w-16" : i === 0 ? "w-24" : ""}`}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(week?.rows ?? []).map((row) => {
            const key = `${shown}-${row.repeat}`;
            const expanded = open === key;
            return (
              <Fragment key={key}>
                <tr
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-surface"
                  onClick={() => setOpen(expanded ? null : key)}
                >
                  <td className="px-4 py-2.5 font-mono font-medium text-text">{row.repeat}</td>
                  <td className={`px-2 py-2.5 font-mono tabular-nums ${scoreClass(row.score)}`}>
                    {row.score == null ? "—" : row.score.toFixed(2)}
                  </td>
                  <td className="truncate px-4 py-2.5 text-text-soft">{row.rationale}</td>
                </tr>
                {expanded ? (
                  <tr key={`${key}-detail`} className="bg-bg-soft">
                    <td colSpan={3} className="px-4 py-4">
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed text-text-soft">{row.rationale}</p>
                        {row.factors.length > 0 ? (
                          <div>
                            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">{copy.factors}</p>
                            <ul className="space-y-1.5">
                              {row.factors.map((factor) => (
                                <li key={factor} className="flex gap-2 text-xs leading-relaxed text-text-soft">
                                  <span className="text-text-muted">·</span>
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <div>
                          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">{copy.sources}</p>
                          {row.sources.length > 0 ? (
                            <ul className="space-y-2">
                              {row.sources.map((source) => (
                                <li key={`${source.type}-${source.id}-${source.excerpt}`} className="text-xs leading-relaxed text-text-soft">
                                  <span className="font-mono text-text-muted">
                                    {source.type}
                                    {source.id ? ` · ${source.id}` : ""}
                                  </span>
                                  <br />
                                  {source.excerpt}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-text-muted">{copy.none}</p>
                          )}
                        </div>
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
  );
}
