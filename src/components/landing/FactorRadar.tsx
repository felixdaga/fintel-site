import { COPY } from "./main_texts";

const FACTORS = [
  { key: "mkt_rf", label: "Mkt", beta: -0.0672 },
  { key: "smb", label: "SMB", beta: -0.0283 },
  { key: "hml", label: "HML", beta: -0.1563 },
  { key: "rmw", label: "RMW", beta: -0.139 },
  { key: "cma", label: "CMA", beta: -0.0534 },
  { key: "mom", label: "Mom", beta: 0.0593 },
] as const;

const LO = -0.2;
const HI = 0.1;
const W = 260;
const H = 236;
const CX = 130;
const CY = 118;
const R = 58;
const LABEL_R = 86;

function mag(v: number) {
  return Math.min(1, Math.max(0, (v - LO) / (HI - LO)));
}

function pt(i: number, n: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function poly(scale: number) {
  return FACTORS.map((_, i) => pt(i, FACTORS.length, R * scale).join(",")).join(
    " ",
  );
}

export function FactorRadar({
  tone = "orange",
  label = COPY.resume.radarLabel,
}: {
  tone?: "orange" | "accent";
  label?: string;
}) {
  const n = FACTORS.length;
  const dataPts = FACTORS.map((f, i) =>
    pt(i, n, R * mag(f.beta)).join(","),
  ).join(" ");
  const fill =
    tone === "accent"
      ? "color-mix(in srgb, var(--accent) 28%, transparent)"
      : "color-mix(in srgb, var(--orange) 28%, transparent)";
  const stroke = tone === "accent" ? "var(--accent)" : "var(--orange)";
  const cap =
    tone === "accent" ? "text-accent" : "text-orange";

  return (
    <figure className="min-w-0">
      <figcaption className={`mb-1 text-center font-mono text-[10px] uppercase tracking-widest ${cap}`}>
        {label}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full max-w-[220px]"
        aria-hidden
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
        {FACTORS.map((_, i) => {
          const [x, y] = pt(i, n, R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={dataPts}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.6}
        />
        {FACTORS.map((f, i) => {
          const [dx, dy] = pt(i, n, R * mag(f.beta));
          const [lx, ly] = pt(i, n, LABEL_R);
          return (
            <g key={f.key}>
              <circle cx={dx} cy={dy} r={3.2} fill={stroke} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-muted)"
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
              >
                {f.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
