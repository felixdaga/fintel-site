import { ChartCard } from "./ChartCard";
import { fmtChart, niceStep } from "./format";
import type { LeagueGroupedChart as Spec } from "./types";

const W = 760;
const H = 230;
const PAD = { l: 52, r: 16, t: 18, b: 40 };

export function LeagueGroupedBar({ chart }: { chart: Spec }) {
  const cats = chart.categories;
  const series = chart.series;
  const vals = series.flatMap((s) => s.values.filter((v): v is number => v != null));
  if (chart.y_max != null) vals.push(chart.y_max);
  if (chart.y_min != null) vals.push(chart.y_min);
  const rawMax = vals.length ? Math.max(...vals, 0) : 1;
  const yMin = chart.y_min ?? 0;
  let yMax = chart.y_max ?? rawMax * 1.08;
  if (yMax <= yMin) yMax = yMin + 1;
  const step = niceStep((yMax - yMin) / 4);
  const ticks: number[] = [];
  for (let t = yMin; t <= yMax + step * 0.01; t += step) ticks.push(Number(t.toFixed(8)));

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const n = Math.max(cats.length, 1);
  const slot = plotW / n;
  const groupW = slot * 0.72;
  const barW = groupW / Math.max(series.length, 1);

  return (
    <ChartCard title={chart.title} caption={chart.caption} hint={chart.hint}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.title}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray={t === 0 ? undefined : "4 4"}
            />
            <text
              x={PAD.l - 8}
              y={y(t) + 3.5}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {fmtChart(t, chart.format)}
            </text>
          </g>
        ))}
        {cats.map((cat, i) => {
          const cx = PAD.l + slot * (i + 0.5);
          const left = cx - groupW / 2;
          return (
            <g key={cat}>
              {series.map((s, si) => {
                const v = s.values[i];
                if (v == null) return null;
                const top = y(v);
                return (
                  <rect
                    key={s.id}
                    x={left + si * barW + 1}
                    y={top}
                    width={Math.max(4, barW - 2)}
                    height={Math.max(0, y(yMin) - top)}
                    fill={s.color}
                    rx={3}
                  >
                    <title>{`${cat} · ${s.label}: ${fmtChart(v, chart.format)}`}</title>
                  </rect>
                );
              })}
              <text
                x={cx}
                y={H - 14}
                textAnchor="middle"
                fill="var(--text-soft)"
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
              >
                {cat}
              </text>
            </g>
          );
        })}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={y(yMin)}
          y2={y(yMin)}
          stroke="var(--border-strong)"
          strokeWidth={1.2}
        />
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}
