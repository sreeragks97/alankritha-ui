export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export interface CatalogFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  metalType?: string;
  occasion?: string;
  tags?: string[];
  search?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}
