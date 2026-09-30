import type { ReactNode } from "react";
import { StrongText } from "@/components/landing/Mark";
import { RepeatCharts, ReturnCharts, ScoreCharts, TiltCharts, WeightCharts } from "./Charts";
import { postContent } from "./data";
import { HeadlineResults, HoldingProvider, HoldingToggle, ModeCopy } from "./Holding";
import { RawScores } from "./RawScores";

const c = postContent;

function Section({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-text">
        <StrongText text={title} />
      </h2>
      {body ? (
        <p>
          <StrongText text={body} />
        </p>
      ) : null}
      {children}
    </section>
  );
}

export default function SystematicAiCryptoPost() {
  return (
    <div className="space-y-14">
      <div className="space-y-4 rounded-2xl border border-border bg-bg/70 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.intro.title} />
        </h2>
        <p>
          <StrongText text={c.intro.body} />
        </p>
        <p>
          <StrongText text={c.intro.lead} />
        </p>
        <ul className="space-y-2 pl-5">
          {c.intro.agents.map((agent) => (
            <li key={agent.name} className="list-disc">
              <span className="font-medium text-text">
                <StrongText text={agent.name} />
              </span>
              <span className="text-text-soft"> — {agent.body}</span>
            </li>
          ))}
        </ul>
        <p>
          <StrongText text={c.intro.shared} />
        </p>
        <p>
          <StrongText text={c.intro.result} />
        </p>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-surface-2 sm:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))]">
        {c.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`min-w-0 px-3 py-3 sm:px-4 sm:py-3.5 ${
              i % 2 === 1 ? "border-l border-border" : ""
            } ${i >= 2 ? "border-t border-border" : ""} ${i > 0 ? "sm:border-l sm:border-border" : "sm:border-l-0"} sm:border-t-0`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted sm:tracking-[0.16em]">{stat.label}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className={stat.value.length > 6 ? "text-sm font-semibold tracking-tight text-text sm:text-[15px]" : "font-mono text-xl font-semibold tabular-nums tracking-tight text-text sm:text-2xl"}>
                {stat.value}
              </span>
              {"note" in stat ? <span className="text-[11px] text-text-muted">{stat.note}</span> : null}
            </p>
          </div>
        ))}
      </div>

      <HoldingProvider>
        <HoldingToggle />

        <HeadlineResults />

        <Section title={c.returns.title}>
          <ModeCopy copy={c.returns.body} />
          <ReturnCharts />
        </Section>

        <Section title={c.scores.title} body={c.scores.body}>
          <ScoreCharts />
        </Section>

        <Section title={c.tilts.title} body={c.tilts.body}>
          <TiltCharts />
        </Section>

        <Section title={c.weights.title}>
          <ModeCopy copy={c.weights.body} />
          <WeightCharts />
        </Section>

        <Section title={c.repeats.title} body={c.repeats.body}>
          <RepeatCharts />
        </Section>
      </HoldingProvider>

      <Section title={c.raw.title} body={c.raw.body}>
        <RawScores />
      </Section>

      <Section title={c.mission.title} body={c.mission.body}>
        <pre className="max-h-80 overflow-auto rounded-2xl border border-border bg-surface-2 px-4 py-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-text-soft">
          <StrongText text={c.mission.scroll} />
        </pre>
      </Section>

      <Section title={c.dataAccess.title} body={c.dataAccess.body}>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {c.dataAccess.items.map((item) => (
            <li key={item.name} className="px-5 py-4">
              <p className="text-sm font-semibold text-text">
                <StrongText text={item.name} />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-soft">
                <StrongText text={item.body} />
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
