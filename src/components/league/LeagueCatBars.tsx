import { LeagueLegend } from "./LeagueLegend";
import { fmtChart } from "./format";

export type CatSeries = {
  id: string;
  label: string;
  color: string;
  values: (number | null)[];
};

export function LeagueCatBars({
  title,
  categories,
  series,
  format = "number",
  stack,
  zero = true,
  yMin,
  yMax,
  height = 280,
  rotateX,
}: {
  title?: string;
  categories: string[];
  series: CatSeries[];
  format?: "pct" | "number" | "usd" | "abs_pct";
  stack?: boolean;
  zero?: boolean;
  yMin?: number;
  yMax?: number;
  height?: number;
  rotateX?: boolean;
}) {
  const W = 760;
  const PAD = { l: 52, r: 16, t: 20, b: rotateX ? 56 : 40 };
  const n = categories.length;
  const ng = series.length;
  const num = (v: number | null | undefined) => (v == null ? 0 : Number(v) || 0);
  const sums = categories.map((_, i) => series.reduce((acc, s) => acc + num(s.values[i]), 0));
  let ymin: number;
  let ymax: number;
  if (stack) {
    ymin = yMin ?? 0;
    ymax = yMax ?? Math.max(0, ...sums);
  } else {
    const live = series.flatMap((s) => s.values.filter((v): v is number => v != null));
    ymin = yMin ?? (live.length ? Math.min(...live) : 0);
    ymax = yMax ?? (live.length ? Math.max(...live) : 1);
  }
  if (zero) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  const span = ymax - ymin || 1;
  ymin -= span * 0.05;
  ymax += span * 0.05;
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const groupW = n ? iw / n : iw;
  const barW = stack
    ? Math.min(56, Math.max(18, groupW * 0.42))
    : Math.min(14, (groupW * 0.78) / Math.max(ng, 1));
  const x = (i: number, g: number) =>
    stack
      ? PAD.l + i * groupW + (groupW - barW) / 2
      : PAD.l + i * groupW + (groupW - barW * ng) / 2 + g * barW;
  const yTicks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4);
  const step = n > 14 ? Math.ceil(n / 8) : 1;
  const xLab = (s: string) => (s.length >= 7 && /^\d{4}-\d{2}/.test(s) ? s.slice(0, 7) : s);

  const body = !n || !ng ? null : (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" role="img" aria-label={title || "bars"}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
          <text
            x={PAD.l - 10}
            y={y(t) + 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
          >
            {fmtChart(t, format)}
          </text>
        </g>
      ))}
      {ymin < 0 && ymax > 0 ? (
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={y(0)}
          y2={y(0)}
          stroke="var(--border-strong)"
          strokeWidth={1}
        />
      ) : null}
      {categories.map((cat, i) => {
        const xx = PAD.l + i * groupW + groupW / 2;
        const show = i % step === 0 || i === n - 1;
        return (
          <g key={`${cat}-${i}`}>
            {stack
              ? (() => {
                  let y0 = 0;
                  return series.map((s) => {
                    const v = num(s.values[i]);
                    const top = y0 + v;
                    const prev = y0;
                    y0 = top;
                    if (!v) return null;
                    const bh = Math.abs(y(top) - y(prev));
                    return (
                      <rect
                        key={s.id}
                        x={x(i, 0)}
                        y={y(top)}
                        width={barW}
                        height={bh}
                        fill={s.color}
                      >
                        <title>{`${cat} · ${s.label}: ${fmtChart(v, format)}`}</title>
                      </rect>
                    );
                  });
                })()
              : series.map((s, g) => {
                  const v = s.values[i];
                  if (v == null) return null;
                  const by = y(Math.max(v, 0));
                  const bh = Math.abs(y(v) - y(0));
                  return (
                    <rect key={s.id} x={x(i, g)} y={by} width={barW} height={bh} fill={s.color}>
                      <title>{`${cat} · ${s.label}: ${fmtChart(v, format)}`}</title>
                    </rect>
                  );
                })}
            {show ? (
              <text
                x={xx}
                y={height - 16}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize={9}
                fontFamily="var(--font-geist-mono)"
                transform={rotateX ? `rotate(-35 ${xx} ${height - 16})` : undefined}
              >
                {xLab(cat)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  if (!title) {
    return (
      <div>
        {body}
        <LeagueLegend series={series} />
      </div>
    );
  }

  return (
    <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        {title}
      </figcaption>
      <div className="mt-3">{body}</div>
      <LeagueLegend series={series} />
    </figure>
  );
}
