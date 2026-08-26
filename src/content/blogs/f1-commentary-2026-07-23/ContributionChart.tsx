"use client";

const POS = "#5cb88a";
const NEG = "#d97a6a";

export type ContribBar = { symbol: string; bps: number };

export function ContributionChart({ data }: { data: ContribBar[] }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.bps)));
  const rows = [...data].sort((a, b) => b.bps - a.bps);

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
          Active return by name — contribution (bps)
        </h3>
        <span className="text-[11px] text-text-muted">F1 − DJIA, period cumulative</span>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((r) => {
          const pct = (Math.abs(r.bps) / maxAbs) * 100;
          const pos = r.bps >= 0;
          return (
            <div key={r.symbol} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-right font-mono text-xs text-text-soft">{r.symbol}</span>
              <div className="relative flex h-5 flex-1 items-center">
                <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
                <div
                  className="absolute h-3 rounded-sm"
                  style={{
                    background: pos ? POS : NEG,
                    width: `${pct / 2}%`,
                    left: pos ? "50%" : `${50 - pct / 2}%`,
                  }}
                />
              </div>
              <span
                className="w-16 shrink-0 text-right font-mono text-xs tabular-nums"
                style={{ color: pos ? POS : NEG }}
              >
                {r.bps > 0 ? "+" : ""}
                {r.bps.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-2 w-3 rounded-sm" style={{ background: POS }} />
          added to alpha
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          <span className="inline-block h-2 w-3 rounded-sm" style={{ background: NEG }} />
          detracted from alpha
        </span>
      </div>
    </div>
  );
}
