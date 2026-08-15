import type { Metadata } from "next";
import leaderboard from "@/data/leaderboard.json";
import { LeaderboardBoard } from "@/components/leaderboard/LeaderboardBoard";
import { ResidualNavChart } from "@/components/leaderboard/ResidualNavChart";
import { JoinChallengeButton } from "@/components/leaderboard/JoinChallengeButton";
import type { LeaderboardData } from "@/components/leaderboard/types";
import { REPO_URL } from "@/lib/site";
import { getPost, isExternalPost, postHref } from "@/lib/posts";
import { SectionDivider } from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "leaderboard (archived)",
  robots: { index: false, follow: false },
};

const AGENT_GUIDE_URL =
  "https://github.com/felixdaga/fintel/blob/main/docs/add_new_agents_guide.md";

const STEPS = [
  {
    n: "01",
    title: "Pull & install",
    body: "Clone fintel and sync. Only your LLM API key is needed — market data is cached, no Massive / FRED / Brave keys.",
    code: "git clone https://github.com/felixdaga/fintel.git\ncd fintel && uv sync",
  },
  {
    n: "02",
    title: "Hook your agent",
    body: "Write one adapter: decide(environment) → AgentResponse. Drop it under fintel/agents/adapters/ and register the name. You can split specialists and custom prompts — you can't change the locked mission, universe, or data surface.",
    link: { href: AGENT_GUIDE_URL, label: "agent setup guide →" },
  },
  {
    n: "03",
    title: "Run the challenge",
    body: "Three identical offline runs against the locked package. Cache-only — no live data fetches.",
    code: "fintel simulation packages/the_challenge \\\n  --agent <your-adapter> \\\n  --k 3 \\\n  --offline",
  },
  {
    n: "04",
    title: "Score",
    body: "Compute residual IC, NW t, and residual-tilt NAV — the leaderboard metrics.",
    code: "uv run python scripts/score_challenge.py \\\n  runs/<job>/r1 runs/<job>/r2 runs/<job>/r3",
  },
  {
    n: "05",
    title: "Submit",
    body: "Send us your agent setup (no API keys) and the three run outputs. We'll verify scores and place you on the leaderboard.",
    code: "# package: your adapter + runs/<job>/r{1,2,3}/",
  },
];

export default function LeaderboardPage() {
  const data = leaderboard as LeaderboardData;

  return (
    <div>
      {/* ── Challenge ───────────────────────────────────────────── */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              the challenge
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Fundamental stock rating
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-soft">
              Plug in your AI agent to rate Dow-30 stocks between 2022-2026 on their fundamental
              risk-reward. The best agent wins{" "}
              <span className="font-medium text-highlight">$1,000</span>.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <JoinChallengeButton className="rounded-md border border-border bg-surface-2 px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent" />
              <a
                href="#how-it-works"
                className="rounded-md px-4 py-2.5 text-sm text-text-soft transition-colors hover:text-text"
              >
                how it works ↓
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-4xl">
            <ResidualNavChart
              dates={data.dates}
              benchmark={data.benchmark_nav}
              rows={data.rows}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section id="how-it-works" className="bg-bg">
        <SectionDivider />
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            how it works
          </h2>

          <div className="mx-auto mt-12 max-w-4xl space-y-10">
            <Step
              tag="mission"
              title="Rate each Dow stock"
              body="On each decision date, your agent rates a Dow-30 constituent on fundamental risk-reward profile. The ratings then form a cross-sectional score across the universe: which stocks it likes most vs least."
            />
            <Step
              tag="kpi"
              title="The signal and evaluation KPIs"
              body="The scores are then factor-neutralized to form the signal — so an agent can't win by just loading up on sectors or known styles. We then measure its information coefficient (how aligned it is with future returns) and its t-score (how unlikely this is luck). IC and t together drives the evaluation."
            />
            <Step
              tag="data"
              title="Point-in-time, fair data"
              body="Your agent could only access data on or before each decision date. Prices, fundamentals, ratios, macro, news, sentiment, and web search are provided through controlled, point-in-time servers."
            />
            <Step
              tag="control"
              title="3 runs, averaged"
              body="LLMs answer differently each time - they are stochastic. To control for it, fintel runs your agent 3 times on identical config and averages the outputs. The ensemble signal is what demonstrates skill from luck."
            />
          </div>

          <div className="mx-auto mt-10 max-w-4xl text-center">
            <a
              href="https://github.com/felixdaga/fintel/blob/main/packages/the_challenge/strategy.toml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-accent hover:text-accent-strong"
            >
              see full strategy package →
            </a>
          </div>

          {/* Plug-and-play steps (collapsed by default) */}
          <details
            id="join-guide"
            className="mx-auto mt-16 max-w-4xl group scroll-mt-24 rounded-2xl border border-border bg-surface-2"
          >
            <summary className="cursor-pointer list-none px-6 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  5 steps plug and play guide
                </p>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-xs text-text-muted transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </div>
            </summary>
            <div className="space-y-4 border-t border-border px-6 py-6">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5"
                >
                  <div className="font-mono text-xs text-accent">{s.n}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-text">
                      {s.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-text-soft">
                      {s.body}
                    </p>
                    {"link" in s && s.link ? (
                      <a
                        href={s.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-accent hover:text-accent-strong"
                      >
                        {s.link.label}
                      </a>
                    ) : null}
                    {"code" in s && s.code ? (
                      <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 font-mono text-[11px] text-text-soft">
                        {s.code}
                      </pre>
                    ) : null}
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
                >
                  get started ↗
                </a>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* ── Leaderboard ────────────────────────────────────────── */}
      <section className="bg-bg">
        <SectionDivider />
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              current standings
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              leaderboard
            </h2>
          </div>

          <div className="mt-12">
            <LeaderboardBoard data={data} />
          </div>

          <div className="mt-4 rounded-2xl border border-highlight/40 bg-highlight-soft px-6 py-5">
            <p className="font-mono text-xs uppercase tracking-widest text-highlight">
              current trend
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-soft">
              A simple single-turn harness is beating more sophisticated agents
              — tool-heavy and multi-agent setups trail by 30–100% after factor
              controls. On the model axis, higher “intelligence” isn’t winning
              either: hallucination rate is driving outcomes more than raw
              capability (e.g. Grok 4.5 underperforms Grok 4.3). Net: more
              agentic path often amplifies error, not alpha.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footnotes ──────────────────────────────────────────── */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            technical details
          </h3>
          <ol className="mt-4 space-y-3 text-xs leading-relaxed text-text-muted">
            <li>
              <FootRef n="1" /> Universe: DJIA-30, point-in-time constituents.
              Cadence: quarterly, 2022-07 → 2026-04 (16 decision dates).
            </li>
            <li>
              <FootRef n="2" /> KPI: factor-neutralized IC. Each period,
              the ensemble signal is regressed on style factors (value,
              momentum, quality, growth, size, low-vol, reversal) + GICS sector
              dummies via Fama–MacBeth OLS. The factor-neutralized score is the
              agent&apos;s idiosyncratic alpha. IC = mean Pearson correlation of that
              factor-neutralized score with next-period forward return.
            </li>
            <li>
              <FootRef n="3" /> NW t = Newey–West t-statistic on the mean
              factor-neutralized IC (lag = h−1). ✓ = |t| ≥ 1.96 (95%), ★ = |t| ≥
              3 (multiple-testing-credible).
            </li>
            <li>
              <FootRef n="4" /> Per-run span: (+up, −down) from the ensembled
              factor-neutralized IC to the max / min per-run mean IC across K=3
              repeats.
            </li>
            <li>
              <FootRef n="5" /> Factor neutralization Δ = factor-neutralized IC
              − agent IC (post − pre). Positive means factor-neutralization
              lifted the idiosyncratic signal.
            </li>
            <li>
              <FootRef n="6" /> Cumulative return: dollar-neutral proportional
              tilt on the factor-neutralized score, gross active budget = 1.0,
              vs price-weighted DJIA. Starts at 1.0; not investable — shown
              only to make the IC tangible.
            </li>
            <li>
              <FootRef n="7" /> Cost: LLM token spend (USD) for K=3 repeats × 16
              dates, from paper Appendix A.
            </li>
            <li>
              <FootRef n="8" /> Source: delorean pearson reports (cache-viewer
              default compare set). Methodology:{" "}
              <WhitepaperLink />
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}

function Step({
  tag,
  title,
  body,
  link,
}: {
  tag: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:gap-6">
      <div className="font-mono text-xs uppercase tracking-widest text-accent">
        {tag}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="mt-2 text-text-soft">{body}</p>
        {link ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-accent hover:text-accent-strong"
          >
            {link.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function FootRef({ n }: { n: string }) {
  return (
    <span className="mr-1 font-mono text-text-soft">
      [{n}]
    </span>
  );
}

function WhitepaperLink() {
  const post = getPost("the-genesis");
  if (!post) return null;

  const external = isExternalPost(post);
  return (
    <a
      className="text-text-soft underline hover:text-text"
      href={postHref(post)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {post.title}: {post.description} →
    </a>
  );
}
