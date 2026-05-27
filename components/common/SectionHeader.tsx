import Link from "next/link";
import type { SectionHeaderProps } from "@/types/ui";

export function SectionHeader({ title, subtitle, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-2xl text-[var(--brand-ink)] sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-[var(--brand-muted)] sm:text-base">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link className="gold-link text-sm font-semibold" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
