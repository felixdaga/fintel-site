/**
 * /strategy copy — edit this file.
 */

export const STRATEGY_COPY = {
  meta: {
    title: "Live strategy",
    description:
      "fintel's deployed in-house agent: a live demonstration of what our eval pipeline can unlock.",
  },

  hero: {
    kicker: "live strategy",
    title: "Meet the fintel-optimized agent",
    titleAccent: "fintel-optimized",
    ledes: [
      "We've built an *in-house agent* from the ground up with fintel evals. Deployed since April this year, it systematically covers Dow Jones to generate active investment calls. *No human-in-the-loop, no algos*.",
      "This is a demonstration that our eval pipeline works, that we have *skin in the game*; Our evals aim to capture and improve *real performance*.",
    ],
    disclaimer: "Past performance is not indicative of future results.",
  },

  chart: {
    title: "Gross cumulative return since deployment",
    titleShort: "Gross return since deployment",
    aria: "In-house agent cumulative return versus DJIA and relative alpha",
    agent: "In-house agent (gross)",
    agentShort: "Agent",
    benchmark: "DJIA",
    alpha: "Alpha (agent ÷ DJIA)",
    alphaShort: "Alpha",
    navBubble: {
      label: "NAV (USD)",
    },
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
      "Each row is the in-house agent's score and rationale for a DJIA constituent on decision date. Tap any row to expand the rationale and key factors.",
  },
} as const;
