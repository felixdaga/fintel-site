"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { StrongText } from "@/components/landing/Mark";
import { postContent } from "./data";
import showcase from "./showcase.json";

const c = postContent;

type Mode = "active" | "binary";

export type HoldingBook = {
  summary: typeof showcase.summary;
  returns: typeof showcase.returns;
  weights: typeof showcase.weights;
  repeats: typeof showcase.repeats;
};

const activeBook: HoldingBook = {
  summary: showcase.summary,
  returns: showcase.returns,
  weights: showcase.weights,
  repeats: showcase.repeats,
};

type HoldingValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  book: HoldingBook;
};

const HoldingContext = createContext<HoldingValue | null>(null);

export function useHolding() {
  const value = useContext(HoldingContext);
  if (!value) throw new Error("Holding charts must render under the holding toggle");
  return value;
}

export function HoldingProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("active");
  const book = mode === "binary" ? showcase.binary : activeBook;
  return <HoldingContext.Provider value={{ mode, setMode, book }}>{children}</HoldingContext.Provider>;
}

export function HoldingToggle() {
  const { mode, setMode } = useHolding();
  const options = [
    ["active", c.holding.active],
    ["binary", c.holding.binary],
  ] as const;
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
      <div className="inline-flex rounded-full border border-border bg-surface-2 p-1">
        {options.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
              mode === id ? "bg-accent text-bg" : "text-text-muted hover:text-text-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-center text-xs leading-relaxed text-text-muted">
        <StrongText text={c.holding.note} />
      </p>
    </div>
  );
}

export function ModeCopy({ copy }: { copy: { active: string; binary: string } }) {
  const { mode } = useHolding();
  return (
    <p>
      <StrongText text={copy[mode]} />
    </p>
  );
}

type MetricRow = HoldingBook["summary"][number]["rows"][number];

function pct(value: number | null, digits = 2) {
  if (value == null) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

function num(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(2);
}

const HIGHER = [true, true, false, true, true, true];

function versus(value: number | null, base: number | null, digits: number, scale = 1) {
  if (value == null || base == null) return "";
  const shown = Number((value * scale).toFixed(digits));
  const bench = Number((base * scale).toFixed(digits));
  if (shown === bench) return "";
  return shown > bench ? "text-positive" : "text-negative";
}

const HEAD = c.summary.columns;

function bookName(row: MetricRow) {
  const labels = c.summary.books;
  if (row.key in labels) return labels[row.key as keyof typeof labels];
  return row.label;
}

function benchIr(row: MetricRow) {
  return row.key === "cap" || row.key === "mcMax" ? row.irCap : row.irEqual;
}

function tokenCount(value: number) {
  return value.toLocaleString("en-US");
}

function BookTable({ id, rows }: { id: "openclaw" | "fintel"; rows: MetricRow[] }) {
  const fintel = id === "fintel";
  const usage = c.usage[id];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex flex-col gap-1.5 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 className={`font-mono text-xs font-medium ${fintel ? "text-orange" : "text-accent"}`}>{c.names[id]}</h3>
        <p className="flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[11px] text-text-muted sm:justify-end">
          <span className="whitespace-nowrap">
            {c.usage.input} <span className="text-text-soft">{tokenCount(usage.input)}</span>
          </span>
          <span className="whitespace-nowrap">
            {c.usage.output} <span className="text-text-soft">{tokenCount(usage.output)}</span>
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-muted">
              {HEAD.map((name, i) => (
                <th key={name} className={`px-4 py-2 font-mono font-normal ${i ? "text-right" : ""}`}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const ir = benchIr(row);
              const above = index > 0 ? rows[index - 1] : null;
              const overlay = row.key === "eqMax" || row.key === "mcMax";
              const metrics = [
                { text: pct(row.total), value: row.total, base: above?.total ?? null, digits: 2, scale: 100 },
                { text: pct(row.annRet), value: row.annRet, base: above?.annRet ?? null, digits: 2, scale: 100 },
                { text: pct(row.annVol), value: row.annVol, base: above?.annVol ?? null, digits: 2, scale: 100 },
                { text: pct(row.maxDd), value: row.maxDd, base: above?.maxDd ?? null, digits: 2, scale: 100 },
                { text: num(row.sharpe), value: row.sharpe, base: above?.sharpe ?? null, digits: 2, scale: 1 },
                { text: num(ir), value: ir, base: 0, digits: 2, scale: 1 },
              ];
              return (
                <tr key={row.key} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono font-medium text-text">{bookName(row)}</td>
                  {metrics.map((metric, i) => {
                    const grade = overlay && HIGHER[i] ? versus(metric.value, metric.base, metric.digits, metric.scale) : "";
                    return (
                      <td
                        key={HEAD[i + 1]}
                        className={`px-4 py-2.5 text-right font-mono tabular-nums ${grade || "text-text-soft"}`}
                      >
                        {metric.text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HeadlineResults() {
  const { mode, book } = useHolding();
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-text">
        <StrongText text={c.summary.title} />
      </h2>
      <div className="space-y-4">
        {book.summary.map((block) => (
          <BookTable key={block.id} id={block.id === "fintel" ? "fintel" : "openclaw"} rows={block.rows} />
        ))}
      </div>
      <p className="text-xs text-text-muted">
        <StrongText text={c.summary.footnote[mode]} />
      </p>
    </section>
  );
}
