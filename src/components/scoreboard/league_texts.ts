/**
 * All scoreboard copy — edit this file.
 * Wrap a phrase in *stars* to highlight it orange.
 * `{tokens}` are filled from src/data/league.json when the page renders.
 * Structural ids (which book a strategy uses) live in `league_keys.ts`.
 */

const TESTS = {
  ann_ir: {
    title: "Information ratio",
    label: "IR",
    body:
      "Mean active return versus the price-weighted DJIA, divided by tracking error, then annualized. Measures the assumed holding book versus the price-weighted index.",
  },
  total: {
    title: "Total return",
    label: "total ret",
    body: "Compound growth of the scoreboard book over the window, net of 5 bp trading cost.",
  },
  ann_ret: {
    title: "Ann. return",
    label: "ann ret",
    body:
      "Compound growth of the scoreboard book, annualized over the window: (1 + total)^(1 / years) − 1. This is a book result, not a rating-quality result.",
  },
  ann_sharpe: {
    title: "Sharpe",
    label: "sharpe",
    body:
      "Mean period return of the scoreboard book divided by period volatility, then annualized (× √ppy). Does not subtract the DJIA.",
  },
  ann_vol: {
    title: "Volatility",
    label: "vol",
    body: "Annualized volatility of the scoreboard book’s period returns.",
  },
  max_dd: {
    title: "Max drawdown",
    label: "max dd",
    body: "Peak-to-trough decline of net NAV on the scoreboard book. Shallower is better.",
  },
  mean_ic: {
    title: "Spearman IC",
    label: "IC",
    body:
      "Each decision date, rank-correlate the 30 scores with next-quarter returns (h=1). The scoreboard reports the mean of those correlations ({n_ic} periods). It asks whether higher-rated names subsequently returned more. Empty for stock-pick agents that do not rate the full universe.",
  },
  t_stat: {
    title: "IC t-stat",
    label: "IC t",
    body:
      "One-sample t of mean IC versus 0: (mean IC / sample std) × √n. We treat t > 3 as a conventional bar showing that ranking skill is distinguishable from noise over this window.",
  },
  residual_ic: {
    title: "Residual IC",
    label: "resid IC",
    body:
      "Each date, residualize the scores on point-in-time FF6 loadings (Mkt, SMB, HML, RMW, CMA, Mom): s = a + Bγ + u. Residual IC is Spearman corr(u, next-period excess return) — skill left after stripping common-factor bets. Empty for stock-pick agents.",
  },
  residual_t: {
    title: "Residual t",
    label: "resid t",
    body:
      "The same t-stat construction as IC t, applied to the residual-IC series. Residual t > 3 is the bar we use for idiosyncratic skill after neutralization.",
  },
  ff_r2: {
    title: "FF R²",
    label: "FF R²",
    body: "R² of the FF6 residualization of the score series — how much of the rating is a common-factor bet.",
  },
  cost_usd: {
    title: "Eval cost",
    label: "eval cost",
    body:
      "USD charged for the {n_cells} rating cells — model inference, not portfolio trading cost. OpenClaw is typically a {cost_ratio} multiple of GFA on the same model.",
  },
  n_periods: {
    title: "Periods",
    label: "periods",
    body:
      "Number of h=1 IC observations ({n_ic} in this window). One fewer than the {n_dates} decision dates, because the last date has no next-quarter return yet.",
  },
  n_cells: {
    title: "Cells",
    label: "cells",
    body: "Rating cells in the run grid (dates × names × repeats), from health.json.",
  },
  intelligence_index: {
    title: "AA Intelligence",
    label: "AA IQ",
    body: "Artificial Analysis Intelligence Index for the model (not a book result).",
  },
  omniscience_accuracy: {
    title: "Omniscience accuracy",
    label: "accuracy",
    body: "Artificial Analysis omniscience accuracy — share of knowledge items the model gets right.",
  },
  hallucination_rate: {
    title: "Hallucination rate",
    label: "halluc.",
    body: "Artificial Analysis hallucination rate (Pro). Frontier models tend to score higher here.",
  },
} as const;

const METHOD_METRICS = [
  "ann_ret",
  "mean_ic",
  "t_stat",
  "residual_ic",
  "residual_t",
  "ann_sharpe",
  "ann_ir",
  "max_dd",
  "cost_usd",
  "n_periods",
] as const satisfies readonly (keyof typeof TESTS)[];

const MISSION_TEXT = `You are a portfolio manager. You will be asked, independently for one company at a time, to rate that company's fundamental attractiveness and the trajectory of its business on a continuous scale from -1 to +1.

## What the score combines

Judge three pillars, in this order of importance:

1. **Fundamental health & trajectory** (primary) — earnings path and durability, margins, cash generation, balance-sheet resilience, franchise / competitive position.
2. **Valuation vs opportunity** (co-primary) — mainly vs the company's *own* recent history (is the market paying more or less for the same earnings power?).
3. **Near-term rerating chance** (secondary boost) — a dated, fundamental catalyst that could re-rate the stock over the coming quarter-to-year (guidance, earnings event, product/regulatory clearance, capital-allocation shift, leadership change with a clear strategy implication). This pillar exists because assessment is quarterly: a sound fundamental view should be slightly stronger when a credible re-rating path is in the pack.

Pillar 3 is a *modifier*, not a thesis. It can raise or lower the score within a band once pillars 1–2 are set; it cannot turn a weak or deteriorating business into a high score, and price momentum alone is never a rerating catalyst.

## Score anchors (use the continuous range; these are landmarks)

**Long side**


| Score    | Meaning                                                                                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **+1.0** | Extremely attractive: excellent fundamental health *and* clear positive trajectory, clearly undervalued vs own history (and peers if shown), *and* a credible near-term fundamental catalyst that makes positive re-rating likely. All three pillars aligned; rare. |
| **+0.5** | Strongly attractive: excellent health + trajectory *and* clearly undervalued vs own history. Catalyst helpful but not required. Multi-factor, well-cited.                                                                                                           |
| **+0.2** | Mildly attractive: good / solid fundamentals and trajectory; valuation fair-to-slightly-cheap vs own history (OK, not a screaming bargain). Optional small bump (toward ~+0.3) if a credible near-term catalyst is present without stretching the fundamental case. |
| **0.0**  | Neutral: mixed or fully priced — nothing clearly mis-set in fundamentals or valuation, or pillars cancel.                                                                                                                                                           |


**Short side** (mirror the long side)


| Score    | Meaning                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **−0.2** | Mildly unattractive: soft or deteriorating fundamentals and/or somewhat rich vs own history; no offsetting catalyst.              |
| **−0.5** | Strongly unattractive: poor / worsening health or trajectory *and* expensive vs own history.                                      |
| **−1.0** | Extremely unattractive: bad/worsening fundamentals, clearly expensive, *and* near-term downside catalyst or de-rating risk. Rare. |


In-between values (e.g. +0.35, −0.15) are encouraged when the case sits between anchors. Prefer milder scores when evidence is thin, gapped, or conflicting. Reserve **|score| ≥ 0.5** for multi-factor, well-cited cases; reserve **|score| ≥ 0.8** for near-full alignment of all three pillars.

## How to combine (discipline)

- Start from pillar 1 (fundamentals). If health/trajectory is merely OK, you should rarely exceed ~+0.2 even if valuation looks cheap.
- Use pillar 2 to move within / across bands: cheap vs history can lift a good franchise toward +0.5; rich vs history should cap or flip an otherwise decent story.
- Apply pillar 3 last, as a modest adjuster (think roughly ±0.1 to ±0.2 on the continuous scale), and only when the catalyst is dated and fundamental — not a headline spike or "stock has been going up."
- Cross-lane weight when synthesizing specialist reports: quantitative fundamentals and own-history valuation dominate; qualitative franchise / structural web context supports; recent news/updates and macro/sentiment mainly feed pillar 3 (and risk offsets), they do not replace pillars 1–2.



## Anti-momentum (still binding)

Do not momentum-chase. A rising or falling price is not itself a reason to rate a company attractive or unattractive — price action is at most a check on whether the market has already priced in the fundamentals you see. A good quarter or a headline does not make a bad business attractive, and a bad quarter does not undo a durable franchise. If the only evidence for a view is that the stock has been going up, say so and score down your conviction.

## Output hygiene

The score is a rating, not a trade instruction — do not discuss position sizing, stop losses, or entry/exit timing; that is handled downstream, deterministically, from your rating alone.

Use only the point-in-time evidence you are given through your tools. You will not be told the current date beyond your decision date, and you have no access to information published after it. Cite the specific evidence (a filing, a price level, a news item, a macro reading) behind every material claim in your rationale — do not rely on general knowledge about the company that isn't grounded in what you were actually shown. Quote or omit: do not upgrade vague text into precise figures, and do not treat an incomplete or non-contiguous quarterly history as trailing twelve months.

When you have formed a view, submit it via the tool made available to you for that purpose.
`;

const MISSION_DATA_ACCESS = {
  title: "Data they could access",
  lede: "Same point-in-time surface for both harnesses. Nothing published after the decision date.",
  items: [
    { label: "Prices", detail: "Massive daily prices, 365-day lookback." },
    { label: "Fundamentals", detail: "Massive fundamentals, 540-day lookback." },
    { label: "Valuation ratios", detail: "Own-history and peer multiples, 365-day window." },
    {
      label: "Trailing returns",
      detail: "Simple returns vs DJIA at 1d / 2w / 1m / 3m / 6m / 12m, plus path, vol, and beta.",
    },
    {
      label: "Macro",
      detail: "FRED regime pack — rates, curve, vol, credit, FX, oil, breakeven, labour; 90-day lookback.",
    },
    { label: "News", detail: "Recent articles only, 14-day window." },
    {
      label: "Web search",
      detail:
        "Structural queries (business model, competition, risk, strategy) over 30 days, plus an updates query over 7 days. Age-clamped.",
    },
  ],
} as const;

export const LEAGUE_COPY = {
  meta: {
    title: "Scoreboard",
    description:
      "Investment performance and characteristics of financial AI agents — how they should be evaluated.",
  },

  hero: {
    kicker: "Beyond AI benchmarks",
    title: "Scoreboard",
    titleAccent: "Scoreboard",
    lede:
      "By combining systematic research with AI eval science, we generate *unparalleled insights* into the *investment performance* and *characteristics* of financial AI agents.",
  },

  findings: {
    title: "fintel commentary",
    titleAccent: "commentary",
    lede: "*Actionable insights* from our evaluators.",
    groups: [
      {
        items: [
          {
            id: "skill",
            kicker: "01",
            claim: "{leaders} leading on total return.",
            body:
              "{leaders} led on total return. Rank IC (how correlated the agent scores are with next-period returns) is positive for all {n_lower} agents, but only {t_clear_n} clear a significant threshold: {t_clear}. After factor neutralization, only *{residual_winner}* remains (residual t={residual_t}) — suggesting idiosyncratic insight beyond common-factor loadings. *{shallow}* has the lowest drawdown at {shallow_dd}.",
            rule: "Choosing the right model depends on your investment objective.",
          },
          {
            id: "system",
            kicker: "02",
            claim: "Harness affects model performance and characteristics.",
            body:
              "On headline metrics the ranking is preserved across both harnesses: total return *{total_rank}*, IC *{ic_rank}*. On more granular dimensions the harness is the larger driver — especially sector bias and residual IC.",
            rule:
              "Don’t evaluate the model in isolation. Harness and data also shape investment performance and characteristics.",
          },
          {
            id: "model",
            kicker: "03",
            claim: "Model capability is just one driver of performance.",
            body:
              "Model capability (intelligence) is just one driver of performance. It is also heavily driven by reliability and hallucination (Omniscience), and by the harness of choice.",
            rule:
              "Picking the right model often means balancing intelligence and reliability (frontier models tend to have higher hallucination rates). Suitability to the harness should also be assessed.",
          },
          {
            id: "strategy",
            kicker: "04",
            claim:
              "Agents are better deployed to systematically rate the universe than to pick names out of it.",
            body:
              "Holding the model and the OpenClaw harness fixed, *systematic stockrate* beats *fundamental stockpick* on information ratio, volatility, and drawdown for both GLM 5.3 and Muse 1.3. Picking a handful stocks concentrates the book and exposes hallucinations and errors.",
            rule:
              "Adopt implementations that could control for AI-specific risks.",
          },
        ],
      },
    ],
  },

  howToRead: {
    kicker: "How to interpret results",
    lede: "Investment performance is strategy-dependent and multi-faceted:",
    strategyTitle: "Strategy and books",
  },

  strategies: {
    "systematic stockrate": {
      lede:
        "Each agent is independently deployed to rate a ticker on each decision date. The ratings are then aggregated into a cross-sectional signal that we transform into holdings in the following ways:",
    },
    "fundamental stockpick": {
      lede:
        "Each agent is responsible for identifying the most attractive tickers across the universe. They output holdings and their respective ratings.",
    },
  },

  books: {
    mvo: {
      label: "MVO",
      hint: "Mean-variance-optimized portfolio based on the agent rating and stock covariance.",
    },
    naive_tilt: {
      label: "naive tilt",
      hint: "Over/underweight the benchmark based on the agent rating, constrained to zero net exposure.",
    },
    "sw_0.0": {
      label: "SW Long >0",
      hint: "Long every ticker scored above zero; higher score, larger weight.",
    },
  },

  tests: TESTS,

  charts: {
    cum_ret: {
      title: "cumulative return vs universe",
      hint: "This run’s holding books versus the PIT DJIA, price-weighted and cap-weighted.",
    },
    overlay: {
      title: "Cumulative return",
      hint:
        "Cumulative return of a hypothetical portfolio that proportionately holds every name scored above 0 (attractive) by the respective agent. The universe is the DJIA, shown price-weighted and market-cap-weighted.",
    },
    underwater: { title: "underwater" },
    ic: { title: "Spearman IC · h=1" },
    residual: { title: "residual IC · FF6" },
    sto_return: {
      title: "repeat return vs ensemble",
      hint: "Each repeat is SW Long >0. The dashed line is the ensemble book.",
    },
    hold_corr: {
      title: "holding membership corr",
      hint: "Pearson correlation of SW Long >0 membership (0/1) across repeats, averaged over dates.",
    },
    factor: {
      title: "active factor exposure",
      hint: "Mean holdings-weighted PIT FF6 beta minus DJIA PW. Dashed ring is zero.",
    },
    sector: {
      title: "active sector exposure",
      hint: "Mean GICS weight minus DJIA PW. Dashed ring is zero.",
    },
    rating: { title: "company rating" },
  },

  methodology: {
    summary: "methodology",
    teaser: "Systematic backtesting for AI agents.",
    groups: [
      {
        sections: [
          {
            id: "ratings",
            title: "Mission",
            wide: true,
            body: "Both harnesses receive this rubric. The score is a rating, not a trade.",
            scroll: MISSION_TEXT,
            dataAccess: MISSION_DATA_ACCESS,
          },
        ],
      },
      {
        title: "Harnesses",
        sections: [
          {
            id: "gfa",
            title: "fintel_GFA",
            body:
              "A structured specialist pipeline. A quantitative specialist reads a pre-built pack (prices, fundamentals, valuation ratios, trailing returns, macro). A qualitative specialist reads news and web context. The two run in parallel. A portfolio-manager call then synthesizes one −1 to +1 score and must submit through a fixed schema. The research path is the same every cell — the agent does not choose tools or extra steps.",
          },
          {
            id: "openclaw",
            title: "OpenClaw",
            body:
              "A tool-calling ReAct harness. The same point-in-time tools are available, but the agent decides what to pull and how many reasoning steps to take before submitting a score. That can surface more evidence; it also adds tokens, retries, and a {cost_ratio} cost multiple versus GFA on the same models.",
          },
          {
            id: "twins",
            title: "Twins",
            wide: true,
            body:
              "A twin is the same model run on both harnesses. That is how we hold the model fixed and attribute remaining differences in the book — sector tilt, residual skill, cost — to the harness.",
          },
        ],
      },
      {
        title: "Metrics",
        sections: METHOD_METRICS.map((id) => ({
          id,
          title: TESTS[id].title,
          body: TESTS[id].body,
        })),
      },
    ],
  },

  mission: {
    text: MISSION_TEXT,
    dataAccess: MISSION_DATA_ACCESS,
  },

  subscribe: {
    title: "Subscribe for new eval insights",
  },

  table: {
    caption: "Click a row for the *resume*",
  },
};
