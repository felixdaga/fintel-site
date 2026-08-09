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
    <div className="border-b border-border">
      <ScrollToTop />
      {/* ── Intro + chart ───────────────────────────────────────────── */}
      <section className="border-b border-border bg-bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              live strategy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:mt-4 sm:text-5xl">
              F1
            </h1>
          </div>

          <div className="mx-auto mt-6 max-w-3xl text-center sm:mt-8">
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              We are at the{" "}
              <span className="font-medium text-highlight">dawn of AI-native
              strategies</span>, where AI agents are directly making investment decisions. We
              believe our eval platform gives us an edge — so we&apos;ve put real money
              behind it. Leveraging our founders&apos; experience at BlackRock, we have
              launched our first flagship strategy: F1
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
            <p className="text-sm leading-relaxed text-text-soft sm:text-base">
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
            <p className="mt-3 text-sm leading-relaxed text-text-soft sm:mt-4 sm:text-base">
              After hundreds of evals across potential strategies and agents, F1 is{" "}
              <span className="font-medium text-highlight">still evolving</span>. For
              transparency and knowledge sharing, we will publish the raw agent outputs
              every Friday before our weekly rebalancing.
            </p>
          </div>
        </div>
      </section>

      {/* ── Weekly agent outputs ────────────────────────────────────── */}
      <section className="border-b border-border">
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
