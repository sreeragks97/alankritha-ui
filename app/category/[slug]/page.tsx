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

  const { categoryService, productService, siteSettingsService } = await getServerServices();

  const [categoryRow, categoryRows, productRows, settings] = await Promise.all([
    categoryService.getCategoryBySlug(slug),
    categoryService.getCategories({ activeOnly: true }),
    productService.getProducts({ page: 1, limit: 100, activeOnly: true }),
    siteSettingsService.getSettings(),
  ]);

  const categories = categoryRows.map(mapCategoryToUiCategory);
  const products = productRows.items.map((item) =>
    mapProductToUiProduct(item, { offerBadgeFallback: settings.offer_badge_label }),
  );
  const category = categoryRow ? mapCategoryToUiCategory(categoryRow) : null;

  if (!category) {
    notFound();
  }

  const config = {
    search: settings.filter_search_enabled,
    sort: settings.filter_sort_enabled,
    category: settings.filter_category_enabled,
    price: settings.filter_price_enabled,
    metal: settings.filter_metal_enabled,
    occasion: settings.filter_occasion_enabled,
    tag: settings.filter_tag_enabled,
  };

  const filters: CatalogFilters = {
    category: config.category ? firstOf(query.category) ?? slug : slug,
    search: config.search ? firstOf(query.search) : undefined,
    metalType: config.metal ? firstOf(query.metal) : undefined,
    occasion: config.occasion ? firstOf(query.occasion) : undefined,
    minPrice: config.price && firstOf(query.minPrice) ? Number(firstOf(query.minPrice)) : undefined,
    maxPrice: config.price && firstOf(query.maxPrice) ? Number(firstOf(query.maxPrice)) : undefined,
    tags: config.tag && firstOf(query.tag) ? [String(firstOf(query.tag))] : undefined,
  };

  const sort = config.sort ? (firstOf(query.sort) as SortOption) ?? "featured" : "featured";
  const page = Number(firstOf(query.page) ?? "1");

  const scopedProducts = products.filter((product) => product.category === slug || filters.category === "all");
  const filtered = composeCatalog(scopedProducts, filters, sort);
  const result = paginate(filtered, page, PAGE_SIZE);

  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <SectionHeader title={category.name} subtitle={category.description} />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <FilterSidebar categories={categories} products={products} config={config} />
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
