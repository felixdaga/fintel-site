export type LeaderboardRow = {
  id: string;
  agent: string;
  harness: string;
  iterations: string | null;
  model: string;
  chart_label: string;
  runs: number;
  residual_ic: number;
  residual_nwt: number;
  per_run_mean_ic_min: number | null;
  per_run_mean_ic_max: number | null;
  per_run_mean_ic_pm: number | null;
  agent_ic: number;
  factor_neutralization_delta: number;
  cost_usd: number;
  nav_residual: number[];
};

export type LeaderboardData = {
  meta: {
    source: string;
    ic_method: string;
    horizon: number;
    k: number;
    universe: string;
    cadence: string;
    window: string;
    benchmark: string;
    holding: string;
    notes: Record<string, string>;
  };
  dates: string[];
  benchmark_nav: number[];
  rows: LeaderboardRow[];
};
