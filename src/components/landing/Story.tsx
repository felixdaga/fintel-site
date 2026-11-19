import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { SectionHeader } from "./SectionHeader";

export function Story() {
  const { kicker, title, titleAccent, paragraphs, contact, href } = COPY.story;

  return (
    <section id="work" className="scroll-mt-16 bg-bg">
      <div className={`${PAGE_PAD} py-16 sm:py-24`}>
        <div className={`${PAGE_GUTTER} mx-auto max-w-3xl`}>
          <SectionHeader kicker={kicker} title={title} titleAccent={titleAccent} />
          <div className="mt-8 space-y-6 text-center">
            {paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-relaxed text-text-soft sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
          <p className="mt-10 text-center sm:mt-12">
            <a
              href={href}
              className="inline-block rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent sm:text-base"
            >
              {contact}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
