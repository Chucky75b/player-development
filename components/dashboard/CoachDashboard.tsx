import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  displayName: string;
};

const POSITION_LABEL: Record<string, string> = {
  point_guard: "PG",
  guard: "G",
  forward: "F",
  power_forward: "PF",
  center: "C",
};

export async function CoachDashboard({ displayName }: Props) {
  const supabase = await createClient();

  const { data: players } = await supabase
    .from("players")
    .select("id, first_name, last_name, jersey_number, first_position, status")
    .order("first_name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div>
      <h3 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Welcome back,
        </h3>
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
        {displayName}
      </h1>
      </div>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)]">
        <h2 className="border-b border-[var(--color-line-soft)] px-5 py-3 font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Roster
        </h2>

        {!players || players.length === 0 ? (
          <p className="px-5 py-4 text-sm text-[var(--color-ink-tertiary)]">
            No players yet.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-line-soft)]">
            {players.map((player) => {
              const name = `${player.first_name} ${player.last_name}`.trim();
              const position = player.first_position
                ? POSITION_LABEL[player.first_position]
                : null;
              return (
                <li key={player.id}>
                  <Link
                    href={`/players/${player.id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm text-[var(--color-ink-primary)] hover:bg-[var(--color-surface-2)]"
                  >
                    <span>
                      {name}
                      {player.status !== "active" && (
                        <span className="ml-2 text-xs text-[var(--color-ink-muted)]">
                          ({player.status})
                        </span>
                      )}
                    </span>
                    <span className="font-data text-xs text-[var(--color-court)]">
                      {[
                        player.jersey_number != null
                          ? `#${player.jersey_number}`
                          : null,
                        position,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
