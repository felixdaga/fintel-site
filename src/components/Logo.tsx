export function Logo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 font-mono text-xl font-semibold tracking-tight text-text ${className}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-strong text-lg font-bold leading-none text-white shadow-sm">
        fl
      </span>
      fintel.
    </a>
  );
}
