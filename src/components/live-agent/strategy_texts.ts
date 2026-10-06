/**
 * /live-agent copy — edit this file.
 */

export const STRATEGY_COPY = {
  meta: {
    title: "Live agent",
    description:
      "A live demonstration of financial AI evaluations, and our skin in the game.",
  },

  hero: {
    title: "Meet the fintel-optimized agent",
    titleAccent: "fintel-optimized",
    ledes: [
      "We've built an *in-house agent* through financial AI evaluations. Deployed since April this year, it *systematically covers the Dow Jones universe* to generate active investment calls. *No human in the loop*.",
      "This live strategy is a demonstration of what evaluations unlock, and our *skin in the game*.",
    ],
    disclaimer: "Past performance is not indicative of future results.",
  },

  chart: {
    title: "Gross cumulative return since deployment",
    titleShort: "Gross return since deployment",
    aria: "In-house agent cumulative return, in percent, versus price-weighted and market-cap-weighted Dow Jones",
    agent: "In-house agent (gross)",
    agentShort: "Agent",
    benchmark: "Dow Jones (price-weighted)",
    benchmarkShort: "Price-weighted",
    benchmarkMcap: "Dow Jones (market-cap-weighted)",
    benchmarkMcapShort: "Market-cap-weighted",
    navBubble: {
      label: "NAV (USD)",
    },
    // Same backtest as the investor deck's skin-in-the-game slide.
    eval: {
      label: "Eval",
      window: "Sep 2022–Mar 2026",
      ann: 0.200723,
      sharpe: 1.896246,
      ir: 1.083443,
    },
    liveLabel: "Live",
    metrics: {
      ann: "Ann. return",
      sharpe: "Sharpe",
      ir: "IR",
    },
  },

  alpha: {
    title: "Alpha vs price-weighted Dow Jones",
    titleShort: "Alpha vs price-weighted",
    aria: "Cumulative alpha versus the price-weighted Dow Jones, in basis points",
    label: "Alpha (bps)",
    short: "Alpha",
  },

  process: {
    title: "Evaluated and optimized for performance",
    titleAccent: "performance",
    lede: "Through fintel, we evaluated at scale across the agentic components — model, harness, data, prompt — on the investment KPIs we care about. A model is only chosen because it works best for the specific investment strategy and harness.",
    charts: {
      model: {
        title: "Choosing the model",
        eyebrow: "Agent eval: Backtest performance",
      },
      harness: {
        title: "Customizing the harness",
        eyebrow: "Agent eval: Backtest performance",
      },
      additivity: {
        title: "Evaluating additivity of a dataset or prompt",
        eyebrow: "Agent eval: Drawdowns",
      },
      cadence: {
        title: "Finding the right rebalancing cadence",
        eyebrow: "Agent eval: Trading costs",
      },
    },
  },

  controls: {
    title: "Evaluated and controlled for AI-specific risks",
    titleAccent: "risks",
    lede: "When AI is generating alpha, *AI-specific risks = investment risks*. Through fintel, we evaluated agent stochasticity and hallucinations to impose the right controls.",
    charts: {
      stochastic: {
        title: "Same agent, same date, same ticker (JPM) — different scores",
        eyebrow: "Agent eval: Stochasticity across identical repeats",
      },
      systematic: {
        title: "Systematic vs unconstrained trading",
        eyebrow: "Agent eval: Backtest performance",
      },
    },
  },

  live: {
    title: "Post-deployment outputs and evals",
    titleAccent: ["evals","outputs"],
    lede: "fintel houses our pre- and post-deployment agents under the same roof so we can continuously evaluate and fine-tune our agents. Raw outputs and evals are showcased below.",
    postsKicker: "Evals & commentary",
    howToRead:
      "Each row is the in-house agent's score and rationale for a DJIA constituent on the decision date. Tap any row to expand the rationale and key factors.",
  },
} as const;
