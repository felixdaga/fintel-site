"use client";

import { CumulativeReturnChart, type CumPoint } from "./CumulativeReturnChart";
import { ContributionChart, type ContribBar } from "./ContributionChart";
import { f1CommentaryContent } from "./data";
import cumReturn from "./cumulative-return.json";
import contributions from "./contributions.json";

export default function F1CommentaryPost() {
  const c = f1CommentaryContent;
  const cum = cumReturn as unknown as CumPoint[];
  const contribs = contributions as unknown as ContribBar[];

  return (
    <div className="space-y-14">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {c.intro.kicker}
        </p>
        <p className="mt-4 text-base leading-relaxed text-text-soft">{c.intro.body}</p>
      </div>

      {/* Chart 1 — cumulative return */}
      <section>
        <CumulativeReturnChart data={cum} />
      </section>

      {/* Context */}
      <section>
        <SectionHeader title={c.context.title} />
        <div className="mt-6 space-y-5">
          {c.context.blocks.map((b) => (
            <div key={b.head} className="rounded-xl border border-border bg-surface-2/60 p-5">
              <p className="text-sm font-semibold text-text">{b.head}</p>
              <p className="mt-2 text-base leading-relaxed text-text-soft">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wins */}
      <section>
        <SectionHeader title={c.wins.title} num="01" />
        <div className="mt-6 space-y-4">
          {c.wins.items.map((w) => (
            <ContribRow key={w.sym} sym={w.sym} bps={w.bps} body={w.body} positive />
          ))}
        </div>
      </section>

      {/* Chart 2 — contributions */}
      <section>
        <ContributionChart data={contribs} />
      </section>

      {/* Luck */}
      <section>
        <SectionHeader title={c.luck.title} num="02" />
        <div className="mt-6 space-y-4">
          {c.luck.items.map((l) => (
            <ContribRow key={l.sym} sym={l.sym} bps={l.bps} body={l.body} tag={l.tag} />
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section>
        <SectionHeader title={c.verdict.title} num="03" accentWord="fixing" />
        <p className="mt-5 text-base leading-relaxed text-text-soft">{c.verdict.body}</p>
        <div className="mt-6 space-y-4">
          {c.verdict.fixes.map((f) => (
            <div key={f.head} className="rounded-xl border border-accent/40 bg-accent-soft/40 px-5 py-4">
              <p className="text-sm font-semibold text-text">{f.head}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-soft">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-base leading-relaxed text-text-soft">{c.verdict.dontChase}</p>
      </section>
    </div>
  );
}

function SectionHeader({
  num,
  title,
  accentWord,
}: {
  num?: string;
  title: string;
  accentWord?: string;
}) {
  const renderTitle = () => {
    if (!accentWord) return title;
    const idx = title.toLowerCase().indexOf(accentWord.toLowerCase());
    if (idx === -1) return title;
    return (
      <>
        {title.slice(0, idx)}
        <span className="text-orange">{title.slice(idx, idx + accentWord.length)}</span>
        {title.slice(idx + accentWord.length)}
      </>
    );
  };
  return (
    <div className="flex items-baseline gap-3">
      {num ? <span className="font-mono text-sm text-accent">{num}</span> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-text">{renderTitle()}</h2>
    </div>
  );
}

function ContribRow({
  sym,
  bps,
  body,
  positive,
  tag,
}: {
  sym: string;
  bps: string;
  body: string;
  positive?: boolean;
  tag?: string;
}) {
  const isPos = positive ?? bps.trim().startsWith("+");
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-text">{sym}</h3>
        <div className="flex items-center gap-3">
          {tag ? (
            <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {tag}
            </span>
          ) : null}
          <span
            className="font-mono text-sm font-medium tabular-nums"
            style={{ color: isPos ? "var(--positive)" : "var(--negative)" }}
          >
            {bps}
          </span>
        </div>
      </div>
      <p className="mt-2 text-base leading-relaxed text-text-soft">{body}</p>
    </div>
  );
}
