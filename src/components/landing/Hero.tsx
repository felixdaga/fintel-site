const REPO = "https://github.com/felixdaga/fintel";

import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden bg-bg sm:min-h-0 sm:block">
      <HeroBackdrop />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 text-center sm:py-36">
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

      <a
        href="#finance-knowhow"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted transition-colors hover:text-text sm:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 animate-bounce"
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
