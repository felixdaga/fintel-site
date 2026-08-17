type Step = {
  n: string;
  title: string;
  body: string;
};

/**
 * Vertical timeline of the eval loop — a clean step-by-step guide. Each node
 * is a step on a left-hand spine with its number, title, and a short paragraph.
 */
export function StepsTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative mt-8 space-y-4 border-l border-border/80 pl-6 sm:space-y-6 sm:pl-8">
      {steps.map((step) => (
        <li key={step.n} className="relative">
          <span
            className="absolute -left-[calc(1.5rem+5px)] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 ring-4 ring-bg sm:-left-[calc(2rem+5px)]"
            aria-hidden
          >
            <span className="font-mono text-[10px] font-semibold text-accent">
              {step.n}
            </span>
          </span>

          <div className="rounded-2xl border border-border bg-surface-2 px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
