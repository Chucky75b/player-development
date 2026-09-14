type Anchor = {
  id: string;
  title: string;
  description: string | null;
};

type Props = {
  items: Anchor[];
};

export function AnchorsReadOnly({ items }: Props) {
  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
        Anchors
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
              <p className="text-sm font-semibold text-[var(--color-ink-primary)]">
                {item.title}
              </p>
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
