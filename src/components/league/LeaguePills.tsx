export function LeaguePills({
  items,
  value,
  onChange,
  hidden,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  hidden?: boolean;
}) {
  if (hidden || !items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              on
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface-2 text-text-soft hover:border-border-strong hover:text-text"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
