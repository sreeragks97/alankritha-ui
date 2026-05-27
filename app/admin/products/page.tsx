"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { adminRepository } from "@/lib/admin/repository";
import { formatCurrency, queryProducts } from "@/lib/admin/selectors";
import type { AdminCategory, AdminProduct, ProductStatus } from "@/types/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    void adminRepository.getProducts().then(setProducts);
    void adminRepository.getCategories().then(setCategories);
  }, []);

  const result = useMemo(
    () =>
      queryProducts(products, {
        search,
        category,
        status,
        page,
        pageSize: 5,
      }),
    [products, search, category, status, page],
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === result.items.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(result.items.map((item) => item.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Start by creating your first catalogue item for storefront publishing."
        actionLabel="Add Product"
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="card-luxury rounded-2xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
                setSelectedIds([]);
              }}
              placeholder="Search by product name or code"
            />
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
                setSelectedIds([]);
              }}
              className="rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as "all" | ProductStatus);
                setPage(1);
                setSelectedIds([]);
              }}
              className="rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Link href="/admin/products/new" className="rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white">
            Add Product
          </Link>
        </div>
      </section>

      <section className="card-luxury overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#ede3d1] px-4 py-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={selectedIds.length === result.items.length && result.items.length > 0} onChange={toggleSelectAll} />
            Bulk Select
          </label>
          <p className="text-[var(--brand-muted)]">
            Showing {result.items.length} of {result.total} products
          </p>
        </div>
        <DataTable
          columns={[
            {
              key: "select",
              title: "Select",
              render: (item) => (
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} />
              ),
            },
            {
              key: "product",
              title: "Product",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-[#f2e8d3] bg-cover bg-center" style={{ backgroundImage: `url(${item.images[0] || ""})` }} />
                  <div>
                    <p className="font-medium text-[var(--brand-ink)]">{item.name}</p>
                    <p className="text-xs text-[var(--brand-muted)]">{item.code}</p>
                  </div>
                </div>
              ),
            },
            { key: "category", title: "Category", render: (item) => item.categoryName },
            { key: "price", title: "Price", render: (item) => formatCurrency(item.price) },
            { key: "status", title: "Status", render: (item) => <StatusBadge status={item.status} /> },
            {
              key: "featured",
              title: "Featured",
              render: (item) => (item.isFeatured ? <span className="rounded-full bg-[#f5e5c0] px-2 py-1 text-xs">Featured</span> : "-"),
            },
            {
              key: "actions",
              title: "Actions",
              render: (item) => (
                <select className="rounded-lg border border-[#e8dcc3] bg-white px-2 py-1 text-xs" defaultValue="">
                  <option value="" disabled>
                    Choose
                  </option>
                  <option value="view">View</option>
                  <option value="edit">Edit ({item.id})</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="delete">Delete</option>
                </select>
              ),
            },
          ]}
          rows={result.items}
          rowKey={(row) => row.id}
        />
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setSelectedIds([]);
          }}
        />
      </section>
    </div>
  );
}
