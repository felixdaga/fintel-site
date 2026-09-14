import { fmtNum } from "./format";
import type { LeagueAxisRow } from "./types";

export function LeagueAxisTable({ rows }: { rows: LeagueAxisRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-border text-[10px] uppercase tracking-widest text-text-muted">
            <th className="px-3 py-2.5 font-medium">metric</th>
            <th className="px-3 py-2.5 text-right font-medium">same model</th>
            <th className="px-3 py-2.5 text-right font-medium">n</th>
            <th className="px-3 py-2.5 text-right font-medium">same harness</th>
            <th className="px-3 py-2.5 text-right font-medium">n</th>
            <th className="px-3 py-2.5 text-right font-medium">neither</th>
            <th className="px-3 py-2.5 text-right font-medium">n</th>
            <th className="px-3 py-2.5 font-medium">driven</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60 last:border-0">
              <td className="px-3 py-2 text-text">{row.label}</td>
              <td className="px-3 py-2 text-right tabular-nums text-text-soft">
                {fmtNum(row.same_model, 2)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-text-muted">
                {row.n_same_model}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-text-soft">
                {fmtNum(row.same_harness, 2)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-text-muted">
                {row.n_same_harness}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-text-soft">
                {fmtNum(row.neither, 2)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-text-muted">
                {row.n_neither}
              </td>
              <td
                className={`px-3 py-2 ${
                  row.driven === "harness"
                    ? "text-orange"
                    : row.driven === "model"
                      ? "text-accent"
                      : "text-text-muted"
                }`}
              >
                {row.driven || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
