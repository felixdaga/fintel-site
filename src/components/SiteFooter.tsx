import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-10 sm:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-center sm:justify-self-start">
          <Logo />
        </div>
        <p className="text-center text-sm text-text-muted">
          For consultation or partnership,
          <br />
          contact{" "}
          <a
            href="mailto:founders@fintel.capital"
            className="transition-colors hover:text-accent"
          >
            founders@fintel.capital
          </a>
        </p>
      </div>
    </footer>
  );
}
