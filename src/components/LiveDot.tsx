export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-1.5 w-1.5 shrink-0 ${className}`}
      aria-hidden
    >
      <span className="live-dot-ping absolute inset-0 rounded-full bg-orange" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-orange" />
    </span>
  );
}
