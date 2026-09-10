import { DISPLAY, HEADLINE, PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";

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

export function HowFintel() {
  const { header, headerAccent, title, titleAccent, values, items, contact, href } =
    COPY.close;

  return (
    <section id="ask" className="scroll-mt-16 bg-bg">
      <div className={`${PAGE_PAD} py-16 sm:py-24`}>
        <div className={`${PAGE_GUTTER} flex flex-col items-center text-center`}>
          <h2 className={`max-w-4xl text-text ${DISPLAY}`}>
            <CloseTitle title={header} accent={headerAccent} />
          </h2>

          <div className="mt-10 grid w-full max-w-4xl gap-10 sm:mt-12 sm:grid-cols-2 sm:gap-x-16">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={
                  i === 0 ? "sm:border-r sm:border-border sm:pr-16" : "sm:pl-0"
                }
              >
                <p className="font-mono text-xs tracking-widest text-orange">
                  {v.n}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-text sm:text-2xl">
                  {v.title}
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-text-soft sm:text-lg">
                  {v.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid w-full gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-5">
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
                            {b.label}
                          </p>
                          <p className="mt-0.5 text-sm leading-relaxed text-text-soft">
                            {b.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <p className={`mt-16 max-w-4xl text-text sm:mt-20 ${HEADLINE}`}>
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
  );
}

function CloseTitle({ title, accent }: { title: string; accent: string }) {
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
