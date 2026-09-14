import type {
  LeagueLab,
  LeaguePublic,
  LeagueScatterChart,
  LeagueSystem,
} from "./types";

export const LG_CHARTS = [
  { id: "ret", label: "cumulative return" },
  { id: "dd", label: "underwater" },
  { id: "ic", label: "spearman IC" },
  { id: "resid", label: "residual IC" },
  { id: "factor", label: "active factor exposure" },
  { id: "sector", label: "active sector exposure" },
  { id: "rating", label: "company rating" },
  { id: "sim", label: "harness vs model" },
  { id: "hx", label: "harness compare" },
  { id: "drivers", label: "model drivers" },
  { id: "tools", label: "data tools" },
] as const;

export type LgMetric = (typeof LG_CHARTS)[number]["id"];

export const HX_METRIC_IDS = [
  "total",
  "ann_ret",
  "mean_ic",
  "residual_ic",
  "ann_sharpe",
  "ann_ir",
  "ann_vol",
  "max_dd",
  "cost_usd",
] as const;

export const HX_INVERT: Record<string, boolean> = {
  ann_vol: true,
  cost_usd: true,
};

export type YKind = "pct" | "num" | "usd" | "int";

export type YCol = { id: string; label: string; kind: YKind };

export type LinePt = { x: string; y: number };
export type LineSeries = {
  id: string;
  label: string;
  color: string;
  dashed?: boolean;
  pts: LinePt[];
};

export function tsMean(rows: { y?: number }[] | undefined): number | null {
  const ys = (rows || []).map((r) => r.y).filter((v): v is number => v != null && Number.isFinite(v));
  if (!ys.length) return null;
  return ys.reduce((a, b) => a + b, 0) / ys.length;
}

export function cumRet(pts: { date: string; nav: number }[] | undefined): LinePt[] {
  const rows = pts || [];
  if (!rows.length) return [];
  const z = rows[0].nav;
  if (!z) return [];
  return rows.map((p) => ({ x: p.date, y: p.nav / z - 1 }));
}

export function underwater(pts: { date: string; nav: number }[] | undefined): LinePt[] {
  let peak = -Infinity;
  return (pts || []).map((p) => {
    peak = Math.max(peak, p.nav);
    return { x: p.date, y: peak > 0 ? p.nav / peak - 1 : 0 };
  });
}

export function needsBook(metric: LgMetric): boolean {
  return metric === "ret" || metric === "dd" || metric === "factor" || metric === "sector" || metric === "hx";
}

export function yCols(data: LeaguePublic): YCol[] {
  const labels = data.table_ids;
  const lab = data.lab;
  const hasResid = labels.some((k) => data.systems.find((s) => s.id === k)?.residual_ic != null);
  const hasRetries = labels.some((k) => data.systems.find((s) => s.id === k)?.n_retries != null);
  const hasTools = labels.some((k) => lab?.tools.runs[k]?.n_calls);
  const cols: YCol[] = [
    { id: "total", label: "total", kind: "pct" },
    { id: "ann_ret", label: "ann ret", kind: "pct" },
    { id: "mean_ic", label: "sp IC", kind: "num" },
    { id: "t_stat", label: "sp t", kind: "num" },
    { id: "icir_ann", label: "sp icir", kind: "num" },
  ];
  if (hasResid) {
    cols.push(
      { id: "ff_r2", label: "r2", kind: "num" },
      { id: "residual_ic", label: "resid IC", kind: "num" },
      { id: "residual_t", label: "resid t", kind: "num" },
      { id: "residual_icir_ann", label: "resid icir", kind: "num" },
    );
  }
  cols.push(
    { id: "ann_sharpe", label: "ann sharpe", kind: "num" },
    { id: "ann_ir", label: "ann IR", kind: "num" },
    { id: "ann_vol", label: "ann vol", kind: "pct" },
    { id: "max_dd", label: "max dd", kind: "pct" },
    { id: "cost_usd", label: "cost", kind: "usd" },
  );
  if (hasRetries) cols.push({ id: "n_retries", label: "retries", kind: "int" });
  if (hasTools) cols.push({ id: "n_calls", label: "tools", kind: "int" });
  cols.push({ id: "n_periods", label: "periods", kind: "int" });
  cols.push({ id: "n_cells", label: "agent simulations", kind: "int" });
  return cols;
}

export function yValue(
  data: LeaguePublic,
  id: string,
  colId: string,
  book: string,
): number | null {
  const s = data.systems.find((row) => row.id === id);
  const run = data.lab?.runs[id];
  const m = run?.metrics?.[book];
  const map: Record<string, number | null | undefined> = {
    total: m?.total,
    ann_ret: m?.ann_ret,
    mean_ic: s?.mean_ic,
    t_stat: s?.t_stat,
    icir_ann: s?.icir_ann,
    ff_r2: s?.ff_r2,
    residual_ic: s?.residual_ic,
    residual_t: s?.residual_t,
    residual_icir_ann: s?.residual_icir_ann,
    ann_sharpe: m?.ann_sharpe,
    ann_ir: m?.ann_ir,
    ann_vol: m?.ann_vol,
    max_dd: m?.max_dd,
    cost_usd: s?.cost_usd,
    n_retries: s?.n_retries,
    n_calls: data.lab?.tools.runs[id]?.n_calls ?? s?.n_calls,
    n_periods: s?.n_periods,
    n_cells: s?.n_cells,
  };
  const v = map[colId];
  return v == null || Number.isNaN(Number(v)) ? null : Number(v);
}

export function fmtKind(kind: YKind, v: number | null, extra = false): string {
  if (v == null || Number.isNaN(v)) return "—";
  if (kind === "pct") return `${(100 * v).toFixed(extra ? 2 : 1)}%`;
  if (kind === "usd") return `$${v.toFixed(extra ? 2 : 0)}`;
  if (kind === "int") return String(Math.round(v));
  return v.toFixed(extra ? 4 : 2);
}

export function harnessTwins(data: LeaguePublic) {
  const preferred = ["fintel_GFA", "OpenClaw"];
  const byModel: Record<string, Record<string, string>> = {};
  for (const s of data.systems) {
    const model = s.model || s.id;
    const h = s.analysis_harness;
    if (!byModel[model]) byModel[model] = {};
    if (!(h in byModel[model])) byModel[model][h] = s.id;
  }
  const twins = Object.keys(byModel)
    .sort()
    .filter((m) => Object.keys(byModel[m]).length >= 2)
    .map((model) => ({ model, keys: byModel[model] }));
  const harnesses = [...new Set(twins.flatMap((t) => Object.keys(t.keys)))];
  harnesses.sort((a, b) => {
    const ia = preferred.indexOf(a);
    const ib = preferred.indexOf(b);
    const ra = ia < 0 ? preferred.length : ia;
    const rb = ib < 0 ? preferred.length : ib;
    return ra !== rb ? ra - rb : a.localeCompare(b);
  });
  return { twins, harnesses };
}

export function olsFit(pts: { x: number; y: number }[]) {
  const live = pts.filter((p) => p.x != null && p.y != null);
  const n = live.length;
  if (n < 2) return null;
  const mx = live.reduce((s, p) => s + p.x, 0) / n;
  const my = live.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  live.forEach((p) => {
    const dx = p.x - mx;
    const dy = p.y - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  });
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2, n };
}

export function driverScatter(
  data: LeaguePublic,
  axis: { id: string; label: string; pct: boolean },
  ySpec: YCol,
  harness: string,
): LeagueScatterChart {
  const visible = data.systems.filter(
    (s) => harness === "all" || s.analysis_harness === harness,
  );
  const points = visible
    .map((s) => {
      const x = (s as LeagueSystem)[axis.id as keyof LeagueSystem];
      const y = yValue(data, s.id, ySpec.id, "sw_0.0");
      if (typeof x !== "number" || y == null) return null;
      return {
        id: s.id,
        label: s.short,
        x,
        y,
        color: data.harness_colors[s.analysis_harness] || s.color,
        harness: s.analysis_harness,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p != null);
  const fit = olsFit(points);
  return {
    id: axis.id,
    title: axis.label,
    caption: "",
    hint: fit
      ? `OLS  y = ${fit.intercept.toFixed(3)} + ${fit.slope.toFixed(3)} x · R² ${fit.r2.toFixed(2)} · n=${fit.n}`
      : points.length
        ? `n=${points.length}`
        : "no overlapping points",
    x_format: axis.pct ? "pct" : "number",
    y_format: ySpec.kind === "pct" ? "pct" : "number",
    x_name: axis.label,
    y_name: ySpec.label,
    points,
    fit,
  };
}

export function availableCharts(data: LeaguePublic): typeof LG_CHARTS[number][] {
  const lab: LeagueLab | undefined = data.lab;
  if (!lab) return [];
  const ids = data.table_ids;
  const hasTools = ids.some((k) => lab.tools.runs[k]?.n_calls);
  const hasRatings = (lab.ratings.universe || []).length > 0;
  const hasSim = (lab.sim.order || []).length >= 2;
  const hasHx = harnessTwins(data).twins.length > 0;
  const hasDrivers = (lab.aa_axes || []).some((ax) =>
    data.systems.some((s) => {
      const v = s[ax.id as keyof LeagueSystem];
      return typeof v === "number";
    }),
  );
  return LG_CHARTS.filter(
    (c) =>
      (c.id !== "tools" || hasTools) &&
      (c.id !== "rating" || hasRatings) &&
      (c.id !== "sim" || hasSim) &&
      (c.id !== "hx" || hasHx) &&
      (c.id !== "drivers" || hasDrivers),
  );
}
