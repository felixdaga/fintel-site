type PairRow = { type: "pair"; i: string; p: string };
type Row = PairRow;

const ROWS: Row[] = [
  {
    type: "pair",
    i: "Is my AI ready to trade and make money?",
    p: "Can AI generate durable and additive alpha over traditional strategies?",
  },
  {
    type: "pair",
    i: "My agent was trading so well before April - what happened!?",
    p: "How can we systematically backtest and evaluate AI agents?",
  },
  {
    type: "pair",
    i: "Should AI run my portfolio like a hedge fund or index?",
    p: "Which investment strategy is implementatble with the current state of AI?",
  },
  {
    type: "pair",
    i: "Which model/harness is best for investing? Is Claude > GPT?",
    p: "How can we quantify impact from each iteration of the strategy and agent?",
  },
];

const cellBase = "rounded-2xl px-5 py-4 text-sm leading-relaxed";
const cellDefault = {
  i: `${cellBase} border border-border bg-bg text-text-soft`,
  p: `${cellBase} border border-accent/30 bg-accent-soft text-text`,
};

export function Questions() {
  return (
    <section id="questions" className="bg-bg-soft">
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
                <p className={cellDefault.i}>{r.i}</p>
                <div className="hidden items-center sm:flex">
                  <span className="font-mono text-xs text-accent">↔</span>
                </div>
                <p className={cellDefault.p}>{r.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
