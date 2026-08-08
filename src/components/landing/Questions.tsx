type PairRow = { type: "pair"; i: string; p: string; highlight?: boolean };
type Row = PairRow;

const ROWS: Row[] = [
  {
    type: "pair",
    i: "Can my AI agent actually trade and make money?",
    p: "Can AI agents contribute to durable and additive alpha?",
  },
  {
    type: "pair",
    i: "What prompt should I use for OpenClaw to screen my portfolio?",
    p: "Which AI-native investment strategy could actually work?",
  },
  {
    type: "pair",
    i: "Which model is the best stock picker, Claude or Gemini? Should I save money with a cheaper model?",
    p: "How can I systematically quantify AI-specific capabilities and risks?",
  },
  {
    type: "pair",
    i: "What are my returns if my agent started trading a year ago instead?",
    p: "How to realistically backtest AI agents while minimizing look-ahead bias and stochasticity?",
  },
  {
    type: "pair",
    highlight: true,
    i: "Smarter model or more sophisticated agent = better returns?",
    p: "From switching a model to adding a new subagent, how can I quantify the performance impact?",
  },
];

const cellBase = "rounded-2xl px-5 py-4 text-sm leading-relaxed";
const cellDefault = {
  i: `${cellBase} border border-border bg-bg-soft text-text-soft`,
  p: `${cellBase} border border-accent/30 bg-accent-soft text-text`,
};
const cellHighlight = `${cellBase} border border-highlight/50 bg-highlight-soft text-text`;

export function Questions() {
  return (
    <section id="questions" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="block text-highlight">Million-dollar questions...</span>
            <span className="block text-accent"> unanswered</span>
          </h2>
        </div>

        <div className="mt-12">
          <div className="mb-3 hidden grid-cols-[1fr_auto_1fr] gap-6 sm:grid">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-text-muted">
              personal portfolio
            </p>
            <div />
            <p className="text-center font-mono text-xs uppercase tracking-widest text-text-muted">
              institutional portfolio
            </p>
          </div>

          <div className="space-y-4">
            {ROWS.map((r) => (
              <div
                key={r.i}
                className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-6"
              >
                <p className={r.highlight ? cellHighlight : cellDefault.i}>
                  {r.i}
                </p>
                <div className="hidden items-center sm:flex">
                  <span
                    className={`font-mono text-xs ${r.highlight ? "text-highlight" : "text-accent"}`}
                  >
                    ↔
                  </span>
                </div>
                <p className={r.highlight ? cellHighlight : cellDefault.p}>
                  {r.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
