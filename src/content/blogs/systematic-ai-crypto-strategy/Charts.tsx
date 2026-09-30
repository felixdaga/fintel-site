"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { postContent } from "./data";
import { useHolding } from "./Holding";
import showcase from "./showcase.json";

const names = postContent.names;

const OC = "#6f93cf";
const FINTEL = "#e8924a";
const BENCH = "#6b7a8e";
const RUNS = ["#6f93cf", "#e8924a", "#4cae86"];

const W = 640;
const H = 250;
const PAD = { l: 48, r: 10, t: 14, b: 28 };

type Line = { name: string; color: string; dashed?: boolean; values: number[] };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function axisDate(iso: string) {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year.slice(2)}`;
}

function fromNav(nav: number[]) {
  return nav.map((value) => (value - 1) * 100);
}

function pctTick(value: number) {
  return `${Math.round(value)}%`;
}

function pctTip(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function LineChart({
  labels,
  series,
  tick,
  tip,
  height = H,
  guide,
}: {
  labels: string[];
  series: Line[];
  tick: (value: number) => string;
  tip: (value: number) => string;
  height?: number;
  guide?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const layout = useMemo(() => {
    const vals = series.flatMap((line) => line.values);
    const ymin = Math.min(...vals);
    const ymax = Math.max(...vals);
    const span = ymax - ymin || 1;
    const lo = ymin - span * 0.06;
    const hi = ymax + span * 0.06;
    const n = labels.length;
    const iw = W - PAD.l - PAD.r;
    const ih = height - PAD.t - PAD.b;
    const x = (i: number) => PAD.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
    const y = (value: number) => PAD.t + ih - ((value - lo) / (hi - lo)) * ih;
    const paths = series.map((line) =>
      line.values
        .map((value, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(value).toFixed(1)}`)
        .join(" "),
    );
    const ticks = Array.from({ length: 4 }, (_, i) => {
      const value = lo + ((hi - lo) * i) / 3;
      return { value, y: y(value) };
    });
    const step = Math.max(1, Math.ceil((n - 1) / 5));
    const marks = new Set<number>();
    for (let i = 0; i < n; i += step) marks.add(i);
    if (n > 0) marks.add(n - 1);
    const xLabels = [...marks].sort((a, b) => a - b).map((i) => ({ i, x: x(i), label: labels[i] }));
    const guideY = guide != null && guide >= lo && guide <= hi ? y(guide) : null;
    return { x, y, paths, ticks, xLabels, n, guideY };
  }, [guide, height, labels, series]);

  const onMove = (event: MouseEvent<SVGSVGElement>) => {
    if (layout.n === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * W;
    if (sx < PAD.l || sx > W - PAD.r) {
      setHover(null);
      return;
    }
    const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
    setHover(Math.min(layout.n - 1, Math.max(0, Math.round(t * (layout.n - 1)))));
  };

  const point = hover == null ? null : { index: hover, x: layout.x(hover) };

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="w-full"
        role="img"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {layout.ticks.map((row) => (
          <g key={row.value}>
            <line x1={PAD.l} x2={W - PAD.r} y1={row.y} y2={row.y} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD.l - 8} y={row.y + 3} textAnchor="end" fill="var(--text-muted)" fontSize="10">
              {tick(row.value)}
            </text>
          </g>
        ))}
        {layout.guideY != null ? (
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={layout.guideY}
            y2={layout.guideY}
            stroke="var(--text-muted)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        ) : null}
        {series.map((line, i) => (
          <path
            key={line.name}
            d={layout.paths[i]}
            fill="none"
            stroke={line.color}
            strokeWidth="1.8"
            strokeDasharray={line.dashed ? "4 3" : undefined}
          />
        ))}
        {point ? (
          <line x1={point.x} x2={point.x} y1={PAD.t} y2={height - PAD.b} stroke="var(--text-muted)" strokeWidth="1" />
        ) : null}
        {layout.xLabels.map((mark) => (
          <text key={mark.i} x={mark.x} y={height - 8} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
            {mark.label}
          </text>
        ))}
      </svg>
      {point ? (
        <p className="mt-1 font-mono text-[11px] text-text-soft">
          {labels[point.index]}
          {series.map((line) => (
            <span key={line.name}>
              {" · "}
              <span style={{ color: line.color }}>{line.name}</span> {tip(line.values[point.index])}
            </span>
          ))}
        </p>
      ) : (
        <p className="mt-1 h-4" />
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-soft">
        {series.map((line) => (
          <span key={line.name} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ background: line.color }} />
            {line.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function Panel({ heading, split, children }: { heading: string; split: string; children: ReactNode }) {
  return (
    <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="mb-3">
        <p className="text-base font-semibold tracking-tight text-text">{heading}</p>
        <p className="text-xs text-text-muted">{split}</p>
      </figcaption>
      {children}
    </figure>
  );
}

function harnessLines(block: { benchmark: number[]; openclaw: number[]; fintel: number[] }, map: (values: number[]) => number[]): Line[] {
  return [
    { name: names.benchmark, color: BENCH, dashed: true, values: map(block.benchmark) },
    { name: names.openclaw, color: OC, values: map(block.openclaw) },
    { name: names.fintel, color: FINTEL, values: map(block.fintel) },
  ];
}

function scoreTick(value: number) {
  return value.toFixed(1);
}

function scoreTip(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

export function ReturnCharts() {
  const { book } = useHolding();
  const labels = {
    equal: book.returns.equal.dates.map(axisDate),
    cap: book.returns.cap.dates.map(axisDate),
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {postContent.returns.panels.map((panel) => (
        <Panel key={panel.book} heading={panel.heading} split={panel.split}>
          <LineChart
            labels={labels[panel.book]}
            series={harnessLines(book.returns[panel.book], fromNav)}
            tick={pctTick}
            tip={pctTip}
            height={520}
          />
        </Panel>
      ))}
    </div>
  );
}

const ENS = "#d5deea";

export function ScoreCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {postContent.scores.panels.map((panel) => {
        const block = showcase.scores[panel.harness];
        const series: Line[] = [
          ...names.repeats.map((key, i) => ({
            name: key,
            color: RUNS[i],
            values: block[key],
          })),
          {
            name: postContent.scores.ensemble,
            color: ENS,
            dashed: true,
            values: block.ensemble,
          },
        ];
        return (
          <Panel key={panel.harness} heading={panel.heading} split={panel.split}>
            <LineChart
              labels={showcase.scores.dates.map(axisDate)}
              series={series}
              tick={scoreTick}
              tip={scoreTip}
              height={520}
              guide={0}
            />
          </Panel>
        );
      })}
    </div>
  );
}

export function TiltCharts() {
  const labels = showcase.tilts.labels;
  const line = (bench: number, openclaw: number[], fintel: number[]): Line[] => [
    { name: names.benchmark, color: BENCH, dashed: true, values: openclaw.map(() => bench * 100) },
    { name: names.openclaw, color: OC, values: openclaw.map((value) => value * 100) },
    { name: names.fintel, color: FINTEL, values: fintel.map((value) => value * 100) },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {postContent.tilts.panels.map((panel) => {
        const block = showcase.tilts[panel.book];
        return (
          <Panel key={panel.book} heading={panel.heading} split={panel.split}>
            <LineChart labels={labels} series={line(block.benchmark, block.openclaw, block.fintel)} tick={pctTick} tip={pctTip} />
          </Panel>
        );
      })}
    </div>
  );
}

export function WeightCharts() {
  const { book } = useHolding();
  const toPct = (values: number[]) => values.map((value) => value * 100);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {postContent.weights.panels.map((panel) => {
        const block = book.weights[panel.book];
        return (
          <Panel key={panel.book} heading={panel.heading} split={panel.split}>
            <LineChart labels={block.dates.map(axisDate)} series={harnessLines(block, toPct)} tick={pctTick} tip={pctTip} />
          </Panel>
        );
      })}
    </div>
  );
}

export function RepeatCharts() {
  const { book } = useHolding();
  const labels = book.repeats.dates.map(axisDate);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {postContent.repeats.panels.map((panel) => {
        const block = book.repeats[panel.harness];
        const series: Line[] = names.repeats.map((key, i) => ({
          name: key,
          color: RUNS[i],
          values: fromNav(block[key]),
        }));
        return (
          <Panel key={panel.harness} heading={panel.heading} split={panel.split}>
            <LineChart labels={labels} series={series} tick={pctTick} tip={pctTip} />
          </Panel>
        );
      })}
    </div>
  );
}
