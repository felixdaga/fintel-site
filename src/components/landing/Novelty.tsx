import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./copy";
import { SectionHeader } from "./SectionHeader";

export function Novelty() {
  const { kicker, title, lede, typicalLabel, fintelLabel, rows } = COPY.novelty;

  return (
    <section id="how" className="bg-bg-soft">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={PAGE_GUTTER}>
          <SectionHeader kicker={kicker} title={title} lede={lede} />

          <div className="mt-8 space-y-3 sm:hidden">
            {rows.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-border bg-surface-2 p-4 text-left"
              >
                <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                  {r.label}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-wide text-text-muted">
                  {typicalLabel}
                </p>
                <p className="mt-1 text-sm text-text-soft">{r.terminal}</p>
                <p className="mt-3 text-[11px] text-accent">{fintelLabel}</p>
                <p className="mt-1 text-sm font-medium text-text">{r.fintel}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-border bg-surface-2 sm:block">
            <div className="grid grid-cols-3 border-b border-border bg-surface text-xs font-medium uppercase tracking-wide text-text-muted">
              <div className="px-5 py-3" />
              <div className="px-5 py-3">{typicalLabel}</div>
              <div className="px-5 py-3 text-accent normal-case tracking-normal">
                {fintelLabel}
              </div>
            </div>
            {rows.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-3 border-b border-border last:border-0"
              >
                <div className="px-5 py-4 font-mono text-xs uppercase tracking-wide text-text-muted">
                  {r.label}
                </div>
                <div className="px-5 py-4 text-sm text-text-soft">{r.terminal}</div>
                <div className="px-5 py-4 text-sm font-medium text-text">
                  {r.fintel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
