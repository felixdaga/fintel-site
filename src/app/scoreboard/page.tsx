import type { Metadata } from "next";
import league from "@/data/league.json";
import { Marked } from "@/components/landing/Mark";
import { SectionHeader } from "@/components/landing/SectionHeader";
import {
  LEDE,
  PAGE_GUTTER,
  PAGE_PAD,
  PAGE_TITLE,
} from "@/components/landing/whyEvalData";
import { LeagueFindings } from "@/components/scoreboard/copy";
import { SubscribeForm } from "@/components/SubscribeForm";
import { LeagueTable } from "@/components/scoreboard/LeagueTable";
import { fillCopy } from "@/components/scoreboard/format";
import { LEAGUE_COPY } from "@/components/scoreboard/league_texts";
import type { LeaguePublic } from "@/components/scoreboard/types";
import { SITE_URL } from "@/lib/site";

const data = league as LeaguePublic;

export const metadata: Metadata = {
  title: LEAGUE_COPY.meta.title,
  description: fillCopy(LEAGUE_COPY.meta.description, data.copy),
  alternates: {
    canonical: `${SITE_URL}/scoreboard`,
  },
};

export default function LeaguePage() {
  const vars = data.copy;
  const { hero, findings } = LEAGUE_COPY;

  return (
    <div>
      <section className="bg-bg">
        <div className={`${PAGE_PAD} pt-12 pb-12 sm:pt-20 sm:pb-16`}>
          <div className={PAGE_GUTTER}>
            <header className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {hero.kicker}
              </p>
              <h1 className={`mt-3 ${PAGE_TITLE}`}>
                <HeroTitle title={hero.title} accent={hero.titleAccent} />
              </h1>
              <p className={`mt-6 ${LEDE}`}>
                <Marked text={fillCopy(hero.lede, vars)} />
              </p>
            </header>
          </div>
        </div>
      </section>

      <section className="bg-bg-soft">
        <div className={`${PAGE_PAD} pt-8 pb-12 sm:pt-10 sm:pb-16`}>
          <div className={PAGE_GUTTER}>
            <LeagueTable data={data} />
          </div>
        </div>
      </section>

      <section className="bg-bg">
        <div className={`${PAGE_PAD} py-12 sm:py-16`}>
          <div className={PAGE_GUTTER}>
            <SectionHeader
              title={findings.title}
              titleAccent={findings.titleAccent}
              lede={fillCopy(findings.lede, vars)}
            />
            <div className="mt-10">
              <LeagueFindings data={data} vars={vars} />
            </div>
            <div className="mt-12 flex justify-center sm:mt-16">
              <SubscribeForm title={LEAGUE_COPY.subscribe.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroTitle({ title, accent }: { title: string; accent: string }) {
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
