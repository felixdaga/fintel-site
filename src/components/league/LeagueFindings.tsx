import { Marked } from "@/components/landing/Mark";
import { fillCopy } from "./format";
import { LEAGUE_COPY } from "./league_texts";

export function LeagueFindings({ vars }: { vars: Record<string, string> }) {
  const items = LEAGUE_COPY.findings.groups.flatMap((g) => g.items);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-2xl border border-border bg-surface-2 px-5 py-6 sm:px-6 sm:py-7 ${
            "wide" in item && item.wide ? "sm:col-span-2" : ""
          }`}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            {item.kicker}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-text sm:text-xl">
            <Marked text={fillCopy(item.claim, vars)} />
          </h3>
          {item.body.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 32)}
              className="mt-3 text-sm leading-relaxed text-text-soft sm:text-[15px]"
            >
              <Marked text={fillCopy(para, vars)} />
            </p>
          ))}
          {"rule" in item && item.rule ? (
            <p className="mt-4 text-sm font-medium text-orange">
              <Marked text={fillCopy(item.rule, vars)} />
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
