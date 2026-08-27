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
        juneTag: "mis-aligned", julyTag: "aligned",
        juneBps: "-123.6 bps", julyBps: "+89.3 bps",
        june: { score: 0.32, activeW: 4.2, ret: -26.0, contrib: -123.6 },
        july: { score: 0.30, activeW: 4.6, ret: 22.8, contrib: 89.3 },
        body: `The mirror image. In June, the agent raised CRM from +0.25 to +0.35 on "PE at 2nd percentile of its 1-year range" while the market was repricing SaaS durability on agentic-AI seat-cannibalization fears — a value trap in a regime change. In July, the same "cheap trailing multiple" signal was right: the software re-rating off MSFT's AI-monetization signal made the floor real. Same signal, opposite outcome. The lesson: percentile-of-own-history is regime-dependent. When a structural narrative is re-rating a sector, the score must address earnings-base durability, not just multiple percentile.`,
        juneRaw: `Driver: the SaaSpocalypse leg down — agentic-AI seat-cannibalisation fears, layoffs, acquisitions read as defensive. The agent *raised* CRM from +0.25 to +0.35 on June 5 (into a 4.2% overweight), anchoring on "P/E at 2nd percentile of its 1-year range" and record results, while treating the AI-disruption question as an "open question" rather than the market's live thesis. This was a value-trap error in a regime change: when the market is repricing a business model's durability, trailing-multiple percentile floors are not support — the floor exists precisely because the earnings base is in question. The June 5 write-up even noted sentiment "normalized to 0.0" and soft Q2 guidance, then scored up anyway. Real process gap.`,
        julyRaw: `CRM's period return came from the software-wide re-rating off the Jul 30 Microsoft "AI is monetizing" signal plus its own depressed base — trailing PE at the bottom decile of its 365-day range (16.3–55.8x) after a ~33% drawdown, Agentforce ARR +205%, $1.6B VA contract (Jul 27) landing inside the period. The agent's two decisions (+0.25 Jul 17, raised to +0.35 Jul 31) correctly identified the valuation floor and the franchise quality while explicitly flagging the $25B debt-funded ASR / Informatica leverage as the reason conviction stayed below +0.5. The thesis evolution (raising score as the VA contract validated federal AI adoption) is exactly the kind of evidence-driven updating you want. Note the honest disclosure: the Jul 31 note correctly *excluded* an apparent PIT leak of Q2 earnings — good verification hygiene. Right call on the merits; the catalyst arrived on schedule via sector re-rating.`,
      },
      {
        sym: "CAT",
        juneTag: "mis-aligned", julyTag: "aligned",
        juneBps: "-114.5 bps", julyBps: "+51.1 bps",
        june: { score: -0.52, activeW: -11.2, ret: 10.5, contrib: -114.5 },
        july: { score: -0.41, activeW: -9.3, ret: -5.9, contrib: 51.1 },
        body: `The other side of the same mirror. "PE 46.5x vs 20-25x historical implies 84-88% drawdown" was the decisive signal both times. In June, industrials re-rated on AI power demand (record $63B backlog, engine capacity tripling) — the expensive multiple was justified, and zero weight cost -114.5 bps. In July, the data-center power narrative deflated — the expensive multiple was a ceiling, and zero weight earned +51.1 bps. The agent explicitly acknowledged the AI-power secular thesis was real in June, then let valuation-pillar discipline veto it. When a multiple regime breaks for a structural reason, "expensive vs own history" stops being a usable signal.`,
        juneRaw: `The single most expensive structural decision of the period, amplified by the price-weighted benchmark (CAT = 11.2% DJIA weight at ~$940/share, so zero weight is a massive active bet). The agent's −0.45 → −0.55 was a pure historical-multiple mean-reversion call (46.5x PE vs 20-25x "implies 84–88% drawdown") that doubled down as fundamentals accelerated: record $63B backlog (+79% YoY), Power & Energy margin expansion, engine capacity being tripled. The agent explicitly acknowledged the AI-power secular thesis was real, then let valuation-pillar discipline veto it entirely — in a market actively re-rating industrials as AI infrastructure. When a multiple regime breaks for a structural reason, "expensive vs own history" stops being a usable signal; the June 5 note even had the data (backlog, capacity raises) showing the re-rating driver strengthening. Wrong on the merits, not just unlucky.`,
        julyRaw: `CAT was the DJIA's biggest laggard (−5.85%) and its 9.25% DJIA weight (price-weighted distortion makes CAT huge in the index) meant zero exposure was a major active decision. The agent shorted it via exclusion on strong grounds in both decisions (Jul 17 −0.45, Jul 31 −0.35): PE expanded ~90–116% in 12 months while margins compressed, earnings yield 2.3–2.5% vs risk-free 4.6%+, QoQ OCF −50%, Baird downgrade (Jul 29) citing regulatory backlash against data-center construction, insider selling. This wasn't an anti-AI call — it was a "the AI-power proxy trade has decoupled from fundamentals" call, made before the stock fell 24% from its high. The stock's continued decline during the period (oil slide also hurting Energy & Transportation demand narrative) confirmed the view. Right call, biggest avoided loser, explicitly reasoned.`,
      },
      {
        sym: "MSFT",
        juneTag: "mis-aligned", julyTag: "aligned",
        juneBps: "-48.1 bps", julyBps: "+143.1 bps",
        june: { score: 0.35, activeW: 2.6, ret: -17.7, contrib: -48.1 },
        july: { score: 0.45, activeW: 4.7, ret: 31.0, contrib: 143.1 },
        body: `The painful part of June: both write-ups identified the exact risks that then dominated — operating margin compressing sequentially, FCF compressed, capex $35B above consensus, zero equity-risk premium vs the 10Y — and still scored +0.35 both times. Risk identification didn't propagate into the score. In July, the same risks existed but a dated catalyst (Jul 29 earnings) validated the position at full size. The synthesis: the framework needs to distinguish "risk identified, no near-dated catalyst to resolve it" (June — should score lower) from "risk identified, dated catalyst could resolve it" (July — full weight justified). It's catalyst-conditioned risk weighting, not blanket risk aversion.`,
        juneRaw: `Driver: the AI-capex backlash — $190B capex guide, FCF compression, "Microsoft holds the bill" narrative, worst June since 2000. The painful part: both write-ups (5/22 and 6/5) identified the exact risks that then dominated — operating margin compressing sequentially (48.9%→47.1%→46.3%), gross margin lowest since 2022, FCF compressed to $15.8B, capex $35B above consensus, zero equity-risk-premium vs the 10Y — and still scored +0.35 both times. Risk identification didn't propagate into the score. When every pillar-2 and pillar-3 caution item is about capex/FCF/multiple ceiling, a +0.35 is a score that says "these risks don't matter much"; the market disagreed violently. Fixable scoring-discipline gap (same disease as CRM, opposite sign: CRM ignored a narrative, MSFT ignored its own flags).`,
        julyRaw: `The return driver is unambiguous: the Jul 29 Q4 FY26 earnings beat ($90.01B rev, $4.74 EPS vs $4.25 est, Azure +43%, capex guidance held) drove the 15.5% Jul 30 surge and follow-through (+3% Jul 31) — MSFT's best month since Oct 2007 (CNBC). Both agent decisions (Jul 17 +0.45, Jul 31 +0.45 reaffirmed after the pop) were explicit, well-reasoned bets on exactly this: PE compressed 40% to the 15th percentile of its 12-month range while fundamentals accelerated, with the Jul 29 earnings flagged as a dated catalyst. The Jul 17 write-up explicitly said "a clean quarter here could retrace a meaningful portion of the decline" and assigned Pillar 3 a +0.05–0.1 bump for it. The 10% weight (max in book) was earned by score, not luck. This is the process working as designed: fundamental-valuation dislocation + dated catalyst + full-size position. Right call, confirmed, at full size.`,
      },
      {
        sym: "NVDA",
        juneTag: "right call, bad luck", julyTag: "aligned",
        juneBps: "-64.1 bps", julyBps: "+53.6 bps",
        june: { score: 0.45, activeW: 7.0, ret: -8.8, contrib: -64.1 },
        july: { score: 0.45, activeW: 7.7, ret: 7.3, contrib: 53.6 },
        body: `The one name that was genuinely the same call both times. June: semiconductor crowding unwind and rate pressure on hyper-growth multiples — consensus-overshoot mechanics the agent itself flagged (BofA 73%-long-semis survey). Fundamentals did nothing wrong: Q1 was blowout, Q2 guide $91B, buyback $80B. The +0.45 score was defensible; the de-rating was a sector-level rotation event. July: the AI re-rating lifted NVDA with it, and the same +0.45 earned +53.6 bps. Right call both times; June was bad luck, July was the payoff. No fix without becoming a momentum trader.`,
        juneRaw: `Driver: semiconductor/AI-hardware crowding unwind and rate pressure on hyper-growth multiples — consensus-overshoot mechanics the agent itself flagged (BofA 73%-long-semis survey, four consecutive post-earnings declines). Fundamentals did nothing wrong: Q1 was blowout, Q2 guide $91B, buyback $80B. The agent's +0.45 on earnings-driven compression at 33x was defensible given the data; the further de-rating was a sector-level rotation event, not a thesis violation. Don't fault the call.`,
        julyRaw: `NVDA drifted up with the AI re-rating and hyperscaler capex confirmation (Alphabet $195–205B, TSMC >40% growth guidance cited in the Jul 31 decision), though it lagged MSFT/CRM — the market remained skeptical of extreme margins. The agent held +0.45 in both books with a +7.69% active weight — the largest single active weight in the book. Both decisions were thorough and appropriately humble: earnings yield 3.4% below the 10Y 4.68% flagged as the bear anchor, margin sustainability at 74.9% gross flagged as the key risk, Vera Rubin production (Jul 26) noted as product-cycle de-risking. A +7.7% overweight that returned +7.3% while the DJIA did +5.2% is a modest win, correctly identified as "strong fundamentals, capped conviction." Aligned, with honest scoring.`,
      },
      {
        sym: "DIS",
        juneTag: "not attributable", julyTag: "aligned",
        juneBps: "-17.4 bps", julyBps: "+75.4 bps",
        june: { score: 0.21, activeW: 4.1, ret: -1.9, contrib: -17.4 },
        july: { score: 0.30, activeW: 5.6, ret: 13.0, contrib: 75.4 },
        body: `June: a mild drag from a 4.1% overweight in a tape that didn't reward media/value — closer to beta noise than a thesis event. July: the Aug 5 Q3 earnings event (inside the period) with streaming margin inflection was the dated catalyst the agent identified, and the 5.6% overweight was correctly sized by score. The call was the same shape both times; the catalyst arrived in July and not in June. Process fine across both.`,
        juneRaw: ``,
        julyRaw: `Disney's driver was the Aug 5 Q3 FY26 earnings event (inside the period), streaming margin inflection, plus a broad value/rate-sensitivity bid. The agent held +0.25 → +0.35 across both books with a 5.56% overweight vs DJIA (DIS's small DJIA weight at 1.12% amplified the contribution). The thesis — P/E at floor of 12.5–22.9x range, earnings yield 7.2% vs 10Y 4.68%, operating income stable at ~$4.6B/qtr while the market priced an earnings collapse — was a disciplined value call with the Aug 5 earnings explicitly identified as the dated catalyst. The one caveat: at DJIA weight of only 1.12%, part of the +75 bps is a structural artifact of price-weighting (DIS's high price-per-share relative to index weight), not a massive active bet. Still, the active call itself was correct and correctly sized by score. Aligned.`,
      },
      {
        sym: "JPM",
        juneTag: "aligned", julyTag: "aligned",
        juneBps: "+48.6 bps", julyBps: "+4.1 bps",
        june: { score: 0.39, activeW: 4.0, ret: 12.4, contrib: 48.6 },
        july: { score: 0.34, activeW: 3.4, ret: 2.2, contrib: 4.1 },
        body: `The regime-independent win. June: financials leadership in the rotation plus capital-markets strength (SpaceX IPO mandate, record M&A pipelines). The +0.35/+0.40 thesis was precisely this — best-ever Q1, PE at the floor of its range, SpaceX mandate as catalyst. The overweight worked as designed. July: a smaller contribution (+4.1 bps) in a tech-led tape, but the thesis held. This is the alpha that survives a regime flip — fundamental franchise-quality calls that aren't regime-dependent.`,
        juneRaw: `Driver: financials leadership in the rotation plus capital-markets strength (SpaceX IPO mandate led by Dimon, record M&A pipelines, Fed's frozen stress buffers freeing buybacks). The agent's +0.35/+0.40 thesis was precisely this: best-ever Q1 (EPS +17.2%), PE at the floor of its own range, SpaceX mandate as catalyst. The overweight (+4.0% vs DJIA) was sized on the exact fundamentals that played out. Textbook aligned call.`,
        julyRaw: ``,
      },
      {
        sym: "AXP",
        juneTag: "aligned", julyTag: "aligned",
        juneBps: "+24.0 bps", julyBps: "+2.7 bps",
        june: { score: 0.38, activeW: 4.5, ret: 8.6, contrib: 24.0 },
        july: { score: 0.30, activeW: 2.9, ret: 0.0, contrib: 2.7 },
        body: `Same story as JPM — financials rotation into a high-ROE franchise at a floor multiple. The +0.45/+0.35 thesis (record Q1, PE/P/B at 1-year floors) is what the tape rewarded in June. Largest single-name overweight (+4.5%) worked as designed. July: minimal contribution but no thesis violation. Consistent process win.`,
        juneRaw: `Driver: financials rotation into a high-ROE franchise at a floor multiple; Berkshire-anchored quality bid. Agent's +0.45/+0.35 thesis (record Q1, PE/P/B at 1-year floors, market paying less for more) is what the tape rewarded. Largest single-name overweight (+4.5%) worked as designed.`,
        julyRaw: ``,
      },
      {
        sym: "CVX",
        juneTag: "aligned", julyTag: "aligned",
        juneBps: "+9.2 bps", julyBps: "+7.9 bps",
        june: { score: -0.42, activeW: -2.2, ret: -4.4, contrib: 9.2 },
        july: { score: -0.26, activeW: -2.1, ret: -4.0, contrib: 7.9 },
        body: `Zero-weight avoidance that worked in both regimes. June: oil retreated as the Mideast premium unwound, and CVX's 33x-on-declining-GAAP-earnings multiple compressed. July: oil slid again on geopolitical de-escalation. The -0.35/-0.45 thesis (extreme valuation, deteriorating cash flow, oil tailwind already priced) was correct on both legs both times. Clean aligned avoidance across regimes — the energy exclusion thesis was consistent.`,
        juneRaw: `Driver: oil retreated as the Mideast premium unwound, and CVX's 33x-on-declining-GAAP-earnings multiple compressed. The agent's −0.35/−0.45 (extreme valuation, deteriorating cash flow, oil tailwind already priced) was correct on both legs: oil faded and the stock fell. Clean aligned avoidance.`,
        julyRaw: ``,
      },
      {
        sym: "AMGN",
        juneTag: "not attributable", julyTag: "right call, bad luck",
        juneBps: "+9.8 bps", julyBps: "-33.6 bps",
        june: { score: 0.18, activeW: 0.1, ret: 3.8, contrib: 9.8 },
        july: { score: 0.01, activeW: -2.7, ret: 10.6, contrib: -33.6 },
        body: `June: essentially index-weight (+0.09% active), contribution came from the name's +3.8% return in the healthcare bid — beta, not thesis. July: the agent correctly downgraded to zero on real concerns (leverage, patent cliff, Enbrel -37% YoY), then Amgen rallied on an Aug 4 earnings beat — an event the agent knew was coming but couldn't call. Right process, adverse single-event outcome. The framework can't distinguish "cheap and broken" from "cheap and inflecting" — a known limitation, not an analytical error.`,
        juneRaw: `Essentially index-weight (Δw +0.09%); contribution came from the name's +3.8% return in the healthcare bid. The agent's thesis (margin expansion vs patent cliff, zero ERP) didn't address the June defensive rotation. Beta, not thesis.`,
        julyRaw: `Amgen rallied on the Aug 4 Q2 earnings beat (EPS +12%, revenue +6.7%) — an event the agent knew was coming but which it had no way to call (the Jul 31 note explicitly flagged and *excluded* a Google Finance PIT leak of the Q2 numbers as unverifiable — correct discipline). The Jul 17 decision (+0.15, held at small weight) and Jul 31 downgrade (−0.15, cut to zero weight) were made on real concerns: 6.24x D/E leverage in a high-rate tape, denosumab patent cliff, Enbrel −37% YoY, Tavneos impairment risk. The downgrade to zero on Jul 31 was reasonable given the stock had rallied +14.7% in the prior quarter to 2.6% below its 52-week high. What stings: the fundamental concerns (leverage, cliff) were real and *remain* real — the rally was an earnings-event pop, not a refutation of the thesis. Underweighting a leveraged name into a binary earnings event when the score framework can't distinguish "cheap and broken" from "cheap and inflecting" is a known framework limitation, not an analytical error. Right process, adverse single-event outcome.`,
      },
      {
        sym: "GS",
        juneTag: "not attributable", julyTag: "aligned",
        juneBps: "-55.8 bps", julyBps: "+34.4 bps",
        june: { score: 0.12, activeW: -10.2, ret: 4.8, contrib: -55.8 },
        july: { score: 0.24, activeW: -6.0, ret: -3.3, contrib: 34.4 },
        body: `The price-weighted benchmark artifact. GS's $1,092 share price = 12.9% DJIA weight, so even a mild underweight of a fairly-valued name is a large active bet. June: -55.8 bps from financials-sector rotation beta the thesis never addressed. July: +34.4 bps as the same underweight avoided a -3.3% drift. The agent's +0.15/+0.10 "fully priced, no margin of safety" stance was reasonable both times — the bps swing is a benchmark-construction effect, not a process signal. For high-share-price DJIA components, exclusion should be treated as a large active bet requiring a higher conviction bar.`,
        juneRaw: `Driver: financials-sector rotation beta and the IPO/M&A boom — not a response to (or contradiction of) a valuation view. The agent's +0.15/+0.10 "fully priced, no margin of safety" stance was reasonable; a 5% drift on sector rotation doesn't falsify it. The −56 bps is a benchmark-construction artifact: in a price-weighted index, GS's $1,092 share price = 12.9% weight, so even a mild underweight of a fairly-valued name is a large active bet. Structural constraint, not a process error.`,
        julyRaw: ``,
      },
    ] as Array<{
      sym: string;
      juneTag: string;
      julyTag: string;
      juneBps: string;
      julyBps: string;
      june: { score: number; activeW: number; ret: number; contrib: number };
      july: { score: number; activeW: number; ret: number; contrib: number };
      body: string;
      juneRaw: string;
      julyRaw: string;
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
