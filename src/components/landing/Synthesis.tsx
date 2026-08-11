import { QuestionRotate } from "@/components/landing/QuestionRotate";

export function Synthesis() {
  return (
    <section id="finance-knowhow" className="bg-bg-soft">
      <div className="mx-auto max-w-6xl px-5 py-24">
        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Questions we can&apos;t afford to ignore
          </h2>
        </div>

        {/* Questions — rotating with yellow banner lines */}
        <QuestionRotate />

        {/* Bridge + pillars */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-base leading-relaxed text-text-soft sm:text-lg">
            Answering takes both{" "}
            <span className="font-semibold text-accent">financial knowhow</span>{" "}
            and{" "}
            <span className="font-semibold text-orange">AI eval science</span>.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Pillar
              variant="finance"
              title="Finance knowhow"
              items={[
                "Implementable investment strategies",
                "Systematic research pipeline",
                "Financial data knowledge",
              ]}
            />
            <Pillar
              variant="eval"
              title="Eval science"
              items={[
                "Controlled agent simulation",
                "Benchmark optimization pipeline",
                "Scalability-driven and open sourcing",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  variant,
  title,
  items,
}: {
  variant: "finance" | "eval";
  title: string;
  items: string[];
}) {
  const styles =
    variant === "finance"
      ? {
          wash: "bg-accent-soft/40",
          border: "border-accent/20",
          title: "text-accent",
          dot: "bg-accent",
        }
      : {
          wash: "bg-orange-soft/40",
          border: "border-orange/20",
          title: "text-orange",
          dot: "bg-orange",
        };

  return (
    <div
      className={`rounded-2xl border ${styles.border} ${styles.wash} p-6 text-left`}
    >
      <h3 className={`text-base font-semibold ${styles.title}`}>{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-text-soft"
          >
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
