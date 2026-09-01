import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import { PlayerDashboard } from "@/components/dashboard/PlayerDashboard";
import { CoachDashboard } from "@/components/dashboard/CoachDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : user.email ?? "";

  const role = profile?.role ?? "player";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-6">
        <div className="flex items-center justify-end">
          <form action={logout}>
            <button
              type="submit"
              className="rounded-[4px] border border-[var(--color-line-default)] px-3 py-1.5 text-sm text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink-primary)]"
            >
              Esci
            </button>
          </form>
        </div>

        {role === "player" ? (
          <PlayerDashboard displayName={displayName} />
        ) : (
          <CoachDashboard displayName={displayName} />
        )}
      </div>
    </main>
  );
}
