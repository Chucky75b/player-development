import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

const POSITION_LABEL: Record<string, string> = {
  point_guard: "Point Guard",
  guard: "Guard",
  forward: "Forward",
  power_forward: "Power Forward",
  center: "Center",
};

export default async function PlayerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: viewerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const viewerRole = viewerProfile?.role ?? "player";
  if (viewerRole !== "coach" && viewerRole !== "admin") {
    redirect("/dashboard");
  }

  const { data: player } = await supabase
    .from("players")
    .select(
      "first_name, last_name, jersey_number, first_position, second_position, status"
    )
    .eq("id", id)
    .maybeSingle();

  if (!player) {
    notFound();
  }

  const displayName = `${player.first_name} ${player.last_name}`.trim();
  const positions = [player.first_position, player.second_position]
    .filter(Boolean)
    .map((p) => POSITION_LABEL[p as string])
    .join(" / ");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-6">
        <Link
          href="/dashboard"
          className="text-xs text-[var(--color-ink-tertiary)] underline decoration-[var(--color-line-strong)] underline-offset-2 hover:text-[var(--color-court-strong)]"
        >
          ← Back to roster
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
            {displayName}
          </h1>
          <p className="font-data text-xs text-[var(--color-ink-tertiary)]">
            {[
              player.jersey_number != null ? `#${player.jersey_number}` : null,
              positions || null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
          <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
            Anchors
          </h2>
          <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
            No data yet.
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
            No data yet.
          </p>
        </section>

        <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
          <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
            Priorities
          </h2>
          <p className="mt-3 text-sm text-[var(--color-ink-tertiary)]">
            No data yet.
          </p>
        </section>
      </div>
    </main>
  );
}
