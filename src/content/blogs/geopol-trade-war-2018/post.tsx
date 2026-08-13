"use client";

import { reportContent } from "./data";
import { ScoreChart } from "./ScoreChart";
import { DateTable } from "./DateTable";
import { StochasticityCharts } from "./StochasticityCharts";
import { EvalChart } from "./EvalChart";
import { EvalTable } from "./EvalTable";

export default function GeopolReportPost() {
  const c = reportContent;

  return (
    <div className="space-y-10">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="text-base leading-relaxed text-text-soft">{c.intro.body}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.intro.stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      {/* Section 1 */}
      <section>
        <SectionHeader num={c.section1.num} title={c.section1.title} subtitle={c.section1.subtitle} />
        <div className="mt-5 space-y-5">
          <ScoreChart party="USA" />
          <ScoreChart party="CHN" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.section1.caption}</p>
      </section>

      {/* Section 2: Agent-on-Agent Eval Chart */}
      <section>
        <SectionHeader num={c.sectionEvalChart.num} title={c.sectionEvalChart.title} subtitle={c.sectionEvalChart.subtitle} />
        <div className="mt-5">
          <EvalChart />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.sectionEvalChart.caption}</p>
      </section>

      {/* Section 3: Rating Rationale Table */}
      <section>
        <SectionHeader num={c.sectionEvalTable.num} title={c.sectionEvalTable.title} subtitle={c.sectionEvalTable.subtitle} />
        <div className="mt-5">
          <EvalTable />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.sectionEvalTable.caption}</p>
      </section>

      {/* Section 4: Raw Agent Output */}
      <section>
        <SectionHeader num={c.section2.num} title={c.section2.title} subtitle={c.section2.subtitle} />
        <div className="mt-5">
          <DateTable />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.section2.caption}</p>
      </section>

      {/* Section 5 */}
      <section>
        <SectionHeader num={c.section3.num} title={c.section3.title} subtitle={c.section3.subtitle} />
        <div className="mt-5">
          <StochasticityCharts />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.section3.caption}</p>
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

function SectionHeader({ num, title, subtitle }: { num: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-sm text-accent">{num}</span>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-text">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
