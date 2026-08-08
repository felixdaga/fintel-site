"use client";

import type { RebalanceReport } from "./types";

const actionColor: Record<string, string> = {
  buy: "text-green-600 dark:text-green-400",
  sell: "text-red-600 dark:text-red-400",
  hold: "text-text-muted",
};

const actionBg: Record<string, string> = {
  buy: "bg-green-50 dark:bg-green-950/30",
  sell: "bg-red-50 dark:bg-red-950/30",
  hold: "bg-bg-soft",
};

export function RebalanceGuidance({ report }: { report: RebalanceReport }) {
  const trades = report.holdings.filter((h) => h.action !== "hold");
  const held = report.holdings.filter((h) => h.action === "hold");

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-text-soft">
        <span>
          <span className="font-medium text-text">Capital</span> ${report.capital.toLocaleString()}
        </span>
        <span>
          <span className="font-medium text-text">Holdings</span> {report.n_holdings}
        </span>
        <span>
          <span className="font-medium text-text">Buys</span> {report.n_buys}
        </span>
        <span>
          <span className="font-medium text-text">Sells</span> {report.n_sells}
        </span>
        <span>
          <span className="font-medium text-text">Turnover</span> {(report.total_turnover * 100).toFixed(0)}%
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2 pr-4 font-medium">Symbol</th>
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 text-right font-medium">Target Wt</th>
              <th className="py-2 pr-4 text-right font-medium">Curr Wt</th>
              <th className="py-2 pr-4 text-right font-medium">Trade Shares</th>
              <th className="py-2 pr-4 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Notional</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((h) => (
              <tr
                key={h.symbol}
                className={`border-b border-border/50 ${actionBg[h.action]}`}
              >
                <td className="py-2 pr-4 font-mono font-medium text-text">{h.symbol}</td>
                <td className={`py-2 pr-4 font-medium ${actionColor[h.action]}`}>
                  {h.action}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-text-soft">
                  {(h.target_weight * 100).toFixed(1)}%
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-text-muted">
                  {(h.current_weight * 100).toFixed(1)}%
                </td>
                <td className="py-2 pr-4 text-right tabular-nums font-medium text-text">
                  {h.trade_shares > 0 ? "+" : ""}
                  {h.trade_shares.toFixed(1)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-text-soft">
                  ${h.price.toFixed(2)}
                </td>
                <td className="py-2 text-right tabular-nums text-text-soft">
                  ${h.target_notional.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
            {held.length > 0 && (
              <tr className="border-b border-border/50">
                <td colSpan={7} className="py-1.5 text-xs text-text-muted">
                  <span className="font-mono">held</span> — {held.map((h) => h.symbol).join(", ")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
