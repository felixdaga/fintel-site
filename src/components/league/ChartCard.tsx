export function ChartCard({
  title,
  caption,
  hint,
  children,
}: {
  title: string;
  caption?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-2xl border border-border bg-surface-2 p-4 sm:p-5">
      <figcaption className="text-xs font-bold uppercase tracking-widest text-text sm:text-sm">
        {title}
      </figcaption>
      {hint ? (
        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{hint}</p>
      ) : null}
      <div className="mt-3">{children}</div>
      {caption ? (
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{caption}</p>
      ) : null}
    </figure>
  );
}
