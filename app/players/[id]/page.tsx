import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
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
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", id)
    .maybeSingle();

  if (!player || player.role !== "player") {
    notFound();
  }

  const displayName = player.first_name
    ? `${player.first_name} ${player.last_name ?? ""}`.trim()
    : "Name not set";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-6">
        <Link
          href="/dashboard"
          className="text-xs text-[var(--color-ink-tertiary)] underline decoration-[var(--color-line-strong)] underline-offset-2 hover:text-[var(--color-court-strong)]"
        >
          ← Back to roster
        </Link>

        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
          {displayName}
        </h1>

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
      </div>
    </main>
  );
}
