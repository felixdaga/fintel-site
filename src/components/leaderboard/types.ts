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
  factor_neutralization_delta: number;
  cost_usd: number;
  nav_residual: number[];
};

export type LeaderboardData = {
  dates: string[];
  benchmark_nav: number[];
  rows: LeaderboardRow[];
};
