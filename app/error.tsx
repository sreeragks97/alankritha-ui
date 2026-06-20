"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell py-10">
      <div className="card-luxury rounded-2xl p-6 text-center sm:p-8">
        <p className="font-heading text-3xl">Unable to load this page</p>
        <p className="mt-3 text-sm text-[var(--brand-muted)]">An unexpected issue occurred. Please try again.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
