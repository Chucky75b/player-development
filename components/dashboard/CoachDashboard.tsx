import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  displayName: string;
};

export async function CoachDashboard({ displayName }: Props) {
  const supabase = await createClient();

  const { data: players } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role", "player")
    .order("first_name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
        Welcome back, {displayName}
      </h1>

      <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)]">
        <h2 className="border-b border-[var(--color-line-soft)] px-5 py-3 font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Roster
        </h2>

        {!players || players.length === 0 ? (
          <p className="px-5 py-4 text-sm text-[var(--color-ink-tertiary)]">
            No players yet. Create an account with the role &quot;player&quot; in Supabase → Authentication.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-line-soft)]">
            {players.map((player) => {
              const name = player.first_name
                ? `${player.first_name} ${player.last_name ?? ""}`.trim()
                : "Name not set";
              return (
                <li key={player.id}>
                  <Link
                    href={`/players/${player.id}`}
                    className="block px-5 py-3 text-sm text-[var(--color-ink-primary)] hover:bg-[var(--color-surface-2)]"
                  >
                    {name}
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
