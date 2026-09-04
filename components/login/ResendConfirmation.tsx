"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  resendConfirmation,
  type ResendState,
} from "@/app/(auth)/login/resend-action";

const initialState: ResendState = { status: "idle" };

export function ResendConfirmation() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    resendConfirmation,
    initialState
  );

  if (searchParams.get("error") !== "confirmation-link-invalid") {
    return null;
  }

  if (state.status === "sent") {
    return (
      <p className="mt-4 rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3.5 py-3 text-sm text-[var(--color-ink-secondary)]">
        New confirmation email sent — check your inbox (and spam folder).
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-4 flex flex-col gap-2 rounded-[4px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-3.5"
    >
      <p className="text-sm text-[var(--color-danger)]">
        That confirmation link didn&apos;t work. Enter your email to get a
        new one.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="name@club.com"
          className="flex-1 rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-ink-primary)] outline-none focus:border-[var(--color-court)]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="whitespace-nowrap rounded-[4px] bg-[var(--color-court)] px-3 py-2 text-sm font-semibold text-[#1a1206] hover:bg-[var(--color-court-strong)] disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Resend"}
        </button>
      </div>
    </form>
  );
}
