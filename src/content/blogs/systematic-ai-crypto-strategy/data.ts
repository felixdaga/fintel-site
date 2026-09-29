/**
 * "Systematic AI crypto strategy" — every sentence and label lives here.
 *
 * Edit this file to change the post. Wrap a word in *asterisks* to highlight
 * it. The chart lines and table numbers live in showcase.json and raw.json.
 */

export const postContent = {
  meta: {
    slug: "systematic-ai-crypto-strategy",
    title: "Systematic AI crypto strategy",
    description: "Can eval-driven AI improve BTC + ETH allocation",
    date: "2026-09-29",
  },

  intro: {
    title: "Intro",
    body: "We explore whether AI can systematically add value for two common Bitcoin + Ether index strategies: *equal weight* and *market-cap weight*. Each month it rates the relative attractiveness of Bitcoin versus Ether, from −1 to +1. A positive rating says the window is Bitcoin-led and adds Bitcoin. A negative rating says it is Ether-led and adds Ether. The rating is turned into active weights by a scaler. The default is *20 percentage points*, so a score of +1 is a 20-point Bitcoin overweight and a score of −1 is the same overweight on Ether.",
    lead: "Here we show the eval results for two harnesses.",
    agents: [
      {
        name: "*OpenClaw*",
        body: "Calls the tools itself, across multiple turns. Serves as baseline for how an off-the-shelf agent would perform.",
      },
      {
        name: "*Fintel crypto agent*",
        body: "A harness optimized through our evals for performance and efficiency.",
      },
    ],
    shared: "Two agents ran on the same model, *MiMo 2.6*, with the same data (see end of page).",
    result: "*The results indicate that our Fintel agent could add meaningful alpha to both types of index strategies while slightly reducing drawdowns. OpenClaw, our baseline, does not improve performance, and it uses significantly more tokens. Overall, this is a new kind of smart-beta strategy: regime-aware allocations without human intervention.*",
  },

  stats: [
    { label: "Period", value: "Feb 2024 – Sep 2026" },
    { label: "Decision periods", value: "32" },
    { label: "Repeats", value: "3" },
    { label: "Simulations", value: "96", note: "per agent" },
  ],

  names: {
    benchmark: "Benchmark",
    openclaw: "OpenClaw",
    fintel: "Fintel",
    repeats: ["r1", "r2", "r3"],
  },

  usage: {
    input: "input tokens",
    output: "output tokens",
    openclaw: { input: 72903882, output: 852186 },
    fintel: { input: 2991835, output: 1064575 },
  },

  summary: {
    title: "Headline results",
    columns: ["book", "avg BTC", "total", "ann ret", "ann vol", "max DD", "Sharpe", "IR"],
    books: {
      equal: "Equal",
      eq20: "With AI overlay",
      cap: "Market cap",
      mc20: "With AI overlay",
    },
    footnote:
      "With AI overlay is the default 20-percentage-point tilt. The information ratio is versus that row's benchmark. Figures are net of 5 bps. Sharpe and the information ratio are annualized. Marked through 2026-09-28.",
  },

  returns: {
    title: "Return",
    body: "Cumulative return at the default scaler, against the benchmark each book starts from. The charts are split by index.",
    panels: [
      { book: "equal", heading: "Cumulative return", split: "Equal weight" },
      { book: "cap", heading: "Cumulative return", split: "Market cap" },
    ],
  },

  tilts: {
    title: "Tilt size",
    body: "Total return as the scaler widens from 5 points to 30, then to the maximum. The maximum is a full 100-point move, clipped so Bitcoin's weight stays between 0 and 100 percent. *Raising the rating sensitivity lifts Fintel's performance.*",
    panels: [
      { book: "equal", heading: "Total return", split: "Off equal weight" },
      { book: "cap", heading: "Total return", split: "Off market cap" },
    ],
  },

  weights: {
    title: "Bitcoin weight",
    body: "The Bitcoin weight on each decision date, against the benchmark weight.",
    panels: [
      { book: "equal", heading: "Bitcoin weight", split: "Equal weight" },
      { book: "cap", heading: "Bitcoin weight", split: "Market cap" },
    ],
  },

  repeats: {
    title: "Three repeats",
    body: "Each agent is run three times to measure stochasticity. OpenClaw is less consistent because of its harness.",
    panels: [
      { harness: "openclaw", heading: "Cumulative return", split: "OpenClaw" },
      { harness: "fintel", heading: "Cumulative return", split: "Fintel" },
    ],
  },

  raw: {
    title: "Raw agent output",
    body: "The Bitcoin rating each repeat submitted. Open it for the rationale, the factors, and the sources.",
    earlier: "Earlier month",
    later: "Later month",
    columns: ["repeat", "score", "rationale"],
    factors: "key factors",
    sources: "sources cited",
    none: "none cited",
  },

  mission: {
    title: "The mission",
    body: "This is the brief the portfolio manager reads on every date. It turns the data into one rating of Bitcoin versus Ether. The specialists do not see it.",
    scroll: `You are rating Bitcoin against Ether. You see both coins in one decision. Submit exactly one view. The symbol is \`BTC\`. The score runs from -1 to +1.

The score says which of two books this window favors. It is a rating of that choice. It is not a weight, a hedge, or an entry.

## The two books

A market-cap book weights each coin by price times circulating supply. Bitcoin's larger share means Bitcoin's return dominates the book. The weights drift with price. A reset does not pull the book back to half and half.

An equal-weight book is half Bitcoin and half Ether, reset on the decision schedule. Ether's return has a much larger effect. Each reset sells the coin that outperformed and buys the one that lagged. In a one-way trend, that sale is a drag on the equal book.

Ether's swings are larger than Bitcoin's. The equal-weight book is the bumpier one: higher volatility, deeper drawdowns. That is a cost of leaning toward Ether when the backdrop is a drawdown. It is not, by itself, a reason to refuse an Ether-led window.

Positive means the window is Bitcoin-led: the market-cap book is the one this window favors. Negative means the window is Ether-led: the equal-weight book is the one this window favors, because Ether deserves the larger share that book gives it. Zero means the two sides cancel, or nothing dated inside the window says which coin is leading.

## Three dimensions

State what each one says about that choice, then weigh them. When they disagree, stay closer to zero. The regime outweighs the other two when a web result dated inside the window supports it. The other two can still pull that call back toward zero.

1. **Regime** — is the tape Bitcoin-led or Ether-led? This is the primary question.
  - Bitcoin-led: Bitcoin's share of the two coins is rising, or a result dated inside the window says Bitcoin is leading and Ether is the small sleeve. That is the case for the market-cap book.
  - Ether-led: Ether is gaining on Bitcoin, on usage or on a result dated inside the window, and the relative price has not already paid for it. That is the case for the equal-weight book.  Yields, the dollar, gold, equities, VIX, money, the Fed's balance sheet, Fear & Greed, stablecoins, and the Bitcoin-linked names (gold, COIN, WGMI) are the quantitative reading of the same question.
2. **ETH fundamental** — is Ether being used, and is its supply falling because use is burning it? Value locked, fees, and ETH supply are the network series in this pack. They are about Ether. Bitcoin has no matching activity or supply series here, so a strong Ether print is evidence about Ether, not a finished comparison. A strong print the market has not already paid is evidence for the equal-weight side. When the missing Bitcoin side would change the score, research it with web search. If the search still does not cover it, say that side is empty.
3. **What the market is already paying** — where the pair trades versus its own window, and how crowded each side is. Read \`relative\`. Do not divide prices or subtract vol and funding yourself.
  - \`eth_btc\` is Ether's close divided by Bitcoin's close. 0.03 means one ETH costs 0.03 BTC. \`latest_value\` is the last ratio. \`change\` and \`change_pct\` are that ratio versus the start of the window. A low ratio versus its own window is cheap Ether. A ratio that has already risen is the market having paid for Ether, which caps an Ether lean.
  - \`dvol_spread\` is Ether's implied vol minus Bitcoin's, in annualized vol points. Positive means Ether vol is higher. A wide positive spread is the extra bump of an Ether lean. Count it as a cost in a drawdown. It does not, by itself, pick the book.
  - \`funding_spread\` is Ether's 8-hour funding minus Bitcoin's, on hours both printed. Positive means Ether longs are paying more than Bitcoin longs. The richer side is the crowded long, and a crowded long is capped.
   Spot-ETF flow is positioning when the series exists: each coin versus its own history, in millions of dollars. Positive is inflow. The two histories start on different dates, so compare each coin to itself. Days before a coin's ETFs existed are absent. Absence is not a zero flow.

Raw prices, DVOL, and funding are still available when you want a level. The pair math is already on \`relative\`.

## What the numbers leave out

The quantitative tools are every tool except \`web_search\`: prices, the pair math, implied vol, funding, Ethereum usage and supply, ETF flow, Fear & Greed, cross-assets, and macro. They measure part of each pillar. They do not cover the whole pillar. Bitcoin's network, a halving, an upgrade, a regulatory date, and why the tape changed are examples of what those series leave out.

Use \`web_search\` when a hole would change the score. Search which coin is leading: Bitcoin's share of the two coins, or a dated line that the market is Bitcoin-led or Ether-led. Search Bitcoin's network when Ether's usage or supply would otherwise stand alone. Search the cause of an Ether fee or supply print, and a policy or ETF fact the flow series does not state. Do not search for which coin's price already rose. That reading is on \`relative\`. A result enters the score when the tool dates it inside the window. Something you did not retrieve does not.

## Score anchors (landmarks, not a checklist)


| Score    | Meaning                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| **+1.0** | Rare. Several dimensions agree the window is Bitcoin-led, and you can cite them.                            |
| **+0.5** | A clear case for the market-cap book. More than one dimension supports Bitcoin leading.                     |
| **+0.2** | A lean toward the market-cap book. One dimension supports it and the others are mixed.                      |
| **0.0**  | No edge, or the dimensions cancel.                                                                          |
| **−0.2** | A lean toward the equal-weight book.                                                                        |
| **−0.5** | A clear case for the equal-weight book. More than one dimension supports Ether leading, and it is not paid. |
| **−1.0** | Rare. Several dimensions agree the window is Ether-led.                                                     |


In-between values are the normal case. Thin, gapped, or conflicting evidence stays near zero.

## Anti-momentum

A coin that has already outperformed is the market having paid. That caps the winner. It is not a reason to score the winner higher. The equal-weight reset would sell that winner, so a one-way trend already in the tape is a drag on leaning further into it. If the only evidence is that one coin's price has been rising, the score stays near zero.

## Output hygiene

Submit one view, symbol \`BTC\`, and no view for \`ETH\`. Only Bitcoin carries the rating.

Leave position size, hedges, and entry timing out of the rationale. Those are applied later from the score alone.

Every material claim cites a tool reading: a \`relative\` value, another series, or a web-search result. Quote a figure only when the tool returned it.

When the view is formed, submit it with the tool provided for that purpose.`,
  },

  dataAccess: {
    title: "The data",
    body: "Both agents can read the same series. Each print is cut off before the decision date.",
    items: [
      {
        name: "Prices",
        body: "Coinbase closes for Bitcoin and Ether. Returns, drawdown, and distance from the high at 1, 3, 6, and 12 months, plus the month-end path.",
      },
      {
        name: "ETH/BTC",
        body: "Ether's close divided by Bitcoin's close, and where that ratio sits in its own window. A low ratio is cheap Ether. The agent reads this instead of dividing the two prices.",
      },
      {
        name: "Implied volatility",
        body: "Deribit DVOL for each coin, and Ether's vol minus Bitcoin's. A wide positive spread is the extra bump of leaning toward Ether.",
      },
      {
        name: "Funding",
        body: "Perpetual funding in basis points per 8 hours, for each coin and the gap between them. The side paying more is the crowded long.",
      },
      {
        name: "Spot-ETF flow",
        body: "Net creations in millions of dollars. Each coin is compared with its own history. Days before that coin's ETFs existed are left out, not filled in as zero.",
      },
      {
        name: "Ether network",
        body: "Value locked, fees, and ETH supply. A falling supply means burn exceeded issuance. Bitcoin has no matching activity series in this pack.",
      },
      {
        name: "Fear & Greed",
        body: "The crypto sentiment index, from 0 to 100. High is greed.",
      },
      {
        name: "Stablecoins",
        body: "Total stablecoin supply outstanding, and how it has moved over 30 and 180 days.",
      },
      {
        name: "Macro",
        body: "Dollar, equities, VIX, Treasury and real yields, credit, money supply, the Fed's balance sheet, and reverse repo, over one and three months.",
      },
      {
        name: "Cross-asset",
        body: "Gold, the dollar index, Coinbase, and Bitcoin miners, over 1, 3, 6, and 12 months.",
      },
      {
        name: "Web search",
        body: "Dated pages on which coin is leading, on Bitcoin's network, on why Ether fees or supply moved, and on ETF or policy news. A page counts only when it is dated inside the window.",
      },
    ],
  },
} as const;
