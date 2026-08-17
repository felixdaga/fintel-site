"use client";

import { KpiBarChart } from "./KpiBarChart";
import { StrategyComparisonChart } from "./StrategyComparisonChart";
import { StepsTimeline } from "./StepsTimeline";
import {
  postContent,
  MODEL_BARS,
  HARNESS_BARS,
  type StrategyComparison,
} from "./data";
import strategyComparison from "./strategy-comparison.json";
import { REPO_URL } from "@/lib/site";

export default function IterativeImprovementPost() {
  const c = postContent;
  const comparison = strategyComparison as unknown as StrategyComparison;

  return (
    <div className="space-y-12">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {c.intro.kicker}
        </p>
        <p className="mt-4 text-base leading-relaxed text-text-soft">
          {c.intro.body}
        </p>
      </div>

      {/* How we run evals with fintel */}
      <section>
        <SectionHeader num="01" title="How we run evals with fintel" />
        <StepsTimeline steps={[...c.steps]} />
      </section>

      {/* Examples — three iterations from our own runs */}
      <section>
        <SectionHeader num="02" title="Examples" />
        <p className="mt-4 text-base leading-relaxed text-text-soft">
          Three real iterations from our own runs — each one knob on the grid,
          scored on the same KPI, then kept or cut.
        </p>

        <div className="mt-10 space-y-12">
          {/* Example 1 — which model is better */}
          <ExampleBlock n="2.1" title={c.example1.title}>
            <Explore text={c.example1.explore} />
            <HowToRead text={c.example1.caption} />
            <div className="mt-5">
              <KpiBarChart
                bars={MODEL_BARS}
                extraRows={[
                  {
                    label: "intelligence",
                    value: (b) => b.intelligence,
                    format: (b) => `${b.intelligence}`,
                    meter: (b) => b.intelligence / 60,
                    meterColor: () => "var(--accent)",
                  },
                  {
                    label: "hallucination",
                    value: (b) => b.hallucination,
                    format: (b) => `${(b.hallucination * 100).toFixed(0)}%`,
                    meter: (b) => b.hallucination,
                    meterColor: () => "var(--negative)",
                  },
                ]}
              />
            </div>
            <Takeaway text={c.example1.takeaway} />
          </ExampleBlock>

          {/* Example 2 — tool-calling agent vs minimal harness */}
          <ExampleBlock n="2.2" title={c.example2.title}>
            <Explore text={c.example2.explore} />
            <HowToRead text={c.example2.caption} />
            <div className="mt-5">
              <KpiBarChart bars={HARNESS_BARS} />
            </div>
            <Takeaway text={c.example2.takeaway} />
          </ExampleBlock>

          {/* Example 3 — strategy improving */}
          <ExampleBlock n="2.3" title={c.example3.title}>
            <Explore text={c.example3.explore} />
            <HowToRead text={c.example3.caption} />
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <StrategyComparisonChart threshold="> 0.0" data={comparison["sw_0.0"]} />
              <StrategyComparisonChart threshold="> 0.3" data={comparison["sw_0.3"]} />
            </div>
            <Takeaway text={c.example3.takeaway} />
          </ExampleBlock>
        </div>
      </section>

      {/* Closing */}
      <section>
        <SectionHeader num="03" title={c.closing.title} accentWord="improve" />
        <p className="mt-4 text-base leading-relaxed text-text-soft">
          {c.closing.body}
        </p>
        <div className="mt-8 text-center">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            {c.closing.cta}
          </a>
        </div>
      </section>
    </div>
  );
}

function ExampleBlock({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{n}</span>
        <h3 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
          {title}
        </h3>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SectionHeader({
  num,
  title,
  accent,
  accentWord,
}: {
  num: string;
  title: string;
  accent?: boolean;
  accentWord?: string;
}) {
  const renderTitle = () => {
    if (!accentWord) return title;
    const idx = title.toLowerCase().indexOf(accentWord.toLowerCase());
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const match = title.slice(idx, idx + accentWord.length);
    const after = title.slice(idx + accentWord.length);
    return (
      <>
        {before}
        <span className="text-orange">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-sm text-accent">{num}</span>
      <h2
        className={`text-2xl font-semibold tracking-tight ${accent ? "text-orange" : "text-text"}`}
      >
        {renderTitle()}
      </h2>
    </div>
  );
}

function Explore({ text }: { text: string }) {
  return (
    <div className="mt-4">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        what we wanted to explore
      </p>
      <p className="mt-2 text-base leading-relaxed text-text-soft">{text}</p>
    </div>
  );
}

function HowToRead({ text }: { text: string }) {
  return (
    <div className="mt-3 text-xs leading-relaxed text-text-muted">
      <p>
        <span className="font-medium text-text-soft">How to read. </span>
        {text}
      </p>
    </div>
  );
}

function Takeaway({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-xl border border-accent/40 bg-accent-soft/40 px-5 py-4">
      <p className="text-sm font-medium leading-relaxed text-text">{text}</p>
    </div>
  );
}
