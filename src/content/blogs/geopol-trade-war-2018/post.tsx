"use client";

import { reportContent, AXIS_COLOR } from "./data";
import type { OriginKey, SetupKey } from "./data";
import { Novelty } from "./Novelty";
import { Timeline } from "./Timeline";
import { Methodology } from "./Methodology";
import { ScoreChart } from "./ScoreChart";
import { DateTable } from "./DateTable";
import { EvalChart } from "./EvalChart";
import { EvalTable } from "./EvalTable";
import { AveragedScoreChart } from "./AveragedScoreChart";
import { REPO_URL } from "@/lib/site";

export default function GeopolReportPost() {
  const c = reportContent;

  return (
    <div className="space-y-10">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="text-base leading-relaxed text-text-soft">{c.intro.body}</p>
        <div className="mt-5">
          <Novelty />
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {c.intro.axesTitle}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {c.intro.axes.map((ax) => (
              <div key={ax.name}>
                <div className="text-sm font-semibold">
                  <span style={{ color: AXIS_COLOR[ax.poles[0].key] }}>{ax.poles[0].label}</span>
                  <span className="font-normal text-text-muted"> vs </span>
                  <span style={{ color: AXIS_COLOR[ax.poles[1].key] }}>{ax.poles[1].label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {c.intro.advisorsTitle}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {c.intro.advisors.map((a) => {
              const originColor = AXIS_COLOR[a.originKey as OriginKey];
              const setupColor = AXIS_COLOR[a.setupKey as SetupKey];
              const setupLabel = a.setupKey === "llm" ? "LLM" : "agent";
              return (
                <div
                  key={a.name}
                  className="rounded-lg border border-border bg-bg-soft/50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-text">{a.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip color={originColor}>{a.origin}</Chip>
                      <Chip color={setupColor}>{setupLabel}</Chip>
                    </div>
                  </div>
                  <dl className="mt-2 space-y-1.5 text-sm leading-relaxed">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-text-muted">Model</dt>
                      <dd className="text-text-soft">{a.model}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-text-muted">Harness</dt>
                      <dd className="text-text-soft">{a.harness}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-text-muted">Access</dt>
                      <dd className="text-text-soft">{a.access}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.intro.stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
        <div className="mt-5">
          <Timeline />
        </div>
        <div className="mt-3">
          <Methodology />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-text">{c.headlinesTitle}</h2>
        <div className="mt-4 space-y-4">
          {c.headlines.map((h) => (
            <Headline key={h.title} kicker={h.kicker} title={h.title} body={h.body} />
          ))}
        </div>
      </section>

      <ScoreKey threat={c.scoreKey.threat} stance={c.scoreKey.stance} />

      {/* 01 What they recommended */}
      <section>
        <SectionHeader num={c.sectionEvalMean.num} title={c.sectionEvalMean.title} />
        <Finding headline={c.sectionEvalMean.headline} text={c.sectionEvalMean.finding} />
        <HowToRead text={c.sectionEvalMean.caption} />
        <div className="mt-5 space-y-5">
          <AveragedScoreChart party="USA" />
          <AveragedScoreChart party="CHN" />
        </div>
      </section>

      {/* 02 Open a brief */}
      <section>
        <SectionHeader num={c.section2.num} title={c.section2.title} />
        <Finding headline={c.section2.headline} text={c.section2.finding} />
        <HowToRead text={c.section2.caption} />
        <div className="mt-5">
          <DateTable />
        </div>
      </section>

      {/* 03 Was this good advice? */}
      <section>
        <SectionHeader num={c.sectionEvalChart.num} title={c.sectionEvalChart.title} />

        <Finding headline={c.sectionEvalChart.headline} text={c.sectionEvalChart.finding} />
        <HowToRead text={c.sectionEvalChart.caption} />
        <div className="mt-5">
          <EvalChart />
        </div>

        <h3 className="mt-10 text-lg font-semibold text-text">{c.sectionEvalTable.title}</h3>
        <Finding headline={c.sectionEvalTable.headline} text={c.sectionEvalTable.finding} />
        <HowToRead text={c.sectionEvalTable.caption} />
        <div className="mt-5">
          <EvalTable />
        </div>
      </section>

      {/* 04 Ask twice */}
      <section>
        <SectionHeader num={c.section1.num} title={c.section1.title} />
        <Finding headline={c.section1.headline} text={c.section1.finding} />
        <HowToRead text={c.section1.caption} />
        <div className="mt-5 space-y-5">
          <ScoreChart party="USA" />
          <ScoreChart party="CHN" />
        </div>
      </section>

      <section>
        <SectionHeader num={c.takeaway.num} title={c.takeaway.title} />

        <h3 className="mt-4 text-lg font-semibold text-text">{c.takeaway.limitsTitle}</h3>
        <div className="mt-3 space-y-3">
          {c.takeaway.limits.map((lim) => (
            <p key={lim.title} className="text-sm leading-relaxed text-text-soft">
              <span className="font-semibold text-text">{lim.title} </span>
              {lim.body}
            </p>
          ))}
        </div>
        <p className="mt-6 text-base font-semibold leading-snug text-orange">{c.takeaway.offer}</p>

        <div className="mt-6 rounded-2xl border border-border bg-bg/70 px-5 py-5">
          <h3 className="text-sm font-semibold text-text">{c.takeaway.install.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-soft">{c.takeaway.install.body}</p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 font-mono text-[11px] text-text-soft">
            {c.takeaway.install.code}
          </pre>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {c.takeaway.streams.map((stream) => (
            <div key={stream.kicker} className="rounded-2xl border border-border bg-bg/70 px-5 py-5">
              <div className="font-mono text-xs uppercase tracking-widest text-accent">
                {stream.kicker}
              </div>
              <h3 className="mt-2 text-base font-semibold text-text">{stream.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-soft">{stream.body}</p>
              <div className="mt-5 space-y-5">
                {stream.steps.map((s) => (
                  <GuideStep key={s.n} step={s} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            get started ↗
          </a>
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

function Chip({ color, children }: { color: string; children: string }) {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {children}
    </span>
  );
}

function GuideStep({
  step,
}: {
  step: {
    n: string;
    title: string;
    body: string;
    code?: string;
    link?: { href: string; label: string };
  };
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[2.5rem_1fr] sm:gap-4">
      <div className="font-mono text-sm text-accent">{step.n}</div>
      <div>
        <h4 className="text-sm font-semibold text-text">{step.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-text-soft">{step.body}</p>
        {step.link ? (
          <a
            href={step.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-accent hover:text-accent-strong"
          >
            {step.link.label}
          </a>
        ) : null}
        {step.code ? (
          <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 font-mono text-[11px] text-text-soft">
            {step.code}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

function Headline({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border-l-4 border-accent bg-accent/5 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-accent">{kicker}</div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-soft">{body}</p>
    </div>
  );
}

function ScoreKey({ threat, stance }: { threat: string; stance: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-bg-soft/40 px-4 py-3 text-xs leading-relaxed text-text-muted sm:flex-row sm:gap-6">
      <span>{threat}</span>
      <span className="hidden text-border sm:inline">·</span>
      <span>{stance}</span>
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

function Finding({ headline, text }: { headline: string; text: string }) {
  return (
    <div className="mt-4 rounded-xl border-l-4 border-accent bg-accent/5 px-5 py-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Key finding</div>
      <p className="text-base font-semibold leading-snug text-text">{headline}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-soft">{text}</p>
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
