import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";
import bannersJson from "@/data/banners.json";
import type { Banner, Category, Product } from "@/types/product";

export const products: Product[] = productsJson as Product[];
export const categories: Category[] = categoriesJson as Category[];
export const banners: Banner[] = bannersJson as Banner[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, limit);
}
