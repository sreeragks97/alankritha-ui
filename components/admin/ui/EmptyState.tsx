interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="card-luxury rounded-2xl border-dashed p-10 text-center">
      <p className="font-heading text-3xl text-[var(--brand-ink)]">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--brand-muted)]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
