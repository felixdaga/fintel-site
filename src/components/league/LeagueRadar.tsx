import { fmtChart } from "./format";
import type { LeagueRadarPack } from "./types";

const W = 280;
const H = 250;
const CX = 140;
const CY = 125;
const R = 62;
const LABEL_R = 92;

function pt(i: number, n: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

export function LeagueRadar({
  pack,
  values,
  color,
  label,
}: {
  pack: LeagueRadarPack;
  values: (number | null)[];
  color: string;
  label: string;
}) {
  const n = pack.axes.length;
  const span = pack.hi - pack.lo || 1;
  const mag = (v: number | null) => {
    const x = v == null || !Number.isFinite(v) ? 0 : v;
    return Math.min(1, Math.max(0, (x - pack.lo) / span));
  };
  const poly = (scale: number) =>
    pack.axes.map((_, i) => pt(i, n, R * scale).join(",")).join(" ");
  const dataPts = values.map((v, i) => pt(i, n, R * mag(v)).join(",")).join(" ");
  const fill = `color-mix(in srgb, ${color} 28%, transparent)`;

  return (
    <figure className="min-w-0">
      <figcaption className="mb-1 text-center font-mono text-[10px] uppercase tracking-widest text-text-soft">
        {label}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full max-w-[240px]"
        role="img"
        aria-label={`${label} active tilt`}
      >
        <polygon
          points={poly(mag(0))}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <polygon
          points={poly(1)}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={1.25}
        />
        {pack.axes.map((ax, i) => {
          const [x, y] = pt(i, n, R);
          return (
            <line
              key={ax.id}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}
        <polygon points={dataPts} fill={fill} stroke={color} strokeWidth={1.6} />
        {pack.axes.map((ax, i) => {
          const [dx, dy] = pt(i, n, R * mag(values[i] ?? 0));
          const [lx, ly] = pt(i, n, LABEL_R);
          return (
            <g key={ax.id}>
              <circle cx={dx} cy={dy} r={3.2} fill={color}>
                <title>{`${ax.label}: ${fmtChart(values[i], pack.format)}`}</title>
              </circle>
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-muted)"
                fontSize={10}
                fontFamily="var(--font-geist-mono)"
              >
                {ax.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
