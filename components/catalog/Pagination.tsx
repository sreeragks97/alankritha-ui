import Link from "next/link";
import type { PaginationMeta } from "@/types/catalog";

interface PaginationProps {
  meta: PaginationMeta;
  basePath: string;
  query: Record<string, string | undefined>;
}

function pageHref(basePath: string, query: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  params.set("page", page.toString());
  return `${basePath}?${params.toString()}`;
}

export function Pagination({ meta, basePath, query }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={pageHref(basePath, query, Math.max(1, meta.page - 1))}
        className="rounded-full border border-[#cfbf9f] px-4 py-2 text-sm text-[var(--brand-gold-deep)]"
      >
        Prev
      </Link>
      <span className="rounded-full bg-[#f8edd8] px-4 py-2 text-sm text-[var(--brand-ink)]">
        {meta.page} / {meta.totalPages}
      </span>
      <Link
        href={pageHref(basePath, query, Math.min(meta.totalPages, meta.page + 1))}
        className="rounded-full border border-[#cfbf9f] px-4 py-2 text-sm text-[var(--brand-gold-deep)]"
      >
        Next
      </Link>
    </nav>
  );
}
