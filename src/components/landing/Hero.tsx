import { DISPLAY, LEAD } from "./whyEvalData";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-bg sm:min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/30 via-transparent to-orange/25 sm:hidden"
        aria-hidden
      />
      <HeroBackdrop />

      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-5 text-center">
        <div className="pointer-events-auto mx-auto flex w-full max-w-2xl flex-col items-center">
          <h1 className="text-text">
            <span className={DISPLAY}>Evaluation platform for</span>
            <span className={`mt-1 text-accent ${DISPLAY}`}>financial agents</span>
          </h1>

          <p className={`mt-5 sm:mt-6 ${LEAD}`}>
            Turn your strategy into eval benchmarks for AI agents
          </p>
        </div>
      </div>

      <a
        href="#why-eval"
        className="relative z-10 mt-auto flex shrink-0 flex-col items-center gap-2 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 text-text-soft transition-colors hover:text-text"
      >
        <span className="text-sm font-bold tracking-tight sm:text-base">
          Why you should eval
        </span>
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
