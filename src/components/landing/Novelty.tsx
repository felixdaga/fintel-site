const rows = [
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
    <section id="how" className="border-b border-border bg-bg-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            the difference
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Financial agent eval is different and non-negotiable
          </h2>
          <p className="mt-4 text-text-soft">
            When coding agents fail, you can retry right away. When
            financial agents fail, you find out after losing money.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface-2">
          <div className="grid grid-cols-3 border-b border-border bg-surface text-xs font-medium uppercase tracking-wide text-text-muted">
            <div className="px-5 py-3" />
            <div className="px-5 py-3">Typical agentic evals</div>
            <div className="px-5 py-3 text-accent normal-case tracking-normal">
              fintel.
            </div>
          </div>
          {rows.map((r) => (
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
      </div>
    </section>
  );
}
