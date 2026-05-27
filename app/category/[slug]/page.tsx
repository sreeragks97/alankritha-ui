import { notFound } from "next/navigation";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { composeCatalog } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/constants";
import { categories, getCategoryBySlug, products } from "@/lib/data";
import { paginate } from "@/lib/pagination";
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

  const category = getCategoryBySlug(slug);
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
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar categories={categories} products={products} />
        <div>
          {result.items.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
