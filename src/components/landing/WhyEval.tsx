"use client";

import { useEffect, useRef, useState } from "react";
import leaderboard from "@/data/leaderboard.json";
import { colorFor } from "@/components/leaderboard/chartPalette";
import type { LeaderboardData } from "@/components/leaderboard/types";
import { EVAL_CARDS, HEADLINE, SERIES_LIST, type EvalCard } from "./whyEvalData";
import { EvalStoryChart, type StorySeries } from "./EvalStoryChart";

function clamp(n: number, lo = 0, hi = 1) {
  return Math.min(hi, Math.max(lo, n));
}

function span(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp((progress - start) / (end - start));
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

export function WhyEval() {
  const data = leaderboard as LeaderboardData;
  const byId = new Map(data.rows.map((r) => [r.id, r]));

  const series: StorySeries[] = SERIES_LIST.flatMap(({ id, label }) => {
    const row = byId.get(id);
    return row ? [{ id, label, values: row.nav_residual }] : [];
  });
  const ids = series.map((s) => s.id);

  const trackRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 640px)");
    const sync = () => setPin(desktop.matches && !motion.matches);
    sync();
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!pin) {
      setProgress(1);
      return;
    }
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const nav = 64;
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight - nav;
      const range = rect.height - view;
      const scrolled = nav - rect.top;
      setProgress(range <= 0 ? 1 : clamp(scrolled / range));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pin]);

  const overlay = pin ? smooth(span(progress, 0.08, 0.4)) : 1;
  const overlayLabels = pin ? smooth(span(progress, 0.42, 0.58)) : 1;

  return (
    <section id="why-eval" className="bg-bg">
      {pin ? <div className="h-16" aria-hidden /> : null}
      <div ref={trackRef} className={pin ? "h-[240vh]" : undefined}>
        <div
          className={
            pin
              ? "sticky top-16 z-10 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden px-5 pb-8 pt-8"
              : "flex flex-col px-4 py-12 sm:px-5 sm:py-20"
          }
        >
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
            <blockquote className="shrink-0 text-center">
              <p className={HEADLINE}>When coding agents fail, you retry.</p>
              <p className={`mt-2 sm:mt-3 ${HEADLINE}`}>
                When financial agents fail, you{" "}
                <span className="text-orange">lose</span>.
              </p>
            </blockquote>

            <div className="hidden min-h-0 flex-1 sm:block">
              <EvalStoryChart
                dates={data.dates}
                series={series}
                overlay={overlay}
                overlayLabels={overlayLabels}
                fit={pin}
              />
            </div>

            <div
              className="mt-8 shrink-0 sm:mt-0"
              style={{
                opacity: overlay,
                pointerEvents: overlay > 0.7 ? "auto" : "none",
              }}
            >
              <h2 className="mb-3 text-center text-sm font-semibold tracking-tight text-text sm:mb-3 sm:text-base">
                Questions you can&apos;t afford to ignore
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {EVAL_CARDS.map((card) => (
                  <EvalBubble key={card.title} card={card} ids={ids} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {pin ? <div className="h-16" aria-hidden /> : null}
    </section>
  );
}

function EvalBubble({ card, ids }: { card: EvalCard; ids: string[] }) {
  return (
    <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-border bg-surface-2 px-3 py-3 text-left sm:rounded-3xl sm:px-4 sm:py-4">
      <h3
        className="w-full text-left text-xs font-semibold leading-snug sm:text-sm"
        style={{ color: colorFor(card.seriesId, ids) }}
      >
        {card.title}
      </h3>
      <p className="mt-1 w-full text-left text-[11px] leading-relaxed text-text-muted sm:text-xs">
        {card.tag}
      </p>
    </div>
  );
}
