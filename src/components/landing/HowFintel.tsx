import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { SectionHeader } from "./SectionHeader";

export function HowFintel() {
  const { kicker, title, titleAccent, lede, pillars } = COPY.howFintel;

  return (
    <section id="how-fintel" className="bg-bg">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={PAGE_GUTTER}>
          <SectionHeader
            kicker={kicker}
            title={title}
            titleAccent={titleAccent}
            lede={lede}
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-5">
            {pillars.map((pillar) => (
              <Pillar key={pillar.title} {...pillar} />
            ))}
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
  items: readonly string[];
}) {
  const finance = variant === "finance";
  const wash = finance ? "bg-accent-soft/40" : "bg-orange-soft/40";
  const border = finance ? "border-accent/20" : "border-orange/20";
  const titleColor = finance ? "text-accent" : "text-orange";
  const dot = finance ? "bg-accent" : "bg-orange";

  return (
    <div className={`rounded-2xl border ${border} ${wash} p-6 text-left`}>
      <h3 className={`text-sm font-semibold sm:text-base ${titleColor}`}>{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-text-soft"
          >
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
