"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "@/types/product";
import { SORT_OPTIONS } from "@/lib/constants";

interface FilterSidebarProps {
  categories: Category[];
  products: Product[];
}

function uniqueTags(products: Product[]): string[] {
  return Array.from(new Set(products.flatMap((product) => product.tags))).sort((a, b) => a.localeCompare(b));
}

export function FilterSidebar({ categories, products }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [metalType, setMetalType] = useState(searchParams.get("metal") ?? "all");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") ?? "all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");
  const [priceMin, setPriceMin] = useState(searchParams.get("minPrice") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("maxPrice") ?? "");
  const [tag, setTag] = useState(searchParams.get("tag") ?? "");

  const tags = useMemo(() => uniqueTags(products), [products]);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    const assignments: Array<[string, string]> = [
      ["search", search],
      ["category", category],
      ["metal", metalType],
      ["occasion", occasion],
      ["sort", sort],
      ["minPrice", priceMin],
      ["maxPrice", priceMax],
      ["tag", tag],
    ];

    assignments.forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    setDrawerOpen(false);
  }

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setMetalType("all");
    setOccasion("all");
    setSort("featured");
    setPriceMin("");
    setPriceMax("");
    setTag("");
    router.push(pathname);
    setDrawerOpen(false);
  }

  const controls = (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Product Search</label>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or code"
          className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Sort</label>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Category</label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm">
          <option value="all">All Categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Min Price</label>
          <input
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
            type="number"
            className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Max Price</label>
          <input
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            type="number"
            className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Metal</label>
        <select value={metalType} onChange={(event) => setMetalType(event.target.value)} className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm">
          <option value="all">All</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Occasion</label>
        <select value={occasion} onChange={(event) => setOccasion(event.target.value)} className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm">
          <option value="all">All</option>
          <option value="bridal">Bridal</option>
          <option value="festive">Festive</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Tag</label>
        <select value={tag} onChange={(event) => setTag(event.target.value)} className="h-11 w-full rounded-xl border border-[#dbcdb1] bg-white px-3 text-sm">
          <option value="">Any</option>
          {tags.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={applyFilters}
          className="flex-1 rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="flex-1 rounded-full border border-[#cfbf9f] px-4 py-2 text-sm font-semibold text-[var(--brand-gold-deep)]"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="card-luxury sticky top-24 hidden h-fit p-4 lg:block">{controls}</aside>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="mb-4 inline-flex rounded-full border border-[#cfbf9f] px-4 py-2 text-sm font-semibold text-[var(--brand-gold-deep)]"
        >
          Filters & Sort
        </button>
        {drawerOpen ? (
          <div className="fixed inset-0 z-50">
            <button type="button" className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} aria-label="Close filters" />
            <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#fffdf9] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-heading text-xl">Filters</p>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                  ×
                </button>
              </div>
              {controls}
            </aside>
          </div>
        ) : null}
      </div>
    </>
  );
}
