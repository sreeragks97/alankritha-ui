import Link from "next/link";
import type { SectionHeaderProps } from "@/types/ui";

export function SectionHeader({ title, subtitle, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-7">
      <div className="max-w-2xl">
        <h2 className="title-luxury text-[var(--brand-ink)]">{title}</h2>
        {subtitle ? <p className="mt-2.5 text-sm leading-7 text-[var(--brand-muted)] sm:text-base">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link className="gold-link rounded-full border border-[#d9cbaf] px-3 py-1.5 text-sm font-semibold hover:border-[#c9b48c]" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
