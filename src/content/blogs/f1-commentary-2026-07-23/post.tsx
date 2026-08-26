"use client";

import { CumulativeReturnChart, type CumPoint } from "./CumulativeReturnChart";
import { ScoreVsReturnChart, type ScoreRow } from "./ScoreVsReturnChart";
import { f1CommentaryContent } from "./data";
import cumReturn from "./cumulative-return.json";
import scores from "./scores.json";

export default function F1CommentaryPost() {
  const c = f1CommentaryContent;
  const cum = cumReturn as unknown as CumPoint[];
  const universe = scores as unknown as ScoreRow[];

  // Merge the per-name score-card metrics into the analysis blocks by symbol.
  const cardBySym = new Map<string, { score: number; activeW: number; ret: number; contrib: number }>();
  for (const s of [...c.scoreCards.top, ...c.scoreCards.bottom]) {
    cardBySym.set(s.sym, s);
  }

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

      {/* Period context */}
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

      {/* Chart 2 — score vs return, full universe */}
      <section>
        <SectionHeader title="Period return vs agent score" num="01" />
        <div className="mt-6">
          <ScoreVsReturnChart data={universe} />
        </div>
      </section>

      {/* Agent analysis — top 5 */}
      <section>
        <SectionHeader title="Agent analysis — top 5 contributors" num="02" />
        <p className="mt-4 text-base leading-relaxed text-text-soft">{c.attribution.blurb}</p>
        <div className="mt-6 space-y-5">
          {c.analysis.top.map((a) => (
            <AnalysisBlock key={a.sym} {...a} card={cardBySym.get(a.sym)} />
          ))}
        </div>
      </section>

      {/* Agent analysis — bottom 5 */}
      <section>
        <SectionHeader title="Agent analysis — bottom 5 contributors" num="03" />
        <div className="mt-6 space-y-5">
          {c.analysis.bottom.map((a) => (
            <AnalysisBlock key={a.sym} {...a} card={cardBySym.get(a.sym)} />
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section>
        <SectionHeader title={c.verdict.title} num="04" accentWord="fixing" />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-soft/60 px-2 py-2">
      <dd className="font-mono text-sm font-medium tabular-nums text-text">{value}</dd>
      <dt className="mt-0.5 text-[10px] uppercase tracking-wider text-text-muted">{label}</dt>
    </div>
  );
}

function AnalysisBlock({
  sym,
  bps,
  tag,
  body,
  card,
}: {
  sym: string;
  bps: string;
  tag: string;
  body: string;
  card?: { score: number; activeW: number; ret: number; contrib: number };
}) {
  const isPos = bps.trim().startsWith("+");
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold tracking-tight text-text">{sym}</h3>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            {tag}
          </span>
          <span
            className="font-mono text-sm font-medium tabular-nums"
            style={{ color: isPos ? "var(--positive)" : "var(--negative)" }}
          >
            {bps}
          </span>
        </div>
      </div>
      {card ? (
        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Metric label="score" value={`${card.score >= 0 ? "+" : ""}${card.score.toFixed(2)}`} />
          <Metric label="active w" value={`${card.activeW >= 0 ? "+" : ""}${card.activeW.toFixed(1)}%`} />
          <Metric label="return" value={`${card.ret >= 0 ? "+" : ""}${card.ret.toFixed(1)}%`} />
        </dl>
      ) : null}
      <p className="mt-4 text-base leading-relaxed text-text-soft">{body}</p>
    </div>
  );
}
