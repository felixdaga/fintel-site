const REPO = "https://github.com/felixdaga/fintel";

import { HeroBackdrop } from "@/components/landing/HeroBackdrop";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg)]">
      <HeroBackdrop />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center sm:py-36">
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
    </section>
  );
}
