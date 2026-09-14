import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnchorsSection } from "@/components/players/AnchorsSection";
import { GrowthAreasSection } from "@/components/players/GrowthAreasSection";
import { PrioritiesSection } from "@/components/players/PrioritiesSection";
import { DrillsSection } from "@/components/players/DrillsSection";
import { FeedbackList } from "@/components/players/FeedbackList";

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

  const [
    { data: anchors },
    { data: growthAreas },
    { data: priorities },
    { data: drills },
    { data: feedback },
  ] = await Promise.all([
    supabase
      .from("anchors")
      .select("id, title, description")
      .eq("player_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("growth_areas")
      .select("id, title, description, category, status")
      .eq("player_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("priorities")
      .select("id, title, description, status")
      .eq("player_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("drills")
      .select("id, title, description, status")
      .eq("player_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("feedback")
      .select("id, content, created_at")
      .eq("player_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const displayName = `${player.first_name} ${player.last_name}`.trim();
  const jerseyLabel =
    player.jersey_number != null ? `#${player.jersey_number}` : "";
  const positions = [player.first_position, player.second_position].filter(
    (p): p is string => Boolean(p)
  );

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
            {displayName} {jerseyLabel}
          </h1>
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

        <AnchorsSection playerId={id} initialItems={anchors ?? []} />
        <GrowthAreasSection
          playerId={id}
          initialItems={growthAreas ?? []}
        />
        <PrioritiesSection playerId={id} initialItems={priorities ?? []} />
        <DrillsSection playerId={id} initialItems={drills ?? []} />
        <FeedbackList items={feedback ?? []} />
      </div>
    </main>
  );
}
