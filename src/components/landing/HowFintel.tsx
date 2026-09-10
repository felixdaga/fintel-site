import Link from "next/link";
import { PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { Marked } from "./Mark";

const TONE = {
  orange: {
    wash: "border-orange/20 bg-orange-soft/40",
    title: "text-orange",
    bullet: "bg-orange",
  },
  accent: {
    wash: "border-accent/20 bg-accent-soft/40",
    title: "text-accent",
    bullet: "bg-accent",
  },
  highlight: {
    wash: "border-highlight/25 bg-highlight-soft/50",
    title: "text-highlight",
    bullet: "bg-highlight",
  },
} as const;

const CLOSE_TITLE =
  "font-semibold tracking-tight leading-[1.05] text-3xl sm:text-5xl";

export function HowFintel() {
  const {
    header,
    headerAccent,
    title,
    titleAccent,
    about,
    values,
    items,
    contact,
    href,
  } = COPY.close;

  return (
    <>
      <section id="ask" className="scroll-mt-16 bg-bg-soft">
        <div className={`${PAGE_PAD} py-16 sm:py-24`}>
          <div className={`${PAGE_GUTTER} flex flex-col items-center text-center`}>
            <h2 className={`max-w-4xl text-text ${CLOSE_TITLE}`}>
              <CloseTitle title={header} accent={headerAccent} />
            </h2>

            <div className="mt-12 w-full sm:mt-16">
              <div className="grid w-full gap-3 sm:grid-cols-3 sm:gap-5">
                {items.map((item) => {
                  const tone = TONE[item.tone];
                  return (
                    <article
                      key={item.title}
                      className={`flex h-full flex-col rounded-2xl border p-6 text-left ${tone.wash}`}
                    >
                      <h3
                        className={`text-sm font-semibold sm:text-base ${tone.title}`}
                      >
                        {item.title}
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {item.bullets.map((b) => (
                          <li key={b.label} className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.bullet}`}
                            />
                            <div>
                              <p className="text-sm font-medium text-text">
                                <Marked text={b.label} />
                              </p>
                              <p className="mt-0.5 text-sm leading-relaxed text-text-soft">
                                <Marked text={b.body} />
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 sm:grid-cols-2 sm:gap-16">
                <OfferValue value={values[0]} align="left" />
                <OfferValue value={values[1]} align="right" />
              </div>

              <div
                className="mt-4 hidden items-end sm:flex"
                aria-hidden
              >
                <div className="h-3 w-px bg-border" />
                <div className="h-px flex-1 bg-border" />
                <div className="h-3 w-px bg-border" />
              </div>

              <p className="mt-6 text-center sm:mt-8">
                <Link
                  href={about.href}
                  className="text-sm font-medium text-text underline decoration-orange/70 underline-offset-4 transition-colors hover:text-orange sm:text-base"
                >
                  {about.label}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg">
        <div className={`${PAGE_PAD} py-16 sm:py-24`}>
          <div className={`${PAGE_GUTTER} flex flex-col items-center text-center`}>
            <p className={`max-w-4xl text-text ${CLOSE_TITLE}`}>
              <CloseTitle title={title} accent={titleAccent} />
            </p>

            <a
              href={href}
              className="mt-8 inline-block rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent sm:mt-10 sm:text-base"
            >
              {contact}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function OfferValue({
  value,
  align,
}: {
  value: (typeof COPY.close.values)[number];
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-left sm:text-right" : "text-left"}>
      <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
        {value.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-text-soft sm:text-[15px]">
        <Marked text={value.body} />
      </p>
    </div>
  );
}

function CloseTitle({ title, accent }: { title: string; accent: string }) {
  if (/\*[^*]+\*/.test(title)) return <Marked text={title} />;
  const i = title.indexOf(accent);
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="text-orange">{accent}</span>
      {title.slice(i + accent.length)}
    </>
  );
}
