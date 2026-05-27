import type { PaginationMeta } from "@/types/catalog";

export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; meta: PaginationMeta } {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    meta: {
      page: normalizedPage,
      pageSize,
      total,
      totalPages,
      hasPrev: normalizedPage > 1,
      hasNext: normalizedPage < totalPages,
    },
  };
}
