import { ChartCard } from "./ChartCard";
import { fmtChart } from "./format";
import type { LeagueScatterChart as Spec } from "./types";

const W = 760;
const H = 230;
const PAD = { l: 52, r: 56, t: 16, b: 40 };

export function LeagueScatter({ chart }: { chart: Spec }) {
  const pts = chart.points;
  if (!pts.length) {
    return (
      <ChartCard title={chart.title} caption={chart.caption} hint={chart.hint}>
        <p className="text-sm text-text-muted">no overlapping points</p>
      </ChartCard>
    );
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  let xmin = Math.min(...xs);
  let xmax = Math.max(...xs);
  let ymin = Math.min(...ys);
  let ymax = Math.max(...ys);
  if (xmin === xmax) {
    xmin -= 1;
    xmax += 1;
  }
  if (ymin === ymax) {
    ymin -= Math.abs(ymin) * 0.05 || 0.05;
    ymax += Math.abs(ymax) * 0.05 || 0.05;
  }
  const xspan = xmax - xmin;
  const yspan = ymax - ymin;
  xmin -= xspan * 0.08;
  xmax += xspan * 0.08;
  ymin -= yspan * 0.08;
  ymax += yspan * 0.08;
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (v: number) => PAD.l + ((v - xmin) / (xmax - xmin)) * iw;
  const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const xTicks = Array.from({ length: 5 }, (_, i) => xmin + ((xmax - xmin) * i) / 4);
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const fit = chart.fit;

  return (
    <ChartCard title={chart.title} caption={chart.caption} hint={chart.hint}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.title}
      >
        {yTicks.map((t) => (
          <g key={`y-${t}`}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PAD.l - 8}
              y={y(t) + 3}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
            >
              {fmtChart(t, chart.y_format)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text
            key={`x-${t}`}
            x={x(t)}
            y={H - 16}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
          >
            {fmtChart(t, chart.x_format)}
          </text>
        ))}
        {fit ? (
          <line
            x1={x(xmin)}
            y1={y(fit.intercept + fit.slope * xmin)}
            x2={x(xmax)}
            y2={y(fit.intercept + fit.slope * xmax)}
            stroke="var(--orange)"
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />
        ) : null}
        {pts.map((p) => (
          <g key={p.id}>
            <circle
              cx={x(p.x)}
              cy={y(p.y)}
              r={5}
              fill={p.color}
              stroke="var(--bg-soft)"
              strokeWidth={1}
            >
              <title>{`${p.label}: ${chart.x_name} ${fmtChart(p.x, chart.x_format)}, ${chart.y_name} ${fmtChart(p.y, chart.y_format)}`}</title>
            </circle>
            <text
              x={x(p.x) + 7}
              y={y(p.y) - 7}
              fill="var(--text-soft)"
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </ChartCard>
  );
}
