import { HEADLINE, KICKER, LEDE } from "./whyEvalData";
import type { ReactNode } from "react";

function paintAccent(
  title: string,
  accent?: string | readonly string[],
): ReactNode {
  const words = !accent ? [] : typeof accent === "string" ? [accent] : [...accent];
  if (words.length === 0) return title;

  const hits: { start: number; end: number }[] = [];
  for (const w of words) {
    let from = 0;
    while (from < title.length) {
      const i = title.indexOf(w, from);
      if (i < 0) break;
      hits.push({ start: i, end: i + w.length });
      from = i + w.length;
    }
  }
  hits.sort((a, b) => a.start - b.start);
  if (hits.length === 0) return title;

  const parts: ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, n) => {
    if (h.start < cursor) return;
    if (h.start > cursor) parts.push(title.slice(cursor, h.start));
    parts.push(
      <span key={n} className="text-orange">
        {title.slice(h.start, h.end)}
      </span>,
    );
    cursor = h.end;
  });
  if (cursor < title.length) parts.push(title.slice(cursor));
  return parts;
}

export function SectionHeader({
  kicker,
  title,
  titleAccent,
  lede,
}: {
  kicker: string;
  title: string;
  titleAccent?: string | readonly string[];
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
