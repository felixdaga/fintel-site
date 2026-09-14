import { fmtNum } from "./format";
import type { LeagueLab } from "./types";

function rgb(a: number[], b: number[], t: number) {
  const u = Math.max(0, Math.min(1, t));
  return a.map((x, i) => Math.round(x + (b[i] - x) * u));
}

function heatColor(v: number | null) {
  if (v == null) return "var(--surface)";
  const mid = [27, 39, 56];
  const pos = [76, 174, 134];
  const neg = [217, 122, 108];
  const c = v < 0 ? rgb(neg, mid, v + 1) : rgb(mid, pos, (v - 0.35) / 0.65);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function heatInk(v: number | null) {
  return v != null && v >= 0.78 ? "#0c1118" : "var(--text)";
}

function simLab(ident: { harness?: string; model?: string } | undefined) {
  const h = ident?.harness === "OpenClaw" ? "OC" : ident?.harness || "";
  return `${h} ${ident?.model || ""}`.trim() || "—";
}

export function LeagueSimHeat({
  sim,
  metric,
}: {
  sim: LeagueLab["sim"];
  metric: string;
}) {
  const order = sim.order || [];
  const systems = sim.systems || {};
  const spec = (sim.metrics || []).find((m) => m.id === metric) || sim.metrics[0];
  const mat = (sim.matrices || {})[metric] || [];
  const brk = order.findIndex(
    (lab, i) =>
      i > 0 &&
      systems[lab] &&
      systems[order[i - 1]] &&
      systems[lab].harness !== systems[order[i - 1]].harness,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        pairwise — {spec?.label || metric}
      </h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-max border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="px-2 py-1.5" />
              {order.map((lab, j) => (
                <th
                  key={lab}
                  className={`px-2 py-1.5 font-medium text-text-muted ${j === brk ? "border-l border-border" : ""}`}
                >
                  {simLab(systems[lab])}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.map((lab, i) => (
              <tr key={lab} className={i === brk ? "border-t border-border" : ""}>
                <td className="whitespace-nowrap px-2 py-1.5 text-text-soft">{simLab(systems[lab])}</td>
                {order.map((other, j) => {
                  const v = (mat[i] || [])[j] ?? null;
                  return (
                    <td
                      key={other}
                      className={`px-2 py-1.5 text-center tabular-nums ${j === brk ? "border-l border-border" : ""}`}
                      style={{ background: heatColor(v), color: heatInk(v) }}
                      title={`${simLab(systems[lab])} × ${simLab(systems[other])}: ${fmtNum(v, 3)}`}
                    >
                      {fmtNum(v, 2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
        <span>0.35</span>
        <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#1b2738] to-[#4cae86]" />
        <span>1.0</span>
      </div>
      {spec?.hint ? <p className="mt-2 text-[11px] text-text-muted">{spec.hint}</p> : null}
    </div>
  );
}
