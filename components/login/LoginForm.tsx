"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/app/(auth)/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-data text-xs uppercase tracking-wide text-[var(--color-ink-tertiary)]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink-primary)] outline-none placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-court)] focus:ring-1 focus:ring-[var(--color-court)]"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="font-data text-xs uppercase tracking-wide text-[var(--color-ink-tertiary)]"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--color-ink-tertiary)] underline decoration-[var(--color-line-strong)] underline-offset-2 hover:text-[var(--color-court-strong)]"
          >
            Forgot Password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink-primary)] outline-none focus:border-[var(--color-court)] focus:ring-1 focus:ring-[var(--color-court)]"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-[4px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 rounded-[4px] bg-[var(--color-court)] px-4 py-2.5 font-display text-base font-semibold uppercase tracking-wide text-[#1a1206] transition-colors hover:bg-[var(--color-court-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Logging in…" : "Sign in"}
      </button>
    </form>
  );
}
