const REPO = "https://github.com/felixdaga/fintel";

import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col bg-bg sm:min-h-0 sm:block">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/30 via-transparent to-orange/25 sm:hidden"
        aria-hidden
      />
      <HeroBackdrop />

      <div className="relative flex flex-1 flex-col items-center justify-center px-5 text-center sm:py-36">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
            Evaluation platform for{" "}
            <span className="text-accent">financial agents</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-soft">
            Evaluate and optimize your AI agents for financial decisions making.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-strong"
            >
              I want to evaluate my ai agent
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>

      <a
        href="#finance-knowhow"
        aria-label="Scroll down"
        className="relative z-10 flex shrink-0 justify-center pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 text-text-soft transition-colors hover:text-text sm:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
