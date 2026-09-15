export type LeagueBar = {
  id: string;
  label: string;
  value: number | null;
  color: string;
};

export type LeagueBarChart = {
  id: string;
  title: string;
  caption: string;
  format: "pct" | "number" | "usd" | "abs_pct";
  mark?: { y: number; label: string } | null;
  y_min?: number | null;
  bars: LeagueBar[];
};

export type LeagueGroupedSeries = {
  id: string;
  label: string;
  color: string;
  values: (number | null)[];
};

export type LeagueGroupedChart = {
  id: string;
  title: string;
  caption: string;
  hint?: string;
  format: "pct" | "number" | "usd" | "abs_pct";
  y_min?: number | null;
  y_max?: number | null;
  categories: string[];
  series: LeagueGroupedSeries[];
};

export type LeagueScatterPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  harness: string;
};

export type LeagueScatterFit = {
  slope: number;
  intercept: number;
  r2: number;
  n: number;
};

export type LeagueScatterChart = {
  id: string;
  title: string;
  caption: string;
  hint: string;
  x_format: "number" | "pct";
  y_format: "number" | "pct";
  x_name: string;
  y_name: string;
  points: LeagueScatterPoint[];
  fit: LeagueScatterFit | null;
};

export type LeagueRadarPack = {
  title: string;
  caption: string;
  lo: number;
  hi: number;
  format: "number" | "pct";
  axes: { id: string; label: string }[];
  series: {
    id: string;
    label: string;
    color: string;
    values: (number | null)[];
  }[];
};

export type LeagueAxisRow = {
  id: string;
  label: string;
  same_model: number | null;
  n_same_model: number;
  same_harness: number | null;
  n_same_harness: number;
  neither: number | null;
  n_neither: number;
  driven: string | null;
};

export type LeagueSystem = {
  id: string;
  system: string;
  harness: string;
  analysis_harness: string;
  model: string;
  data: string;
  short: string;
  color: string;
  total: number | null;
  ann_ret: number | null;
  ann_sharpe: number | null;
  ann_ir: number | null;
  ann_vol: number | null;
  max_dd: number | null;
  mean_ic: number | null;
  t_stat: number | null;
  icir_ann: number | null;
  n_periods: number | null;
  residual_ic: number | null;
  residual_t: number | null;
  residual_icir_ann: number | null;
  ff_r2: number | null;
  cost_usd: number | null;
  n_cells: number | null;
  intelligence_index: number | null;
  finance_index?: number | null;
  omniscience_index: number | null;
  omniscience_accuracy: number | null;
  non_hallucination_rate?: number | null;
  hallucination_rate: number | null;
  n_retries?: number | null;
  n_calls?: number | null;
  summary?: { side: string; aspect: string; pattern: string; evidence: string }[];
};

export type LeaguePt = { date: string; [k: string]: string | number };

export type LeagueLabRun = {
  nav: Record<string, { date: string; nav: number }[]>;
  ic: Record<string, { date: string; ic: number }[]>;
  residual_ic: { date: string; ic: number }[];
  metrics: Record<
    string,
    {
      total: number | null;
      ann_ret: number | null;
      ann_sharpe: number | null;
      ann_ir: number | null;
      ann_vol: number | null;
      max_dd: number | null;
      label: string;
    }
  >;
};

export type LeagueLab = {
  books: { id: string; label: string }[];
  default_book: string;
  horizons: string[];
  book_labels: Record<string, string>;
  pw_nav: { date: string; nav: number }[];
  residual_note: string;
  runs: Record<string, LeagueLabRun>;
  exposure: {
    factors: string[];
    factor_labels: Record<string, string>;
    sectors: string[];
    sector_codes: Record<string, string>;
    runs: Record<
      string,
      Record<
        string,
        {
          factor: Record<string, { date: string; y: number }[]>;
          sector: Record<string, { date: string; y: number }[]>;
        }
      >
    >;
  };
  ratings: {
    universe: string[];
    runs: Record<string, Record<string, { date: string; score: number }[]>>;
  };
  tools: {
    kinds: string[];
    runs: Record<string, { by_tool: Record<string, number>; n_calls: number }>;
  };
  sim: {
    n_dates: number;
    metrics: { id: string; label: string; hint?: string }[];
    order: string[];
    systems: Record<string, { harness: string; model: string; label: string }>;
    matrices: Record<string, (number | null)[][]>;
    axis: LeagueAxisRow[];
    twins: {
      model: string;
      n_pairs?: number;
      xs?: number | null;
      resid?: number | null;
      factor?: number | null;
      sector?: number | null;
      pairs: { a_harness?: string; b_harness?: string }[];
    }[];
  };
  aa_axes: { id: string; label: string; pct: boolean }[];
};

export type LeaguePublic = {
  schema_version: number;
  generated_at: string;
  book: string;
  book_label: string;
  window: {
    start: string;
    end: string;
    label: string;
    n_dates: number;
    n_ic: number;
    n_cells: number | null;
  };
  pw: {
    total: number | null;
    ann_ret: number | null;
    sharpe: number | null;
    max_dd: number | null;
  };
  harness_colors: Record<string, string>;
  aa_attribution: string;
  systems: LeagueSystem[];
  table_ids: string[];
  copy: Record<string, string>;
  axis: LeagueAxisRow[];
  charts: {
    total: LeagueBarChart;
    ic_t: LeagueBarChart;
    residual_t: LeagueBarChart;
    max_dd: LeagueBarChart;
    twin_cost: LeagueGroupedChart;
    twin_similarity: LeagueGroupedChart;
    omni_ic: LeagueScatterChart;
    acc_ic: LeagueScatterChart;
  };
  tilts: {
    factor: LeagueRadarPack;
  };
  lab?: LeagueLab;
};
