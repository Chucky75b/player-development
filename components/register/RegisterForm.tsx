"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "@/app/(auth)/register/actions";

const initialState: RegisterState = { status: "idle" };

const inputClass =
  "rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink-primary)] outline-none placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-court)] focus:ring-1 focus:ring-[var(--color-court)]";

const labelClass =
  "font-data text-xs uppercase tracking-wide text-[var(--color-ink-tertiary)]";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    register,
    initialState
  );

  if (state.status === "check-email") {
    return (
      <p className="rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-3 text-sm text-[var(--color-ink-secondary)]">
        Check your inbox to confirm your email — the message will come from{" "}
        <span className="text-[var(--color-ink-primary)]">
          Supabase Auth
        </span>{" "}
        (noreply@mail.app.supabase.io), not from the club. Once your account
        is reviewed and activated by the staff, you&apos;ll be able to sign
        in.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className={labelClass}>
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className={labelClass}>
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className={labelClass}>
          I am a
        </label>
        <select
          id="role"
          name="role"
          defaultValue="player"
          className={inputClass}
        >
          <option value="player">Player</option>
          <option value="coach">Coach</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="name@club.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {state.status === "error" && (
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
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
