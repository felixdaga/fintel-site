import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { SectionHeader } from "./SectionHeader";

export function HowItWorks() {
  const { kicker, title, titleAccent, lede, steps } = COPY.howItWorks;

  return (
    <section id="how-it-works" className="bg-bg">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={PAGE_GUTTER}>
          <SectionHeader
            kicker={kicker}
            title={title}
            titleAccent={titleAccent}
            lede={lede}
          />

          <ol className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-5">
            {steps.map((step) => (
              <li
                key={step.n}
                className="rounded-2xl border border-border bg-surface-2 px-5 py-5 text-left"
              >
                <p className="font-mono text-xs tracking-widest text-accent">
                  {step.n}
                </p>
                <h3 className="mt-3 text-sm font-semibold text-text sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
