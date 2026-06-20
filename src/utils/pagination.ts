import type { PaginatedResult } from "@/src/types/database";

export function toPaginatedResult<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

export function toRange(page: number, limit: number): [number, number] {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  return [from, to];
}
