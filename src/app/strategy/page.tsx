import type { Metadata } from "next";
import strategy from "@/data/strategy.json";
import { StrategyNavChart } from "@/components/strategy/StrategyNavChart";
import { WeeklyScoresTable } from "@/components/strategy/WeeklyScoresTable";
import { ScrollToTop } from "@/components/strategy/ScrollToTop";
import { SectionDivider } from "@/components/SectionDivider";
import type { StrategyData } from "@/components/strategy/types";

export const metadata: Metadata = {
  title: "F1 strategy",
  description:
    "F1: fintel's flagship systematic DJIA strategy. Agent-driven, real money.",
};

const MISSION_SNIPPET = `You are a systematic equity research analyst. You will be asked,
independently for one company at a time, to rate that company's
fundamental attractiveness and the trajectory of its business
on a continuous scale from -1 to +1.

Score anchors (landmarks on the continuous range):
  +1.0  Extremely attractive — health, trajectory, undervalued vs own
        history, and a credible near-term fundamental catalyst. Rare.
  +0.5  Strongly attractive — excellent health + trajectory and clearly
        undervalued vs own history.
  +0.2  Mildly attractive — solid fundamentals; valuation fair-to-cheap.
   0.0  Neutral — mixed or fully priced; pillars cancel.
  −0.2  Mildly unattractive — soft fundamentals and/or somewhat rich.
  −0.5  Strongly unattractive — poor trajectory and expensive vs history.
  −1.0  Extremely unattractive — bad fundamentals, clearly expensive,
        and near-term downside catalyst. Rare.

In-between values (e.g. +0.35, −0.15) are encouraged. Prefer milder
scores when evidence is thin. Reserve |score| ≥ 0.5 for multi-factor,
well-cited cases.`;

const DATA_SNIPPET = `fundamentals     — income / balance / cash-flow filings
ratios           — trailing valuation & profitability vs own history
prices           — level, range, and returns (context, not the thesis)
macro            — FRED regime (rates, vol, credit, …)
news_sentiment   — daily sentiment score/count series
news + web_search — franchise, risks, and near-term updates`;

function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-white">{children}</span>;
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
        {label}
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-relaxed text-text-soft sm:text-xs">
        {code}
      </pre>
    </div>
  );
}

export default function StrategyPage() {
  const { nav, weeks } = strategy as StrategyData;

  return (
    <div>
      <ScrollToTop />

      {/* Origin + performance */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
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
              with <Em>AI agents as source of alpha</Em> in-lieu of traditional
              signals. At the time, there were no frameworks, let alone tools,
              to evaluate this new approach.
            </p>
            <p className="text-base leading-relaxed text-text-soft sm:text-lg">
              The solution ultimately became <Em>fintel</Em>. Combining our own
              systematic research pipeline with AI eval science, it has enabled
              us to{" "}
              <Em>scalably evaluate hundreds of strategies and agents</Em> to
              pinpoint the optimal configurations.
            </p>
            <p className="text-base font-semibold leading-relaxed text-text sm:text-lg">
              This culminates to our first strategy, <Em>F1</Em>, deployed April
              this year:
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

      {/* How the agent works */}
      <section className="bg-bg">
        <SectionDivider />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
          <p className="text-center text-base leading-relaxed text-text-soft sm:text-lg">
            F1 aims to <Em>consistently outperform DJIA</Em>, our current
            benchmark. Agents are deployed as{" "}
            <Em>fundamental stock specialists</Em> — rating each DJIA name
            independently on point-in-time evidence.
          </p>

          <div className="mt-8 space-y-4">
            <Snippet label="Snippet 1: mission" code={MISSION_SNIPPET} />
            <Snippet label="Snippet 2: data pack" code={DATA_SNIPPET} />
          </div>

          <p className="mt-8 text-center text-base leading-relaxed text-text-soft sm:text-lg">
            Our track record is yet to be proven, and our strategy evolving, but
            we want to{" "}
            <Em>
              bring you onboard early to demonstrate the edge that fintel
              could offer
            </Em>
            . We will share major evals and evolutions here going foward.
            Meanwhile, <Em>raw agent outputs</Em> will be{" "}
            <Em>published on each rebalancing date</Em>.
            Hopefully this can inpire your own AI-native strategy one day!
          </p>
        </div>
      </section>

      {/* Agent outputs */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-16">
          <div className="mb-6 sm:mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Powering our strategy
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-text sm:mt-3 sm:text-3xl">
              Agent outputs
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-soft sm:mt-3">
              Each row is the fintel agent&apos;s score and rationale for a DJIA
              constituent on decision date. Tap any row to expand the
              rationale and key factors.
            </p>
          </div>

          <WeeklyScoresTable weeks={weeks} />
        </div>
      </section>
    </div>
  );
}
