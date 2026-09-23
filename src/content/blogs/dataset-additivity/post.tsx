import { Fragment } from "react";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import { StrongText } from "@/components/landing/Mark";
import { AblationCharts, ExposureChart, IcChart, NameScatter } from "./AblationCharts";
import { RawOutputs } from "./RawOutputs";
import { postContent } from "./data";

const c = postContent;

type MetricRow = { metric: string; base: string; bii: string; lower?: boolean };
type MetricGroups = readonly { label: string; rows: readonly MetricRow[] }[];

export default function DatasetAdditivityPost() {
  return (
    <div className="space-y-14">
      <div className="space-y-4 rounded-2xl border border-border bg-bg/70 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.intro.title} />
        </h2>
        {c.intro.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <StrongText text={paragraph} />
          </p>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.dataset.title} />
        </h2>
        <p>
          <StrongText text={c.dataset.before} />
          <a href={c.dataset.href} className="text-accent underline underline-offset-2" target="_blank" rel="noreferrer">
            <StrongText text={c.dataset.linkLabel} />
          </a>
          <StrongText text={c.dataset.after} />
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.agent.title} />
        </h2>
        <p>
          <StrongText text={c.agent.body} />
        </p>
        <pre className="max-h-80 overflow-auto rounded-2xl border border-border bg-surface-2 px-4 py-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-text-soft">
          <StrongText text={c.setup.missionScroll} />
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.evaluation.title} />
        </h2>
        {c.evaluation.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <StrongText text={paragraph} />
          </p>
        ))}
        <details className="group rounded-2xl border border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-semibold tracking-tight text-text">
              <StrongText text={c.methodology.title} />
            </h2>
            <DetailsArrow openRotate="group-open:rotate-90" />
          </summary>
          <div className="space-y-6 px-5 pb-6">
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-widest text-text-muted">
                    <th className="px-4 py-3 font-medium" />
                    {c.setup.twinColumns.map((column) => (
                      <th key={column} className="px-4 py-3 font-medium">
                        <StrongText text={column} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.setup.twinRows.map((row) => (
                    <tr key={row} className="border-b border-border align-top last:border-0">
                      <td className="px-4 py-3 font-semibold text-text">
                        <StrongText text={row} />
                      </td>
                      {c.setup.twinShared.map((value) => (
                        <td key={`${row}-${value}`} className="px-4 py-3 text-text">
                          <StrongText text={value} />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {c.setup.dataFields.map((field) => (
                            <span
                              key={field}
                              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-text"
                            >
                              <StrongText text={field} />
                            </span>
                          ))}
                          {row === "GFA + Commentary" ? (
                            <span className="rounded-full border border-accent bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-text">
                              <StrongText text={c.setup.dataExtra} />
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-tight text-text">
                <StrongText text={c.methodology.portfoliosTitle} />
              </h3>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                <StrongText text={c.methodology.portfoliosLede} />
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {c.methodology.portfolios.map((portfolio) => (
                  <div key={portfolio.title} className="rounded-xl border border-border bg-surface-2 px-4 py-3">
                    <p className="text-sm font-semibold text-text">
                      <StrongText text={portfolio.title} />
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-soft">
                      <StrongText text={portfolio.body} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-tight text-text">
                <StrongText text={c.methodology.metricsTitle} />
              </h3>
              <dl className="space-y-3">
                {c.methodology.metrics.map((metric) => (
                  <div key={metric.title}>
                    <dt className="text-sm font-semibold text-text">
                      <StrongText text={metric.title} />
                    </dt>
                    <dd className="mt-1 text-text-soft">
                      <StrongText text={metric.body} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </details>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.result.title} />
        </h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-text">
            <StrongText text={c.result.performanceTitle} />
          </h3>
          <p>
            <StrongText text={c.result.lead} />
          </p>
          <ComparisonTable groups={c.result.signal} />
          <IcChart />
          <h3 className="text-xl font-semibold tracking-tight text-text">
            <StrongText text={c.result.holdingsTitle} />
          </h3>
          <p>
            <StrongText text={c.result.portfolios} />
          </p>
          <ComparisonTable groups={c.result.returns} />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-text">
              <StrongText text={c.charts.returnTitle} />
            </h3>
            <AblationCharts books={["sw_0.0", "mvo"]} panel="nav" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-text">
              <StrongText text={c.charts.underwaterTitle} />
            </h3>
            <AblationCharts books={["sw_0.0", "mvo"]} panel="dd" />
          </div>
          <ComparisonTable groups={c.result.vol} />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-text">
            <StrongText text={c.result.factor.title} />
          </h3>
          <p>
            <StrongText text={c.result.factor.body} />
          </p>
          <ExposureChart kind="factor" note={c.result.factor.note} />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-text">
            <StrongText text={c.result.sector.title} />
          </h3>
          <p>
            <StrongText text={c.result.sector.body} />
          </p>
          <ExposureChart kind="sector" note={c.result.sector.note} />
          <p>
            <StrongText text={c.result.sector.examplesLede} />
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-widest text-text-muted">
                  {c.result.sector.columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">
                      <StrongText text={column} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.result.sector.rows.map((row) => (
                  <tr key={row.sector} className="border-b border-border align-top last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-text">
                      <StrongText text={row.sector} />
                    </td>
                    <td className="px-4 py-3 text-text-soft">
                      <StrongText text={row.text} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-text">
            <StrongText text={c.result.company.title} />
          </h3>
          <p>
            <StrongText text={c.result.company.body} />
          </p>
          <NameScatter />
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-widest text-text-muted">
                  {c.result.company.columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">
                      <StrongText text={column} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.result.company.rows.map((row) => (
                  <tr key={row.symbol} className="border-b border-border align-top last:border-0">
                    <td className="px-4 py-3 font-semibold text-text">
                      <StrongText text={row.symbol} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-text">
                      <StrongText text={row.gap} />
                    </td>
                    <td className="px-4 py-3 text-text-soft">
                      <StrongText text={row.text} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.bottom.title} />
        </h2>
        <p>
          <StrongText text={c.bottom.body} />
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-text">
          <StrongText text={c.rawOutputs.title} />
        </h2>
        <p>
          <StrongText text={c.rawOutputs.body} />
        </p>
        <RawOutputs />
      </section>
    </div>
  );
}

function ComparisonTable({ groups }: { groups: MetricGroups }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-widest text-text-muted">
            {c.table.columns.map((column) => (
              <th key={column || "metric"} className="px-4 py-3 font-medium">
                <StrongText text={column} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <tr className="border-b border-border bg-surface-2">
                <td colSpan={3} className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text">
                  <StrongText text={group.label} />
                </td>
              </tr>
              {group.rows.map((row) => {
                const side = betterSide(row.base, row.bii, row.lower);
                return (
                  <tr key={`${group.label}-${row.metric}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-text">
                      <StrongText text={row.metric} />
                    </td>
                    <td className={cellClass(side === "base")}>
                      <StrongText text={row.base} />
                    </td>
                    <td className={cellClass(side === "bii")}>
                      <StrongText text={row.bii} />
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function cellNumber(value: string) {
  return Number(value.replace("%", "").replace("−", "-").replace("+", ""));
}

/** Higher is better, including drawdown: a smaller loss is a larger number. */
function betterSide(base: string, bii: string, lower = false): "base" | "bii" | null {
  const a = cellNumber(base);
  const b = cellNumber(bii);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return null;
  const baseWins = lower ? a < b : a > b;
  return baseWins ? "base" : "bii";
}

function cellClass(win: boolean) {
  return win ? "px-4 py-2.5 font-mono text-positive" : "px-4 py-2.5 font-mono text-text";
}
