interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ title, description, actionLabel = "Try again", onAction }: ErrorStateProps) {
  return (
    <section className="card-luxury rounded-2xl border-dashed border-[#e7c8bf] bg-[#fff7f4] p-8 text-center sm:p-10" role="alert">
      <p className="font-heading text-3xl text-[#7a3f2f]">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-[#8a5d4f]">{description}</p>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[#d8a89a] bg-white px-4 py-2 text-sm font-semibold text-[#7a3f2f]"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
