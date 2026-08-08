export type StrategyDecision = {
  symbol: string;
  score: number;
  conviction: number | null;
  time_horizon: string | null;
  rationale: string;
  key_factors: string[];
  in_book: boolean;
};

export type StrategyHolding = {
  symbol: string;
  weight: number;
  score: number;
};

export type RebalanceHolding = {
  symbol: string;
  target_weight: number;
  current_weight: number;
  target_shares: number;
  current_shares: number;
  trade_shares: number;
  price: number;
  target_notional: number;
  action: "buy" | "sell" | "hold";
};

export type RebalanceReport = {
  decision_date: string;
  as_of: string;
  capital: number;
  n_holdings: number;
  holdings: RebalanceHolding[];
  total_turnover: number;
  n_buys: number;
  n_sells: number;
};

export type StrategyWeek = {
  date: string;
  holdings: StrategyHolding[];
  decisions: StrategyDecision[];
};

export type StrategyMeta = {
  strategy: string;
  description: string;
  agent: string;
  universe: string;
  cadence: string;
  benchmark: string;
  cost_bps: number;
  threshold: number;
  start: string;
  as_of: string;
  capital: number;
};

export type StrategyData = {
  meta: StrategyMeta;
  nav: {
    dates: string[];
    f1_net: number[];
    f1_gross: number[];
    benchmark: number[];
  };
  weeks: StrategyWeek[];
  latest_rebalance: RebalanceReport;
};
