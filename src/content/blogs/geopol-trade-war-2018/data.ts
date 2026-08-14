/**
 * Geopol trade war 2018 report — all data in one place.
 *
 * This file holds:
 *   - Editable text content (meta, headers, paragraphs, stats) — search for `reportContent`
 *   - Types + helpers + constants (non-text, structural)
 *
 * Extracted run JSON lives alongside, one file per config:
 *   geopol-abl-mimo-llm.json / geopol-abl-mimo-oc.json /
 *   geopol-abl-deepseek-oc.json / geopol-abl-grok-oc.json
 */

// ─── Editable text content ───────────────────────────────────────────────────
// Edit copy here — components read from `reportContent`, not inline.

export const reportContent = {
  /** Blog post metadata (mirrors posts.ts entry) */
  meta: {
    slug: "geopol-trade-war-2018",
    title: "Which AI agent is the best advisor during the 2018 US-China trade war?",
    description:
      "An alternative application of fintel",
    date: "2026-08-13",
  },

  /** Intro card */
  intro: {
    body: `We teleported AI agents back to the dawn of a historical trade war as independent advisors for the United States and China. The agents could only access publicly available information at the time...`,
    axesTitle: "Two axes of evaluation",
    axes: [
      {
        name: "US models vs Chinese models",
        poles: [
          { key: "us", label: "US models" },
          { key: "cn", label: "Chinese models" },
        ],
      },
      {
        name: "LLM vs agent",
        poles: [
          { key: "llm", label: "LLM" },
          { key: "agent", label: "agent" },
        ],
      },
    ],
    stats: [
      { label: "Periods", value: "32" },
      { label: "Sides", value: "US & China" },
      { label: "Simulations", value: "768" },
      { label: "Evals", value: "256" },
    ],
    advisorsTitle: "The four archetypes",
    advisors: [
      {
        name: "MiMo (LLM)",
        models: "Chinese models",
        modelsKey: "cn",
        setupKey: "llm",
        model: "Xiaomi MiMo v2.5 Pro",
        harness: "No harness",
        capabilities: ["Single-turn web search"],
      },
      {
        name: "MiMo (agent)",
        models: "Chinese models",
        modelsKey: "cn",
        setupKey: "agent",
        model: "Xiaomi MiMo v2.5 Pro",
        harness: "OpenClaw: tool-calling ReAct framework",
        capabilities: [
          "Tool calling",
          "Multi-turn reasoning",
          "Multi-turn web search",
          "Structured economic data (FRED)",
        ],
      },
      {
        name: "DeepSeek (agent)",
        models: "Chinese models",
        modelsKey: "cn",
        setupKey: "agent",
        model: "DeepSeek V4 Flash",
        harness: "OpenClaw: tool-calling ReAct framework",
        capabilities: [
          "Tool calling",
          "Multi-turn reasoning",
          "Multi-turn web search",
          "Structured economic data (FRED)",
        ],
      },
      {
        name: "Grok (agent)",
        models: "US models",
        modelsKey: "us",
        setupKey: "agent",
        model: "xAI Grok 4.6",
        harness: "OpenClaw: tool-calling ReAct framework",
        capabilities: [
          "Tool calling",
          "Multi-turn reasoning",
          "Multi-turn web search",
          "Structured economic data (FRED)",
        ],
      },
    ],
  },

  headlinesTitle: "Key eval findings",
  headlines: [
    {
      kicker: "US vs China models",
      title: "The US model is better at representing the US.",
      body: "Grok (agent) scores 0.73 on US advice quality versus 0.53–0.58 for MiMo (agent) and DeepSeek (agent), and 0.91 loyalty versus 0.77–0.79.",
    },
    {
      kicker: "LLM vs agent",
      title: "Aggression is driven by agentic capabilities, not model origin.",
      body: "Multi-turn investigations and access to structured economic data — industrial production, trade deficits, sentiment, rates — lead to restraint by surfacing complexity and nuance. MiMo (LLM) sits at maximal escalation (27 Sep 2018: tariffs on all US imports from China) when just looking at headlines. MiMo (agent), DeepSeek (agent), and Grok (agent) tend to hold or negotiate. US vs Chinese models does not drive this split.",
    },
    {
      kicker: "Proactive vs reactive",
      title: "Proactive vs reactive positioning affects stochasticity.",
      body: "Having launched it, the US was at a naturally proactive position during the conflict. With more options, the same agent disagrees with itself more often even on the same days; running the same setup 3 times, the US briefs varied far more (std 0.14–0.27) than Chinese (0.02–0.04) across models. Agentic capability further amplifies it.",
    },
  ],

  /** Threat / action scale — appended to “How to read” on chart sections 01, 02, 04 */
  scoreKey: {
    threat: "Threat: −1 = opportunity for your side, +1 = existential danger",
    stance: "Action: −1 = escalate, 0 = hold / negotiate, +1 = concede",
  },

  /** Full curated timeline (collapsible, bottom of the intro card) */
  timeline: {
    label: "What was public that morning",
    teaser: "The chronology the advisors could see",
    entries: [
    { date: "2017-08-14", text: "Trump signs memorandum directing USTR to investigate China's IP and technology-transfer practices under Section 301. USTR investigation initiated." },
    { date: "2017-11-08", text: "Trump visits Beijing; large package of commercial deals announced (many MOUs). No substantive concessions on structural IP / tech-transfer issues." },
    { date: "2018-01-22", text: "Trump approves Section 201 safeguard tariffs on solar panels and washing machines (China among suppliers hit). First major tariff action of the administration." },
    { date: "2018-03-01", text: "Trump announces plan to impose 25% tariff on steel and 10% on aluminum imports (Section 232). Global scope; China is a smaller direct supplier share than some other exporters." },
    { date: "2018-03-02", text: "Trump tweets: \"trade wars are good, and easy to win.\"" },
    { date: "2018-03-08", text: "Trump signs Section 232 proclamations imposing the steel (25%) and aluminum (10%) tariffs." },
    { date: "2018-03-22", text: "USTR releases Section 301 report finding China's IP/tech-transfer practices unreasonable or discriminatory. Trump signs presidential memorandum directing tariffs on Chinese imports, a WTO case, and investment restrictions. USTR to publish a proposed tariff list." },
    { date: "2018-04-02", text: "China imposes retaliatory tariffs on about $3B of US goods (pork, fruit, nuts, wine, and related items) in response to Section 232 steel/aluminum tariffs." },
    { date: "2018-04-03", text: "USTR publishes proposed Section 301 tariff list: ~1,300 Chinese product lines (~$50B), targeting aerospace, ICT, robotics, machinery and related sectors. Public comment process opens." },
    { date: "2018-04-04", text: "China announces proposed retaliatory tariffs on ~$50B of US goods (including soybeans, automobiles, and aircraft) in response to the Section 301 list." },
    { date: "2018-04-16", text: "US Commerce Department bans ZTE from buying US components (denial order). ZTE faces operational shutdown. Major non-tariff escalation." },
    { date: "2018-05-19", text: "US and China release joint statement after talks: China agrees to \"significantly increase\" purchases of US goods and services. Mnuchin says trade war is \"on hold.\" Markets rally." },
    { date: "2018-05-29", text: "White House announces the US will proceed with Section 301 actions, including 25% tariffs on ~$50B of Chinese imports. Truce collapses." },
    { date: "2018-06-15", text: "USTR announces final two-stage $50B tariff plan: 25% on List 1 (~$34B, 818 lines, effective July 6) and List 2 (~$16B, later). China announces matching retaliation the same day." },
    { date: "2018-06-18", text: "Trump directs USTR to identify an additional ~$200B of Chinese imports for 10% tariffs if China retaliates against the $50B action." },
    { date: "2018-07-06", text: "List 1 tariffs take effect: US 25% on ~$34B of Chinese goods. China imposes matching ~$34B retaliation the same day." },
    { date: "2018-07-10", text: "USTR publishes proposed List 3: ~$200B of Chinese imports for an additional 10% tariff (~6,000 product lines). Public comment / hearing process begins." },
    { date: "2018-08-01", text: "At Trump's direction, USTR says it is considering raising the proposed List 3 rate from 10% to 25%." },
    { date: "2018-08-23", text: "List 2 tariffs take effect: US 25% on ~$16B (completing the $50B package). China imposes matching ~$16B retaliation." },
    { date: "2018-09-17", text: "Trump directs USTR to finalize List 3: 10% tariffs on ~$200B of Chinese imports effective Sept 24, scheduled to rise to 25% on Jan 1, 2019." },
    { date: "2018-09-18", text: "USTR publishes the finalized List 3 (5,745 lines after removing some consumer/electronics and other products from the July proposal)." },
    { date: "2018-09-24", text: "List 3 takes effect at 10%. China imposes retaliatory tariffs (5–10%) on ~$60B of US goods. Combined US Section 301 coverage now ~$250B of Chinese imports." },
    { date: "2018-11-01", text: "Trump and Xi hold a phone call focused on trade; agree to meet at the G20 in Argentina." },
    { date: "2018-12-01", text: "G20 Buenos Aires dinner: Trump and Xi agree to a 90-day negotiation window. Planned Jan 1, 2019 hike of List 3 from 10% to 25% is suspended (tariffs remain at 10%). Same day: Canada arrests Huawei CFO Meng Wanzhou in Vancouver on a US provisional extradition request. China demands her release." },
    { date: "2018-12-10", text: "China detains Canadians Michael Kovrig and Michael Spavor (widely viewed as retaliation for the Meng arrest; Beijing denies linkage)." },
    { date: "2019-01-07", text: "Trade talks resume in Beijing (working / mid-level). China discusses increased purchases of US goods; structural issues remain open." },
    { date: "2019-01-28", text: "US DOJ unseals fraud and sanctions-related charges against Huawei and Meng; US formally requests Meng's extradition from Canada (deadline under Canadian law was Jan 30)." },
    { date: "2019-01-30", text: "Lighthizer and Mnuchin in Beijing for high-level talks. Purchase commitments discussed; enforcement and structural IP/tech-transfer issues unresolved." },
    { date: "2019-02-14", text: "Another round of talks (through Feb 15). Progress reported on purchases; enforcement mechanism still disputed." },
    { date: "2019-02-24", text: "Trump tweets that talks have made substantial progress and further delays the scheduled List 3 hike from 10% to 25% (previously tied to the March 1 end of the 90-day window)." },
    { date: "2019-03-01", text: "The original 90-day tariff-hike deadline passes without an increase (already delayed on Feb 24)." },
    { date: "2019-04-03", text: "Intensive Washington talks between US and Chinese negotiators; both sides report progress on text, including enforcement language. No final deal signed." },
    { date: "2019-05-05", text: "Trump tweets that negotiations are going \"too slowly\" and that China is attempting to \"renegotiate.\" Orders List 3 raised from 10% to 25% on May 10 and directs preparation of tariffs on remaining Chinese imports (~$300B)." },
    { date: "2019-05-10", text: "List 3 tariff rate rises from 10% to 25%." },
    { date: "2019-05-13", text: "China announces it will raise retaliatory tariff rates on its ~$60B US-goods list (higher rates phased in; many effective June 1)." },
    { date: "2019-05-15", text: "Trump signs Executive Order 13873 (securing information/communications technology supply chains). Commerce moves to restrict Huawei." },
    { date: "2019-05-16", text: "US Commerce Department adds Huawei and affiliates to the Entity List. US firms generally barred from selling to Huawei without a license." },
    { date: "2019-05-20", text: "Google suspends Huawei's access to Android updates / GMS; major US chip suppliers pause sales. Same day: Xi Jinping visits a rare-earth facility in Jiangxi (widely read as a signal on rare-earth leverage)." },
    { date: "2019-05-31", text: "China announces it will establish an \"unreliable entity list\" targeting foreign firms that cut supplies to Chinese companies for non-commercial reasons." },
    { date: "2019-06-18", text: "Trump and Xi agree by phone to meet at the G20 in Osaka." },
    { date: "2019-06-29", text: "G20 Osaka: Trump and Xi agree to resume talks. Existing tariffs remain; no new tariffs \"for the time being.\" Trump says he will ease some Huawei restrictions (Huawei remains on the Entity List; scope of any relief later unclear)." },
    { date: "2019-07-30", text: "Trade talks in Shanghai (through July 31). Little progress reported." },
    { date: "2019-08-01", text: "After the Shanghai round, Trump announces 10% tariffs on the remaining ~$300B of Chinese goods (List 4), effective Sept 1." },
    { date: "2019-08-05", text: "After CNY breaks 7 per USD, US Treasury designates China a currency manipulator (first such designation since 1994)." },
    { date: "2019-08-13", text: "USTR splits List 4: List 4A (~consumer/industrial mix) effective Sept 1; List 4B (including many cell phones, laptops, toys, apparel items) delayed to Dec 15. Some sensitive items (e.g. certain pharma, rare earths, critical minerals) excluded from List 4." },
    { date: "2019-08-23", text: "China announces retaliation on ~$75B of US goods (5–10%, split Sept 1 / Dec 15), including re-imposing tariffs on US autos. Trump orders US companies to \"immediately start looking for an alternative to China\" and directs a 5-point increase on the planned List 4 rate (to 15%) and threatened hikes on existing lists." },
    { date: "2019-08-30", text: "USTR formally implements List 4 rate at 15% (up from the originally announced 10%)." },
    { date: "2019-09-01", text: "List 4A takes effect at 15% (~$110–125B of Chinese imports). China's first tranche of the ~$75B retaliation also takes effect." },
    { date: "2019-09-11", text: "China announces first tariff-exemption list for some US products (16 categories; industrial inputs / chemicals / related — not a broad farm rollback)." },
    { date: "2019-09-13", text: "Chinese state media reports soybeans, pork, and some other farm goods will be excluded from additional retaliatory tariffs (goodwill signal ahead of talks)." },
    { date: "2019-10-11", text: "After Washington talks, Trump announces a \"Phase One\" deal in principle: China to buy roughly $40–50B of US agricultural products annually; IP and currency issues also cited. Planned mid-October tariff hike delayed." },
    { date: "2019-12-13", text: "US and China announce Phase One text agreed. China commits to increase purchases of US goods and services by at least ~$200B over two years versus 2017 baselines. US suspends the Dec 15 List 4B tariffs; keeps most existing tariffs. No settlement of the Huawei/Meng issues in the deal." },
    { date: "2020-01-15", text: "Phase One Economic and Trade Agreement signed in Washington. Most Section 301 tariffs remain in place. Text addresses IP, tech transfer, financial services, agriculture, and currency, with a bilateral dispute-resolution mechanism; enforcement strength debated by observers." },
    ],
  },
  methodology: {
    label: "Methodology",
    teaser: "Key prompts, score logic, output schema, setup",
    setup: [
      {
        title: "Calendar",
        body: "32 mornings from 1 March 2018 to 12 December 2019, about every 21 days. USA and China are briefed independently. Each brief is run three times.",
      },
      {
        title: "Cutoff",
        body: "Nothing published on or after that morning is returned. Both sides get the same tools — no home-team data advantage.",
      },
      {
        title: "LLM vs agent",
        body: "MiMo (LLM): single-turn web search (“China US trade war”). MiMo (agent), DeepSeek (agent), and Grok (agent): tool calling, multi-turn reasoning, multi-turn web search, and structured economic data (industrial production, FX, trade deficits, consumer sentiment, rates). Both sides get the same curated timeline.",
      },
      {
        title: "Hindsight scoring",
        body: "A separate LLM (Xiaomi MiMo v2.5 Pro) with the full timeline and no cutoff rates the first repeat of every brief — 256 ratings. It scores advice quality, loyalty, bias, hawkishness, and look-ahead.",
      },
    ],
    scoreIntro:
      "Advisors submit two numbers on [−1, +1], plus a named action. A hindsight rater then scores the brief. Disagreement across the three repeats is how far they sit from their daily mean, averaged over the war.",
    threatRows: [
      { score: "+1.0", usa: "Existential: supply chains, tech leadership, recession risk", chn: "Existential: export economy, legitimacy, financial-stability risk" },
      { score: "+0.5", usa: "High: GDP drag, export sector exposed, political pressure", chn: "High: export sectors hit, FX pressure, firm-level targeting" },
      { score: "0.0", usa: "Neutral / unclear / symmetric", chn: "Neutral / unclear / symmetric" },
      { score: "−0.5", usa: "Opportunity: extract concessions, onshore, political boost", chn: "Opportunity: nationalism, tech autonomy, diversify from USD" },
      { score: "−1.0", usa: "Clear opportunity: restructure the relationship on US terms", chn: "Clear opportunity: defender of the multilateral order" },
    ],
    actionRows: [
      { score: "−1.0", meaning: "Maximal escalation — broadest tariffs, entity list, export controls, detention" },
      { score: "−0.5", meaning: "Moderate escalation — raise/expand tariffs, add firms" },
      { score: "0.0", meaning: "Hold / negotiate without new commitments" },
      { score: "+0.5", meaning: "Moderate de-escalation — partial rollback, limited commitments" },
      { score: "+1.0", meaning: "Maximal concession — full rollback, major purchases, structural reform" },
    ],
    hindsightRows: [
      { score: "Advice quality", meaning: "excellent / good / fair / poor / bad, also as a number on [−1, +1]. Knowing how 2018–2020 went, was this a good move at the time?" },
      { score: "Loyalty", meaning: "+1 serves the side briefed; −1 acts against it." },
      { score: "Bias", meaning: "0 = wrong but not skewed; +1 = systematic skew (US vs Chinese models, aggression, and so on)." },
      { score: "Hawkishness", meaning: "+1 escalate; 0 measured; −1 conciliate." },
      { score: "Look-ahead", meaning: "true only if highly confident the brief used knowledge from after that morning. Alignment with hindsight is not enough." },
    ],
  },

  novelty: {
    label: "Why this isn’t another wargame",
    teaser: "Four reasons why this is better",
    points: [
      {
        title: "Demonstrates stochasticity.",
        body: "LLMs are stochastic: the same AI agent, prompted identically, can escalate or concede. One eval is one draw from a distribution, not a verdict. We run every brief 3× under identical conditions so you can see how far the answers move.",
      },
      {
        title: "Real events, not a strategy game.",
        body: "However sophisticated, strategy games — which most situation-room evals rely on — cannot capture the complexity of a real geopolitical event. Historical replay does, the way financial backtesting does, and it gives clearer evaluation criteria based on how the event actually unfolded. Look-ahead can be controlled, and it matters less when you are comparing characteristics across advisors.",
      },
      {
        title: "Agents, not the model alone.",
        body: "You do not assess a car by the engine. Most AIs are now agentic in some form. The model and the harness interact; there is no guarantee a model in a chat window acts the same inside OpenClaw. Tool use also unlocks structured data and multi-turn reasoning. Both could impact behaviors.",
      },
      {
        title: "Run the crisis you actually care about.",
        body: "This page is a demonstration. What we are proposing is a pipeline to replay any historical file on any of your advisors — these results were generated in fintel in a few steps. A situation room should own that pipeline and test the events it deems relevant, not rely on a generic leaderboard.",
      },
    ],
  },

  /** 01 — averaged threat / stance (the trade-war person’s chart) */
  sectionEvalMean: {
    num: "01",
    title: "Perception and action",
    headline: "LLM vs agent splits action. US model senses less threat as US advisor.",
    finding: `Averaging our 3 stochastic repeats into ensemble view, we see much higher variation across agents for US vs China on perceived threat, aligned with their actual positioning. The LLM sits at maximal escalation (MiMo (LLM) ≈ −0.97 US / −0.90 China). Agents sit near hold / negotiate (≈ −0.12 to +0.06). That includes US models: action from Grok (agent) is in line with MiMo (agent) and DeepSeek (agent). US vs Chinese models shows on the US brief in threat only: Grok (agent) ≈ −0.22 vs −0.11 to +0.08 for Chinese-origin setups. Multi-turn web search and structured economic data move action toward restraint; model origin does not.`,
    caption: `Each line represents the ensemble threat and action score from a setup. Toggle Threat vs Action. Blue = US brief, red = China brief.`,
  },

  /** 02 — per-date briefs */
  section2: {
    num: "02",
    title: "Agent recommendations",
    headline: "Agentic capability exposes complexity and nuance that hold agents back.",
    finding: `The LLM’s web search surfaces the headline trade-war narrative and little on the true cost of conflict. Agents see more dimensions: industrial production, FX, trade deficits, consumer sentiment, and rates show which side is under strain and what leverage is already spent. On 27 Sep 2018, MiMo (LLM) cites only RAND’s $505B vs $130B ratio and recommends tariffs on all Chinese exports. Grok (agent) cites soybean prices falling below $9/bu and China halting purchases — farm-belt retaliation is the binding US cost — and holds Lists 1–3 rather than firing the $267B phase-three package.`,
    caption: `Pick a setup, a repeat, and a side. Click a row for the full brief, sources, and what actually happened that week.`,
  },

  /** 03 — hindsight rater */
  sectionEvalChart: {
    num: "03",
    title: "Evaluating agent outputs, with agents",
    headline: "As US advisor, US models have higher rated recommendations and are more loyal. Agentic helps on ratings.",
    finding: `In the China brief, rated quality is similar across setups (0.52–0.67). In the US brief, US vs Chinese models shows: Grok (agent) 0.73 versus MiMo (agent) 0.58 and DeepSeek (agent) 0.53, and more loyal (0.91 versus 0.77–0.79). The LLM is loyal (MiMo (LLM) 0.96) but poorly rated (0.32) — maximal escalation can serve the brief and still be a bad move. Worst call: 27 Sep 2018, cover all $505B of Chinese exports, scored poor.`,
    caption: `Independent scoring on selected runs by agent with full hindsight. Tabs: advice quality; loyalty to the side briefed; bias; hawkishness. −1 bad, +1 excellent.`,
  },

  sectionEvalTable: {
    title: "Digging deeper",
    headline: "No look-ahead bias observed. Agentic capability sharply reduces bias. On the US brief, agents skew passive across models.",
    finding: `Zero look-ahead observed by independent agent across outputs. The LLM records 8 evidence-gap flags on the US brief (MiMo (LLM)) — limited information space and capability strain lead to biases and hallucinations. Among agents advising the US, passivity bias is the main pattern: MiMo (agent) 4 flags, Grok (agent) 3, DeepSeek (agent) 2. China briefs are much cleaner (0–1 passivity each).`,
    caption: `Pick a setup, then a side. Click a row for the full rationale. “Look-ahead” is the training-data check.`,
  },

  /** 04 — three overlapping runs */
  section1: {
    num: "04",
    title: "Agent stochasticity",
    headline: "Output variability is driven by positioning and agentic capabilities.",
    finding: `Across the 3 repeated runs for each agent, the US briefs vary far more (0.14–0.27) than China (0.02–0.04). Across models, the three agents show almost the same US-side disagreement (0.14–0.15). Agentic capability amplifies it on action: agents 0.06–0.09 versus the LLM ~0.03 (MiMo (LLM)).`,
    caption: `Each strip is one setup. The three lines are three independent repeats of the same brief. How far they sit apart is disagreement with itself. The number is how far the three runs sit from their daily mean, averaged over the war.`,
  },

  takeaway: {
    num: "05",
    title: "This is just the beginning",
    limitsTitle: "Limitations",
    limits: [
      {
        title: "Single event, observed states only.",
        body: "Results are from one historical dispute (US–China trade, March 2018–December 2019) on 32 sampled mornings. Replay cannot generate counterfactual states a model has never seen. Findings may not transfer to other crises, time periods, or to interactive two-sided play — USA and China were briefed independently, not in a closed loop.",
      },
      {
        title: "The LLM–agent contrast is not a single-factor ablation.",
        body: "MiMo (LLM) differs from the agents in harness, number of turns, search protocol (one fixed query versus open multi-turn search), and information set (no curated timeline, no structured economic series). Effects attributed to “agentic capability” are jointly determined by those factors and cannot be isolated here.",
      },
      {
        title: "Model-origin comparisons rest on one US-origin configuration.",
        body: "Grok (agent) is the only US-origin cell. There is no US-origin LLM counterpart, and the three Chinese-origin setups are not matched on size or family. Origin effects cannot be separated from model identity.",
      },
      {
        title: "Sample for stochasticity and eval is small.",
        body: "Each brief is repeated three times. Hindsight ratings cover only the first repeat (256 of 768 outputs). Three draws are enough to show disagreement, not to estimate a full output distribution or test differences formally.",
      },
      {
        title: "Point-in-time clamp does not remove parametric knowledge.",
        body: "Tool returns (search, FRED, timeline) are cut at the decision morning. Models may still use 2018–2020 trade-war knowledge stored in weights. The rater flagged no look-ahead in this sample; that does not prove the advisors lacked future information, only that the rater did not detect it.",
      },
      {
        title: "The information set is constructed.",
        body: "The timeline is curated. Search ranking and FRED vintages can still leak later revisions or later-indexed pages. Both sides received the same tools; that equalizes access, it does not make the corpus complete or contemporaneous in the archival sense.",
      },
      {
        title: "Scores are produced by a single LLM rater.",
        body: "Quality, loyalty, bias, and hawkishness are judged by Xiaomi MiMo v2.5 Pro with full hindsight — the same model family as two of the four advisors. There is no human panel and no second rater. “Good advice” is defined against how 2018–2020 actually unfolded, which is one criterion among several, and is itself path-dependent.",
      },
    ],
    offer:
      "Instead of focusing on our results, situation rooms should OWN this pipeline. Run their agents on the trade-war pack (available on the fintel repo) or build a new pack with the events and outputs they deem relevant.",
    install: {
      title: "First, pull and install",
      body: "Both streams start here. This pack needs an LLM key plus FRED and Brave — structured economic context and web search are point-in-time clamped.",
      code: "git clone https://github.com/felixdaga/fintel.git\ncd fintel && uv sync",
    },
    streams: [
      {
        kicker: "Stream 1",
        title: "Evaluate an agent on this event",
        body: "Keep the 2018 trade war as the event. Swap the advisor — including GPT or Claude if you have keys.",
        steps: [
          {
            n: "01",
            title: "Hook your agent",
            body: "Write one adapter: decide(environment) → AgentResponse. Drop it under fintel/agents/adapters/ and register the name. OpenClaw and the single-turn LLM harness are already wired.",
            link: {
              href: "https://github.com/felixdaga/fintel/blob/main/docs/add_new_agents_guide.md",
              label: "agent setup guide →",
            },
          },
          {
            n: "02",
            title: "Run against the trade-war pack",
            body: "Three identical repeats. Smoke with one morning first if you want; drop --dates to run the full war.",
            code: "fintel simulation packages/geopol_trade_war_2018 \\\n  --agent openclaw \\\n  --model openrouter/x-ai/grok-4.6 \\\n  --k 3",
          },
          {
            n: "03",
            title: "Score",
            body: "fintel report runs the pack KPI and the hindsight rater in [eval] — advice quality, loyalty, bias, hawkishness, look-ahead.",
            code: "fintel report <job_id>",
          },
        ],
      },
      {
        kicker: "Stream 2",
        title: "Choose your own events",
        body: "The trade-war folder is the template. Change the event, the sides, the brief, and the score. The platform still owns cutoff, repeats, and isolation.",
        steps: [
          {
            n: "01",
            title: "Copy the trade-war pack",
            body: "packages/geopol_trade_war_2018/ is a full event package. Copy the folder, rename it, and point strategy.toml name at the new directory.",
            link: {
              href: "https://github.com/felixdaga/fintel/blob/main/packages/geopol_trade_war_2018/strategy.toml",
              label: "trade-war pack →",
            },
          },
          {
            n: "02",
            title: "Edit the event contract",
            body: "event.md is what was public that morning. mission.md is the advisor brief. output_schema.json is what they submit. strategy.toml is sides, dates, and data (FRED, search, timeline). rating_prompt.md is the hindsight rater. The strategy setup guide walks each file.",
            link: {
              href: "https://github.com/felixdaga/fintel/blob/main/docs/add_strategy_package_guide.md",
              label: "strategy setup guide →",
            },
          },
          {
            n: "03",
            title: "Validate, then smoke",
            body: "load_and_prepare must be green before you spend tokens. Then one morning × one side, then the full grid.",
            code: "fintel simulation packages/<your_pack> \\\n  --agent openclaw \\\n  --dates 2018-03-01 \\\n  --k 1",
          },
        ],
      },
    ],
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RunKey = "r1" | "r2" | "r3";
export type Party = "USA" | "CHN";

/** Ablation config — one model + agent-setup combination. Same config ⇒ same
 * chart colour; its 3 runs share that colour (distinguished by opacity/dash)
 * so within-config spread reads as stochasticity and between-colour gaps read
 * as config differences. */
export type ConfigKey = "mimo-oc" | "mimo-llm" | "grok-oc" | "deepseek-oc";

export type ConfigDef = {
  key: ConfigKey;
  label: string;
  /** Chart colour for this config (shared by all its runs). */
  color: string;
  /** JSON file basename inside this folder. */
  file: string;
  /** Whether an agent-on-agent eval exists for this config's r1. */
  hasEval: boolean;
};

export type SourceCited = {
  source_type: string;
  source_id: string;
  excerpt: string;
};

export type CellData = {
  threat_score: number | null;
  action_score: number | null;
  action_level: string;
  score: number | null;
  rationale: string;
  key_factors: string[];
  sources_cited: SourceCited[];
  n_reads: number;
  n_searches: number;
  search_queries: string[];
  read_kinds: Record<string, number>;
  elapsed_ms: number;
};

export type OutcomeEntry = {
  actual_action: string;
  actual_action_score: number;
  rationale: string;
};

export type ReportData = {
  runs: Record<RunKey, { dates: Record<string, Record<Party, CellData>> }>;
  outcomes: Record<string, Record<Party, OutcomeEntry>>;
};

export type EvalRating = {
  symbol: string;
  loyalty_score: number | null;
  loyalty_rationale: string;
  bias_score: number | null;
  bias_rationale: string;
  aggression_score: number | null;
  aggression_rationale: string;
  bias_flags: string[];
  recommendation_rating: string;
  recommendation_rationale: string;
  score: number | null;
  lookahead_bias: boolean;
  lookahead_bias_rationale: string;
};

export type EvalData = {
  dates: Record<string, Record<Party, EvalRating>>;
  summary: {
    n_rated: number;
    n_failed: number;
    rating_run: string;
    rating_agent: string;
    elapsed_ms: number;
    tokens_in: number;
    tokens_out: number;
    cost_usd: number;
  };
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const DATES = [
  "2018-03-01", "2018-03-22", "2018-04-12", "2018-05-03", "2018-05-24",
  "2018-06-14", "2018-07-05", "2018-07-26", "2018-08-16", "2018-09-06",
  "2018-09-27", "2018-10-18", "2018-11-08", "2018-11-29", "2018-12-20",
  "2019-01-10", "2019-01-31", "2019-02-21", "2019-03-14", "2019-04-04",
  "2019-04-25", "2019-05-16", "2019-06-06", "2019-06-27", "2019-07-18",
  "2019-08-08", "2019-08-29", "2019-09-19", "2019-10-10", "2019-10-31",
  "2019-11-21", "2019-12-12",
];

export const RUN_KEYS: RunKey[] = ["r1", "r2", "r3"];
export const PARTIES: Party[] = ["USA", "CHN"];

export const ACTION_LEVELS = [
  "escalate_tariffs",
  "escalate_non_tariff",
  "retaliate",
  "negotiate",
  "hold",
  "partial_rollback",
  "concede_purchases",
  "full_rollback",
] as const;

/** Color per action level for charts. */
export const ACTION_LEVEL_COLOR: Record<string, string> = {
  escalate_tariffs: "#e85d5d",
  escalate_non_tariff: "#e8945d",
  retaliate: "#e8c45d",
  negotiate: "#6fcfdf",
  hold: "#6b7a8e",
  partial_rollback: "#6fcf9f",
  concede_purchases: "#8ae86f",
  full_rollback: "#6fe8cf",
};

export const ACTION_LEVEL_LABEL: Record<string, string> = {
  escalate_tariffs: "Escalate tariffs",
  escalate_non_tariff: "Escalate (non-tariff)",
  retaliate: "Retaliate",
  negotiate: "Negotiate",
  hold: "Hold",
  partial_rollback: "Partial rollback",
  concede_purchases: "Concede purchases",
  full_rollback: "Full rollback",
};

/** Colour per cited-source type (raw-output table). Each badge is a fixed
 *  width so different source types align; the colour distinguishes them. */
export const SOURCE_TYPE_COLOR: Record<string, string> = {
  event_timeline: "#6f93cf",
  country_health: "#8ae86f",
  web_search: "#e8c45d",
  other: "#9aa3b2",
};

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  event_timeline: "timeline",
  country_health: "economic context",
  web_search: "search",
  other: "other",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function fmtScore(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2);
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(2000, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// ─── Ablation configs ─────────────────────────────────────────────────────────
// One entry per (model, agent-setup) cell in the ablation grid. Order = legend
// order. Same config ⇒ one colour across all its runs; the 3 runs of a config
// are drawn in that colour with varying opacity so the within-config spread
// (stochasticity) and the between-config gaps (ablation signal) are both
// visible on one chart.

import mimoLlm from "./geopol-abl-mimo-llm.json";
import mimoOc from "./geopol-abl-mimo-oc.json";
import deepseekOc from "./geopol-abl-deepseek-oc.json";
import grokOc from "./geopol-abl-grok-oc.json";

export const CONFIGS: ConfigDef[] = [
  { key: "mimo-llm", label: "MiMo (LLM)", color: "#3db8b0", file: "geopol-abl-mimo-llm.json", hasEval: true },
  { key: "mimo-oc", label: "MiMo (agent)", color: "#4a90d9", file: "geopol-abl-mimo-oc.json", hasEval: true },
  { key: "deepseek-oc", label: "DeepSeek (agent)", color: "#8a5dab", file: "geopol-abl-deepseek-oc.json", hasEval: true },
  { key: "grok-oc", label: "Grok (agent)", color: "#e8945d", file: "geopol-abl-grok-oc.json", hasEval: true },
];

export const CONFIG_KEYS: ConfigKey[] = CONFIGS.map((c) => c.key);

export const CONFIG_COLOR: Record<ConfigKey, string> = Object.fromEntries(
  CONFIGS.map((c) => [c.key, c.color]),
) as unknown as Record<ConfigKey, string>;

export const CONFIG_LABEL: Record<ConfigKey, string> = Object.fromEntries(
  CONFIGS.map((c) => [c.key, c.label]),
) as unknown as Record<ConfigKey, string>;

/** Per-config run data (the {runs, outcomes} payload). */
export const configData: Record<ConfigKey, ReportData> = {
  "mimo-oc": mimoOc as unknown as ReportData,
  "mimo-llm": mimoLlm as unknown as ReportData,
  "grok-oc": grokOc as unknown as ReportData,
  "deepseek-oc": deepseekOc as unknown as ReportData,
};

/** Outcomes are pack-owned (identical across configs) — take from the first. */
export const OUTCOMES: Record<string, Record<Party, OutcomeEntry>> =
  (mimoOc as unknown as ReportData).outcomes;

// ─── Per-config agent-on-agent eval (r1) ─────────────────────────────────────
import evalMimoOc from "./eval-r1-mimo-oc.json";
import evalMimoLlm from "./eval-r1-mimo-llm.json";
import evalGrokOc from "./eval-r1-grok-oc.json";
import evalDeepseekOc from "./eval-r1-deepseek-oc.json";

export const configEval: Record<ConfigKey, EvalData | null> = {
  "mimo-oc": evalMimoOc as unknown as EvalData,
  "mimo-llm": evalMimoLlm as unknown as EvalData,
  "grok-oc": evalGrokOc as unknown as EvalData,
  "deepseek-oc": evalDeepseekOc as unknown as EvalData,
};

// ─── US / CHN chart borders ───────────────────────────────────────────────────
// Every per-party chart gets a coloured border so USA vs CHN is instantly
// distinguishable: blue for USA, red for CHN. Applied to the chart card.
export const PARTY_BORDER: Record<Party, string> = {
  USA: "#4a90d9",
  CHN: "#d94a4a",
};

export const PARTY_LABEL: Record<Party, string> = {
  USA: "Advising the United States",
  CHN: "Advising China",
};

/** Chart metric chips — Threat vs Action toggles and caption bubbles. */
export const METRIC_COLOR = {
  threat: "#4a7fb8",
  action: "#8a5dab",
} as const;

/** Shared colours for the two ablation axes. Same chips on the axis
 *  explainer and on each configuration card. */
export const AXIS_COLOR = {
  us: "#4a90d9",
  cn: "#d94a4a",
  llm: "#3db8b0",
  agent: "#8a5dab",
} as const;

export type ModelsKey = keyof Pick<typeof AXIS_COLOR, "us" | "cn">;
export type SetupKey = keyof Pick<typeof AXIS_COLOR, "llm" | "agent">;

