const W = 320;
const H = 118;
const PAD = { l: 8, r: 8, t: 16, b: 8 };

export function IcPairChart({
  title,
  theirs,
  baseline,
  yMax = 0.16,
}: {
  title: string;
  theirs: { label: string; ic: number };
  baseline: { label: string; ic: number };
  yMax?: number;
}) {
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + ih - (v / yMax) * ih;
  const barW = 48;
  const gap = 36;
  const groupW = barW * 2 + gap;
  const x0 = PAD.l + (iw - groupW) / 2;
  const xTheirs = x0;
  const xBase = x0 + barW + gap;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-orange">
        {title}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 h-auto w-full"
        role="img"
        aria-label={`${title}. ${theirs.label} IC ${theirs.ic.toFixed(2)}, ${baseline.label} IC ${baseline.ic.toFixed(2)}.`}
      >
        <Bar
          x={xTheirs}
          y={y(theirs.ic)}
          w={barW}
          bottom={y(0)}
          fill="var(--orange)"
          value={theirs.ic}
        />
        <Bar
          x={xBase}
          y={y(baseline.ic)}
          w={barW}
          bottom={y(0)}
          fill="var(--accent)"
          value={baseline.ic}
        />
      </svg>
      <ChartLegend
        preLabel={baseline.label}
        postLabel={theirs.label}
      />
    </div>
  );
}

function Bar({
  x,
  y,
  w,
  bottom,
  fill,
  value,
}: {
  x: number;
  y: number;
  w: number;
  bottom: number;
  fill: string;
  value: number;
}) {
  const h = Math.max(0, bottom - y);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} />
      <text
        x={x + w / 2}
        y={y - 4}
        textAnchor="middle"
        fill="var(--text)"
        fontSize={10}
        fontFamily="var(--font-geist-mono)"
      >
        {value.toFixed(2)}
      </text>
    </g>
  );
}

export function ChartLegend({
  preLabel,
  postLabel,
}: {
  preLabel: string;
  postLabel: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
        <span className="inline-block h-1.5 w-3 rounded-sm bg-accent" />
        {preLabel}
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] text-text">
        <span className="inline-block h-1.5 w-3 rounded-sm bg-orange" />
        {postLabel}
      </span>
    </div>
  );
}
