"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "@/app/(auth)/forgot-password/actions";

const initialState: ForgotPasswordState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  if (state.status === "sent") {
    return (
      <p className="rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-3 text-sm text-[var(--color-ink-secondary)]">
        Se l&apos;indirizzo è collegato a un account, riceverai a breve
        un&apos;email con le istruzioni per reimpostare la password.
      </p>
    );
  }

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
          placeholder="nome@club.com"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-[4px] bg-[var(--color-court)] px-4 py-2.5 font-display text-base font-semibold uppercase tracking-wide text-[#1a1206] transition-colors hover:bg-[var(--color-court-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Invio…" : "Invia link di reset"}
      </button>
    </form>
  );
}
