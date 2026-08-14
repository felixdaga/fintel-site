import { reportContent } from "./data";

/**
 * Collapsible "Novelty" panel — sits under the timeline in the intro card.
 *
 * Uses the native <details>/<summary> element so it works without JS.
 * Copy lives in `reportContent.novelty` (data.ts).
 */
export function Novelty() {
  const n = reportContent.novelty;

  return (
    <details className="group rounded-2xl border border-[#e8945d]/50 bg-[#e8945d]/10 px-5 py-4 open:bg-[#e8945d]/15">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#e8945d]">
            {n.label}
          </span>
          <span className="text-sm text-text-soft">{n.teaser}</span>
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-[#e8945d]/70 transition-transform duration-200 group-open:rotate-90"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="M5 3l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {n.points.map((p) => {
          const highlight = p.title.startsWith("Run the crisis");
          return (
            <div
              key={p.title}
              className={
                highlight
                  ? "rounded-xl border border-[#e8945d]/50 bg-[#e8945d]/10 p-4"
                  : "rounded-xl border border-border/60 bg-bg-soft/40 p-4"
              }
            >
              <h3 className={highlight ? "text-sm font-semibold text-[#e8945d]" : "text-sm font-semibold text-text"}>
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-soft">{p.body}</p>
            </div>
          );
        })}
      </div>
    </details>
  );
}
