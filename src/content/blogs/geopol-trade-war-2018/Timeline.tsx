import { reportContent } from "./data";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";

/**
 * Collapsible "Full timeline" panel — sits at the bottom of the intro card.
 *
 * The entire curated point-in-time chronology the agents saw, so a reader can
 * look up what was knowable on any decision date. Native <details>/<summary>
 * (works without JS), collapsed by default. Copy lives in
 * `reportContent.timeline` (data.ts).
 */
export function Timeline() {
  const t = reportContent.timeline;

  return (
    <details className="group rounded-xl border border-border bg-bg-soft/40 px-4 py-3 open:bg-bg-soft/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {t.label}
          </span>
          <span className="text-sm text-text-muted">{t.teaser}</span>
        </div>
        <DetailsArrow openRotate="group-open:rotate-90" />
      </summary>

      <ol className="mt-4 max-h-80 list-none space-y-2 overflow-y-auto pr-2">
        {t.entries.map((e, i) => (
          <li key={e.date + i} className="flex gap-3 text-sm leading-relaxed">
            <span className="shrink-0 font-mono text-xs text-accent">{e.date}</span>
            <span className="text-text-soft">{e.text}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}
