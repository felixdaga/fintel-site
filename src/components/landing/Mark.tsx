import type { ReactNode } from "react";

export function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-orange">{children}</span>;
}

const MARK = /\*([^*]+)\*/g;

export function unmark(text: string) {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

/** Wrap *this* in orange. Use on any copy string — no-ops if there are no marks. */
export function Marked({ text }: { text: string }) {
  const re = /\*([^*]+)\*/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(<Em key={n}>{m[1]}</Em>);
    last = start + m[0].length;
    n += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function Takeaway({
  children,
  className = "mt-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mx-auto max-w-3xl text-center text-base leading-relaxed text-text-soft sm:text-lg ${className}`}
    >
      {children}
    </p>
  );
}
