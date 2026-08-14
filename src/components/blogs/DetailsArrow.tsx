/** Filled triangle pointing right — disclosure affordance for blog cards and panels. */
export function DetailsArrow({
  className = "text-text-muted",
  openRotate,
}: {
  className?: string;
  /** e.g. `group-open:rotate-90` or `group-open/inner:rotate-90` */
  openRotate?: string;
}) {
  return (
    <svg
      className={`h-2.5 w-2.5 shrink-0 self-center transition-transform duration-200 ${openRotate ?? ""} ${className}`}
      viewBox="0 0 8 10"
      aria-hidden
    >
      <path d="M0 0 L8 5 L0 10 Z" fill="currentColor" />
    </svg>
  );
}
