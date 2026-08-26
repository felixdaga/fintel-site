/**
 * "F1 Commentary: A self-reflection from our agent" — first installment.
 *
 * Distilled from the F1 period report for Jul 23 – Aug 7, 2026. The blog keeps
 * the agent's reasoning at the fundamental level (valuation, catalysts,
 * franchise quality) and deliberately omits the internal scoring mechanics,
 * the holdings rule, and any live/backtest distinction.
 */

export const f1CommentaryContent = {
  meta: {
    slug: "f1-commentary-2026-07-23",
    title: "F1 Commentary: A self-reflection from our agent",
    description: "Jul 23 – Aug 7, 2026 — did we earn the +330 bps, or was it luck?",
    date: "2026-08-26",
  },

  series: "F1 Commentary",
  seriesSub: "A self-reflection from our agent",

  intro: {
    kicker: "installment 01 · jul 23 – aug 7, 2026",
    body: `Over 12 trading days, F1 returned +8.5% against the DJIA's +4.5% — +330 basis points of active return in a single period. That pulled F1's cumulative alpha since we went live on April 24 past +500 bps in under four months. The period stacked two of the year's biggest macro catalysts back-to-back, and both broke our way. So we asked our agent to look back honestly: did we earn this, or did the wind just blow?`,
  },

  context: {
    title: "What the period looked like",
    blocks: [
      {
        head: "Big Tech earnings week (Jul 27–31)",
        body: `Microsoft's Q4 beat triggered the largest one-day market-cap gain for any U.S. company and paced the Dow's rebound. The dominant driver was an AI-monetization re-rating in mega-cap tech — exactly the theme F1 was positioned for.`,
      },
      {
        head: "Geopolitical de-escalation + risk-on August (Aug 3–7)",
        body: `Oil slid as tensions eased, the Dow closed at a record, and it was the best week for all major indexes since April. Within the DJIA, the leaders were tech/AI names; the laggards were industrials and energy. F1's overweight to tech and its absence from industrials and energy aligned almost perfectly with that shape.`,
      },
    ],
  },

  wins: {
    title: "What we got right",
    items: [
      {
        sym: "MSFT",
        bps: "+143.1 bps",
        body: `Our largest position, sized for a re-rating we explicitly flagged: the stock's PE had compressed to the 15th percentile of its one-year range while fundamentals accelerated, with the earnings print named as a dated catalyst. Full weight into a flagged catalyst — the process working as designed.`,
      },
      {
        sym: "CRM",
        bps: "+89.3 bps",
        body: `A depressed base (trailing PE at the bottom decile) plus real franchise traction. We raised our conviction as evidence arrived — the kind of evidence-driven updating you want.`,
      },
      {
        sym: "DIS",
        bps: "+75.4 bps",
        body: `A disciplined value call: earnings yield well above the risk-free rate, operating income stable while the market priced a collapse, and the Aug 5 earnings identified as the dated catalyst.`,
      },
      {
        sym: "NVDA",
        bps: "+53.6 bps",
        body: `Our largest single active weight, scored with honest humility about margin-sustainability risk. A big overweight that returned in line with the market — strong fundamentals, capped conviction, correctly sized.`,
      },
      {
        sym: "CAT",
        bps: "+51.1 bps",
        body: `The biggest avoided loser. Zero exposure on a thesis that the AI-power proxy trade had decoupled from fundamentals — stretched multiples, compressing margins, deteriorating cash conversion. The stock then fell nearly 6% over the period.`,
      },
    ],
  },

  luck: {
    title: "What was luck, not skill",
    items: [
      {
        sym: "BA",
        bps: "−29.9 bps",
        tag: "fixable",
        body: `We listed the regulatory catalysts — restored self-certification authority, a pending MAX-7 certification — as genuine structural positives, and still cut the name. Our framework has no slot for turnaround-option value: a name in mid-turnaround gets scored on today's unprofitability and is structurally excluded. That's a coverage gap we can fix, not just bad luck.`,
      },
      {
        sym: "AMGN",
        bps: "−33.6 bps",
        tag: "bad luck",
        body: `An earnings-event pop against a justified underweight made days before the event. The concerns — leverage, a patent cliff, deteriorating franchises — were real and remain real. Right process, adverse single-event outcome.`,
      },
      {
        sym: "MMM",
        bps: "−15.4 bps",
        tag: "bad luck",
        body: `Same pattern: a Q2 beat and guidance raise that genuinely contradicted the trend-read, against an underweight made on sound valuation discipline. Earnings events do that. No fix needed.`,
      },
      {
        sym: "HD",
        bps: "−28.5 bps",
        tag: "not attributable",
        body: `Drifted up on the broad risk-on tape with no name-specific catalyst. Sitting out on valuation discipline during a multiple-expansion regime is the designed cost of the framework — it reverses in compression regimes.`,
      },
    ],
  },

  verdict: {
    title: "Verdict — and what we're fixing",
    body: `The process was sound. Roughly 270 of the 330 basis points came from five explicit, correctly-sized positions, and every one was an earned call rather than a coin flip. The two calls we got wrong were small in aggregate, and one was an earnings-event outcome on a genuinely leveraged name.`,
    fixes: [
      {
        head: "Turnaround-option blindness",
        body: `When we identify a cheap-to-enumerate dated catalyst on a turnaround name, allow a small position even when current margins are ugly, rather than binary exclusion. This is the one change that would have been justified ex-ante and would have recovered ~30 bps this period.`,
      },
      {
        head: "Earnings-event sizing",
        body: `Don't deepen a zero-weight exclusion within a few days of a known binary event unless the fundamental case is extreme. Both negative contributors that hurt were earnings pops against underweights made right before the event.`,
      },
    ],
    dontChase: `We're not retrofitting a sector-timing narrative — the IT overweight was the expression of individual name calls, not a sector bet. And Microsoft's single-day magnitude wasn't forecastable; we sized for a re-rating and the outcome exceeded the thesis. Some of this was the wind. Most of it was us.`,
  },
};
