import type { Metadata } from "next";
import strategy from "@/data/strategy.json";
import { StrategyNavChart } from "@/components/strategy/StrategyNavChart";
import { WeeklyScoresTable } from "@/components/strategy/WeeklyScoresTable";
import { ScrollToTop } from "@/components/strategy/ScrollToTop";
import type { StrategyData } from "@/components/strategy/types";

export const metadata: Metadata = {
  title: "F1 strategy — fintel.",
  description:
    "F1: fintel's flagship systematic DJIA strategy. Weekly rebalanced, agent-driven, real money.",
};

export default function StrategyPage() {
  const data = strategy as StrategyData;
  const { nav, weeks } = data;

  return (
    <div>
      <ScrollToTop />
      {/* ── Intro + chart ───────────────────────────────────────────── */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              live strategy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:mt-4 sm:text-5xl">
              F1
            </h1>
          </div>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center sm:mt-8">
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              While at BlackRock, our founders envisioned a systematic strategy
              with{" "}
              <span className="font-medium text-highlight">
                AI agents as the source of alpha
              </span>{" "}
              instead of traditional signals.
              At the time, there were no open resources to evaluate this novel
              approach.
            </p>
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              <span className="font-medium text-accent">fintel</span> is the
              final piece of the puzzle, unlocking the capability to{" "}
              <span className="font-medium text-highlight">
                evaluate hundreds of strategies and agents at scale
              </span>
              .
            </p>
            <p className="text-base font-semibold leading-relaxed text-text sm:text-lg">
              Our first strategy -{" "}
              <span className="text-accent">F1</span> - was launched
              in April this year:
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
            <StrategyNavChart
              dates={nav.dates}
              f1={nav.f1_gross}
              benchmark={nav.benchmark}
            />
            <p className="mt-3 px-1 text-center text-[11px] leading-relaxed text-text-muted sm:mt-4 sm:text-xs">
              Gross portfolio returns from rolling holdings since inception. Past
              performance is not indicative of future results.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              F1 is a systematic strategy that aims to{" "}
              <span className="font-medium text-highlight">
                consistently outperform DJIA
              </span>
              , our current benchmark. We don&apos;t fly blind with the &quot;latest and
              greatest&quot; agent deployed like a hedge fund manager on day one; Frontier
              is taking the time to{" "}
              <span className="font-medium text-highlight">
                evaluate each part of our strategy/agent and iteratively improve
              </span>
              . Finally, we want to demonstrate that even without fancy data or
              compute, you can still extract additive alpha from AI agents right now.
            </p>
            <p className="mt-3 text-base leading-relaxed text-text-soft sm:mt-4 sm:text-lg">
              After hundreds of evals across potential strategies and agents, F1 is{" "}
              <span className="font-medium text-highlight">still evolving</span>. For
              transparency and knowledge sharing, we will publish the raw agent outputs
              every Friday before our weekly rebalancing.
            </p>
          </div>
        </div>
      </section>

      {/* ── Weekly agent outputs ────────────────────────────────────── */}
      <section className="bg-bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-16">
          <div className="mb-6 sm:mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              agent outputs
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-text sm:mt-3 sm:text-3xl">
              weekly scores
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-soft sm:mt-3">
              Each row is the fintel agent&apos;s raw score for a DJIA constituent on
              the decision date. Tap any row to expand the rationale and key factors.
            </p>
          </div>

          <WeeklyScoresTable weeks={weeks} />
        </div>
      </section>
    </div>
  );
}
