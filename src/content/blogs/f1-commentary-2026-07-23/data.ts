/**
 * "F1 Commentary: A self-reflection from our agent across 2 opposite regimes"
 *
 * Compares two periods where the same agent, same scoring framework, same
 * score-weighted book produced opposite outcomes:
 *   - June 1-17, 2026:  F1 -0.75% vs DJIA +0.81%  (-156 bps active)
 *   - Jul 23-Aug 7, 2026: F1 +8.5% vs DJIA +4.5%  (+400 bps active)
 */

export const f1CommentaryContent = {
  meta: {
    slug: "f1-commentary-2026-07-23",
    title: "F1 Commentary: A self-reflection from our agent",
    description:
      "Studying two regimes back-to-back to separate skill from luck.",
    date: "2026-08-26",
  },

  series: "F1 Commentary",
  seriesSub: "A self-reflection from our agent",

  intro: {
    kicker: "At F1, we don't take things for granted",
    body: `In late July, F1 returned +8.5% against the DJIA's +4.5% — +400 basis points of active return in less than 2 weeks. Substantial for a systematic low-vol strategy. Meanwhile, six weeks earlier the same agent with the same book lost -156 bps over its favourite names. Active sector exposure is unavoidable in a small unverse like DJIA but F1 strives to be regime-independent. So we set our fintel agent to reflect on itself to identify how our process could be improved.`,
  },

  regimes: {
    up: {
      label: "AI-monetization re-rating",
      dates: "Jul 23 – Aug 7",
      f1Return: "+8.5%",
      djiaReturn: "+4.5%",
      active: "+400 bps",
    },
    down: {
      label: "Rotation out of AI/tech",
      dates: "Jun 1 – 17",
      f1Return: "-0.75%",
      djiaReturn: "+0.81%",
      active: "-156 bps",
    },
  },

  context: {
    title: "Regime context",
    blocks: [
      {
        head: "Jun 1-17 — Rotation out of AI/tech",
        body: `A violent rotation out of mega-cap tech and into value, industrials, healthcare and financials. The DJIA rose ~0.8% while the Nasdaq fell heavily (June 5 alone: Nasdaq -4.2%). MSFT had its worst June since 2000; CRM fell 14 straight sessions on "SaaSpocalypse" fears. CAT re-rated to record highs on the AI data-center power thesis. The Dow's price-weighted, low-tech construction made it the rotation's natural beneficiary — exactly the sectors F1 was underweight.`,
      },
      {
        head: "Jul 23-Aug 7 — AI-monetization re-rating",
        body: `Microsoft's Q4 beat triggered the largest one-day market-cap gain for any U.S. company and paced the Dow's rebound. Oil slid as tensions eased, the Dow closed at a record, and it was the best week for all major indexes since April. Within the DJIA, tech/AI names led while industrials and energy lagged. F1's overweight to tech and its absence from industrials and energy aligned almost perfectly with this shape.`,
      },
    ],
  },

  analysis: {
    tagLegend: [
      { tag: "right call", desc: "Thesis was sound and played out." },
      { tag: "right call, bad luck", desc: "Thesis was sound but only later played out." },
      { tag: "bad call", desc: "Thesis was not sound." },
      { tag: "bad call, good luck", desc: "Thesis was not sound but played out." },
      { tag: "not attributable", desc: "Performance cannot be attributed to thesis." },
    ],
    blocks: [
      {
        sym: "CRM",
        juneTag: "right call, bad luck", julyTag: "right call",
        juneBps: "-123.6 bps", julyBps: "+89.3 bps",
        june: { score: 0.32, activeW: 4.2, ret: -26.0, contrib: -123.6 },
        july: { score: 0.30, activeW: 4.6, ret: 22.8, contrib: 89.3 },
        body: `Same thesis both times: trailing PE at the floor of its 1-year range = cheap = buy (+0.25 → +0.35 in both periods). June was negative because the market was questioning SaaS durability on agentic-AI seat-cannibalisation fears; July was positive because MSFT's "AI is monetizing" signal vindicated the software re-rating and made the floor real. The agent was right all along — CRM was cheap and reverted to its historical multiple — it just took a catalyst the agent couldn't time. This validates a trailing-ratio approach: trust mean reversion when you trust the company and its management. The nuance: the agent treated the structural narrative as an "open question" rather than the market's live thesis, so it got bailed out by the fear being temporary rather than correctly assessing cyclical-vs-structural cheapness. If SaaS durability had been a genuine structural break, the trailing floor would have been a trap. The process improvement isn't "stop using trailing" — it's "flag when trailing cheapness coincides with a live structural narrative and require an earnings-base durability check before sizing up."`,
        juneRaw: `Driver: the SaaSpocalypse leg down — agentic-AI seat-cannibalisation fears, layoffs, acquisitions read as defensive. The agent *raised* CRM from +0.25 to +0.35 on June 5 (into a 4.2% overweight), anchoring on "P/E at 2nd percentile of its 1-year range" and record results, while treating the AI-disruption question as an "open question" rather than the market's live thesis. This was a value-trap error in a regime change: when the market is repricing a business model's durability, trailing-multiple percentile floors are not support — the floor exists precisely because the earnings base is in question. The June 5 write-up even noted sentiment "normalized to 0.0" and soft Q2 guidance, then scored up anyway. Real process gap.`,
        julyRaw: `CRM's period return came from the software-wide re-rating off the Jul 30 Microsoft "AI is monetizing" signal plus its own depressed base — trailing PE at the bottom decile of its 365-day range (16.3–55.8x) after a ~33% drawdown, Agentforce ARR +205%, $1.6B VA contract (Jul 27) landing inside the period. The agent's two decisions (+0.25 Jul 17, raised to +0.35 Jul 31) correctly identified the valuation floor and the franchise quality while explicitly flagging the $25B debt-funded ASR / Informatica leverage as the reason conviction stayed below +0.5. The thesis evolution (raising score as the VA contract validated federal AI adoption) is exactly the kind of evidence-driven updating you want. Note the honest disclosure: the Jul 31 note correctly *excluded* an apparent PIT leak of Q2 earnings — good verification hygiene. Right call on the merits; the catalyst arrived on schedule via sector re-rating.`,
      },
      {
        sym: "CAT",
        juneTag: "bad call", julyTag: "bad call, good luck",
        juneBps: "-114.5 bps", julyBps: "+51.1 bps",
        june: { score: -0.52, activeW: -11.2, ret: 10.5, contrib: -114.5 },
        july: { score: -0.41, activeW: -9.3, ret: -5.9, contrib: 51.1 },
        body: `Same trailing signal both times: "PE 46.5x vs 20-25x historical implies 84-88% drawdown" → expensive → exclude (zero weight). But the outcome flipped on how much the structural driver recovered. In June, industrials were re-rating on AI power demand (record $63B backlog, engine capacity tripling) — the expensive multiple was fully justified by a live structural driver, so trailing mean-reversion was flat wrong and zero weight cost -114.5 bps. In July, the data-center power narrative only half-deflated — CAT fell -5.9% (so excluding earned +51.1 bps) but the AI-power structural driver was still partially alive, not dead. The agent called a full decoupling ("the AI-power proxy trade has decoupled from fundamentals") when the reality was a half-decoupling — it missed the nuance that the driver was only half-recovered. This is the key distinction with CRM: there, the SaaS-disruption fear fully recovered by July, so trailing cheapness was cleanly vindicated (right call). Here, the structural driver only half-recovered, so the July thesis overstates the deflation — directionally right (CAT fell) but the reasoning missed that the multiple was still partially justified. Process improvement: when a structural narrative is re-rating a sector, distinguish "fully decoupled" from "half-decoupled" — require a fundamentals-based case for how much of the driver is still alive before excluding on trailing alone.`,
        juneRaw: `The single most expensive structural decision of the period, amplified by the price-weighted benchmark (CAT = 11.2% DJIA weight at ~$940/share, so zero weight is a massive active bet). The agent's −0.45 → −0.55 was a pure historical-multiple mean-reversion call (46.5x PE vs 20-25x "implies 84–88% drawdown") that doubled down as fundamentals accelerated: record $63B backlog (+79% YoY), Power & Energy margin expansion, engine capacity being tripled. The agent explicitly acknowledged the AI-power secular thesis was real, then let valuation-pillar discipline veto it entirely — in a market actively re-rating industrials as AI infrastructure. When a multiple regime breaks for a structural reason, "expensive vs own history" stops being a usable signal; the June 5 note even had the data (backlog, capacity raises) showing the re-rating driver strengthening. Wrong on the merits, not just unlucky.`,
        julyRaw: `CAT was the DJIA's biggest laggard (−5.85%) and its 9.25% DJIA weight (price-weighted distortion makes CAT huge in the index) meant zero exposure was a major active decision. The agent shorted it via exclusion on strong grounds in both decisions (Jul 17 −0.45, Jul 31 −0.35): PE expanded ~90–116% in 12 months while margins compressed, earnings yield 2.3–2.5% vs risk-free 4.6%+, QoQ OCF −50%, Baird downgrade (Jul 29) citing regulatory backlash against data-center construction, insider selling. This wasn't an anti-AI call — it was a "the AI-power proxy trade has decoupled from fundamentals" call, made before the stock fell 24% from its high. The stock's continued decline during the period (oil slide also hurting Energy & Transportation demand narrative) confirmed the view. Right call, biggest avoided loser, explicitly reasoned.`,
      },
      {
        sym: "MSFT",
        juneTag: "right call, bad luck", julyTag: "right call",
        juneBps: "-48.1 bps", julyBps: "+143.1 bps",
        june: { score: 0.35, activeW: 2.6, ret: -17.7, contrib: -48.1 },
        july: { score: 0.45, activeW: 4.7, ret: 31.0, contrib: 143.1 },
        body: `Same thesis both times: PE compressed to a low percentile of its range + accelerating fundamentals = cheap = buy. June was negative because the risks the agent itself identified (capex $35B above consensus, FCF compressed, margin compression, zero ERP vs 10Y) had no near-dated catalyst to resolve them — so they dominated the tape. July was positive because the Jul 29 earnings beat was the dated catalyst that validated the position at full size (+143.1 bps, MSFT's best month since Oct 2007). The agent was right all along — MSFT was cheap and reverted to its historical multiple — it just needed the catalyst to arrive. This validates the trailing-ratio approach. The process gap is risk-flag propagation, not the trailing signal itself: when every pillar-2/3 caution item is about capex/FCF/multiple ceiling and there is no near-dated catalyst to resolve them, the score should be lower. Distinguish "risk identified, no catalyst" (June — score down) from "risk identified, dated catalyst could resolve it" (July — full weight justified).`,
        juneRaw: `Driver: the AI-capex backlash — $190B capex guide, FCF compression, "Microsoft holds the bill" narrative, worst June since 2000. The painful part: both write-ups (5/22 and 6/5) identified the exact risks that then dominated — operating margin compressing sequentially (48.9%→47.1%→46.3%), gross margin lowest since 2022, FCF compressed to $15.8B, capex $35B above consensus, zero equity-risk-premium vs the 10Y — and still scored +0.35 both times. Risk identification didn't propagate into the score. When every pillar-2 and pillar-3 caution item is about capex/FCF/multiple ceiling, a +0.35 is a score that says "these risks don't matter much"; the market disagreed violently. Fixable scoring-discipline gap (same disease as CRM, opposite sign: CRM ignored a narrative, MSFT ignored its own flags).`,
        julyRaw: `The return driver is unambiguous: the Jul 29 Q4 FY26 earnings beat ($90.01B rev, $4.74 EPS vs $4.25 est, Azure +43%, capex guidance held) drove the 15.5% Jul 30 surge and follow-through (+3% Jul 31) — MSFT's best month since Oct 2007 (CNBC). Both agent decisions (Jul 17 +0.45, Jul 31 +0.45 reaffirmed after the pop) were explicit, well-reasoned bets on exactly this: PE compressed 40% to the 15th percentile of its 12-month range while fundamentals accelerated, with the Jul 29 earnings flagged as a dated catalyst. The Jul 17 write-up explicitly said "a clean quarter here could retrace a meaningful portion of the decline" and assigned Pillar 3 a +0.05–0.1 bump for it. The 10% weight (max in book) was earned by score, not luck. This is the process working as designed: fundamental-valuation dislocation + dated catalyst + full-size position. Right call, confirmed, at full size.`,
      },
      {
        sym: "NVDA",
        juneTag: "right call, bad luck", julyTag: "right call",
        juneBps: "-64.1 bps", julyBps: "+53.6 bps",
        june: { score: 0.45, activeW: 7.0, ret: -8.8, contrib: -64.1 },
        july: { score: 0.45, activeW: 7.7, ret: 7.3, contrib: 53.6 },
        body: `Same call both times: +0.45 on strong fundamentals (Q1 blowout, Q2 guide $91B, buyback $80B) at a compressed multiple (33x). The thesis was identical — trailing cheapness on a franchise the market was temporarily doubting. June was negative because of a semiconductor crowding unwind and rate pressure on hyper-growth multiples — a sector-level rotation event the agent itself flagged (BofA 73%-long-semis survey), not a thesis violation. July was positive because the AI re-rating lifted NVDA with it and the same +0.45 earned +53.6 bps. The agent was right all along — NVDA was cheap and reverted to its historical multiple; June was bad luck, July was the payoff. This is the textbook trailing-ratio validation: trust reversion to the mean when fundamentals are intact. No fix without becoming a momentum trader.`,
        juneRaw: `Driver: semiconductor/AI-hardware crowding unwind and rate pressure on hyper-growth multiples — consensus-overshoot mechanics the agent itself flagged (BofA 73%-long-semis survey, four consecutive post-earnings declines). Fundamentals did nothing wrong: Q1 was blowout, Q2 guide $91B, buyback $80B. The agent's +0.45 on earnings-driven compression at 33x was defensible given the data; the further de-rating was a sector-level rotation event, not a thesis violation. Don't fault the call.`,
        julyRaw: `NVDA drifted up with the AI re-rating and hyperscaler capex confirmation (Alphabet $195–205B, TSMC >40% growth guidance cited in the Jul 31 decision), though it lagged MSFT/CRM — the market remained skeptical of extreme margins. The agent held +0.45 in both books with a +7.69% active weight — the largest single active weight in the book. Both decisions were thorough and appropriately humble: earnings yield 3.4% below the 10Y 4.68% flagged as the bear anchor, margin sustainability at 74.9% gross flagged as the key risk, Vera Rubin production (Jul 26) noted as product-cycle de-risking. A +7.7% overweight that returned +7.3% while the DJIA did +5.2% is a modest win, correctly identified as "strong fundamentals, capped conviction." Aligned, with honest scoring.`,
      },
      {
        sym: "AMGN",
        juneTag: "not attributable", julyTag: "right call, bad luck",
        juneBps: "+9.8 bps", julyBps: "-33.6 bps",
        june: { score: 0.18, activeW: 0.1, ret: 3.8, contrib: 9.8 },
        july: { score: 0.01, activeW: -2.7, ret: 10.6, contrib: -33.6 },
        body: `Different reasons each period — this one does NOT fit the same-thesis/trailing-reversion pattern. June: essentially index-weight (+0.09% active), contribution was beta from the healthcare bid, not a thesis call (not attributable). July: the agent correctly downgraded to zero on real concerns (leverage, patent cliff, Enbrel -37% YoY), then Amgen rallied on an Aug 4 earnings beat — an event the agent knew was coming but couldn't call. This is "right call, bad luck" of a different kind: right process, adverse single-event outcome — not trailing reversion vindicated. The framework can't distinguish "cheap and broken" from "cheap and inflecting" — a known limitation, not an analytical error. No trailing-ratio lesson here; the process was correct and the loss was event-driven.`,
        juneRaw: `Essentially index-weight (Δw +0.09%); contribution came from the name's +3.8% return in the healthcare bid. The agent's thesis (margin expansion vs patent cliff, zero ERP) didn't address the June defensive rotation. Beta, not thesis.`,
        julyRaw: `Amgen rallied on the Aug 4 Q2 earnings beat (EPS +12%, revenue +6.7%) — an event the agent knew was coming but which it had no way to call (the Jul 31 note explicitly flagged and *excluded* a Google Finance PIT leak of the Q2 numbers as unverifiable — correct discipline). The Jul 17 decision (+0.15, held at small weight) and Jul 31 downgrade (−0.15, cut to zero weight) were made on real concerns: 6.24x D/E leverage in a high-rate tape, denosumab patent cliff, Enbrel −37% YoY, Tavneos impairment risk. The downgrade to zero on Jul 31 was reasonable given the stock had rallied +14.7% in the prior quarter to 2.6% below its 52-week high. What stings: the fundamental concerns (leverage, cliff) were real and *remain* real — the rally was an earnings-event pop, not a refutation of the thesis. Underweighting a leveraged name into a binary earnings event when the score framework can't distinguish "cheap and broken" from "cheap and inflecting" is a known framework limitation, not an analytical error. Right process, adverse single-event outcome.`,
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
    body: `The honest read: July's +400 bps was mostly earned — and June's -156 bps was mostly bad luck, not process error. The same trailing-ratio thesis drove CRM, MSFT, and NVDA in both periods; all three were right calls that reverted to their historical multiple once the catalyst arrived (MSFT's Jul 29 earnings, the software re-rating, the AI re-rating). June's -156 bps breaks down as ~236 bps of "right call, bad luck" (CRM -123.6, MSFT -48.1, NVDA -64.1) against one genuine bad call (CAT -114.5), partially offset by right-call wins in financials and energy. CAT was the only name where the thesis was not sound in either period: in June the structural re-rating was fully alive (bad call), and in July the agent called a full decoupling when the driver had only half-recovered (bad call, good luck — directionally right but the reasoning missed the nuance). The framework isn't regime-fragile in the trailing sense — trailing reversion works across regimes when the deviation is cyclical. It fails narrowly when a structural narrative re-prices a sector (CAT: AI power demand re-rating industrials), and the fix targets that specific failure mode without sacrificing the trailing discipline that generated July's alpha.`,
    fixes: [
      {
        head: "Structural-narrative awareness for trailing exclusions (CAT)",
        body: `CAT was the one name where the thesis was not sound in either period. In June, the agent used trailing expensiveness to hard-exclude an industrial mid-structural-re-rating on AI power demand — where the expensive multiple was fully justified (record $63B backlog, engine capacity tripling). In July, the agent called a full decoupling when the structural driver had only half-recovered — directionally right (CAT fell) but the reasoning missed that the AI-power thesis was still partially alive. Fix: when a live structural narrative is re-rating a sector, "expensive vs own history" is not a usable signal — distinguish "fully decoupled" from "half-decoupled" and require a fundamentals-based case for how much of the driver is still alive before excluding on trailing alone. This is the opposite of CRM/MSFT, where trailing cheapness was vindicated because the structural fear fully recovered.`,
      },
      {
        head: "Risk flags must move the score (MSFT)",
        body: `MSFT's thesis was right (trailing cheapness, vindicated in July) — but in June the agent identified risks (capex vs FCF divergence, margin compression, zero ERP) and still scored +0.35. The process gap is risk-flag propagation, not the trailing signal. Fix: distinguish "risk identified, no near-dated catalyst to resolve it" (June — score lower) from "risk identified, dated catalyst could resolve it" (July — full weight justified). It's catalyst-conditioned risk weighting, not blanket risk aversion.`,
      },
      {
        head: "Guardrail for trailing cheapness in a live structural narrative (CRM)",
        body: `CRM was a right call — trailing reversion worked because the SaaS-disruption fear was temporary, not structural. But the agent treated the structural narrative as an "open question" rather than the market's live thesis, so it got bailed out rather than correctly assessing cyclical-vs-structural cheapness. Fix: a soft guardrail — when trailing cheapness coincides with a live structural narrative, flag it and require an earnings-base durability check before sizing up. Not a hard exclusion (the agent was right), but a check that would have caught it if the fear had been structural.`,
      },
      {
        head: "Price-weighted benchmark awareness (CAT)",
        body: `CAT's 11.2% DJIA weight (price-weighted distortion at ~$940/share) meant zero weight was a massive active bet on trailing alone — -114.5 bps from a single exclusion. Fix: for high-share-price DJIA components, treat exclusion as a large active bet requiring a higher conviction bar (or an explicit sector-level cap), rather than letting score-threshold mechanics make the bet implicitly.`,
      },
    ],
    dontChase: `The names that worked in both directions of the rotation — JPM, AXP, CVX — were fundamental franchise-quality calls that weren't regime-dependent. That's the alpha worth trusting. The IT overweight itself was the expression of individual name calls, not a sector bet — don't retrofit a "sector-timing skill" narrative. And CRM, MSFT, NVDA's June losses were all right calls that hadn't played out yet — trailing reversion vindicated all three in July; no fix without becoming a momentum trader. The honest conclusion: the trailing-ratio approach works across regimes when deviations are cyclical. The one fixable gap is using trailing in a structural re-rating (CAT) — narrow, targeted, and doesn't require abandoning the discipline that generated July's alpha.`,
  },
};
