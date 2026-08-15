import { HEADLINE, KICKER, LEDE } from "./whyEvalData";
import type { ReactNode } from "react";

function paintAccent(title: string, accent?: string): ReactNode {
  if (!accent) return title;
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

export function SectionHeader({
  kicker,
  title,
  titleAccent,
  lede,
}: {
  kicker: string;
  title: string;
  titleAccent?: string;
  lede?: string;
}) {
  return (
    <header className="text-center">
      <p className={KICKER}>{kicker}</p>
      <h2 className={`mt-3 ${HEADLINE}`}>{paintAccent(title, titleAccent)}</h2>
      {lede ? <p className={`mt-4 ${LEDE}`}>{lede}</p> : null}
    </header>
  );
}
