type Feedback = {
  id: string;
  content: string;
  created_at: string;
};

type Props = {
  items: Feedback[];
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeedbackList({ items }: Props) {
  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <div>
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Feedback
        </h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          From the player — read only
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-tertiary)]">
            No feedback yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[4px] border border-[var(--color-line-soft)] p-3"
            >
              <p className="text-sm text-[var(--color-ink-primary)]">
                {item.content}
              </p>
              <p className="mt-2 font-data text-[10px] uppercase text-[var(--color-ink-muted)]">
                {formatDateTime(item.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
