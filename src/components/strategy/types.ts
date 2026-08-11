export type StrategyDecision = {
  symbol: string;
  score: number;
  conviction: number | null;
  rationale: string;
  key_factors: string[];
  in_book: boolean;
};

export type StrategyHolding = {
  symbol: string;
};

export type StrategyWeek = {
  date: string;
  holdings: StrategyHolding[];
  decisions: StrategyDecision[];
};

export type StrategyData = {
  nav: {
    dates: string[];
    f1_gross: number[];
    benchmark: number[];
  };
  weeks: StrategyWeek[];
};
