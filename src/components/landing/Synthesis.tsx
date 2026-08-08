import { Logo } from "@/components/Logo";

export function Synthesis() {
  return (
    <section className="border-b border-border bg-bg-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Finance knowhow, meet eval science
          </h2>
          <p className="mt-4 text-text-soft">
            To answer those questions, you need an evaluation framework and
            platform that is{" "}
            <strong className="font-medium text-text">strategy-specific</strong>{" "}
            and{" "}
            <strong className="font-medium text-text">agent-agnostic</strong>.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <Pillar
              variant="finance"
              tag="finance"
              title="Finance knowhow"
              items={[
                "Implementable investment strategies",
                "Systematic research pipeline",
                "Financial data knowledge",
              ]}
            />

            <div className="flex justify-center py-1 md:py-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface-2 font-mono text-lg text-text-soft">
                +
              </span>
            </div>

            <Pillar
              variant="eval"
              tag="ai"
              title="Eval science"
              items={[
                "Controlled agent simulation",
                "Benchmark optimization pipeline",
                "Scalability-driven and open sourcing",
              ]}
            />
          </div>

          <div className="mx-auto mt-8 flex flex-col items-center">
            <div
              className="h-0 w-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-border"
              aria-hidden
            />
            <div className="mt-4 w-full max-w-lg rounded-2xl border border-border bg-surface-2 px-8 py-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                built by ex-BlackRock PMs and quants
              </p>
              <div className="mt-5 flex justify-center">
                <Logo size="lg" />
              </div>
              <p className="mt-4 text-base text-text-soft">is the answer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  variant,
  tag,
  title,
  items,
}: {
  variant: "finance" | "eval";
  tag: string;
  title: string;
  items: string[];
}) {
  const styles =
    variant === "finance"
      ? {
          box: "border-accent/30 bg-accent-soft",
          tag: "text-accent",
          dot: "bg-accent",
        }
      : {
          box: "border-orange/30 bg-orange-soft",
          tag: "text-orange",
          dot: "bg-orange",
        };

  return (
    <div className={`rounded-2xl border p-6 ${styles.box}`}>
      <div className={`font-mono text-xs uppercase tracking-widest ${styles.tag}`}>
        {tag}
      </div>
      <h3 className="mt-1 text-lg font-semibold text-text">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-text-soft">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
