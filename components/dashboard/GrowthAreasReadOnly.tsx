type GrowthArea = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
};

type Props = {
  items: GrowthArea[];
};

export function GrowthAreasReadOnly({ items }: Props) {
  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
        Growth Areas
      </h2>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        What to work on
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-tertiary)]">
            No data yet. Your coach will populate this section.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[4px] border border-[var(--color-line-soft)] p-3"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--color-ink-primary)]">
                  {item.title}
                </p>
                {item.category && (
                  <span className="rounded-full border border-[var(--color-line-default)] px-2 py-0.5 font-data text-[10px] uppercase text-[var(--color-ink-tertiary)]">
                    {item.category}
                  </span>
                )}
                {item.status !== "active" && (
                  <span className="font-data text-[10px] uppercase text-[var(--color-ink-muted)]">
                    {item.status}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-[var(--color-ink-tertiary)]">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
