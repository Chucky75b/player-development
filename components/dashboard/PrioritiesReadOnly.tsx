type Priority = {
  id: string;
  title: string;
  description: string | null;
  status: string;
};

type Props = {
  items: Priority[];
};

export function PrioritiesReadOnly({ items }: Props) {
  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
        Priorities
      </h2>

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
