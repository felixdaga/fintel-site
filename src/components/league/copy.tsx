import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import { Marked } from "@/components/landing/Mark";
import { FindingCharts } from "./findings-charts";
import { fillCopy } from "./format";
import { LEAGUE_COPY } from "./league_texts";
import type { LeaguePublic } from "./types";

export function LeagueFindings({
  data,
  vars,
}: {
  data: LeaguePublic;
  vars: Record<string, string>;
}) {
  const items = LEAGUE_COPY.findings.groups.flatMap((g) => g.items);

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-border bg-surface-2 px-5 py-6 sm:px-6 sm:py-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            {item.kicker}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-text sm:text-xl">
            <Marked text={fillCopy(item.claim, vars)} />
          </h3>
          {item.body.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 32)}
              className="mt-3 text-sm leading-relaxed text-text-soft sm:text-[15px]"
            >
              <Marked text={fillCopy(para, vars)} />
            </p>
          ))}
          {"rule" in item && item.rule ? (
            <p className="mt-4 text-sm font-medium text-orange">
              <Marked text={fillCopy(item.rule, vars)} />
            </p>
          ) : null}
          <FindingCharts itemId={item.id} data={data} />
        </article>
      ))}
    </div>
  );
}

type NoteSection = {
  id: string;
  title: string;
  body: string;
  wide?: boolean;
  winner?: string;
  takeaway?: string;
};

type NotePack = {
  summary: string;
  teaser: string;
  groups: readonly {
    title?: string;
    sections: readonly NoteSection[];
  }[];
};

type Block =
  | { kind: "wide"; section: NoteSection }
  | { kind: "grid"; sections: NoteSection[] };

function layoutSections(sections: readonly NoteSection[]): Block[] {
  const ordered: Block[] = [];
  let grid: NoteSection[] = [];
  const flush = () => {
    if (grid.length) {
      ordered.push({ kind: "grid", sections: grid });
      grid = [];
    }
  };
  for (const section of sections) {
    if ("wide" in section && section.wide) {
      flush();
      ordered.push({ kind: "wide", section });
    } else {
      grid.push(section);
    }
  }
  flush();
  return ordered;
}

function NoteBody({
  section,
  vars,
}: {
  section: NoteSection;
  vars: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-text sm:text-base">
        {section.title}
      </h3>
      {section.body.split("\n\n").map((para) => (
        <p key={para.slice(0, 32)} className="mt-2 text-sm leading-relaxed text-text-soft">
          <Marked text={fillCopy(para, vars)} />
        </p>
      ))}
      {section.winner ? (
        <p className="mt-3 text-sm font-medium text-orange">
          {fillCopy(section.winner, vars)}
        </p>
      ) : null}
      {section.takeaway ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          <Marked text={fillCopy(section.takeaway, vars)} />
        </p>
      ) : null}
    </div>
  );
}

export function LeagueNotes({
  vars,
  pack,
  compact = false,
  className = "bg-surface-2",
}: {
  vars: Record<string, string>;
  pack: NotePack;
  compact?: boolean;
  className?: string;
}) {
  const { summary, teaser, groups } = pack;
  return (
    <details className={`group rounded-2xl border border-border text-left ${className}`}>
      <summary
        className={`cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden ${
          compact ? "px-4 py-3 sm:px-5" : "px-5 py-4 sm:px-6 sm:py-5"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{summary}</p>
            {teaser ? (
              <p className={`mt-1 text-text-soft ${compact ? "text-xs sm:text-sm" : "text-sm"}`}>
                <Marked text={fillCopy(teaser, vars)} />
              </p>
            ) : null}
          </div>
          <DetailsArrow openRotate="group-open:rotate-90" className="mt-1 text-text-muted" />
        </div>
      </summary>
      <div className="space-y-10 border-t border-border px-5 py-6 sm:px-6 sm:py-8">
        {groups.map((group) => (
          <div key={group.sections.map((s) => s.id).join("-")}>
            {"title" in group && group.title ? (
              <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
                {group.title}
              </p>
            ) : null}
            <div className="space-y-8">
              {layoutSections(group.sections).map((block) =>
                block.kind === "wide" ? (
                  <NoteBody key={block.section.id} section={block.section} vars={vars} />
                ) : (
                  <div
                    key={block.sections.map((s) => s.id).join("-")}
                    className="grid gap-8 sm:grid-cols-2"
                  >
                    {block.sections.map((section) => (
                      <NoteBody key={section.id} section={section} vars={vars} />
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
