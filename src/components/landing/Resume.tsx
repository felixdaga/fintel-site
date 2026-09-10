import type { ReactNode } from "react";
import { CHART_START, PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { SectionHeader } from "./SectionHeader";
import { Marked, Takeaway } from "./Mark";
import { FactorRadar } from "./FactorRadar";
import { IcPairChart } from "./IcPairChart";
import { EvalStoryChart } from "./EvalStoryChart";
import { evalStoryWindow } from "./evalStory";

export function Resume() {
  const { kicker, title, titleAccent, agent, product, takeaway } = COPY.resume;

  return (
    <section id="resumes" className="scroll-mt-16 bg-bg">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={PAGE_GUTTER}>
          <SectionHeader kicker={kicker} title={title} titleAccent={titleAccent} />

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
            <p className="order-1 font-mono text-xs uppercase tracking-widest text-accent lg:col-start-1 lg:row-start-1">
              {agent.kicker}
            </p>
            <div className="order-2 flex min-w-0 lg:col-start-1 lg:row-start-2">
              <ProfileCard profile={agent.a} theme="accent" />
            </div>
            <div className="order-3 lg:col-start-1 lg:row-start-3">
              <DownArrow theme="accent" />
            </div>
            <div className="order-4 flex min-w-0 lg:col-start-1 lg:row-start-4">
              <ProfileCard profile={agent.b} theme="accent" />
            </div>

            <p className="order-5 mt-8 font-mono text-xs uppercase tracking-widest text-orange lg:col-start-2 lg:row-start-1 lg:mt-0">
              {product.kicker}
            </p>
            <div className="order-6 flex min-w-0 lg:col-start-2 lg:row-start-2">
              <ProfileCard profile={product.a} theme="orange" />
            </div>
            <div className="order-7 lg:col-start-2 lg:row-start-3">
              <DownArrow theme="orange" />
            </div>
            <div className="order-8 flex min-w-0 lg:col-start-2 lg:row-start-4">
              <ProductResumeCard product={product.b} />
            </div>
          </div>

          <Takeaway className="mt-10 sm:mt-12">
            <Marked text={takeaway} />
          </Takeaway>
        </div>
      </div>
    </section>
  );
}

function DownArrow({ theme }: { theme: Theme }) {
  return (
    <div
      className={`flex items-center justify-center py-0.5 ${THEME[theme].text}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M4.5 8 12 18 19.5 8H4.5Z" />
      </svg>
    </div>
  );
}

type Theme = "accent" | "orange";

const THEME = {
  accent: {
    text: "text-accent",
    wash: "border-accent/40 bg-accent-soft/50 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_18%,transparent)]",
    stat: "border-accent/25",
    action: "border-accent/50",
  },
  orange: {
    text: "text-orange",
    wash: "border-orange/40 bg-orange-soft/50 shadow-[0_0_0_1px_color-mix(in_srgb,var(--orange)_18%,transparent)]",
    stat: "border-orange/25",
    action: "border-orange/50",
  },
} as const;

type Field = {
  key: string;
  value: string;
  inline?: boolean;
  quoted?: boolean;
  stats?: readonly { label: string; value: string; vs?: string }[];
};

type Profile = {
  name: string;
  sub?: string;
  nameMark?: string;
  fields: readonly Field[];
  comment?: {
    key: string;
    bullets: readonly string[];
    actions?: readonly { body: string; detail: string }[];
    radar?: boolean;
  };
};

function CardShell({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex h-full min-h-0 w-full flex-col rounded-2xl border ${THEME[theme].wash} p-5 sm:p-6`}
    >
      {children}
    </article>
  );
}

function CardHead({
  name,
  nameMark,
  sub,
  theme,
}: {
  name: string;
  nameMark?: string;
  sub?: string;
  theme: Theme;
}) {
  return (
    <header>
      <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
        {nameMark ? (
          <>
            {name}{" "}
            <span className={`font-medium ${THEME[theme].text}`}>{nameMark}</span>
          </>
        ) : (
          name
        )}
      </h3>
      {sub ? <p className="mt-0.5 text-xs text-text-muted">{sub}</p> : null}
    </header>
  );
}

function ProfileCard({
  profile,
  theme,
}: {
  profile: Profile;
  theme: Theme;
}) {
  const dtCls = THEME[theme].text;
  const inlineN = profile.fields.filter((f) => f.inline).length;
  const gridCols =
    inlineN >= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : inlineN === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2";
  const fullSpan =
    inlineN >= 4
      ? "col-span-2 sm:col-span-4"
      : inlineN === 3
        ? "col-span-1 sm:col-span-3"
        : "col-span-2";

  return (
    <CardShell theme={theme}>
      <CardHead
        name={profile.name}
        nameMark={profile.nameMark}
        sub={profile.sub}
        theme={theme}
      />

      <dl className={`mt-5 grid gap-x-3 gap-y-3.5 ${gridCols}`}>
        {profile.fields.map((f) => (
          <div
            key={f.key}
            className={f.inline ? "col-span-1" : fullSpan}
          >
            <dt
              className={`font-mono text-[10px] uppercase tracking-widest ${dtCls}`}
            >
              {f.key}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-text">
              {f.quoted ? (
                <>
                  “<Marked text={f.value} />”
                </>
              ) : (
                <Marked text={f.value} />
              )}
            </dd>
            {f.stats ? (
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {f.stats.map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-lg border ${THEME[theme].stat} bg-bg/40 px-2 py-1.5`}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-text">
                      {s.value}
                    </p>
                    {s.vs ? (
                      <p className="text-[10px] text-text-muted">{s.vs}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </dl>

      {profile.comment ? (
        <aside className="mt-5 border-t border-border/80 pt-4">
          <p className={`font-mono text-[10px] uppercase tracking-widest ${dtCls}`}>
            {profile.comment.key}
          </p>
          <div
            className={
              profile.comment.radar
                ? "mt-2 grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(9.5rem,11rem)]"
                : "mt-2"
            }
          >
            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-text">
              {profile.comment.bullets.map((b) => (
                <li key={b}>
                  <Marked text={b} />
                </li>
              ))}
            </ul>
            {profile.comment.radar ? <FactorRadar tone={theme} /> : null}
          </div>
          {profile.comment.actions ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {profile.comment.actions.map((a) => (
                <div
                  key={a.body}
                  className={`rounded-xl border ${THEME[theme].action} bg-bg/50 px-3 py-2.5`}
                >
                  <p className="text-sm font-semibold leading-snug text-text">
                    <Marked text={a.body} />
                  </p>
                  <p className={`mt-1 text-xs font-medium ${THEME[theme].text}`}>
                    {a.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      ) : null}
    </CardShell>
  );
}

function ProductResumeCard({
  product,
}: {
  product: (typeof COPY.resume)["product"]["b"];
}) {
  const { dates, series } = evalStoryWindow(CHART_START);

  return (
    <CardShell theme="orange">
      <CardHead
        name={product.name}
        nameMark={product.nameMark}
        sub={product.sub}
        theme="orange"
      />

      <div className="mt-5 flex flex-1 flex-col justify-center">
        <IcPairChart
          title={product.bar.title}
          theirs={product.bar.theirs}
          baseline={product.bar.baseline}
        />
        <aside className="mt-5 border-t border-border/80 pt-4">
          <EvalStoryChart
            dates={dates}
            series={series}
            title={product.line.title}
            aria={product.line.aria}
            preLabel={product.line.preLabel}
            postLabel={product.line.postLabel}
            height={320}
            embedded
            hideGrid
          />
        </aside>
      </div>
    </CardShell>
  );
}
