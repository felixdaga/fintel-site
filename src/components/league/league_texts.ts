/**
 * /league copy — edit this file.
 * Wrap a phrase in *stars* to highlight it orange.
 * `{tokens}` are filled from src/data/league.json when the page renders.
 * Setup is `methodology`. Claims are `findings`.
 * Rebuild numbers with: `python -m f1_deploy.eval_view`
 */

export const LEAGUE_COPY = {
  meta: {
    title: "Evals",
    description:
      "{n} agentic systems scored every Dow name each quarter. Same stocks, same data — model and harness on the same field.",
  },

  hero: {
    kicker: "Beyond AI benchmarks",
    title: "Our proprietary evals",
    titleAccent: "evals",
    lede:
      "At fintel, we quantify and evaluate financial AI agents as systematic signals, surfacing *unparalleled insights* into their performance and characteristics.",
  },

  findings: {
    title: "fintel commentary",
    titleAccent: "commentary",
    lede:
      "*Actionable insights* from our evaluators.",
    groups: [
      {
        items: [
          {
            id: "skill",
            kicker: "01",
            wide: true,
            claim: "Muse 1.3 wins on total return, GLM 5.3 on idiosyncratic insight. The generic fundamental harness outperformed OpenClaw across metrics.",
            body:
              "Every system in this window produced positive excess return versus the price-weighted index. {leaders} led on total return. Rank IC is positive for all {n_lower} systems, but only {t_clear_n} clear a conventional IC t > 3 bar: {t_clear}. After FF6 neutralization, only {residual_winner} remains above that threshold (residual t={residual_t}) — consistent with idiosyncratic insight beyond common-factor loadings. Shallowest drawdown: {shallow} ({shallow_dd}).",
            rule: "Choosing the right model depends on your investment objective.",
          },
          {
            id: "system",
            kicker: "02",
            wide: true,
            claim:
              "Model order holds across harnesses on return and IC.",
            body:
              "On headline metrics the ranking is preserved across both harnesses: total return *{total_rank}*, IC *{ic_rank}*. On more granular dimensions the harness is the larger driver — especially sector bias and residual IC.",
            rule:
              "Don’t evaluate the model in isolation. Harness and data also shape investment performance and characteristics.",
          },
          {
            id: "model",
            kicker: "03",
            claim: "Intelligence and accuracy both matter.",
            body:
              "Stronger models generally produce better results in this panel, and accuracy is a separate trait that also matters. Those two rankings are not the same list. Absolute return went to {abs_return_model}; average IC went to {ic_model}.",
            rule: "Balance the traits. Don’t blindly pick the smartest.",
          },
          {
            id: "harness",
            kicker: "04",
            claim: "The structured harness outperformed the more open agent.",
            body:
              "Our generic fundamental harness — fintel_GFA, structured LangGraph — outperformed OpenClaw’s tool-calling ReAct harness on the same models. OpenClaw can access more data and take more reasoning steps; it also adds noise and a {cost_ratio} cost multiple.",
            rule: "Streamline the harness where possible.",
          },
        ],
      },
    ],
  },

  methodology: {
    summary: "methodology",
    teaser:
      "Universe, harnesses, books, and how each scoreboard metric is computed.",
    groups: [
      {
        title: "Setup",
        sections: [
          {
            id: "universe",
            title: "What we score",
            wide: true,
            body:
              "{n} agentic systems — each a *model × harness* — rate the 30 DJIA constituents. Same names, same quarterly dates, same point-in-time data. This window is {window}: {n_dates} dates, first trading day of March, June, September, and December. Every system rates every name on every date ({n_cells} cells each).",
          },
          {
            id: "ratings",
            title: "How a name is rated",
            wide: true,
            body:
              "Each name is scored one at a time on a continuous scale from −1 to +1: fundamental attractiveness and the trajectory of the business — not a trade, and not a position size. Evidence is point-in-time; nothing published after the decision date is used. Both harnesses see the same basic fundamental surface: prices, fundamentals, valuation, trailing returns, macro, short-window news, and web context. The agent submits a rating; it does not size the book.",
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
              "The same model run on both harnesses is a twin. That is how we hold the model fixed and attribute remaining differences in the book — sector tilt, residual skill, cost — to the harness.",
          },
        ],
      },
      {
        title: "Books",
        sections: [
          {
            id: "books",
            title: "How ratings become a book",
            wide: true,
            body:
              "Holdings follow a fixed rule from those scores — no second agent. Names with score > 0 go long; weight is proportional to score (score-weighted long). Several other books are formed from the same ratings (equal-weight long, naive tilt, MVO) for analytics. The scoreboard uses *{book_label}*, 5 bp trading cost, compared with a price-weighted DJIA on the same dates.",
          },
        ],
      },
      {
        title: "Metrics",
        sections: [
          {
            id: "ann_ret",
            title: "Ann. return",
            body:
              "Compound growth of the scoreboard book, annualized over the window: (1 + total)^(1 / years) − 1. This is a book result, not a rating-quality result.",
          },
          {
            id: "ic",
            title: "Spearman IC",
            body:
              "Each decision date, rank-correlate the 30 scores with next-quarter returns (h=1). The scoreboard reports the mean of those correlations ({n_ic} periods). It asks whether higher-rated names subsequently returned more.",
          },
          {
            id: "tstat",
            title: "IC t-stat",
            body:
              "One-sample t of mean IC versus 0: (mean IC / sample std) × √n. We treat t > 3 as a conventional bar showing that ranking skill is distinguishable from noise over this window.",
          },
          {
            id: "resid_ic",
            title: "Residual IC",
            body:
              "Each date, residualize the scores on point-in-time FF6 loadings (Mkt, SMB, HML, RMW, CMA, Mom): s = a + Bγ + u. Residual IC is Spearman corr(u, next-period excess return) — skill left after stripping common-factor bets.",
          },
          {
            id: "resid_t",
            title: "Residual t",
            body:
              "The same t-stat construction as IC t, applied to the residual-IC series. Residual t > 3 is the bar we use for idiosyncratic skill after neutralization.",
          },
          {
            id: "sharpe",
            title: "Sharpe",
            body:
              "Mean period return of the scoreboard book divided by period volatility, then annualized (× √ppy). Does not subtract the DJIA.",
          },
          {
            id: "ir",
            title: "Information ratio",
            body:
              "Mean active return versus the price-weighted DJIA, divided by tracking error, then annualized. Measures the book versus the index.",
          },
          {
            id: "dd",
            title: "Max drawdown",
            body:
              "Peak-to-trough decline of net NAV on the scoreboard book. Shallower is better.",
          },
          {
            id: "cost",
            title: "Cost",
            body:
              "USD charged for the {n_cells} rating cells — model inference, not portfolio trading cost. OpenClaw is typically a {cost_ratio} multiple of GFA on the same model.",
          },
          {
            id: "periods",
            title: "Periods",
            body:
              "Number of h=1 IC observations ({n_ic} in this window). One less than the {n_dates} decision dates, because the last date has no next-quarter return yet.",
          },
        ],
      },
    ],
  },

  charts: {
    total: {
      title: "total return vs DJIA",
      caption: "{book_label} · dashed = DJIA PW · {window}",
    },
    ic_t: {
      title: "IC t-stat",
      caption: "h=1 Spearman · dashed = t=3 · Muse GFA is {muse_gfa_t}, just under",
    },
    residual_t: {
      title: "residual t after FF6",
      caption: "Only {residual_winner} stays above t=3 once factors are removed",
    },
    max_dd: {
      title: "max drawdown (shallower is better)",
      caption: "{book_label} · {shallow} {shallow_dd} · not the MVO book",
    },
    axis: {
      title: "which axis moves the book",
      hint: "Mean off-diagonal similarity. Opt is fintel_GFA. Driven by whichever class is higher.",
    },
    twin_similarity: {
      title: "same model, different harness",
      caption: "Mean pairwise similarity · 0–1",
      hint: "{twin_hint}",
    },
    omni_ic: {
      title: "Omniscience Index vs Spearman IC",
      caption: "Each point is one agentic system · color = harness · Y = h=1 Spearman IC",
    },
    acc_ic: {
      title: "Omniscience Accuracy vs Spearman IC",
      caption:
        "Accuracy is the positive AA score. Hallucination is not exactly 1 − accuracy (see DeepSeek).",
    },
    twin_cost: {
      title: "job cost — same model, both harnesses",
      caption: "USD · {n_cells} cells each · OpenClaw is {cost_ratio} GFA",
    },
  },

  table: {
    title: "Scoreboard",
    caption:
      "Quantifying the *investment performance* of agentic systems.",
  },

  board: {
    title: "Analytics",
    caption:
      "Identifying *trends* and *performance drivers*.",
  },

  tilts: {
    title: "active factor tilt vs DJIA",
    caption:
      "{book_label} · dashed ring = 0 · shared axis. Outer is +A, center is −A, shared across agents.",
  },
} as const;
