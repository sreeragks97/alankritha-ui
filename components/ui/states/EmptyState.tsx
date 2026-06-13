import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <section className={cn("card-luxury rounded-2xl border-dashed p-8 text-center sm:p-10", className)} role="status" aria-live="polite">
      {icon ? <div className="mb-4 flex justify-center">{icon}</div> : null}
      <p className="font-heading text-3xl text-[var(--brand-ink)]">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--brand-muted)]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
