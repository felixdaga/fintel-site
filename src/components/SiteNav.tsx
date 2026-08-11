"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, REPO_URL } from "@/components/Logo";
import { LiveDot } from "@/components/LiveDot";

const tabs = [
  { href: "/strategy", label: "live strategy", live: true },
  { href: "/leaderboard", label: "join the challenge", live: false },
];

function Divider() {
  return (
    <span aria-hidden className="mx-0.5 h-3 w-px shrink-0 bg-border sm:mx-1" />
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-5">
        <Logo className="shrink-0" />

        {/* Desktop nav (sm+) */}
        <div className="hidden min-w-0 items-center sm:flex">
          {tabs.map((t, i) => (
            <span key={t.href} className="flex items-center">
              {i > 0 ? <Divider /> : null}
              <Link
                href={t.href}
                className="inline-flex shrink-0 items-center rounded-md px-3 py-1.5 text-sm text-text-soft transition-colors hover:bg-surface hover:text-text"
              >
                {t.label}
                {t.live ? <LiveDot className="ml-1.5" /> : null}
              </Link>
            </span>
          ))}
          <Divider />
          <a
            href="https://felixdaga.github.io/Optimized_Agent/posts/2026-07-16-optimizing-ai-agents-for-alpha-generation/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md px-3 py-1.5 text-sm text-text-soft transition-colors hover:bg-surface hover:text-text"
          >
            whitepaper
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 shrink-0 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
          >
            github ↗
          </a>
        </div>

        {/* Mobile hamburger (below sm) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-text-soft transition-colors hover:text-text sm:hidden"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="5" y1="5" x2="15" y2="15" />
                <line x1="15" y1="5" x2="5" y2="15" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open ? (
        <div className="border-t border-border bg-bg-soft px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-md px-3 py-2.5 text-sm text-text-soft transition-colors hover:bg-surface hover:text-text"
              >
                {t.label}
                {t.live ? <LiveDot className="ml-1.5" /> : null}
              </Link>
            ))}
            <a
              href="https://felixdaga.github.io/Optimized_Agent/posts/2026-07-16-optimizing-ai-agents-for-alpha-generation/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-text-soft transition-colors hover:bg-surface hover:text-text"
            >
              whitepaper
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface hover:text-text"
            >
              github ↗
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
