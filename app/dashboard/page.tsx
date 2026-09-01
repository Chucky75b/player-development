import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

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
    .single();

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : user.email;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-6">
        <header className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-5">
          <div>
            <span className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
              {profile?.role ?? "player"}
            </span>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
              Welcome back, {displayName}
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-[4px] border border-[var(--color-line-default)] px-3 py-1.5 text-sm text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink-primary)]"
            >
              Log out
            </button>
          </form>
        </header>

        <p className="text-sm text-[var(--color-ink-tertiary)]">
          Login funzionante. La player dashboard vera e propria (Strength,
          Building Blocks) arriva nel prossimo step.
        </p>
      </div>
    </main>
  );
}
