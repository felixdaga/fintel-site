import type {
  LeagueLab,
  LeaguePublic,
  LeagueScatterChart,
  LeagueSystem,
} from "./types";


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

export const BOOK_PALETTE: Record<string, string> = {
  "sw_0.0": "#6f93cf",
  naive_tilt: "#c77dbb",
  mvo: "#e8924a",
};

export const OVERLAY_BOOK = "sw_0.0";
export const PW_COLOR = "#6b7a8e";
export const MW_COLOR = "#c4a574";

const HIDDEN_BOOKS = new Set(["ew_0.0", "ew_0.3", "sw_0.3"]);

export function pageBooks<T extends { id: string }>(books: T[]): T[] {
  return books.filter((b) => !HIDDEN_BOOKS.has(b.id));
}

export function isPick(s: { sparse_ratings?: boolean; strategy?: string | null }): boolean {
  return Boolean(s.sparse_ratings) || (s.strategy || "").toLowerCase().includes("stockpick");
}

export function tiltScale(values: (number | null)[]): { lo: number; hi: number } {
  const abs = values.filter((v): v is number => v != null && Number.isFinite(v)).map((v) => Math.abs(v));
  const peak = abs.length ? Math.max(...abs) : 0;
  const x = Math.max(peak * 1.08, 1e-6);
  const exp = 10 ** Math.floor(Math.log10(x));
  const n = x / exp;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  const a = nice * exp;
  return { lo: -a, hi: a };
}

function universeSeries(
  lab: LeagueLab,
  kind: "ret" | "dd",
  fallback?: Record<string, { date: string; nav: number }[]>,
): LineSeries[] {
  const series: LineSeries[] = [];
  const pw = lab.pw_nav.length ? lab.pw_nav : fallback?.pw;
  if (pw?.length) {
    series.push({
      id: "pw",
      label: lab.book_labels.pw || "DJIA PW",
      color: PW_COLOR,
      dashed: true,
      pts: kind === "ret" ? cumRet(pw) : underwater(pw),
    });
  }
  const mw = lab.mw_nav?.length ? lab.mw_nav : fallback?.mw;
  if (mw?.length) {
    series.push({
      id: "mw",
      label: lab.book_labels.mw || "DJIA MW",
      color: MW_COLOR,
      dashed: true,
      pts: kind === "ret" ? cumRet(mw) : underwater(mw),
    });
  }
  return series;
}

export function holdingSeries(
  lab: LeagueLab,
  runId: string,
  kind: "ret" | "dd",
  opts?: { agentColor?: string; highlightBook?: string },
): LineSeries[] {
  const run = lab.runs[runId];
  if (!run) return [];
  const series: LineSeries[] = pageBooks(lab.books)
    .map((b) => {
      const nav = run.nav[b.id];
      const highlight = opts?.highlightBook && b.id === opts.highlightBook;
      return {
        id: b.id,
        label: b.label,
        color: highlight && opts.agentColor ? opts.agentColor : BOOK_PALETTE[b.id] || "#6f93cf",
        pts: kind === "ret" ? cumRet(nav) : underwater(nav),
      };
    })
    .filter((s) => s.pts.length);
  series.push(...universeSeries(lab, kind, run.nav));
  return series;
}

export function overlaySeries(data: LeaguePublic): LineSeries[] {
  const lab = data.lab;
  if (!lab) return [];
  const series: LineSeries[] = data.table_ids
    .map((id) => {
      const s = data.systems.find((row) => row.id === id);
      return {
        id,
        label: s?.short || s?.system || id,
        color: s?.color || "#6f93cf",
        pts: cumRet(lab.runs[id]?.nav?.[OVERLAY_BOOK]),
      };
    })
    .filter((row) => row.pts.length);
  series.push(...universeSeries(lab, "ret"));
  return series;
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

export function harnessTwins(data: LeaguePublic) {
  const preferred = ["fintel_GFA", "OpenClaw"];
  const byModel: Record<string, Record<string, string>> = {};
  for (const s of data.systems) {
    if ((s.strategy || "").toLowerCase().includes("stockpick")) continue;
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
      const y = yValue(data, s.id, ySpec.id, data.book || "mvo");
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
