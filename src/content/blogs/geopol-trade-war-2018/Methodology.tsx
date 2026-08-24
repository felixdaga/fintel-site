import type { ReactNode } from "react";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import { reportContent, METRIC } from "./data";
import { ADVISOR_PROMPT, RATER_PROMPT } from "./methodologyPrompts";
import advisorSchema from "./advisor-schema.json";
import raterSchema from "./rater-schema.json";

/**
 * Collapsible methodology panel — third dropdown in the intro card.
 * Nested sections hold the verbatim advisor/rater prompts, schemas, and
 * score anchors. Copy for setup/score tables lives in `reportContent.methodology`.
 */
export function Methodology() {
  const m = reportContent.methodology;
  const advisorJson = JSON.stringify(stripComment(advisorSchema), null, 2);
  const raterJson = JSON.stringify(raterSchema, null, 2);

  return (
    <details className="group rounded-xl border border-border bg-bg-soft/40 px-4 py-3 open:bg-bg-soft/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {m.label}
          </span>
          <span className="text-sm text-text-muted">{m.teaser}</span>
        </div>
        <DetailsArrow openRotate="group-open:rotate-90" />
      </summary>

      <div className="mt-4 space-y-3">
        <Inner label="Setup">
          <dl className="space-y-3">
            {m.setup.map((s) => (
              <div key={s.title}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {s.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-soft">{s.body}</dd>
              </div>
            ))}
          </dl>
        </Inner>

        <Inner label="Advisor prompt">
          <Pre text={ADVISOR_PROMPT} />
        </Inner>

        <Inner label="Score logic">
          <p className="text-sm leading-relaxed text-text-soft">{m.scoreIntro}</p>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {METRIC.threat.label} ({METRIC.threat.desc})
          </h4>
          <Table
            headers={["Score", "USA", "China"]}
            rows={m.threatRows.map((r) => [r.score, r.usa, r.chn])}
          />
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {METRIC.action.label} ({METRIC.action.desc})
          </h4>
          <Table
            headers={["Score", "Meaning"]}
            rows={m.actionRows.map((r) => [r.score, r.meaning])}
          />
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Hindsight rater
          </h4>
          <Table
            headers={["Dimension", "Meaning"]}
            rows={m.hindsightRows.map((r) => [r.score, r.meaning])}
          />
        </Inner>

        <Inner label="Output schema">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Advisor submission
          </h4>
          <Pre text={advisorJson} />
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Hindsight rating
          </h4>
          <Pre text={raterJson} />
        </Inner>

        <Inner label="Hindsight rater prompt">
          <Pre text={RATER_PROMPT} />
        </Inner>
      </div>
    </details>
  );
}

function stripComment(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(stripComment);
  if (schema && typeof schema === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(schema as Record<string, unknown>)) {
      if (k === "$comment") continue;
      out[k] = stripComment(v);
    }
    return out;
  }
  return schema;
}

function Inner({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group/inner rounded-lg border border-border/70 bg-bg/50 px-3 py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-medium text-text">{label}</span>
        <DetailsArrow
          className="text-text-muted"
          openRotate="group-open/inner:rotate-90"
        />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function Pre({ text }: { text: string }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-bg px-3 py-3 font-mono text-[11px] leading-relaxed text-text-soft whitespace-pre-wrap">
      {text}
    </pre>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-xs leading-relaxed">
        <thead className="bg-bg-soft/60 text-text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border/70">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "whitespace-nowrap px-3 py-2 font-mono text-accent"
                      : "px-3 py-2 text-text-soft"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
