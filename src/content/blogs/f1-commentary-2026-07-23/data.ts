/**
 * "F1 Commentary: A self-reflection from our agent" — first installment.
 *
 * Distilled from the F1 period report for Jul 23 – Aug 7, 2026. The blog keeps
 * the agent's reasoning at the fundamental level (valuation, catalysts,
 * franchise quality, the score it assigned) and deliberately omits the
 * live/backtest distinction and the internal rule name.
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

  // Score cards: one per name, grouped by top / bottom 5 active bps.
  scoreCards: {
    top: [
      { sym: "MSFT", score: 0.45, activeW: 4.68, ret: 31.03, contrib: 143.1 },
      { sym: "CRM", score: 0.29, activeW: 4.58, ret: 22.82, contrib: 89.3 },
      { sym: "DIS", score: 0.29, activeW: 5.56, ret: 13.01, contrib: 75.4 },
      { sym: "NVDA", score: 0.45, activeW: 7.69, ret: 7.28, contrib: 53.6 },
      { sym: "CAT", score: -0.41, activeW: -9.25, ret: -5.85, contrib: 51.1 },
    ],
    bottom: [
      { sym: "AMGN", score: 0.01, activeW: -2.72, ret: 10.62, contrib: -33.6 },
      { sym: "BA", score: -0.2, activeW: -2.51, ret: 12.04, contrib: -29.9 },
      { sym: "HD", score: -0.06, activeW: -3.29, ret: 9.52, contrib: -28.5 },
      { sym: "MMM", score: -0.34, activeW: -2.0, ret: 7.85, contrib: -15.4 },
      { sym: "CSCO", score: -0.26, activeW: -1.32, ret: 7.69, contrib: -10.0 },
    ],
  },

  // Full agent analysis sections, shown verbatim from the commentary
  // (only the rule name "score-weighted long, threshold=0" is relaxed to
  // "the score-weighted book"; no live/backtest language appears).
  analysis: {
    top: [
      {
        sym: "MSFT",
        ret: "+31.03%",
        bps: "+143.1 bps",
        tag: "aligned",
        body: `The return driver is unambiguous: the Jul 29 Q4 FY26 earnings beat ($90.01B rev, $4.74 EPS vs $4.25 est, Azure +43%, capex guidance held) drove the 15.5% Jul 30 surge and follow-through (+3% Jul 31) — MSFT's best month since Oct 2007 (CNBC). Both agent decisions (Jul 17 +0.45, Jul 31 +0.45 re-affirmed after the pop) were explicit, well-reasoned bets on exactly this: PE compressed 40% to the 15th percentile of its 12-month range while fundamentals accelerated, with the Jul 29 earnings flagged as a dated catalyst. The Jul 17 write-up explicitly said "a clean quarter here could retrace a meaningful portion of the decline" and assigned Pillar 3 a +0.05–0.1 bump for it. The 10% weight (max in book) was earned by score, not luck. This is the process working as designed: fundamental-valuation dislocation + dated catalyst + full-size position. Right call, confirmed, at full size.`,
      },
      {
        sym: "CRM",
        ret: "+22.82%",
        bps: "+89.3 bps",
        tag: "aligned",
        body: `CRM's period return came from the software-wide re-rating off the Jul 30 Microsoft "AI is monetizing" signal plus its own depressed base — trailing PE at the bottom decile of its 365-day range (16.3–55.8x) after a ~33% drawdown, Agentforce ARR +205%, $1.6B VA contract (Jul 27) landing inside the period. The agent's two decisions (+0.25 Jul 17, raised to +0.35 Jul 31) correctly identified the valuation floor and the franchise quality while explicitly flagging the $25B debt-funded ASR / Informatica leverage as the reason conviction stayed below +0.5. The thesis evolution (raising score as the VA contract validated federal AI adoption) is exactly the kind of evidence-driven updating you want. Note the honest disclosure: the Jul 31 note correctly excluded an apparent PIT leak of Q2 earnings — good verification hygiene. Right call on the merits; the catalyst arrived on schedule via sector re-rating.`,
      },
      {
        sym: "DIS",
        ret: "+13.01%",
        bps: "+75.4 bps",
        tag: "aligned",
        body: `Disney's driver was the Aug 5 Q3 FY26 earnings event (inside the period), streaming margin inflection, plus a broad value/rate-sensitivity bid. The agent held +0.25 → +0.35 across both books with a 5.56% overweight vs DJIA (DIS's small DJIA weight at 1.12% amplified the contribution). The thesis — P/E at floor of 12.5–22.9x range, earnings yield 7.2% vs 10Y 4.68%, operating income stable at ~$4.6B/qtr while the market priced an earnings collapse — was a disciplined value call with the Aug 5 earnings explicitly identified as the dated catalyst. The one caveat: at DJIA weight of only 1.12%, part of the +75 bps is a structural artifact of price-weighting (DIS's high price-per-share relative to index weight), not a massive active bet. Still, the active call itself was correct and correctly sized by score. Aligned.`,
      },
      {
        sym: "NVDA",
        ret: "+7.28%",
        bps: "+53.6 bps",
        tag: "aligned",
        body: `NVDA drifted up with the AI re-rating and hyperscaler capex confirmation (Alphabet $195–205B, TSMC >40% growth guidance cited in the Jul 31 decision), though it lagged MSFT/CRM — the market remained skeptical of extreme margins. The agent held +0.45 in both books with a +7.69% active weight — the largest single active weight in the book. Both decisions were thorough and appropriately humble: earnings yield 3.4% below the 10Y 4.68% flagged as the bear anchor, margin sustainability at 74.9% gross flagged as the key risk, Vera Rubin production (Jul 26) noted as product-cycle de-risking. A +7.7% overweight that returned +7.3% while the DJIA did +5.2% is a modest win, correctly identified as "strong fundamentals, capped conviction." Aligned, with honest scoring.`,
      },
      {
        sym: "CAT",
        ret: "-5.85%",
        bps: "+51.1 bps",
        tag: "aligned",
        body: `CAT was the DJIA's biggest laggard (-5.85%) and its 9.25% DJIA weight (price-weighted distortion makes CAT huge in the index) meant zero exposure was a major active decision. The agent shorted it via exclusion on strong grounds in both decisions (Jul 17 -0.45, Jul 31 -0.35): PE expanded ~90–116% in 12 months while margins compressed, earnings yield 2.3–2.5% vs risk-free 4.6%+, QoQ OCF -50%, Baird downgrade (Jul 29) citing regulatory backlash against data-center construction, insider selling. This wasn't an anti-AI call — it was a "the AI-power proxy trade has decoupled from fundamentals" call, made before the stock fell 24% from its high. The stock's continued decline during the period (oil slide also hurting Energy & Transportation demand narrative) confirmed the view. Right call, biggest avoided loser, explicitly reasoned.`,
      },
    ] as Array<{ sym: string; ret: string; bps: string; tag: string; body: string }>,
    bottom: [
      {
        sym: "AMGN",
        ret: "+10.62%",
        bps: "-33.6 bps",
        tag: "right call, bad luck",
        body: `Amgen rallied on the Aug 4 Q2 earnings beat (EPS +12%, revenue +6.7%) — an event the agent knew was coming but which it had no way to call (the Jul 31 note explicitly flagged and excluded a Google Finance PIT leak of the Q2 numbers as unverifiable — correct discipline). The Jul 17 decision (+0.15, held at small weight) and Jul 31 downgrade (-0.15, cut to zero weight) were made on real concerns: 6.24x D/E leverage in a high-rate tape, denosumab patent cliff, Enbrel -37% YoY, Tavneos impairment risk. The downgrade to zero on Jul 31 was reasonable given the stock had rallied +14.7% in the prior quarter to 2.6% below its 52-week high. What stings: the fundamental concerns (leverage, cliff) were real and remain real — the rally was an earnings-event pop, not a refutation of the thesis. Underweighting a leveraged name into a binary earnings event when the score framework can't distinguish "cheap and broken" from "cheap and inflecting" is a known framework limitation, not an analytical error. Right process, adverse single-event outcome.`,
      },
      {
        sym: "BA",
        ret: "+12.04%",
        bps: "-29.9 bps",
        tag: "mis-aligned (mild)",
        body: `Boeing's period return was driven by two discrete positive events: the FAA's restoration of self-certification authority (Jul 20, just before period start) and the FAA 737 MAX-7 certification on Aug 3 (+8% that day, leading the Dow's record close). The agent's exclusion (-0.15 → -0.25) was based on fundamentals that were, on the merits, correct: 0.6% operating margin, negative H1 FCF, 71x PE, widened Q2 net loss. But the thesis had a real gap: it weighted the current unprofitability heavily and underweighted the pipeline of regulatory catalysts that were publicly visible — the self-certification restoration (Jul 20) was in hand at the Jul 31 rebalance, and the MAX-7 cert was a known near-dated possibility. For a turnaround story, certification milestones are the cheap-to-identify catalysts; the Jul 31 note mentions the Jul 20 restoration as a "genuine structural positive" yet still cut the score. That's a framework bias: the score-weighted book gives no credit for turnaround-option value, so any name in mid-turnaround will be structurally excluded. Cost -30 bps this time. A fixable coverage gap, not just luck.`,
      },
      {
        sym: "HD",
        ret: "+9.52%",
        bps: "-28.5 bps",
        tag: "not attributable",
        body: `Home Depot rose with the broad consumer/risk-on tape and housing-tailwind hopes (21st Century ROAD to Housing Act) — no single HD-specific catalyst inside the period (its Q2 earnings was Aug 18, after period end). The agent had no meaningful position (-0.15 Jul 17 → +0.05 Jul 31, weight 0.55%); the negative contribution is mostly DJIA-side gain against near-zero F1 weight. The thesis — margin compression, rate headwind, DIY softness — was directionally fair and the near-zero weight was a score outcome, not an oversight. A mature retailer drifting up 9.5% in a risk-on tape with no name catalyst is closer to beta noise than an analytical miss. Not attributable; process fine.`,
      },
      {
        sym: "MMM",
        ret: "+7.85%",
        bps: "-15.4 bps",
        tag: "right call, bad luck",
        body: `3M's move came from its Jul 29 Q2 beat and guidance raise ($6.50B sales, $933M net income, stock +6.3%), plus the $5.73B buyback completion — an earnings-event pop that the Jul 17 decision had actually flagged as a two-way catalyst ("Q2 earnings due July 21… could go either way"). The agent's exclusion was grounded in deteriorating multi-quarter fundamentals (EPS -39.7% YoY, equity eroded 29% in a quarter, PFAS tail risk, 33.5x PE on depressed earnings). The Q2 beat was genuinely new information that partially contradicted the trend-read — that's what earnings events do. Notably the agent's Jul 31 note acknowledged the beat and still scored -0.45 on valuation discipline (33.5x near top of range, earnings yield 3.0% vs 4.68% risk-free). The stock is up 22% in ~2 months while consensus 2026 EPS still requires heavy H2 acceleration — the caution may yet be vindicated. Justified underweight, adverse event; no fix needed.`,
      },
      {
        sym: "CSCO",
        ret: "+7.69%",
        bps: "-10.0 bps",
        tag: "not attributable",
        body: `Cisco drifted up with the tech re-rating (it's an AI-networking beneficiary via the same theme that drove MSFT/CRM), though its specific catalyst (Q4 FY26 earnings) fell Aug 12, after period end. The agent's exclusion (-0.35 → -0.15) was a valuation call: PE expanded 40–46% to ~40x while OCF deteriorated, earnings yield 2.4% vs 4.68% risk-free. That's a defensible discipline — paying 40x for a 10% grower with deteriorating cash conversion — but the period move was sector beta, not a thesis event. The score framework's rate-relative-valuation discipline will systematically exclude expensive-multiple names during multiple-expansion regimes; that's a known cost of the framework, not an error in this instance. Not attributable to process failure.`,
      },
    ] as Array<{ sym: string; ret: string; bps: string; tag: string; body: string }>,
  },

  verdict: {
    title: "Verdict — and what we're fixing",
    body: `The process was sound, and this period's +330 bps active return was mostly earned, not lucky. Roughly 270 of the 330 bps came from the top five contributors, and every one of those five was an explicit, well-reasoned, correctly-sized score-weighted position (MSFT full weight into a flagged catalyst; CAT zero-weight on a valuation-decoupling thesis that then played out). The two big calls the agent got wrong (BA, AMGN) were small in aggregate (-64 bps combined) and one of them (AMGN) was an earnings-event coin flip on a genuinely leveraged name.`,
    fixes: [
      {
        head: "Turnaround-option blindness (the BA lesson)",
        body: `The score-weighted book structurally cannot hold a name in mid-turnaround: current-margin names like BA get scored on today's unprofitability, so regulatory/certification catalysts that are cheap to enumerate get no weight. The Jul 31 BA note literally listed the Jul 20 self-certification restoration as a "genuine structural positive" and still cut the score — the pillar structure has no slot for "known dated catalyst with option character." A modest fix: when Pillar 3 identifies a dated catalyst, allow a small positive position (or prevent score deterioration) even when Pillar 1 is ugly, rather than binary exclusion. This is the one change that would have been justified ex-ante and would have recovered ~30 bps.`,
      },
      {
        head: "Earnings-event sizing",
        body: `Both negative contributors that hurt (AMGN, MMM) were earnings-event pops against justified underweights made days before the events. The framework re-scores on rebalance dates that sit between a name and its known earnings date. An explicit rule — "don't initiate or deepen a zero-weight exclusion within N days of a dated binary event unless the fundamental case is extreme" — would reduce this avoidable drag without changing any analytical judgment.`,
      },
    ],
    dontChase: `The IT overweight itself (+13.6% sector tilt) was the expression of individual name calls (MSFT/NVDA/CRM scored on their own merits), not a sector bet — the sector table confirms the tilts and the calls are the same thing. Don't retrofit a "sector-timing skill" narrative. MSFT's magnitude (15.5% single-day, record cap gain) was not forecastable; the agent sized correctly for a re-rating, and the outcome exceeded the thesis. HD/CSCO drifting up on beta while excluded on rate-relative valuation is the designed cost of the discipline in a multiple-expansion regime — it will reverse in compression regimes. Some of this was the wind. Most of it was us.`,
  },
};
