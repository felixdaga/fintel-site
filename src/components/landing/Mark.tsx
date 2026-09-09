export function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-orange">{children}</span>;
}

/** Wrap *this* in orange. Edit copy in main_texts.ts. */
export function Marked({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <Em key={i}>{part.slice(1, -1)}</Em>
        ) : (
          part
        ),
      )}
    </>
  );
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
