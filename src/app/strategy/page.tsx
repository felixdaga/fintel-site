import type { Metadata } from "next";
import strategy from "@/data/strategy.json";
import diff from "@/data/strategy_diff.json";
import { StrategyNavChart } from "@/components/strategy/StrategyNavChart";
import { WeeklyScoresTable } from "@/components/strategy/WeeklyScoresTable";
import { ScrollToTop } from "@/components/strategy/ScrollToTop";
import { MultiLineChart } from "@/components/strategy/MultiLineChart";
import { CadenceBarChart } from "@/components/strategy/CadenceBarChart";
import type { StrategyData } from "@/components/strategy/types";
import { SITE_URL } from "@/lib/site";
import { STRATEGY_COPY } from "@/components/strategy/strategy_texts";
import { posts } from "@/data/posts";
import { PAGE_GUTTER, PAGE_PAD, PAGE_TITLE } from "@/components/landing/whyEvalData";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { Marked } from "@/components/landing/Mark";
import { HowFintel } from "@/components/landing/HowFintel";

export const metadata: Metadata = {
  title: STRATEGY_COPY.meta.title,
  description: STRATEGY_COPY.meta.description,
  alternates: {
    canonical: `${SITE_URL}/strategy`,
  },
};

export default function StrategyPage() {
  const { nav, weeks } = strategy as StrategyData;
  const { hero, chart, process, controls, live } = STRATEGY_COPY;
  const liveNav =
    typeof nav.live_usd === "number"
      ? nav.live_usd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : null;
  const relatedPosts = posts
    .filter(
      (p) =>
        /F1/i.test(p.title) || p.slug === "iterative-agent-improvement",
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <ScrollToTop />

      <section className="bg-bg">
        <div className={`${PAGE_PAD} py-12 sm:py-20`}>
          <div className={PAGE_GUTTER}>
            <header className="mx-auto max-w-3xl text-center">
              <h1 className={PAGE_TITLE}>
                <HeroTitle title={hero.title} accent={hero.titleAccent} />
              </h1>
              <div className="mt-6 space-y-4 sm:mt-8">
                {hero.ledes.map((lede) => (
                  <p
                    key={lede}
                    className="text-base leading-relaxed text-text-soft sm:text-lg"
                  >
                    <Marked text={lede} />
                  </p>
                ))}
              </div>
            </header>

            <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
              <StrategyNavChart
                dates={nav.dates}
                f1={nav.f1_gross}
                benchmark={nav.benchmark}
                title={chart.title}
                titleShort={chart.titleShort}
                aria={chart.aria}
                agentLabel={chart.agent}
                agentShortLabel={chart.agentShort}
                benchmarkLabel={chart.benchmark}
                alphaLabel={chart.alpha}
                alphaShortLabel={chart.alphaShort}
                navBubble={
                  liveNav
                    ? { value: liveNav, label: chart.navBubble.label }
                    : undefined
                }
              />
              <p className="mt-3 px-1 text-center text-[11px] leading-relaxed text-text-muted sm:mt-4 sm:text-xs">
                {hero.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-soft">
        <div className={`${PAGE_PAD} py-12 sm:py-20`}>
          <div className={PAGE_GUTTER}>
            <SectionHeader
              title={process.title}
              titleAccent={process.titleAccent}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-text-soft sm:text-lg">
              <Marked text={process.lede} />
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
              <MultiLineChart
                title={process.charts.model.title}
                eyebrow={process.charts.model.eyebrow}
                highlightId="floor_llm_v1_memory"
                dates={diff.varyModel.dates}
                series={diff.varyModel.series}
                benchmark={{ label: "DJIA", values: diff.varyModel.benchmark }}
                valueKey="nav"
                xTick="year"
                decimals={2}
              />
              <MultiLineChart
                title={process.charts.harness.title}
                eyebrow={process.charts.harness.eyebrow}
                highlightId="floor_llm_v1_memory"
                dates={diff.varyHarness.dates}
                series={diff.varyHarness.series}
                benchmark={{ label: "DJIA", values: diff.varyHarness.benchmark }}
                valueKey="nav"
                xTick="year"
                decimals={2}
              />
              <MultiLineChart
                title={process.charts.additivity.title}
                eyebrow={process.charts.additivity.eyebrow}
                highlightId="alphaview"
                dates={diff.varyStrategy.dates}
                series={diff.varyStrategy.series}
                valueKey="drawdown"
                xTick="month"
                zeroLine
                decimals={2}
              />
              <CadenceBarChart
                title={process.charts.cadence.title}
                eyebrow={process.charts.cadence.eyebrow}
                highlightId="biweekly"
                cadences={diff.cadenceBars.cadences}
                metrics={diff.cadenceBars.metrics}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg">
        <div className={`${PAGE_PAD} py-12 sm:py-20`}>
          <div className={PAGE_GUTTER}>
            <SectionHeader
              title={controls.title}
              titleAccent={controls.titleAccent}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-text-soft sm:text-lg">
              <Marked text={controls.lede} />
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
              <MultiLineChart
                title={controls.charts.stochastic.title}
                eyebrow={controls.charts.stochastic.eyebrow}
                dates={diff.stochasticity.dates}
                series={diff.stochasticity.series}
                valueKey="score"
                xTick="year"
                decimals={2}
              />
              <MultiLineChart
                title={controls.charts.systematic.title}
                eyebrow={controls.charts.systematic.eyebrow}
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

      <section className="bg-bg-soft">
        <div className={`${PAGE_PAD} py-12 sm:py-20`}>
          <div className={PAGE_GUTTER}>
            <SectionHeader title={live.title} titleAccent={live.titleAccent} />
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-text-soft sm:text-lg">
              <Marked text={live.lede} />
            </p>

            <div className="mt-8 sm:mt-10">
              {relatedPosts.length > 0 ? (
                <div className="mb-8 rounded-2xl border border-border bg-surface-2/40 p-5 sm:mb-10 sm:p-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">
                    {live.postsKicker}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {relatedPosts.map((p) => {
                      const href = p.externalUrl ?? `/blogs/${p.slug}`;
                      return (
                        <li key={p.slug}>
                          <a
                            href={href}
                            target={p.externalUrl ? "_blank" : undefined}
                            rel={p.externalUrl ? "noopener noreferrer" : undefined}
                            className="group -mx-2 block rounded-lg px-2 py-2 hover:bg-bg-soft/60"
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
              <p className="mt-6 text-sm leading-relaxed text-text-soft">
                {live.howToRead}
              </p>
            </div>
          </div>
        </div>
      </section>

      <HowFintel />
    </div>
  );
}

function HeroTitle({ title, accent }: { title: string; accent: string }) {
  if (/\*[^*]+\*/.test(title)) return <Marked text={title} />;
  const i = title.indexOf(accent);
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="text-orange">{accent}</span>
      {title.slice(i + accent.length)}
    </>
  );
}
