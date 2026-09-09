"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DISPLAY, PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

function paintBlue(title: string, accent: readonly string[]): ReactNode {
  const hits: { start: number; end: number }[] = [];
  for (const w of accent) {
    let from = 0;
    while (from < title.length) {
      const i = title.indexOf(w, from);
      if (i < 0) break;
      hits.push({ start: i, end: i + w.length });
      from = i + w.length;
    }
  }
  hits.sort((a, b) => a.start - b.start);
  if (hits.length === 0) return title;

  const parts: ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, n) => {
    if (h.start < cursor) return;
    if (h.start > cursor) parts.push(title.slice(cursor, h.start));
    parts.push(
      <span key={n} className="text-accent">
        {title.slice(h.start, h.end)}
      </span>,
    );
    cursor = h.end;
  });
  if (cursor < title.length) parts.push(title.slice(cursor));
  return parts;
}

export function Hero() {
  const [chevron, setChevron] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / 120));
      setChevron(1 - t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-bg sm:min-h-[calc(100dvh-4rem)]">
      <HeroBackdrop />

      <div
        className={`pointer-events-none absolute inset-0 z-[1] flex items-center justify-center ${PAGE_PAD} text-center`}
      >
        <div
          className={`pointer-events-auto ${PAGE_GUTTER} flex flex-col items-center`}
        >
          <div className="w-full max-w-2xl">
            <h1 className="text-text">
              <span className={`text-orange ${DISPLAY}`}>{COPY.hero.line1}</span>
              <span className={`mt-1 ${DISPLAY}`}>
                {paintBlue(COPY.hero.line2, COPY.hero.line2Accent)}
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text sm:mt-6 sm:text-lg">
              {COPY.hero.lede}
            </p>
          </div>
        </div>
      </div>

      <a
        href="#resumes"
        className="relative z-10 mt-auto flex shrink-0 flex-col items-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-text-soft transition-colors hover:text-text sm:pb-4"
        style={{
          opacity: chevron,
          pointerEvents: chevron > 0.08 ? "auto" : "none",
        }}
        aria-label={COPY.hero.scrollAria}
        aria-hidden={chevron < 0.08}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9 animate-bounce sm:h-11 sm:w-11"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
