import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        // className="pointer-events-none absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 opacity-[0.07]"
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

      <div className="relative flex w-full max-w-[380px] flex-col items-center text-center">
        <span className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Roster Access
        </span>
        <h1 className="mt-1 font-display text-[34px] font-bold uppercase leading-[0.95] tracking-tight text-[var(--color-ink-primary)]">
          Player
          <br />
          Development
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink-tertiary)]">
          Track anchors, growth areas and priorities for every player on the
          roster.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link
            href="/login"
            className="rounded-[4px] bg-[var(--color-court)] px-4 py-2.5 text-center font-display text-base font-semibold uppercase tracking-wide text-[#1a1206] transition-colors hover:bg-[var(--color-court-strong)]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-center font-display text-base font-semibold uppercase tracking-wide text-[var(--color-ink-primary)] transition-colors hover:border-[var(--color-line-strong)]"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
