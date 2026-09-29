import type { ReactNode } from "react";
import { StrongText } from "@/components/landing/Mark";
import { RepeatCharts, ReturnCharts, TiltCharts, WeightCharts } from "./Charts";
import { postContent } from "./data";
import { RawScores } from "./RawScores";
import showcase from "./showcase.json";

const c = postContent;

type MetricRow = {
  key: string;
  label: string;
  avgBtc: number | null;
  total: number | null;
  annRet: number | null;
  annVol: number | null;
  maxDd: number | null;
  sharpe: number | null;
  irEqual: number | null;
  irCap: number | null;
};

function pct(value: number | null, digits = 2) {
  if (value == null) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

function num(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(2);
}

/** Higher is better. False means the column has no better/worse direction. */
const HIGHER = [false, true, true, false, true, true, true];

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
  return row.key === "cap" || row.key === "mc20" ? row.irCap : row.irEqual;
}

function tokenCount(value: number) {
  return value.toLocaleString("en-US");
}

function BookTable({ id, rows }: { id: "openclaw" | "fintel"; rows: MetricRow[] }) {
  const fintel = id === "fintel";
  const usage = c.usage[id];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className={`font-mono text-xs font-medium ${fintel ? "text-orange" : "text-accent"}`}>{c.names[id]}</h3>
        <p className="shrink-0 text-right font-mono text-[11px] text-text-muted">
          {c.usage.input}{" "}
          <span className="text-text-soft">{tokenCount(usage.input)}</span>
          <span className="mx-2">·</span>
          {c.usage.output}{" "}
          <span className="text-text-soft">{tokenCount(usage.output)}</span>
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
            const overlay = row.key === "eq20" || row.key === "mc20";
            const metrics = [
              { text: pct(row.avgBtc, 1), value: row.avgBtc, base: above?.avgBtc ?? null, digits: 1, scale: 100 },
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

function Section({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-text">
        <StrongText text={title} />
      </h2>
      {body ? (
        <p>
          <StrongText text={body} />
        </p>
      ) : null}
      {children}
    </section>
  );
}

export default function SystematicAiCryptoPost() {
  return (
    <div className="space-y-14">
      <div className="space-y-4 rounded-2xl border border-border bg-bg/70 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.intro.title} />
        </h2>
        <p>
          <StrongText text={c.intro.body} />
        </p>
        <p>
          <StrongText text={c.intro.lead} />
        </p>
        <ul className="space-y-2 pl-5">
          {c.intro.agents.map((agent) => (
            <li key={agent.name} className="list-disc">
              <span className="font-medium text-text">
                <StrongText text={agent.name} />
              </span>
              <span className="text-text-soft"> — {agent.body}</span>
            </li>
          ))}
        </ul>
        <p>
          <StrongText text={c.intro.shared} />
        </p>
        <p>
          <StrongText text={c.intro.result} />
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))] overflow-hidden rounded-2xl border border-border bg-surface-2">
        {c.stats.map((stat, i) => (
          <div key={stat.label} className={`px-4 py-3.5 ${i ? "border-l border-border" : ""}`}>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">{stat.label}</p>
            <p className="mt-1 flex items-baseline gap-1.5 whitespace-nowrap">
              <span className={stat.value.length > 6 ? "text-[15px] font-semibold tracking-tight text-text" : "font-mono text-2xl font-semibold tabular-nums tracking-tight text-text"}>
                {stat.value}
              </span>
              {"note" in stat ? <span className="text-[11px] text-text-muted">{stat.note}</span> : null}
            </p>
          </div>
        ))}
      </div>

      <Section title={c.summary.title}>
        <div className="space-y-4">
          {showcase.summary.map((block) => (
            <BookTable key={block.id} id={block.id === "fintel" ? "fintel" : "openclaw"} rows={block.rows} />
          ))}
        </div>
        <p className="text-xs text-text-muted">
          <StrongText text={c.summary.footnote} />
        </p>
      </Section>

      <Section title={c.returns.title} body={c.returns.body}>
        <ReturnCharts />
      </Section>

      <Section title={c.tilts.title} body={c.tilts.body}>
        <TiltCharts />
      </Section>

      <Section title={c.weights.title} body={c.weights.body}>
        <WeightCharts />
      </Section>

      <Section title={c.repeats.title} body={c.repeats.body}>
        <RepeatCharts />
      </Section>

      <Section title={c.raw.title} body={c.raw.body}>
        <RawScores />
      </Section>

      <Section title={c.mission.title} body={c.mission.body}>
        <pre className="max-h-80 overflow-auto rounded-2xl border border-border bg-surface-2 px-4 py-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-text-soft">
          <StrongText text={c.mission.scroll} />
        </pre>
      </Section>

      <Section title={c.dataAccess.title} body={c.dataAccess.body}>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {c.dataAccess.items.map((item) => (
            <li key={item.name} className="px-5 py-4">
              <p className="text-sm font-semibold text-text">
                <StrongText text={item.name} />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-soft">
                <StrongText text={item.body} />
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
