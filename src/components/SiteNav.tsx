import Link from "next/link";
import { Logo, REPO_URL } from "@/components/Logo";

const tabs = [
  { href: "/strategy", label: "live strategy" },
  { href: "/leaderboard", label: "join the challenge" },
];

function Divider() {
  return (
    <span aria-hidden className="mx-0.5 h-3 w-px shrink-0 bg-border sm:mx-1" />
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-5">
        <Logo size="lg" className="shrink-0" />
        <div className="flex min-w-0 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t, i) => (
            <span key={t.href} className="flex items-center">
              {i > 0 ? <Divider /> : null}
              <Link
                href={t.href}
                className="shrink-0 rounded-md px-2 py-1.5 text-xs text-text-soft transition-colors hover:bg-surface hover:text-text sm:px-3 sm:text-sm"
              >
                {t.label}
              </Link>
            </span>
          ))}
          <span className="hidden items-center sm:flex">
            <Divider />
            <a
              href="https://felixdaga.github.io/Optimized_Agent/posts/2026-07-16-optimizing-ai-agents-for-alpha-generation/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md px-3 py-1.5 text-sm text-text-soft transition-colors hover:bg-surface hover:text-text"
            >
              whitepaper
            </a>
          </span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 shrink-0 rounded-md border border-border bg-surface-2 px-2 py-1.5 text-xs font-medium text-text transition-colors hover:border-accent hover:text-accent sm:ml-3 sm:px-3 sm:text-sm"
          >
            github ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
