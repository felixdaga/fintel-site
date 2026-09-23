/**
 * "What one dataset adds" — every sentence, label, and table cell lives here.
 *
 * Edit this file to change the post. Wrap a word in *asterisks* to highlight
 * it. The chart lines are the net-NAV series in `series.json`
 * beside this file; they are not restated below.
 */

export const postContent = {
  meta: {
    slug: "dataset-additivity",
    title: "Evaluating data for financial AI agents",
    description:
      "A novel application of agentic eval",
    date: "2026-09-22",
  },

  intro: {
    title: "Intro",
    paragraphs: [
      "*What is a piece of financial data actually worth to an AI agent?* When the AI context is limited and bloating could significantly impact performance, this becomes a necessary question.",
      "Through agentic evaluation, you can *put a number on it for you and your agents* — so you only incorporate or pay for what it's actually worth.",
      "Below is a snippet of how we evaluated the additivity of a dataset — a weekly commentary series from BlackRock Investment Institute — as additional market and macro context for our live agents.",
    ],
  },

  dataset: {
    title: "The dataset",
    before:
      "The *BlackRock Investment Institute (BII) Weekly Commentary* (\"Commentary\") is a regular series from BlackRock, capturing differentiated views across macro regimes, sector narratives, and thematic trends. See the publication link ",
    linkLabel: "here",
    href: "https://www.blackrock.com/corporate/insights/blackrock-investment-institute/global-weekly-commentary",
    after: ".",
  },

  agent: {
    title: "The agent",
    body: "Our *generic fundamental agent* (GFA) is configured to represent how a typical AI agent (or human analyst) would make investment decisions based on the fundamental risk-reward profile of a company. It consists of quantitative and qualitative data specialists (subagents) that report to the portfolio manager for decision-making. The portfolio manager agent is given the following *mission*:",
  },

  evaluation: {
    title: "The evaluation",
    paragraphs: [
      "Through our proprietary eval platform, we have backtested the same agent twice: once with access to a set of basic financial data, and once with additional access to the Commentary. The universe is the *Dow Jones 30*, with controls for survivorship bias.",
      "The period runs from *2 Jan 2026 to 14 Sep 2026* and covers *19 decision dates*. The agent is deployed to *independently rate each ticker* in the universe on each decision date. The ratings are then combined into a cross-sectional score and transformed into active holdings. This produces 570 individual simulations (30 × 19) for each run, totalling *1140 samples* of how the agent would behave and perform under point-in-time controlled environments.",
    ],
  },

  setup: {
    twinColumns: ["Model", "Harness", "Universe", "Dates", "Data"],
    twinShared: ["MiMo 2.6", "GFA", "Dow Jones 30", "biweekly"],
    dataFields: [
      "prices",
      "fundamentals",
      "ratios",
      "returns",
      "macro",
      "news",
      "web_search",
    ],
    dataExtra: "Commentary",
    missionScroll: `You are a equity research analyst. You will be asked, independently for one company at a time, to rate that company's fundamental attractiveness and the trajectory of its business on a continuous scale from -1 to +1.

## What the score combines

Judge three pillars, in this order of importance:

1. **Fundamental health & trajectory** (primary) — earnings path and durability, margins, cash generation, balance-sheet resilience, franchise / competitive position.
2. **Valuation vs opportunity** (co-primary) — mainly vs the company's *own* recent history (is the market paying more or less for the same earnings power?).
3. **Near-term rerating chance** (secondary boost) — a dated, fundamental catalyst that could re-rate the stock over the coming weeks-to-quarter (guidance, earnings event, product/regulatory clear, capital-allocation shift, leadership change with a clear strategy implication). This pillar exists because assessment is biweekly: a sound fundamental view should be slightly stronger when a credible near-term re-rating path is in the pack.

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
- Use pillar 2 to move within / across bands: cheap vs history can lift a good franchise toward +0.5; rich vs history should cap or flip a otherwise decent story.
- Apply pillar 3 last, as a modest adjuster (think roughly ±0.1 to ±0.2 on the continuous scale), and only when the catalyst is dated and fundamental — not a headline spike or "stock has been going up."
- Cross-lane weight when synthesizing specialist reports: quantitative fundamentals and own-history valuation dominate; qualitative franchise / structural web context supports; recent news/updates and macro/sentiment mainly feed pillar 3 (and risk offsets), they do not replace pillars 1–2.
- BlackRock weekly commentary, when it is in your prompt, carries the institute's narrative, macro, and asset-class views. When a point is relevant to this company, let it inform the score across the pillars, as in the section below.
`,
    twinRows: ["GFA", "GFA + Commentary"],
  },

  result: {
    title: "The result",
    performanceTitle: "Raw signal performance",
    lead: "The Commentary is additive to the generic AI agent across the board. In terms of raw performance, it has *improved the Information Coefficient (IC) by almost 1% to 5.7%*. Post-factor neutralisation, the residual IC also flipped from negative to positive territory, suggesting that the data is *adding idiosyncratic insights* for the agent.",
    holdingsTitle: "Holdings performance",
    portfolios:
      "When transformed into a positive score-weighted (score-weighted) portfolio and a mean-variance optimised (MVO) portfolio, the *annualised return rose by over 5% to 21.7% and 17.7%*, respectively. Moreover, for MVO the *IR flipped from -0.03 to +1.37* over its benchmark, Dow 30. Meanwhile, volatility remains roughly flat with *slightly improved drawdowns* for both portfolios.",
    signal: [
      {
        label: "Signal",
        rows: [
          { metric: "IC", base: "0.0484", bii: "0.0570" },
          { metric: "t-statistic (18 periods)", base: "0.85", bii: "1.04" },
          { metric: "Residual IC, six-factor", base: "−0.0052", bii: "+0.0054" },
        ],
      },
    ],
    returns: [
      {
        label: "Score-weighted portfolio",
        rows: [
          { metric: "Annualised return", base: "16.61%", bii: "21.67%" },
          { metric: "Sharpe", base: "1.36", bii: "1.69" },
          { metric: "Information ratio", base: "0.38", bii: "0.85" },
        ],
      },
      {
        label: "Mean-variance optimised portfolio",
        rows: [
          { metric: "Annualised return", base: "12.60%", bii: "17.70%" },
          { metric: "Sharpe", base: "1.06", bii: "1.47" },
          { metric: "Information ratio", base: "−0.03", bii: "1.37" },
        ],
      },
    ],
    vol: [
      {
        label: "Score-weighted portfolio",
        rows: [
          { metric: "Volatility", base: "11.88%", bii: "12.14%", lower: true },
          { metric: "Max drawdown", base: "−6.86%", bii: "−6.61%" },
        ],
      },
      {
        label: "Mean-variance optimised portfolio",
        rows: [
          { metric: "Volatility", base: "11.95%", bii: "11.65%", lower: true },
          { metric: "Max drawdown", base: "−7.91%", bii: "−7.28%" },
        ],
      },
    ],
    factor: {
      title: "Factor tilts",
      body: "The score-weighted portfolio with the Commentary loaded more on market beta, momentum (flipped from negative to positive), and large-cap exposure. This is *consistent with BII's overall narrative to overweight U.S. stocks on the AI theme*.",
      note: "Mean active factor exposure, score-weighted portfolio. Positive means the portfolio carries more of that factor than the benchmark.",
    },
    sector: {
      title: "Sector tilts",
      body: "In terms of active sector exposure, the Commentary has shifted the agent towards IT, Financials, and Health Care, and away from Communication Services and Consumer Staples.",
      note: "Mean active sector exposure, score-weighted portfolio. Positive means an overweight of that sector.",
      examplesLede:
        "Examples of how the Commentary has influenced the agent ratings — other factors for the score shifts are omitted.",
      columns: ["Sector", "Agent rationale"],
      rows: [
        {
          sector: "Information Technology",
          text: "On 24 Apr the Microsoft rationale quotes the 20 Apr Commentary, *\"We view this leverage as necessary to get over the hump between front-loaded investment and backloaded revenues – and think it's healthy so far,\"* and the 14 Apr line that *\"the tech sector is now seen posting earnings growth of 43% in 2026, up from 26% last year.\"* The score rose from +0.25 to +0.45.",
        },
        {
          sector: "Financials",
          text: "On 30 Jan the Goldman rationale quotes the 26 Jan Commentary that *expected US investment-grade issuance of $1.85trn in 2026 is a tailwind for underwriting*, and the score flipped from −0.12 to +0.15. On 16 Jan Visa quotes the 12 Jan line that financials are favoured on *\"stronger dealmaking activity and lighter regulation.\"*",
        },
        {
          sector: "Health Care",
          text: "On 22 May the Merck rationale quotes the 18 May upgrade that favors *\"AI-adopters such as health care,\"* and the score flipped from −0.20 to +0.15. On 14 Aug UnitedHealth quotes the 10 Aug Commentary, *\"We favor targeted exposures, such as in technology and healthcare, where structural shifts support earnings growth,\"* and the score flipped from −0.10 to +0.15.",
        },
        {
          sector: "Consumer Staples",
          text: "The Commentary never names the sector. But the agent applies the higher-rate and oil-inflation regime to low earnings-yield defensives, which takes Coca-Cola and Procter & Gamble out of the score-weighted portfolio.",
        },
      ],
    },
    company: {
      title: "Company-level tilts",
      body: "The performance impact of the Commentary can be visualised by plotting the weight gaps between the two agents against period return. In general, *higher weights given by the agent with Commentary correspond to higher returns*. This is often associated with the agent quoting the Commentary in its rationale:",
      columns: ["Company", "Weight delta", "Agent rationale"],
      rows: [
        {
          symbol: "NVDA",
          gap: "+95 bps",
          text: "On 10 Apr the agent rationale quotes the 6 Apr Commentary, *\"Favor AI beneficiaries… such as semiconductors, power and data center assets,\"* and the score rose from +0.45 to +0.62. On 16 Jan it quotes *\"stay overweight U.S. equities and pro-risk on the AI theme,\"* and the score rose from +0.25 to +0.40.",
        },
        {
          symbol: "AMZN",
          gap: "+44 bps",
          text: "On 22 May the agent rationale quotes the 11 May Commentary, *\"The AI buildout is offsetting the shock's drag on growth,\"* and the 18 May upgrade of developed-market equities on AI-driven earnings, as support for the AWS demand path. The score rose from +0.25 to +0.35.",
        },
        {
          symbol: "TRV",
          gap: "+43 bps",
          text: "On 24 Apr the agent rationale quotes the 14 Apr Commentary that Brent fell below $100 and 10-year yields came off their highs at 4.32%, and uses that as easier claims costs plus higher reinvestment yields for a property-and-casualty underwriter. The score rose from +0.35 to +0.45.",
        },
        {
          symbol: "AAPL",
          gap: "+40 bps",
          text: "On 16 Jan the agent rationale quotes the 12 Jan Commentary that Mag 7 fourth-quarter earnings growth was revised up to 20% year over year, and 19% in 2026. The score rose from +0.25 to +0.35.",
        },
        {
          symbol: "HD",
          gap: "−18 bps",
          text: "On 17 Jul the agent rationale quotes *\"Higher interest rates are a defining feature of the new regime\"* and the 10-year at 4.55%, and reads that as pressure on a housing-levered retailer. The score fell from +0.15 to −0.20.",
        },
        {
          symbol: "PG",
          gap: "−47 bps",
          text: "On 17 Jul the agent rationale quotes *\"Higher interest rates are a defining feature of the new regime\"* against a 4.1% earnings yield that sits below the 10-year. The score fell from +0.15 to −0.15.",
        },
        {
          symbol: "MCD",
          gap: "−63 bps",
          text: "On 2 Jan the agent rationale quotes the 15 Dec Commentary on 10-year yields near 4.20% as a headwind for a 3.7% earnings yield, and adds that the U.S. overweight is AI-themed, not where McDonald's is expressed. The score fell from +0.15 to −0.10.",
        },
        {
          symbol: "KO",
          gap: "−66 bps",
          text: "On 10 Apr the agent rationale matches the 30 Mar warning of *\"elevated oil prices testing whether central banks can keep up with inflation\"* to a threat to the 61.6% gross margin. The score fell from +0.15 to −0.15, which drops the name out of the score-weighted portfolio.",
        },
        {
          symbol: "GOOGL",
          gap: "−110 bps",
          text: "On 14 Sep the agent rationale quotes the 8 Sep Commentary, *\"we favor companies with the earnings and cash flows to outrun a higher cost of capital,\"* and says a negative-free-cash-flow quarter does not meet that bar. The score fell from +0.25 to +0.15.",
        },
      ],
    },
  },

  bottom: {
    title: "Bottom line",
    body: "The Commentary is shown to provide an edge for the generic agent during the evaluation period. We therefore proceeded to run the evaluation on other agents and across other market regimes to test for generalisability, *ultimately incorporating the data* into our live agent strategy. Nonetheless, *this is a demonstration of how the value of data, whether it is meant for AI or is qualitative by nature, can be quantified with an agentic evaluation pipeline.*",
  },

  rawOutputs: {
    title: "Raw outputs",
    body: "Each row is the score and agent rationale from the agent that had the Commentary, for one name on that decision date. Expand a row for the full rationale, the key factors, and the BlackRock lines it cited.",
  },

  table: {
    columns: ["", "With access to basic data", "*With access to basic data + Commentary*"],
  },

  methodology: {
    title: "Further details",
    portfoliosTitle: "Terminology",
    portfoliosLede: "Holding transformations",
    portfolios: [
      {
        title: "Score-weighted portfolio",
        body: "Long every ticker scored above zero; a higher score gets a larger weight.",
      },
      {
        title: "Mean-variance optimised portfolio",
        body: "Weights from the agent rating and stock covariance.",
      },
    ],
    metricsTitle: "Metrics",
    metrics: [
      {
        title: "Annualised return",
        body: "Compound growth of the portfolio, annualised over the window: (1 + total)^(1 / years) − 1. This is a portfolio result, not a rating-quality result.",
      },
      {
        title: "IC",
        body: "Each decision date, rank-correlate the 30 scores with next-period returns (h=1). We report the mean of those correlations over 18 periods. It asks whether higher-rated names subsequently returned more.",
      },
      {
        title: "t-statistic",
        body: "One-sample t of mean IC versus 0: (mean IC / sample std) × √n. We treat t > 3 as a conventional bar showing that ranking skill is distinguishable from noise over this window.",
      },
      {
        title: "Residual IC",
        body: "Each date, residualise the scores on point-in-time FF6 loadings (Mkt, SMB, HML, RMW, CMA, Mom): s = a + Bγ + u. Residual IC is the rank correlation of that residual with the next-period excess return — skill left after stripping common-factor bets.",
      },
      {
        title: "Sharpe",
        body: "Mean period return of the portfolio divided by period volatility, then annualised (× √ppy). Does not subtract the benchmark.",
      },
      {
        title: "Information ratio",
        body: "Mean active return versus the benchmark, divided by tracking error, then annualised. Measures the portfolio versus the benchmark.",
      },
      {
        title: "Volatility",
        body: "Annualised volatility of the portfolio’s period returns. Lower is better.",
      },
      {
        title: "Max drawdown",
        body: "Peak-to-trough decline of net asset value. Shallower is better.",
      },
      {
        title: "Active factor exposure",
        body: "Mean holdings-weighted point-in-time six-factor beta of the portfolio, minus the same beta of the benchmark. Positive is an overweight of that factor. Zero is the benchmark.",
      },
      {
        title: "Active sector exposure",
        body: "Mean GICS sector weight of the portfolio minus the benchmark. Positive is an overweight of that sector. Zero is the benchmark.",
      },
    ],
  },

  charts: {
    returnTitle: "Cumulative return",
    underwaterTitle: "Underwater",
    icTitle: "IC",
    books: [
      { id: "sw_0.0", title: "Score-weighted portfolio" },
      { id: "mvo", title: "Mean-variance optimised portfolio" },
    ],
  },

  series: {
    base: "Basic fundamental",
    bii: "Basic fundamental + Commentary",
    pw: "Benchmark",
    colors: {
      base: "#6f93cf",
      bii: "#e8924a",
      pw: "#6b7a8e",
    },
  },
} as const;
