type Props = {
  displayName: string;
};

export function PlayerDashboard({ displayName }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
        Welcome back, {displayName}
      </h1>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Strength
        </h2>
        <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
          Nessun dato ancora. Il tuo coach popolerà questa sezione.
        </p>
      </section>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Building Blocks
        </h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          Su cosa lavorare
        </p>
        <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
          Nessun dato ancora. Il tuo coach popolerà questa sezione.
        </p>
      </section>
    </div>
  );
}
