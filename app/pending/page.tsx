import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/dashboard/actions";

export default async function PendingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] text-center">
        <span className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Roster Access
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-[var(--color-ink-primary)]">
          Your profile is being reviewed
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink-tertiary)]">
          Your account has been created. The staff still needs to review and
          activate it — you&apos;ll get an email at{" "}
          <span className="text-[var(--color-ink-secondary)]">
            {user.email}
          </span>{" "}
          as soon as it&apos;s ready.
        </p>

        <form action={logout} className="mt-8 inline-block">
          <button
            type="submit"
            className="rounded-[4px] border border-[var(--color-line-default)] px-4 py-2 text-sm text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink-primary)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
