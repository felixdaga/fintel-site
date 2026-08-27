"use client";

import { useState } from "react";
import { CumulativeReturnChart, type CumPoint } from "./CumulativeReturnChart";
import { ScoreVsReturnChart, type ScoreRow } from "./ScoreVsReturnChart";
import { f1CommentaryContent } from "./data";
import cumReturnJuly from "./cumulative-return.json";
import cumReturnJune from "./cumulative-return-june.json";
import scoresJuly from "./scores.json";
import scoresJune from "./scores-june.json";

type Regime = "july" | "june";

export default function F1CommentaryPost() {
  const c = f1CommentaryContent;
  const cumJuly = cumReturnJuly as unknown as CumPoint[];
  const cumJune = cumReturnJune as unknown as CumPoint[];
  const universeJuly = scoresJuly as unknown as ScoreRow[];
  const universeJune = scoresJune as unknown as ScoreRow[];
  const [regime, setRegime] = useState<Regime>("july");

  const isUp = regime === "july";
  const cum = isUp ? cumJuly : cumJune;
  const universe = isUp ? universeJuly : universeJune;
  const tone = isUp ? "up" : "down";
  const regimeMeta = isUp ? c.regimes.up : c.regimes.down;

  return (
    <div className="space-y-14">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-bg/70 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {c.intro.kicker}
        </p>
        <p className="mt-4 text-base leading-relaxed text-text-soft">{c.intro.body}</p>
      </div>

      {/* Regime summary banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RegimeCard
          label={c.regimes.up.label}
          dates={c.regimes.up.dates}
          f1Return={c.regimes.up.f1Return}
          djiaReturn={c.regimes.up.djiaReturn}
          active={c.regimes.up.active}
          tone="up"
          isSelected={isUp}
          onClick={() => setRegime("july")}
        />
        <RegimeCard
          label={c.regimes.down.label}
          dates={c.regimes.down.dates}
          f1Return={c.regimes.down.f1Return}
          djiaReturn={c.regimes.down.djiaReturn}
          active={c.regimes.down.active}
          tone="down"
          isSelected={!isUp}
          onClick={() => setRegime("june")}
        />
      </div>

      {/* Chart 1 — cumulative return (toggle) */}
      <section>
        <SectionHeader title="Cumulative return of F1 vs benchmark (DJIA)" num="01" />
        <div className="mt-6">
          <CumulativeReturnChart
            data={cum}
            tone={tone}
            title={`F1 vs DJIA — ${regimeMeta.label}, ${regimeMeta.dates}`}
          />
        </div>
      </section>

      {/* Period context */}
      <section>
        <SectionHeader title={c.context.title} num="02" />
        <div className="mt-6 space-y-5">
          {c.context.blocks.map((b) => (
            <div key={b.head} className="rounded-xl border border-border bg-surface-2/60 p-5">
              <p className="text-sm font-semibold text-text">{b.head}</p>
              <p className="mt-2 text-base leading-relaxed text-text-soft">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chart 2 — score vs return (toggle) */}
      <section>
        <SectionHeader title="Period return vs agent score" num="03" />
        <div className="mt-6">
          <ScoreVsReturnChart data={universe} tone={tone} />
        </div>
      </section>

      {/* Score cards — grouped by 2 regimes */}
      <section>
        <SectionHeader title="Score cards — both regimes side by side" num="04" />
        <p className="mt-4 text-base leading-relaxed text-text-soft">
          Each card shows the agent&apos;s raw score, active weight vs the DJIA,
          the stock&apos;s period return, and the active basis points it
          contributed — in <span className="font-semibold text-negative">June (down regime)</span> and{" "}
          <span className="font-semibold text-positive">July (up regime)</span> side by side.
          Only names material to at least one period are shown.
        </p>
        <div className="mt-6 space-y-4">
          {c.scoreCards.map((s) => (
            <DualScoreCard key={s.sym} {...s} />
          ))}
        </div>
      </section>

      {/* Agent analysis — across regimes, no top/bottom split */}
      <section>
        <SectionHeader title="Agent analysis — across both regimes" num="05" />
        <TagLegend legend={c.analysis.tagLegend} />
        <div className="mt-6 space-y-5">
          {c.analysis.blocks.map((a) => (
            <AnalysisBlock key={a.sym} {...a} />
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section>
        <SectionHeader title={c.verdict.title} num="06" accentWord="fixable" />
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

function RegimeCard({
  label,
  dates,
  f1Return,
  djiaReturn,
  active,
  tone,
  isSelected,
  onClick,
}: {
  label: string;
  dates: string;
  f1Return: string;
  djiaReturn: string;
  active: string;
  tone: "up" | "down";
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = tone === "up" ? "var(--positive)" : "var(--negative)";
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition-all ${
        isSelected ? "border-accent bg-surface-2" : "border-border bg-bg/50 hover:border-accent/40"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
          {label}
        </p>
        <span className="font-mono text-[11px] text-text-muted">{dates}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-4">
        <span className="font-mono text-2xl font-bold tabular-nums" style={{ color }}>
          {active}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-sm text-text-soft">
        <span>F1 {f1Return}</span>
        <span className="text-text-muted">·</span>
        <span>DJIA {djiaReturn}</span>
      </div>
    </button>
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

function TagLegend({ legend }: { legend: { tag: string; desc: string }[] }) {
  return (
    <dl className="mt-5 space-y-2">
      {legend.map((l) => (
        <div key={l.tag} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <TagBadge tag={l.tag} />
          <dd className="text-sm leading-relaxed text-text-soft">{l.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

function tagTone(tag: string): "positive" | "accent" | "negative" | "muted" {
  const t = tag.toLowerCase();
  if (t.startsWith("aligned")) return "positive";
  if (t.includes("right call")) return "accent";
  if (t.startsWith("mis-aligned")) return "negative";
  return "muted";
}

function TagBadge({ tag }: { tag: string }) {
  const tone = tagTone(tag);
  const color =
    tone === "positive"
      ? "var(--positive)"
      : tone === "accent"
        ? "var(--accent)"
        : tone === "negative"
          ? "var(--negative)"
          : "var(--text-muted)";
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1a` }}
    >
      {tag}
    </span>
  );
}

function Metric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color =
    positive === undefined
      ? "var(--text)"
      : positive
        ? "var(--positive)"
        : "var(--negative)";
  return (
    <div className="rounded-lg bg-bg-soft/60 px-2 py-2">
      <dd className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
        {value}
      </dd>
      <dt className="mt-0.5 text-[10px] uppercase tracking-wider text-text-muted">{label}</dt>
    </div>
  );
}

function DualScoreCard({
  sym,
  june,
  july,
}: {
  sym: string;
  june: { score: number; activeW: number; ret: number; contrib: number };
  july: { score: number; activeW: number; ret: number; contrib: number };
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-5">
      <h3 className="text-xl font-semibold tracking-tight text-text">{sym}</h3>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* June (down regime) */}
        <div className="rounded-lg border border-negative/30 bg-negative/5 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-negative">
            Jun — {june.contrib >= 0 ? "+" : ""}
            {june.contrib.toFixed(1)} bps
          </p>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Metric label="score" value={`${june.score >= 0 ? "+" : ""}${june.score.toFixed(2)}`} positive={june.score >= 0} />
            <Metric label="active w" value={`${june.activeW >= 0 ? "+" : ""}${june.activeW.toFixed(1)}%`} positive={june.activeW >= 0} />
            <Metric label="return" value={`${june.ret >= 0 ? "+" : ""}${june.ret.toFixed(1)}%`} positive={june.ret >= 0} />
          </dl>
        </div>
        {/* July (up regime) */}
        <div className="rounded-lg border border-positive/30 bg-positive/5 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-positive">
            Jul — {july.contrib >= 0 ? "+" : ""}
            {july.contrib.toFixed(1)} bps
          </p>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Metric label="score" value={`${july.score >= 0 ? "+" : ""}${july.score.toFixed(2)}`} positive={july.score >= 0} />
            <Metric label="active w" value={`${july.activeW >= 0 ? "+" : ""}${july.activeW.toFixed(1)}%`} positive={july.activeW >= 0} />
            <Metric label="return" value={`${july.ret >= 0 ? "+" : ""}${july.ret.toFixed(1)}%`} positive={july.ret >= 0} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function AnalysisBlock({
  sym,
  juneTag,
  julyTag,
  juneBps,
  julyBps,
  body,
}: {
  sym: string;
  juneTag: string;
  julyTag: string;
  juneBps: string;
  julyBps: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold tracking-tight text-text">{sym}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tabular-nums text-negative">{juneBps}</span>
          <span className="text-text-muted">·</span>
          <span className="font-mono text-[11px] tabular-nums text-positive">{julyBps}</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Jun:</span>
        <TagBadge tag={juneTag} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Jul:</span>
        <TagBadge tag={julyTag} />
      </div>
      <p className="mt-4 text-base leading-relaxed text-text-soft">{body}</p>
    </div>
  );
}
