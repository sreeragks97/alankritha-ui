import type { CatalogFilters, SortOption } from "@/types/catalog";
import type { Product } from "@/types/product";

export function searchProducts(products: Product[], query?: string): Product[] {
  if (!query) {
    return products;
  }

  const needle = query.trim().toLowerCase();
  if (!needle) {
    return products;
  }

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(needle) ||
      product.code.toLowerCase().includes(needle) ||
      product.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  });
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  return products.filter((product) => {
    if (filters.category && filters.category !== "all" && product.category !== filters.category) {
      return false;
    }

    if (typeof filters.minPrice === "number" && product.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === "number" && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.metalType && filters.metalType !== "all" && product.metalType !== filters.metalType) {
      return false;
    }

    if (filters.occasion && filters.occasion !== "all" && product.occasion !== filters.occasion) {
      return false;
    }

    if (filters.tags?.length) {
      const lowerTags = filters.tags.map((tag) => tag.toLowerCase());
      const productTags = product.tags.map((tag) => tag.toLowerCase());
      const hasTag = lowerTags.some((tag) => productTags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const cloned = [...products];

  switch (sort) {
    case "newest":
      return cloned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "price-asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price-desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return cloned.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

export function composeCatalog(products: Product[], filters: CatalogFilters, sort: SortOption): Product[] {
  const searched = searchProducts(products, filters.search);
  const filtered = filterProducts(searched, filters);
  return sortProducts(filtered, sort);
}
