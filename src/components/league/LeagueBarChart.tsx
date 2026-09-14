import { ChartCard } from "./ChartCard";
import { fmtChart, niceStep } from "./format";
import type { LeagueBarChart as Spec } from "./types";

const W = 760;
const H = 210;
const PAD = { l: 52, r: 12, t: 18, b: 52 };

export function LeagueBarChart({ chart }: { chart: Spec }) {
  const bars = chart.bars.filter((b) => b.value != null) as {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
  const ys = bars.map((b) => b.value);
  if (chart.mark?.y != null) ys.push(chart.mark.y);
  const rawMin = ys.length ? Math.min(0, ...ys, chart.y_min ?? 0) : 0;
  const rawMax = ys.length ? Math.max(...ys, 0) : 1;
  const pad = (rawMax - rawMin) * 0.08 || 0.05;
  let yMin = chart.y_min != null ? chart.y_min : rawMin - (rawMin < 0 ? pad : 0);
  let yMax = rawMax + pad;
  if (yMax === yMin) yMax = yMin + 1;
  const step = niceStep((yMax - yMin) / 4);
  const tickMax = Math.ceil(yMax / step) * step;
  const tickMin = Math.floor(yMin / step) * step;
  yMin = tickMin;
  yMax = tickMax === tickMin ? tickMin + step : tickMax;
  const ticks: number[] = [];
  for (let t = yMin; t <= yMax + step * 0.01; t += step) ticks.push(t);

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const n = Math.max(bars.length, 1);
  const slot = plotW / n;
  const barW = Math.min(42, slot * 0.62);
  const zeroY = y(0);

  return (
    <ChartCard title={chart.title} caption={chart.caption}>
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
        {chart.mark && chart.mark.y != null ? (
          <g>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(chart.mark.y)}
              y2={y(chart.mark.y)}
              stroke="var(--orange)"
              strokeWidth={1.4}
              strokeDasharray="5 4"
            />
            <text
              x={W - PAD.r}
              y={y(chart.mark.y) - 5}
              textAnchor="end"
              fill="var(--orange)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {chart.mark.label}
            </text>
          </g>
        ) : null}
        {bars.map((b, i) => {
          const cx = PAD.l + slot * (i + 0.5);
          const top = y(Math.max(b.value, 0));
          const bot = b.value >= 0 ? zeroY : y(b.value);
          const h = Math.max(0, bot - top);
          return (
            <g key={b.id}>
              <rect
                x={cx - barW / 2}
                y={b.value >= 0 ? top : zeroY}
                width={barW}
                height={h || 1}
                fill={b.color}
                rx={4}
              >
                <title>{`${b.label}: ${fmtChart(b.value, chart.format)}`}</title>
              </rect>
              <text
                x={cx}
                y={H - 16}
                textAnchor="end"
                fill="var(--text-soft)"
                fontSize={10}
                fontFamily="var(--font-geist-mono)"
                transform={`rotate(-32 ${cx} ${H - 16})`}
              >
                {b.label}
              </text>
            </g>
          );
        })}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--border-strong)"
          strokeWidth={1.2}
        />
      </svg>
    </ChartCard>
  );
}
