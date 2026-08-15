"use client";

import { useEffect, useState } from "react";
import { DISPLAY, LEAD, PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./copy";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

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
              <span className={DISPLAY}>{COPY.hero.line1}</span>
              <span className={`mt-1 text-accent ${DISPLAY}`}>
                {COPY.hero.line2}
              </span>
            </h1>
            <p className={`mt-5 sm:mt-6 ${LEAD}`}>{COPY.hero.lede}</p>
          </div>
        </div>
      </div>

      <a
        href="#why-eval"
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
