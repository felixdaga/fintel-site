/**
 * Homepage copy — edit this file.
 * Layout/chart IDs stay in whyEvalData.ts.
 */

export const COPY = {
  hero: {
    line1: "Quantifying",
    line2: "financial AI",
    line2Accent: ["financial AI"],
    lede: "From AI resume to AI alpha",
    scrollAria: "Scroll to how we write resumes for financial AI",
  },

  resume: {
    kicker: "What we do",
    title: "We generate resumes for financial AI agents",
    titleAccent: "resumes",
    agent: {
      kicker: "Agents",
      a: {
        name: "AI agent",
        sub: "Evaluated on vibes",
        fields: [
          { key: "IQ", value: "160", inline: true },
          { key: "Graduated from", value: "Anthropic", inline: true },
          { key: "Harness", value: "Claude Code", inline: true },
          { key: "Data", value: "Cap IQ", inline: true },
          { key: "Past achievements", value: "Solved a really hard puzzle" },
        ],
      },
      b: {
        name: "AI agent",
        nameMark: "with resume",
        sub: "Evaluated on actual performance",
        fields: [
          { key: "IQ", value: "160", inline: true },
          { key: "Graduated from", value: "Anthropic", inline: true },
          { key: "Harness", value: "Claude Code", inline: true },
          { key: "Data", value: "Cap IQ", inline: true },
          {
            key: "Past achievements",
            value: "5-year track record running your fundamental LS strategy",
            stats: [
              { label: "Return", value: "+100%", vs: "DJIA +62%" },
              { label: "Sharpe", value: "1.42", vs: "DJIA 0.96" },
              { label: "IR", value: "1.18" },
            ],
          },
          {
            key: "Assessment",
            value:
              "1 personality test + 3 task-specific tests + 2-hour technical interview",
          },
        ],
        comment: {
          key: "Feedback",
          bullets: [
            "Good at structural narrative reasoning. Bad at financial modeling due to high hallucinations — addressable.",
            "Tends to favor US tech. Exhibits signs of momentum-chasing behavior.",
          ],
          radar: true,
          actions: [
            {
              body: "Add xxx to mission prompt",
              detail: "Reduce momentum exposure by 5%",
            },
            {
              body: "Add verifier subagent",
              detail: "Reduce error by 10%, improve IC by 2%",
            },
          ],
        },
      },
    },
    product: {
      kicker: "Agentic components",
      a: {
        name: "Data, model and harness",
        sub: "Paying for general claims",
        fields: [
          {
            key: "AI-ready data",
            value: "Clean and AI-optimized format",
            inline: true,
            quoted: true,
          },
          {
            key: "Frontier models",
            value: "SOTA on finance benchmarks, purpose-built for finance",
            inline: true,
            quoted: true,
          },
          {
            key: "Specialized harness",
            value: "Multi-desk trading firm as an agent",
            inline: true,
            quoted: true,
          },
        ],
      },
      b: {
        name: "Agent components",
        nameMark: "with resume",
        sub: "Paying for true additivity",
        bar: {
          title: "Information coefficient",
          theirs: { label: "AI-ready feed", ic: 0.11 },
          baseline: { label: "Current feed", ic: 0.06 },
        },
        line: {
          title: "Backtest performance",
          aria: "Cumulative return of current stack versus current stack plus your product, rebased to 2025",
          preLabel: "Current stack",
          postLabel: "Current stack + your product",
        },
      },
    },
    takeaway:
      "We have developed a proprietary eval pipeline to *quantify* the performance of financial AI agents and the *additivity* of their components.",
    radarLabel: "Factor tilts",
  },

  whyResume: {
    kicker: "the case for credible evals",
    title: "Why financial AI agents need a resume",
    titleAccent: "resume",
    now: {
      n: "01",
      title: "General financial AI benchmarks",
      body: "Scoring just the LLM on simplified questions and tasks on minimal data. *Virtually none are designed by industry practitioners in realistic investment settings.*",
      refs: ["Finance Agent v2", "BigFinanceBench", "StockBench", "BizFinBench"],
    },
    stack: {
      n: "02",
      title: "It is more than the LLM",
      body: "Agentic components interact *non-monotonically*; a model score is just one small piece of the puzzle.",
      parts: ["LLM", "Harness", "Objectives", "Data", "Regime"],
    },
    reasons: [
      {
        n: "03",
        title: "Financial skills are not generalizable",
        left: {
          eyebrow: "Coding skills",
          title: "A good coder is good at most coding tasks",
        },
        right: {
          eyebrow: "Financial skills",
          title: "A good fundamental analyst ≠ good quant",
        },
      },
      {
        n: "04",
        title: "Stakes are higher",
        left: { eyebrow: "Coding AI", title: "When it fails = Retry" },
        right: {
          eyebrow: "Financial AI",
          title: "When it fails = You",
          mark: "lose money",
        },
      },
    ],
    takeaway:
      "We are the first to offer credible, comprehensive and scalable *financial AI evals*.",
  },

  whyEval: {
    kicker: "unlock potential",
    title: "Capture AI-generated alpha",
    titleAccent: "alpha",
    lede: "The same portfolio manager agent, before and after evals.",
    chartTitle: "Cumulative returns",
    chartAria:
      "Agent backtest before and after eval, rebased to 2025",
    preLabel: "pre-eval agent",
    postLabel: "post-eval agent",
    demo: {
      href: "/strategy",
      label: "live strategy",
      detail: "We believe that AI alpha can be achieved through systematic evals. Witness our real-life demonstration here: ",
    },
  },

  close: {
    header: "What we offer",
    headerAccent: "offer",
    title: "Scale AI alpha with us today",
    titleAccent: "alpha",
    values: [
      {
        n: "01",
        title: "Credibility",
        body: "Evals done by investors and industry practitioners.",
      },
      {
        n: "02",
        title: "Scalability",
        body: "Our proprietary eval platform, built for any agent and any financial task.",
      },
    ],
    items: [
      {
        title: "Customized evals",
        tone: "orange" as const,
        bullets: [
          {
            label: "For AI investors",
            body: "Quantify the performance of your financial AI agent.",
          },
          {
            label: "For AI product providers",
            body: "Quantify the additivity of your data, model, or harness.",
          },
        ],
      },
      {
        title: "In-house agents",
        tone: "accent" as const,
        bullets: [
          {
            label: "In-house agents",
            body: "Access to our in-house alpha agents, continuously evolving through our proprietary evals. Build your agents on what is already working.",
          },
          {
            label: "Investment signals",
            body: "Leverage outputs across our in-house agents as an investment signal.",
          },
        ],
      },
      {
        title: "Proprietary eval insights",
        tone: "highlight" as const,
        bullets: [
          {
            label: "Datasets",
            body: "The first database of agentic evals for financial AI. League tables across common model, harness and data.",
          },
          {
            label: "Insights",
            body: "Our insights and experience as financial AI builders.",
          },
        ],
      },
    ],
    contact: "founders@fintel.capital",
    href: "mailto:founders@fintel.capital",
  },
} as const;
