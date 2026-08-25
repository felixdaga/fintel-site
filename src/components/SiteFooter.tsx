import { Logo } from "@/components/Logo";
import { REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-6 px-5 py-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-y-0">
        <div className="justify-self-start">
          <Logo />
        </div>
        <p className="col-span-2 text-center text-sm text-text-muted sm:col-span-1 sm:col-start-2 sm:row-start-1">
          For consultation or partnership,
          <br />
          contact{" "}
          <a
            href="mailto:inquiry@fintel.capital"
            className="transition-colors hover:text-accent"
          >
            inquiry@fintel.capital
          </a>
        </p>
        <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-4 text-xs text-text-soft sm:col-start-3">
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
