/**
 * Homepage copy — edit this file.
 * Layout/chart IDs stay in whyEvalData.ts.
 */

export const COPY = {
  hero: {
    line1: "Evaluation platform for",
    line2: "financial agents",
    lede: "Own your AI eval pipeline",
    scrollAria: "Scroll to why you should eval",
  },

  whyEval: {
    kicker: "why eval",
    title: "Optimize your AI agents for alpha generation",
    titleAccent: "alpha",
    lede: "The same portfolio manager agent, before and after evals.",
    chartTitle: "Cumulative returns",
    chartAria: "Agent backtest before and after eval",
    preLabel: "pre-eval agent",
    postLabel: "post-eval agent",
  },

  howItWorks: {
    kicker: "how it works",
    title: "Evaluating your AI agents",
    titleAccent: "Evaluating",
    lede: "fintel provides the scalable environment to backtest AI agents on any given investment strategy.",
    steps: [
      {
        n: "01",
        title: "Create a strategy pack",
        body: "How your agent should think and trade. Which performance metrics you care about.",
      },
      {
        n: "02",
        title: "Hook your agent",
        body: "Enforce point-in-time controls for what your agents could access.",
      },
      {
        n: "03",
        title: "Run evals",
        body: "Blast through iterations to identify the optimal strategy + agent.",
      },
    ],
  },

  novelty: {
    kicker: "why it's different",
    title: "Financial agent eval is different",
    titleAccent: "different",
    lede: "Typical agentic evals score sandbox tasks. fintel backtests AI agents on investment strategies.",
    typicalLabel: "Typical agentic evals",
    fintelLabel: "fintel.",
    rows: [
      {
        label: "unit",
        terminal: "Agentic reasoning and coding tasks",
        fintel: "Agentic decision-making and trading",
      },
      {
        label: "environment",
        terminal: "Container - filesystem is the world",
        fintel: "Container + Point-in-time (PIT) controls",
      },
      {
        label: "scoring",
        terminal: "Task completion rate at runtime",
        fintel: "Investment performance metrics computed post-run",
      },
      {
        label: "coupling",
        terminal: "Tasks scored independently",
        fintel: "Decisions are coupled across the investment universe and horizons",
      },
      {
        label: "benchmark",
        terminal: "Shared and generalizable based on task nature",
        fintel: "Investment performance is strategy-specific",
      },
    ],
  },

  howFintel: {
    kicker: "how fintel does it",
    title: "Finance knowhow, eval science",
    titleAccent: ["knowhow", "science"],
    lede: "It takes both financial knowhow and AI eval science to run evals.",
    pillars: [
      {
        variant: "finance" as const,
        title: "Finance knowhow",
        items: [
          "Implementable investment strategies",
          "Systematic research pipeline",
          "Financial domain knowledge",
        ],
      },
      {
        variant: "eval" as const,
        title: "Eval science",
        items: [
          "Controlled agent simulation",
          "Benchmark optimization pipeline",
          "Scalability-driven and open sourcing",
        ],
      },
    ],
    contactLead: "For consultation or partnership, contact",
    email: "felixlin@fintel.capital",
  },
} as const;
