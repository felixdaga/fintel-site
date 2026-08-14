import { HEADLINE } from "./whyEvalData";
import { Logo } from "@/components/Logo";

const EMAIL = "felixlin@fintel.capital";

const ROWS = [
  {
    label: "unit",
    terminal: "Task — finish an instruction in a sandbox",
    fintel: "Decision — emit views at a point-in-time (PIT)",
  },
  {
    label: "environment",
    terminal: "Container — filesystem is the world",
    fintel: "PIT-controlled information access",
  },
  {
    label: "scoring",
    terminal: "Tests / reward when the task completes",
    fintel: "Investment performance metrics computed post-run",
  },
  {
    label: "coupling",
    terminal: "Tasks scored independently",
    fintel: "Decisions are coupled across investment universe and horizons",
  },
  {
    label: "benchmark",
    terminal: "Shared, generalizable datasets",
    fintel: "Investment strategies are highly specialized",
  },
];

export function Novelty() {
  return (
    <section id="how" className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
        <h2 className={`mx-auto w-full text-center ${HEADLINE}`}>
          Financial agent eval is different
        </h2>

        <div className="mt-8 space-y-3 sm:hidden">
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl border border-border bg-surface-2 p-4 text-left"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {r.label}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-text-muted">
                Typical agentic evals
              </p>
              <p className="mt-1 text-sm text-text-soft">{r.terminal}</p>
              <p className="mt-3 text-[11px] text-accent">fintel.</p>
              <p className="mt-1 text-sm font-medium text-text">{r.fintel}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-border bg-surface-2 sm:block">
          <div className="grid grid-cols-3 border-b border-border bg-surface text-xs font-medium uppercase tracking-wide text-text-muted">
            <div className="px-5 py-3" />
            <div className="px-5 py-3">Typical agentic evals</div>
            <div className="px-5 py-3 text-accent normal-case tracking-normal">
              fintel.
            </div>
          </div>
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-3 border-b border-border last:border-0"
            >
              <div className="px-5 py-4 font-mono text-xs uppercase tracking-wide text-text-muted">
                {r.label}
              </div>
              <div className="px-5 py-4 text-sm text-text-soft">{r.terminal}</div>
              <div className="px-5 py-4 text-sm font-medium text-text">
                {r.fintel}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-16 text-center sm:mt-20 sm:pt-20">
          <p className="text-sm leading-relaxed text-text-soft sm:text-lg">
            It takes both{" "}
            <span className="font-semibold text-accent">financial knowhow</span>{" "}
            and{" "}
            <span className="font-semibold text-orange">AI eval science</span> to run evals.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Pillar
              variant="finance"
              title="Finance knowhow"
              items={[
                "Implementable investment strategies",
                "Systematic research pipeline",
                "Financial domain knowledge",
              ]}
            />
            <Pillar
              variant="eval"
              title="Eval science"
              items={[
                "Controlled agent simulation",
                "Benchmark optimization pipeline",
                "Scalability-driven and open sourcing",
              ]}
            />
          </div>

          <div className="mt-8 flex flex-col items-center">
            <svg
              viewBox="0 0 320 64"
              className="mt-2 hidden h-12 w-44 sm:block sm:h-16 sm:w-52"
              aria-hidden
            >
              <path
                d="M48 8 L160 56"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M272 8 L160 56"
                fill="none"
                stroke="var(--orange)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>

            <Logo className="mt-3" />

            <p className="mt-8 text-sm text-text-muted">
              For consultation or partnership, contact
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-1 text-sm text-text-soft transition-colors hover:text-accent"
            >
              {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  variant,
  title,
  items,
}: {
  variant: "finance" | "eval";
  title: string;
  items: string[];
}) {
  const finance = variant === "finance";
  const wash = finance ? "bg-accent-soft/40" : "bg-orange-soft/40";
  const border = finance ? "border-accent/20" : "border-orange/20";
  const titleColor = finance ? "text-accent" : "text-orange";
  const dot = finance ? "bg-accent" : "bg-orange";

  return (
    <div className={`rounded-2xl border ${border} ${wash} p-6 text-left`}>
      <h3 className={`text-sm font-semibold sm:text-base ${titleColor}`}>{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-text-soft sm:text-sm"
          >
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
