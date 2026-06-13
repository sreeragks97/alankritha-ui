import { cn } from "@/lib/cn";

interface MissingImageStateProps {
  label?: string;
  className?: string;
}

export function MissingImageState({ label = "Image unavailable", className }: MissingImageStateProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[inherit] border border-dashed border-[#dbcdb1] bg-[#f8f1e0] px-3 text-center",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--brand-muted)]">{label}</p>
    </div>
  );
}
