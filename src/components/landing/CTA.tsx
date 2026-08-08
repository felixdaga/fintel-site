const REPO = "https://github.com/felixdaga/fintel";

export function CTA() {
  return (
    <section className="bg-bg-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-2 px-6 py-16 text-center">
          <div className="grid-backdrop absolute inset-0 opacity-40" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Own your benchmark evaluation pipeline
            </h2>
            <p className="mx-auto mt-4 max-w-md text-text-soft">
              Specify your strategy, connect an agent, and run the evaluation in minutes.
            </p>
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Try the platform now
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
