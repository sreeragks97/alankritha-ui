import Link from "next/link";
import type { SectionHeaderProps } from "@/types/ui";

export function SectionHeader({ title, subtitle, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-end sm:gap-4">
      <div className="max-w-2xl">
        <h2 className="title-luxury text-[var(--brand-ink)]">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)] sm:mt-2.5 sm:leading-7 sm:text-base">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link className="gold-link inline-flex min-h-11 items-center rounded-full border border-[#d9cbaf] px-3.5 py-1.5 text-sm font-semibold hover:border-[#c9b48c]" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
