export function LeagueLegend({
  series,
}: {
  series: { label: string; color: string; dashed?: boolean }[];
}) {
  if (!series.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => (
        <span key={s.label} className="inline-flex items-center gap-1.5 text-[11px] text-text-soft">
          {s.dashed ? (
            <span
              className="inline-block h-0 w-3 border-t-2 border-dashed"
              style={{ borderColor: s.color }}
            />
          ) : (
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
          )}
          {s.label}
        </span>
      ))}
    </div>
  );
}
