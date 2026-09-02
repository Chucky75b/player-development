import { createClient } from "@/lib/supabase/server";

type Props = {
  displayName: string;
};

const POSITION_LABEL: Record<string, string> = {
  point_guard: "Point Guard",
  guard: "Guard",
  forward: "Forward",
  power_forward: "Power Forward",
  center: "Center",
};

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function PlayerDashboard({ displayName }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: player } = user
    ? await supabase
        .from("players")
        .select("date_birth, first_position, second_position, jersey_number, updated_at")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const positions = [player?.first_position, player?.second_position].filter(
    (p): p is string => Boolean(p)
  );

  const jerseyLabel =
    player?.jersey_number != null ? `#${player.jersey_number}` : "";
  const birthDate = formatDate(player?.date_birth);
  const updatedAt = formatDateTime(player?.updated_at);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Welcome back,
        </h3>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
          {displayName} {jerseyLabel}
        </h1>
        {birthDate && (
          <p className="mt-1 font-data text-xs text-[var(--color-ink-tertiary)]">
            {birthDate}
          </p>
        )}
        {positions.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {positions.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-sm text-[var(--color-ink-muted)]">
                    /
                  </span>
                )}
                <span className="rounded-full border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3 py-1 font-data text-sm text-[var(--color-ink-secondary)]">
                  {POSITION_LABEL[p]}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Anchors
        </h2>
        <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
          No data yet. Your coach will populate this section.
        </p>
      </section>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Growth Areas
        </h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          What to work on
        </p>
        <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
          No data yet. Your coach will populate this section.
        </p>
      </section>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Priorities
        </h2>
        <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
          No data yet. Your coach will populate this section.
        </p>
      </section>

      {updatedAt && (
        <p className="text-xs text-[var(--color-ink-muted)]">
          Last updated {updatedAt}
        </p>
      )}
    </div>
  );
}
