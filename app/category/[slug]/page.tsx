import { notFound } from "next/navigation";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { composeCatalog } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/constants";
import { paginate } from "@/lib/pagination";
import { getServerServices } from "@/src/services/server";
import { mapCategoryToUiCategory, mapProductToUiProduct } from "@/src/utils/uiMappers";
import type { CatalogFilters, SortOption } from "@/types/catalog";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstOf(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const { categoryService, productService } = await getServerServices();

  const [categoryRow, categoryRows, productRows] = await Promise.all([
    categoryService.getCategoryBySlug(slug),
    categoryService.getCategories({ activeOnly: true }),
    productService.getProducts({ page: 1, limit: 100, activeOnly: true }),
  ]);

  const categories = categoryRows.map(mapCategoryToUiCategory);
  const products = productRows.items.map(mapProductToUiProduct);
  const category = categoryRow ? mapCategoryToUiCategory(categoryRow) : null;

  if (!category) {
    notFound();
  }

  const filters: CatalogFilters = {
    category: firstOf(query.category) ?? slug,
    search: firstOf(query.search),
    metalType: firstOf(query.metal),
    occasion: firstOf(query.occasion),
    minPrice: firstOf(query.minPrice) ? Number(firstOf(query.minPrice)) : undefined,
    maxPrice: firstOf(query.maxPrice) ? Number(firstOf(query.maxPrice)) : undefined,
    tags: firstOf(query.tag) ? [String(firstOf(query.tag))] : undefined,
  };

  const sort = (firstOf(query.sort) as SortOption) ?? "featured";
  const page = Number(firstOf(query.page) ?? "1");

  const scopedProducts = products.filter((product) => product.category === slug || filters.category === "all");
  const filtered = composeCatalog(scopedProducts, filters, sort);
  const result = paginate(filtered, page, PAGE_SIZE);

  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <SectionHeader title={category.name} subtitle={category.description} />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <FilterSidebar categories={categories} products={products} />
        <div>
          {result.items.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="card-luxury p-8 text-center text-[var(--brand-muted)] sm:p-10">No products found for the selected filters.</div>
          )}
          <Pagination
            meta={result.meta}
            basePath={`/category/${slug}`}
            query={{
              search: firstOf(query.search),
              category: firstOf(query.category),
              metal: firstOf(query.metal),
              occasion: firstOf(query.occasion),
              minPrice: firstOf(query.minPrice),
              maxPrice: firstOf(query.maxPrice),
              sort: firstOf(query.sort),
              tag: firstOf(query.tag),
            }}
          />
        </div>
      </div>
    </div>
  );
}
