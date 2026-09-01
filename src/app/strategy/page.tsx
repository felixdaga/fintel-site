import type { Metadata } from "next";
import strategy from "@/data/strategy.json";
import diff from "@/data/strategy_diff.json";
import { StrategyNavChart } from "@/components/strategy/StrategyNavChart";
import { WeeklyScoresTable } from "@/components/strategy/WeeklyScoresTable";
import { ScrollToTop } from "@/components/strategy/ScrollToTop";
import { MultiLineChart } from "@/components/strategy/MultiLineChart";
import { CadenceBarChart } from "@/components/strategy/CadenceBarChart";
import { F1Components } from "@/components/strategy/F1Components";
import type { StrategyData } from "@/components/strategy/types";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "F1 strategy",
  description:
    "F1: fintel's flagship systematic DJIA strategy. Agent-driven, real money.",
};

function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-white">{children}</span>;
}

function FootRef({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 font-mono text-[10px] text-accent">{n}</sup>
  );
}

export default function StrategyPage() {
  const { nav, weeks } = strategy as StrategyData;
  const f1Posts = posts
    .filter(
      (p) =>
        /F1/i.test(p.title) || p.slug === "iterative-agent-improvement",
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <ScrollToTop />

      {/* Origin + performance */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              live strategy
            </p>
            <h1 className="live-text mt-3 text-3xl font-semibold tracking-tight text-orange sm:mt-4 sm:text-5xl">
              F1
            </h1>
          </header>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center sm:mt-8">
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              While at <Em>BlackRock</Em>, our founders envisioned a systematic strategy
              with <Em>AI agents as a source of alpha</Em> in lieu of traditional
              signals — and built <Em>fintel</Em> to make it possible.
            </p>
            <p className="text-base font-semibold leading-relaxed text-text sm:text-lg">
              This culminates in our first strategy, <Em>F1</Em>, deployed in April
              this year, which aims to outperform the Dow Jones:
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
            <StrategyNavChart
              dates={nav.dates}
              f1={nav.f1_gross}
              benchmark={nav.benchmark}
            />
            <p className="mt-3 px-1 text-center text-[11px] leading-relaxed text-text-muted sm:mt-4 sm:text-xs">
              Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </section>

      {/* How the agent works — mission + how is this different */}
      <section className="bg-bg">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              A Formula One approach
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Our differentiating approach to AI investing
            </h2>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              <span className="font-semibold text-text-soft">
                A drag race is won by the engine.
              </span>{" "}
              <span className="font-semibold text-orange">
                Formula One is won by the process.
              </span>{" "}
              In a race where the environment is <Em>dynamic</Em>, variables are{" "}
              <Em>non-monotonic</Em>
              <FootRef n={1} /> and winning is about <Em>consistency</Em>, your{" "}
              <Em>process and controls</Em> matter the most.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl sm:mt-10">
            <F1Components />
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
            <h3 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
              The process
            </h3>
            <p className="mt-4 text-base leading-relaxed text-text-soft sm:mt-5 sm:text-lg">
              At F1, we rely on fintel, our{" "}
              <Em>proprietary eval pipeline</Em> that combines financial knowhow with AI eval
              science, to <Em>quantify financial AI performance</Em>. Our
              strategies and agents are built from hundreds of evals to
              identify the optimal configurations, and their iterations are measured to
              adapt for changing market conditions.
            </p>
          </div>

          {/* Eval charts */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
            <MultiLineChart
              title="Choosing the right model"
              eyebrow="Backtest performance"
              highlightId="floor_llm_v1_memory"
              dates={diff.varyModel.dates}
              series={diff.varyModel.series}
              benchmark={{ label: "DJIA", values: diff.varyModel.benchmark }}
              valueKey="nav"
              xTick="year"
              decimals={2}
            />
            <MultiLineChart
              title="Configuring the right harness"
              eyebrow="Backtest performance"
              highlightId="floor_llm_v1_memory"
              dates={diff.varyHarness.dates}
              series={diff.varyHarness.series}
              benchmark={{ label: "DJIA", values: diff.varyHarness.benchmark }}
              valueKey="nav"
              xTick="year"
              decimals={2}
            />
            <MultiLineChart
              title="Evaluating strategy (prompt) iterations"
              eyebrow="Drawdowns"
              highlightId="alphaview"
              dates={diff.varyStrategy.dates}
              series={diff.varyStrategy.series}
              valueKey="drawdown"
              xTick="month"
              zeroLine
              decimals={2}
            />
            <CadenceBarChart
              title="Finding the right rebalancing cadence"
              eyebrow="Trading costs"
              highlightId="biweekly"
              cadences={diff.cadenceBars.cadences}
              metrics={diff.cadenceBars.metrics}
            />
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
                The controls
              </h3>
              <p className="mt-4 text-base leading-relaxed text-text-soft sm:mt-5 sm:text-lg">
                We take crashing seriously. The current limitations of AI,
                e.g. <Em>hallucinations and stochasticity</Em>, mean that they
                can&apos;t be left to roam free; you can&apos;t trust
                a hedge fund manager who hallucinates 5% of the time, let alone{" "}
                <Em>more than half</Em><FootRef n={2} />. At F1, we adopt a{" "}
                <Em>systematic approach</Em> to control for their risks and keep
                them in the right lanes.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <MultiLineChart
                title="AI agents are stochastic"
                eyebrow="Agent ratings for JPM across identical repeats"
                dates={diff.stochasticity.dates}
                series={diff.stochasticity.series}
                valueKey="score"
                xTick="year"
                decimals={2}
              />
              <MultiLineChart
                title="Systematic vs unconstrained trading"
                eyebrow="Backtest performance"
                dates={diff.biweeklyPerformance.dates}
                series={diff.biweeklyPerformance.series.filter(
                  (s) => s.id !== "benchmark",
                )}
                valueKey="nav"
                xTick="month"
                decimals={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3) Transparency — raw agent outputs */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
              The hard work
            </h3>
            <p className="mt-3 text-base leading-relaxed text-text-soft sm:text-lg">
              There is no shortcut to generating alpha with AI. Our approach
              entails <Em>hundreds of evals for each iteration</Em> of our
              strategy and agents. But we see this as necessary for an{" "}
              <Em>institutional-grade</Em> AI portfolio. Though our track record
              is yet to be proven and our strategy is evolving, we want to bring
              you onboard early to demonstrate its power. We will regularly{" "}
              <Em>publish</Em> our evals and raw agent outputs here. Hopefully
              this can inspire your own AI-native strategy one day!
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            {/* F1 commentary & notes — above the table */}
            {f1Posts.length > 0 ? (
              <div className="mb-8 rounded-2xl border border-border bg-surface-2/40 p-5 sm:mb-10 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  F1 evals &amp; commentary                </p>
                <ul className="mt-4 space-y-3">
                  {f1Posts.map((p) => {
                    const href = p.externalUrl ?? `/blogs/${p.slug}`;
                    return (
                      <li key={p.slug}>
                        <a
                          href={href}
                          target={p.externalUrl ? "_blank" : undefined}
                          rel={p.externalUrl ? "noopener noreferrer" : undefined}
                          className="group block rounded-lg px-2 py-2 -mx-2 hover:bg-bg-soft/60"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <span className="text-sm font-medium text-text group-hover:text-accent">
                              {p.title}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums text-text-muted">
                              {p.date}
                            </span>
                          </div>
                          {p.description ? (
                            <p className="mt-1 text-sm leading-relaxed text-text-soft">
                              {p.description}
                            </p>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <WeeklyScoresTable weeks={weeks} />

            {/* How to read — below the table, same width as the table */}
            <p className="mt-6 text-sm leading-relaxed text-text-soft">
              <span className="font-semibold text-text">How to read:</span> Each
              row is the fintel agent&apos;s score and rationale for a DJIA
              constituent on decision date. Tap any row to expand the rationale
              and key factors.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:py-10">
          <ol className="space-y-2 text-xs leading-relaxed text-text-muted">
            <li>
              <span className="font-mono text-accent">1)</span>{" "}
              Agentic capabilities don&apos;t scale monotonically — coordination
              yields diminishing returns once single-agent baselines exceed a
              threshold, and tool-heavy multi-agent setups can incur overhead
              that degrades performance. See Kim et al.,{" "}
              <a
                href="https://arxiv.org/abs/2512.08296"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-text"
              >
                Towards a Science of Scaling Agent Systems
              </a>
              , arXiv:2512.08296 (2026).
            </li>
            <li>
              <span className="font-mono text-accent">2)</span>{" "}
              Hallucination rate on the AA-Omniscience
              knowledge &amp; hallucination benchmark; the median for frontier models sits even higher than 50%. See{" "}
              <a
                href="https://artificialanalysis.ai/evaluations/omniscience"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-text"
              >
                Artificial Analysis — AA-Omniscience
              </a>
              .
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
