import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      {/* Linea del cerchio di centrocampo — unico elemento decorativo, molto sobrio */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        className="pointer-events-none absolute -top-40 left-1/2 h-[900px] w-[900px] -translate-x-1/2 opacity-[0.07]"
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
          y1="620"
          x2="800"
          y2="620"
          stroke="var(--color-court)"
          strokeWidth="2"
        />
      </svg>

      <div className="relative w-full max-w-[380px]">
        <div className="mb-8 flex flex-col gap-1">
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
          Gli account vengono creati dallo staff. Contatta il tuo coach se non
          hai ancora un accesso.
        </p>
      </div>
    </main>
  );
}
