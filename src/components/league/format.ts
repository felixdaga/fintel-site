import type { LeagueSystem } from "./types";

export function fmtNum(v: number | null | undefined, d = 2): string {
  if (v == null || Number.isNaN(v)) return "—";
  return v.toFixed(d);
}

export function fmtPct(v: number | null | undefined, d = 1): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `${(100 * v).toFixed(d)}%`;
}

export function fmtUsd(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `$${v.toFixed(0)}`;
}

/** Public model label. Snapshot still stores the short AA key. */
export function displayModel(name: string | null | undefined): string {
  if (!name) return "—";
  return name.replace(/\bDSV 4\.1\b/g, "DeepSeek v4.1").replace(/\bDSV\b/g, "DeepSeek v4.1");
}

export function fmtChart(
  v: number | null | undefined,
  format: "pct" | "number" | "usd" | "abs_pct",
): string {
  if (v == null || Number.isNaN(v)) return "—";
  if (format === "pct" || format === "abs_pct") return fmtPct(v, 1);
  if (format === "usd") return fmtUsd(v);
  return fmtNum(v, 2);
}

export function clsNum(v: number | null | undefined): string {
  if (v == null || v === 0) return "text-text-soft";
  return v > 0 ? "text-positive" : "text-negative";
}

/** Fill `{token}` slots from league.json `copy`. Unknown tokens are left visible. */
export function fillCopy(
  template: string,
  vars: Record<string, string> | undefined,
): string {
  return template.replace(/\{([a-z0-9_]+)\}/gi, (all, key: string) =>
    vars && vars[key] != null && vars[key] !== "" ? vars[key] : all,
  );
}

export function byId(systems: LeagueSystem[]): Record<string, LeagueSystem> {
  return Object.fromEntries(systems.map((s) => [s.id, s]));
}

export function niceStep(raw: number): number {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return step * pow;
}
