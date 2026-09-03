import Link from "next/link";
import { RegisterForm } from "@/components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col gap-1 text-center">
          <span className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
            Roster Access
          </span>
          <h1 className="font-display text-[28px] font-bold uppercase leading-[0.95] tracking-tight text-[var(--color-ink-primary)]">
            Create account
          </h1>
        </div>

        <div className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline decoration-[var(--color-line-strong)] underline-offset-2 hover:text-[var(--color-court-strong)]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
