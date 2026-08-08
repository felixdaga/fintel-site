const REPO = "https://github.com/felixdaga/fintel";

const SIZES = {
  sm: { mark: "h-12 w-12 text-xs", text: "text-sm", gap: "gap-2" },
  md: { mark: "h-12 w-12 text-sm", text: "text-base", gap: "gap-2" },
  lg: { mark: "h-9 w-9 text-lg", text: "text-xl", gap: "gap-2.5" },
  inline: { mark: "h-7 w-7 text-[10px]", text: "text-lg", gap: "gap-1.5" },
} as const;

export function Logo({
  href = "/",
  size = "sm",
  className = "",
}: {
  href?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <a
      href={href}
      className={`inline-flex items-center font-mono font-semibold tracking-tight text-text ${s.gap} ${s.text} ${className}`}
    >
      <span
        className={`grid place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-strong font-bold leading-none text-white shadow-sm ${s.mark}`}
      >
        fl
      </span>
      fintel.
    </a>
  );
}

export const REPO_URL = REPO;
