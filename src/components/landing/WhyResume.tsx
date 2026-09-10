import type { ReactNode } from "react";
import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { SectionHeader } from "./SectionHeader";
import { Em, Marked, Takeaway } from "./Mark";

const PART_TONE: Record<string, string> = {
  LLM: "border-accent/40 bg-accent-soft text-accent",
  Harness: "border-accent-strong/35 bg-surface-2 text-accent-strong",
  Objectives: "border-orange/45 bg-orange-soft text-orange",
  Data: "border-highlight/40 bg-highlight-soft text-highlight",
  Regime: "border-positive/40 bg-positive/10 text-positive",
  "Market Regime": "border-positive/40 bg-positive/10 text-positive",
};

export function WhyResume() {
  const { kicker, title, titleAccent, now, stack, reasons, takeaway } =
    COPY.whyResume;

  return (
    <section id="why-resume" className="scroll-mt-16 bg-bg">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={PAGE_GUTTER}>
          <SectionHeader kicker={kicker} title={title} titleAccent={titleAccent} />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-5">
            <Card n={now.n} title={now.title}>
              <p className="text-sm leading-relaxed text-text-soft sm:text-[15px]">
                <Marked text={now.body} />
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {now.refs.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-muted"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </Card>

            <Card n={stack.n} title={stack.title}>
              <p className="text-sm leading-relaxed text-text-soft sm:text-[15px]">
                <Marked text={stack.body} />
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {stack.parts.map((part, i) => (
                  <span key={part} className="inline-flex items-center gap-1.5">
                    {i > 0 ? (
                      <span className="font-mono text-xs text-text-muted">+</span>
                    ) : null}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${PART_TONE[part] ?? "border-border bg-surface-2 text-text"}`}
                    >
                      {part}
                    </span>
                  </span>
                ))}
              </div>
            </Card>

            {reasons.map((r) => (
              <Card key={r.n} n={r.n} title={r.title}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                  <Side side={r.left} tone="labs" />
                  <div
                    className="hidden items-center justify-center text-text-muted sm:flex"
                    aria-hidden
                  >
                    <span className="font-mono text-lg">≠</span>
                  </div>
                  <Side side={r.right} tone="finance" />
                </div>
              </Card>
            ))}
          </div>

          <Takeaway className="mt-10 sm:mt-12">
            <Marked text={takeaway} />
          </Takeaway>
        </div>
      </div>
    </section>
  );
}

function Card({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface-2 p-5 text-left sm:p-6">
      <header className="flex items-start gap-3">
        <span className="font-mono text-xs tracking-widest text-accent">{n}</span>
        <h3 className="text-sm font-semibold text-text sm:text-base">{title}</h3>
      </header>
      <div className="mt-4 flex-1">{children}</div>
    </article>
  );
}

function Side({
  side,
  tone,
}: {
  side: { eyebrow: string; title: string; mark?: string };
  tone: "labs" | "finance";
}) {
  const eyebrow = tone === "labs" ? "text-accent" : "text-orange";
  const wash =
    tone === "labs"
      ? "border-accent/20 bg-accent-soft/40"
      : "border-orange/25 bg-orange-soft/50";

  return (
    <div className={`rounded-xl border ${wash} px-3.5 py-3`}>
      <p className={`font-mono text-[10px] uppercase tracking-widest ${eyebrow}`}>
        {side.eyebrow}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-text">
        {side.mark ? (
          <>
            {side.title} <Em>{side.mark}</Em>
          </>
        ) : (
          side.title
        )}
      </p>
    </div>
  );
}
