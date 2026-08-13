"use client";

import { reportContent } from "./data";
import { Novelty } from "./Novelty";
import { Timeline } from "./Timeline";
import { ScoreChart } from "./ScoreChart";
import { DateTable } from "./DateTable";
import { StochasticityCharts } from "./StochasticityCharts";
import { EvalChart } from "./EvalChart";
import { EvalTable } from "./EvalTable";
import { AveragedScoreChart } from "./AveragedScoreChart";

export default function GeopolReportPost() {
  const c = reportContent;

  return (
    <div className="space-y-10">
      {/* Novelty (collapsible, under the title/description) */}
      <Novelty />

      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="text-base leading-relaxed text-text-soft">{c.intro.body}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.intro.stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
        {/* Full curated timeline (collapsible) */}
        <div className="mt-5">
          <Timeline />
        </div>
      </div>

      {/* Section 1 */}
      <section>
        <SectionHeader num={c.section1.num} title={c.section1.title} />
        <Finding text={c.section1.finding} />
        <HowToRead text={c.section1.caption} />
        <div className="mt-5 space-y-5">
          <ScoreChart party="USA" />
          <ScoreChart party="CHN" />
        </div>
      </section>

      {/* Section 2: Raw Outputs — ensemble averages, then per-date table */}
      <section>
        <SectionHeader num={c.section2.num} title={c.section2.title} />

        <h3 className="mt-6 text-lg font-semibold text-text">{c.sectionEvalMean.title}</h3>
        <Finding text={c.sectionEvalMean.finding} />
        <HowToRead text={c.sectionEvalMean.caption} />
        <div className="mt-5 space-y-5">
          <AveragedScoreChart party="USA" />
          <AveragedScoreChart party="CHN" />
        </div>

        <h3 className="mt-10 text-lg font-semibold text-text">Raw Agent Output</h3>
        <Finding text={c.section2.finding} />
        <HowToRead text={c.section2.caption} />
        <div className="mt-5">
          <DateTable />
        </div>
      </section>

      {/* Section 3: Agent-on-Agent Eval — chart, then tables */}
      <section>
        <SectionHeader num={c.sectionEvalChart.num} title={c.sectionEvalChart.title} />

        <h3 className="mt-6 text-lg font-semibold text-text">Eval Scores Over Time</h3>
        <Finding text={c.sectionEvalChart.finding} />
        <HowToRead text={c.sectionEvalChart.caption} />
        <div className="mt-5">
          <EvalChart />
        </div>

        <h3 className="mt-10 text-lg font-semibold text-text">{c.sectionEvalTable.title}</h3>
        <Finding text={c.sectionEvalTable.finding} />
        <HowToRead text={c.sectionEvalTable.caption} />
        <div className="mt-5">
          <EvalTable />
        </div>
      </section>

      {/* Section 4 */}
      <section>
        <SectionHeader num={c.section3.num} title={c.section3.title} />
        <Finding text={c.section3.finding} />
        <HowToRead text={c.section3.caption} />
        <div className="mt-5">
          <StochasticityCharts />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/50 px-4 py-3 text-center">
      <div className="text-2xl font-semibold text-text">{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-text-muted">{label}</div>
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-sm text-accent">{num}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-text">{title}</h2>
    </div>
  );
}

function Finding({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-xl border-l-4 border-accent bg-accent/5 px-5 py-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Key Finding</div>
      <p className="text-sm leading-relaxed text-text-soft">{text}</p>
    </div>
  );
}

function HowToRead({ text }: { text: string }) {
  return (
    <p className="mt-3 text-xs leading-relaxed text-text-muted">
      <span className="font-medium text-text-soft">How to read. </span>
      {text}
    </p>
  );
}
