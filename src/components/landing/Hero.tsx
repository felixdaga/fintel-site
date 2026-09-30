"use client";

import { useEffect, useState } from "react";
import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
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
        className={`relative z-[1] flex flex-1 flex-col items-center justify-center ${PAGE_PAD} text-center`}
      >
        <div className={`${PAGE_GUTTER} flex w-full flex-col items-center`}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-20 -inset-y-10 rounded-full bg-bg/80 blur-3xl sm:-inset-x-28 sm:-inset-y-14"
              aria-hidden
            />
            <h1 className="relative flex flex-col items-center">
              <span className="text-xl font-medium tracking-tight text-orange sm:text-3xl">
                {COPY.hero.line1}
              </span>
              <span className="mt-2 block text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-tight text-text sm:mt-3">
                {COPY.hero.line2}
              </span>
              <span className="block text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-tight text-accent">
                {COPY.hero.line3}
              </span>
            </h1>
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
