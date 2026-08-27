/**
 * "F1 Commentary: A self-reflection from our agent across 2 opposite regimes"
 *
 * Compares two periods where the same agent, same scoring framework, same
 * score-weighted book produced opposite outcomes:
 *   - June 1-17, 2026:  F1 -0.75% vs DJIA +0.81%  (-214 bps active)
 *   - Jul 23-Aug 7, 2026: F1 +8.5% vs DJIA +4.5%  (+330 bps active)
 */

export const f1CommentaryContent = {
  meta: {
    slug: "f1-commentary-2026-07-23",
    title: "F1 Commentary: A self-reflection from our agent across 2 opposite regimes",
    description:
      "Same agent, same book, opposite outcomes. We study two regimes back-to-back to separate skill from luck.",
    date: "2026-08-26",
  },

  series: "F1 Commentary",
  seriesSub: "A self-reflection from our agent",

  intro: {
    kicker: "At F1, we don't take things for granted",
    body: `In late July, F1 returned +8.5% against the DJIA's +4.5% — +330 basis points of active return in less than 2 weeks, pulling our cumulative alpha past +500 bps since we went live. Substantial for a systematic low-vol strategy. But six weeks earlier, over June 1-17, the same agent with the same book lost -214 bps in a violent rotation out of the exact sectors we were positioned for. Same conviction, same scores, opposite outcomes. So we set our fintel agent to reflect on itself across both regimes — was July skill, or was June just bad luck? Or is the honest answer that a fundamental, valuation-anchored book is regime-exposed by design, and the real question is which parts of the process are fixable?`,
  },

  regimes: {
    up: {
      label: "AI re-rating",
      dates: "Jul 23 – Aug 7",
      f1Return: "+8.5%",
      djiaReturn: "+4.5%",
      active: "+330 bps",
    },
    down: {
      label: "Great Rotation",
      dates: "Jun 1 – 17",
      f1Return: "-0.75%",
      djiaReturn: "+0.81%",
      active: "-214 bps",
    },
  },

  context: {
    title: "Two regimes, same book",
    blocks: [
      {
        head: "Jun 1-17 — the Great Rotation out of AI/tech",
        body: `A violent rotation out of mega-cap tech and into value, industrials, healthcare and financials. The DJIA rose ~0.8% while the Nasdaq fell heavily (June 5 alone: Nasdaq -4.2%). MSFT had its worst June since 2000; CRM fell 14 straight sessions on "SaaSpocalypse" fears. CAT re-rated to record highs on the AI data-center power thesis. The Dow's price-weighted, low-tech construction made it the rotation's natural beneficiary — exactly the sectors F1 was underweight.`,
      },
      {
        head: "Jul 23-Aug 7 — the AI-monetization re-rating",
        body: `Microsoft's Q4 beat triggered the largest one-day market-cap gain for any U.S. company and paced the Dow's rebound. Oil slid as tensions eased, the Dow closed at a record, and it was the best week for all major indexes since April. Within the DJIA, tech/AI names led while industrials and energy lagged. F1's overweight to tech and its absence from industrials and energy aligned almost perfectly with this shape.`,
      },
    ],
  },

  scoreCards: [
    { sym: "CRM",  june: { score: 0.32, activeW: 4.2,  ret: -26.0, contrib: -123.6 }, july: { score: 0.30, activeW: 4.6,  ret: 22.8, contrib: 89.3 } },
    { sym: "CAT",  june: { score: -0.52, activeW: -11.2, ret: 10.5, contrib: -114.5 }, july: { score: -0.41, activeW: -9.3,  ret: -5.9, contrib: 51.1 } },
    { sym: "NVDA", june: { score: 0.45, activeW: 7.0,  ret: -8.8,  contrib: -64.1 }, july: { score: 0.45, activeW: 7.7,  ret: 7.3,  contrib: 53.6 } },
    { sym: "MSFT", june: { score: 0.35, activeW: 2.6,  ret: -17.7, contrib: -48.1 }, july: { score: 0.45, activeW: 4.7,  ret: 31.0, contrib: 143.1 } },
    { sym: "DIS",  june: { score: 0.21, activeW: 4.1,  ret: -1.9,  contrib: -17.4 }, july: { score: 0.30, activeW: 5.6,  ret: 13.0, contrib: 75.4 } },
    { sym: "JPM",  june: { score: 0.39, activeW: 4.0,  ret: 12.4, contrib: 48.6 }, july: { score: 0.34, activeW: 3.4,  ret: 2.2,  contrib: 4.1 } },
    { sym: "AXP",  june: { score: 0.38, activeW: 4.5,  ret: 8.6,  contrib: 24.0 }, july: { score: 0.30, activeW: 2.9,  ret: 0.0,  contrib: 2.7 } },
    { sym: "CVX",  june: { score: -0.42, activeW: -2.2, ret: -4.4, contrib: 9.2 }, july: { score: -0.26, activeW: -2.1, ret: -4.0, contrib: 7.9 } },
    { sym: "AMGN", june: { score: 0.18, activeW: 0.1,  ret: 3.8,  contrib: 9.8 }, july: { score: 0.01, activeW: -2.7, ret: 10.6, contrib: -33.6 } },
    { sym: "GS",   june: { score: 0.12, activeW: -10.2, ret: 4.8,  contrib: -55.8 }, july: { score: 0.24, activeW: -6.0, ret: -3.3, contrib: 34.4 } },
  ] as Array<{
    sym: string;
    june: { score: number; activeW: number; ret: number; contrib: number };
    july: { score: number; activeW: number; ret: number; contrib: number };
  }>,

  analysis: {
    tagLegend: [
      { tag: "aligned", desc: "Thesis matched the realized driver — the call was correct on the merits." },
      { tag: "right call, bad luck", desc: "Thesis was sound but an adverse event (often an earnings pop) went against it." },
      { tag: "mis-aligned", desc: "Thesis had a real gap — the process was wrong, not just unlucky." },
      { tag: "not attributable", desc: "Move was sector / beta noise with no name-specific catalyst — process fine." },
    ],
    blocks: [
      {
        sym: "CRM",
        juneTag: "mis-aligned",
        julyTag: "aligned",
        juneBps: "-123.6 bps",
        julyBps: "+89.3 bps",
        body: `The mirror image. In June, the agent raised CRM from +0.25 to +0.35 on "PE at 2nd percentile of its 1-year range" while the market was repricing SaaS durability on agentic-AI seat-cannibalization fears — a value trap in a regime change. In July, the same "cheap trailing multiple" signal was right: the software re-rating off MSFT's AI-monetization signal made the floor real. Same signal, opposite outcome. The lesson: percentile-of-own-history is regime-dependent. When a structural narrative is re-rating a sector, the score must address earnings-base durability, not just multiple percentile.`,
      },
      {
        sym: "CAT",
        juneTag: "mis-aligned",
        julyTag: "aligned",
        juneBps: "-114.5 bps",
        julyBps: "+51.1 bps",
        body: `The other side of the same mirror. "PE 46.5x vs 20-25x historical implies 84-88% drawdown" was the decisive signal both times. In June, industrials re-rated on AI power demand (record $63B backlog, engine capacity tripling) — the expensive multiple was justified, and zero weight cost -114.5 bps. In July, the data-center power narrative deflated — the expensive multiple was a ceiling, and zero weight earned +51.1 bps. The agent explicitly acknowledged the AI-power secular thesis was real in June, then let valuation-pillar discipline veto it. When a multiple regime breaks for a structural reason, "expensive vs own history" stops being a usable signal.`,
      },
      {
        sym: "MSFT",
        juneTag: "mis-aligned",
        julyTag: "aligned",
        juneBps: "-48.1 bps",
        julyBps: "+143.1 bps",
        body: `The painful part of June: both write-ups identified the exact risks that then dominated — operating margin compressing sequentially, FCF compressed, capex $35B above consensus, zero equity-risk premium vs the 10Y — and still scored +0.35 both times. Risk identification didn't propagate into the score. In July, the same risks existed but a dated catalyst (Jul 29 earnings) validated the position at full size. The synthesis: the framework needs to distinguish "risk identified, no near-dated catalyst to resolve it" (June — should score lower) from "risk identified, dated catalyst could resolve it" (July — full weight justified). It's catalyst-conditioned risk weighting, not blanket risk aversion.`,
      },
      {
        sym: "NVDA",
        juneTag: "right call, bad luck",
        julyTag: "aligned",
        juneBps: "-64.1 bps",
        julyBps: "+53.6 bps",
        body: `The one name that was genuinely the same call both times. June: semiconductor crowding unwind and rate pressure on hyper-growth multiples — consensus-overshoot mechanics the agent itself flagged (BofA 73%-long-semis survey). Fundamentals did nothing wrong: Q1 was blowout, Q2 guide $91B, buyback $80B. The +0.45 score was defensible; the de-rating was a sector-level rotation event. July: the AI re-rating lifted NVDA with it, and the same +0.45 earned +53.6 bps. Right call both times; June was bad luck, July was the payoff. No fix without becoming a momentum trader.`,
      },
      {
        sym: "DIS",
        juneTag: "not attributable",
        julyTag: "aligned",
        juneBps: "-17.4 bps",
        julyBps: "+75.4 bps",
        body: `June: a mild drag from a 4.1% overweight in a tape that didn't reward media/value — closer to beta noise than a thesis event. July: the Aug 5 Q3 earnings event (inside the period) with streaming margin inflection was the dated catalyst the agent identified, and the 5.6% overweight was correctly sized by score. The call was the same shape both times; the catalyst arrived in July and not in June. Process fine across both.`,
      },
      {
        sym: "JPM",
        juneTag: "aligned",
        julyTag: "aligned",
        juneBps: "+48.6 bps",
        julyBps: "+4.1 bps",
        body: `The regime-independent win. June: financials leadership in the rotation plus capital-markets strength (SpaceX IPO mandate, record M&A pipelines). The +0.35/+0.40 thesis was precisely this — best-ever Q1, PE at the floor of its range, SpaceX mandate as catalyst. The overweight worked as designed. July: a smaller contribution (+4.1 bps) in a tech-led tape, but the thesis held. This is the alpha that survives a regime flip — fundamental franchise-quality calls that aren't regime-dependent.`,
      },
      {
        sym: "AXP",
        juneTag: "aligned",
        julyTag: "aligned",
        juneBps: "+24.0 bps",
        julyBps: "+2.7 bps",
        body: `Same story as JPM — financials rotation into a high-ROE franchise at a floor multiple. The +0.45/+0.35 thesis (record Q1, PE/P/B at 1-year floors) is what the tape rewarded in June. Largest single-name overweight (+4.5%) worked as designed. July: minimal contribution but no thesis violation. Consistent process win.`,
      },
      {
        sym: "CVX",
        juneTag: "aligned",
        julyTag: "aligned",
        juneBps: "+9.2 bps",
        julyBps: "+7.9 bps",
        body: `Zero-weight avoidance that worked in both regimes. June: oil retreated as the Mideast premium unwound, and CVX's 33x-on-declining-GAAP-earnings multiple compressed. July: oil slid again on geopolitical de-escalation. The -0.35/-0.45 thesis (extreme valuation, deteriorating cash flow, oil tailwind already priced) was correct on both legs both times. Clean aligned avoidance across regimes — the energy exclusion thesis was consistent.`,
      },
      {
        sym: "AMGN",
        juneTag: "not attributable",
        julyTag: "right call, bad luck",
        juneBps: "+9.8 bps",
        julyBps: "-33.6 bps",
        body: `June: essentially index-weight (+0.09% active), contribution came from the name's +3.8% return in the healthcare bid — beta, not thesis. July: the agent correctly downgraded to zero on real concerns (leverage, patent cliff, Enbrel -37% YoY), then Amgen rallied on an Aug 4 earnings beat — an event the agent knew was coming but couldn't call. Right process, adverse single-event outcome. The framework can't distinguish "cheap and broken" from "cheap and inflecting" — a known limitation, not an analytical error.`,
      },
      {
        sym: "GS",
        juneTag: "not attributable",
        julyTag: "aligned",
        juneBps: "-55.8 bps",
        julyBps: "+34.4 bps",
        body: `The price-weighted benchmark artifact. GS's $1,092 share price = 12.9% DJIA weight, so even a mild underweight of a fairly-valued name is a large active bet. June: -55.8 bps from financials-sector rotation beta the thesis never addressed. July: +34.4 bps as the same underweight avoided a -3.3% drift. The agent's +0.15/+0.10 "fully priced, no margin of safety" stance was reasonable both times — the bps swing is a benchmark-construction effect, not a process signal. For high-share-price DJIA components, exclusion should be treated as a large active bet requiring a higher conviction bar.`,
      },
    ] as Array<{
      sym: string;
      juneTag: string;
      julyTag: string;
      juneBps: string;
      julyBps: string;
      body: string;
    }>,
  },

  verdict: {
    title: "Verdict — across both regimes",
    body: `The honest read: July's +330 bps was mostly earned; June's -214 bps was mostly fixable process error, not luck. The same framework produced both. Roughly 270 of July's 330 bps came from five explicit, well-reasoned, correctly sized positions. June's -214 bps is concentrated in two real process errors (CRM -123.6, CAT -114.5 = -238 bps combined) plus one discipline error (MSFT -48 bps), against genuinely aligned wins in financials and energy. The fixable version of the June book — no CRM overweight, a small CAT weight, MSFT at +0.15 — would have been roughly flat-to-positive. The framework isn't broken; it's regime-fragile, and the fixes make it less so without sacrificing the fundamental discipline that generated July's alpha.`,
    fixes: [
      {
        head: "Valuation-anchoring in regime changes (CRM, CAT)",
        body: `Percentile-of-own-history multiples were used as the decisive signal for the two largest negative contributors in June, in opposite directions — buying a "cheap" software name mid-structural-derating and hard-excluding an industrial mid-structural-re-rating. Fix: when a live structural narrative (agentic AI vs SaaS; AI power demand vs cyclicals) is re-rating a sector, require the score to address earnings-base durability, not just multiple percentile. A cheap multiple on a contested earnings base and an expensive multiple on a re-based one are both traps.`,
      },
      {
        head: "Risk flags must move the score (MSFT)",
        body: `Identified risks (capex vs FCF divergence, margin compression, zero ERP) were listed in the rationale but didn't reduce the score. Fix: a mechanical mapping — e.g., capex growing >2x revenue growth with FCF declining caps the pillar-2 score at mildly positive, regardless of franchise quality. More precisely: distinguish "risk identified, no near-dated catalyst to resolve it" (should score lower) from "risk identified, dated catalyst could resolve it" (full weight justified).`,
      },
      {
        head: "Price-weighted benchmark awareness (CAT, GS)",
        body: `Zero-weighting CAT (11.2% DJIA weight) and underweighting GS (12.9%) together created ~250 bps of structural active exposure to two names on valuation discipline alone. Fix: for high-share-price DJIA components, treat exclusion/underweight as a large active bet requiring a higher conviction bar (or an explicit sector-level cap), rather than letting score-threshold mechanics make the bet implicitly.`,
      },
    ],
    dontChase: `The names that worked in both directions of the rotation — JPM, AXP, CVX — were fundamental franchise-quality calls that weren't regime-dependent. That's the alpha worth trusting. The IT overweight itself was the expression of individual name calls, not a sector bet — don't retrofit a "sector-timing skill" narrative. And NVDA's June loss was a justified call hurt by a sector rotation the agent partially flagged — right call, bad luck; no fix without becoming a momentum trader. The honest conclusion across both regimes: the process generates alpha when its fundamental tilts align with the tape, and bleeds when they don't. The fixable gaps make it less regime-fragile without changing what it is.`,
  },
};
