import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/login/LoginForm";
import { ResendConfirmation } from "@/components/login/ResendConfirmation";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      {/* Linea del cerchio di centrocampo — unico elemento decorativo, molto sobrio */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        className="pointer-events-none absolute h-[900px] w-[900px] opacity-[0.07]"
      >
        <circle
          cx="400"
          cy="400"
          r="220"
          fill="none"
          stroke="var(--color-court)"
          strokeWidth="2"
        />
        <line
          x1="0"
          y1="400"
          x2="800"
          y2="400"
          stroke="var(--color-court)"
          strokeWidth="2"
        />
      </svg>

      <div className="relative w-full max-w-[380px]">
        <div className="mb-8 flex flex-col gap-1 text-center">
          <span className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
            Roster Access
          </span>
          <h1 className="font-display text-[34px] font-bold uppercase leading-[0.95] tracking-tight text-[var(--color-ink-primary)]">
            Player
            <br />
            Development
          </h1>
        </div>

        <div className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-6 shadow-[0_1px_0_0_var(--color-line-soft)]">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="underline decoration-[var(--color-line-strong)] underline-offset-2 hover:text-[var(--color-court-strong)]"
          >
            Create account
          </Link>
        </p>

        <Suspense fallback={null}>
          <ResendConfirmation />
        </Suspense>
      </div>
    </main>
  );
}
