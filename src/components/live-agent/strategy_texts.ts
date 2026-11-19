/**
 * /live-agent copy — edit this file.
 * Figures below come from the live book. This page is that record.
 */

export const STRATEGY_COPY = {
  meta: {
    title: "Live book",
    description:
      "Live results for a Dow Jones book run since April this year.",
  },

  hero: {
    title: "Live book",
    titleAccent: "book",
    ledes: [
      "A systematic book on the Dow Jones, live since April this year, with no human in the loop.",
    ],
    disclaimer: "Past performance is not indicative of future results.",
  },

  chart: {
    title: "Gross cumulative return since deployment",
    titleShort: "Gross return since deployment",
    aria: "Book cumulative return, in percent, versus price-weighted and market-cap-weighted Dow Jones",
    agent: "Book (gross)",
    agentShort: "Book",
    benchmark: "Dow Jones (price-weighted)",
    benchmarkShort: "Price-weighted",
    benchmarkMcap: "Dow Jones (market-cap-weighted)",
    benchmarkMcapShort: "Market-cap-weighted",
    navBubble: {
      label: "NAV (USD)",
    },
    // Same backtest as the investor deck's skin-in-the-game slide.
    eval: {
      label: "Backtest",
      window: "Sep 2022–Mar 2026",
      ann: 0.200723,
      sharpe: 1.896246,
      ir: 1.083443,
    },
    liveLabel: "Live performance",
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

  live: {
    title: "Decisions",
    titleAccent: "Decisions",
    lede: "Each row is a score and a rationale for a Dow Jones name on the decision date.",
    postsKicker: "Notes",
    howToRead:
      "Tap a row to read the rationale and the factors behind the score.",
  },
} as const;
