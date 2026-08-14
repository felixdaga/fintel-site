import { reportContent } from "./data";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";

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
        <DetailsArrow
          className="text-[#e8945d]/70"
          openRotate="group-open:rotate-90"
        />
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
