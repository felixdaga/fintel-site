import { Logo } from "@/components/Logo";
import { REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-10">
        <div className="justify-self-start">
          <Logo />
        </div>
        <p className="text-center text-sm text-text-muted">
          Evaluation platform for financial agents
        </p>
        <div className="flex items-center justify-self-end gap-4 text-xs text-text-soft">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            github ↗
          </a>
          <span className="text-text-muted">MIT</span>
        </div>
      </div>
    </footer>
  );
}
