export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto border-t border-border ${className ?? "max-w-3xl"}`}
      aria-hidden
    />
  );
}
