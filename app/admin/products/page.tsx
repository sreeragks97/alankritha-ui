"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { OptimizedImage } from "@/components/ui/image";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { EmptyProducts, GenericErrorState } from "@/components/ui/states";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/currency";
import { useCategories } from "@/src/hooks/useCategories";
import { useDeleteProduct, useProducts } from "@/src/hooks/useProducts";
import { mapCategoryToAdminCategory, mapProductToAdminProduct } from "@/src/utils/adminMappers";
import type { AdminProduct, ProductStatus } from "@/types/admin";

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=640&q=80";

export default function AdminProductsPage() {
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categoriesQuery = useCategories();
  const productsQuery = useProducts({
    page,
    limit: 5,
    search: search.trim() || undefined,
    category: category === "all" ? undefined : category,
    active: status === "all" ? undefined : status === "active",
  });
  const deleteProductMutation = useDeleteProduct();

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).map(mapCategoryToAdminCategory),
    [categoriesQuery.data],
  );

  const result = useMemo(() => {
    const items = (productsQuery.data?.items ?? []).map(mapProductToAdminProduct);

    return {
      items,
      total: productsQuery.data?.total ?? 0,
      totalPages: productsQuery.data?.totalPages ?? 1,
      page: productsQuery.data?.page ?? page,
    };
  }, [page, productsQuery.data]);

  const isLoading =
    (productsQuery.isLoading && !productsQuery.data) ||
    (categoriesQuery.isLoading && !categoriesQuery.data);

  const hasLoadError = productsQuery.isError || categoriesQuery.isError;

  const handleRowAction = async (item: AdminProduct, action: string) => {
    if (action === "view") {
      router.push(`/product/${item.slug}`);
      return;
    }

    if (action === "edit") {
      router.push(`/admin/products/${item.id}`);
      return;
    }

    if (action === "duplicate") {
      showToast({
        title: "Duplicate action pending",
        description: "Duplicate workflow will be wired in the next integration slice.",
        tone: "info",
      });
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(`Delete \"${item.name}\"? This cannot be undone.`);
      if (!confirmed) {
        return;
      }

      try {
        await deleteProductMutation.mutateAsync(item.id);
        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
        showToast({
          title: "Product deleted",
          description: `${item.name} has been removed.`,
          tone: "success",
        });
      } catch (error) {
        showToast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Unable to delete product.",
          tone: "error",
        });
      }
    }
  };

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

  if (isLoading) {
    return (
      <PageLoader label="Loading products list">
        <div className="space-y-4">
          <Shimmer className="card-luxury h-20 rounded-2xl" />
          <Shimmer className="card-luxury h-80 rounded-2xl" />
        </div>
      </PageLoader>
    );
  }

  if (hasLoadError) {
    return (
      <GenericErrorState
        onRetry={() => {
          void Promise.all([productsQuery.refetch(), categoriesQuery.refetch()]);
        }}
      />
    );
  }

  if (result.total === 0) {
    return <EmptyProducts onAction={() => window.location.assign("/admin/products/new")} />;
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
              className="min-h-11 rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            >
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
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
              className="min-h-11 rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)]"
          >
            Add Product
          </Link>
        </div>
      </section>

      <section className="card-luxury overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-2 border-b border-[#ede3d1] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
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
              hideOnMobile: true,
              render: (item) => (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleOne(item.id)}
                  aria-label={`Select ${item.name}`}
                />
              ),
            },
            {
              key: "product",
              title: "Product",
              mobileTitle: "Product",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#f2e8d3]">
                    <OptimizedImage
                      src={item.images[0] ?? FALLBACK_THUMBNAIL}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover object-center"
                      fallbackLabel={`${item.name} thumbnail unavailable`}
                    />
                  </div>
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
              hideOnMobile: true,
              render: (item) => (item.isFeatured ? <span className="rounded-full bg-[#f5e5c0] px-2 py-1 text-xs">Featured</span> : "-"),
            },
            {
              key: "actions",
              title: "Actions",
              mobileTitle: "Quick Action",
              render: (item) => (
                <select
                  className="min-h-10 rounded-lg border border-[#e8dcc3] bg-white px-2 py-1 text-xs focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                  defaultValue=""
                  onChange={(event) => {
                    const action = event.target.value;
                    event.target.value = "";
                    if (action) {
                      void handleRowAction(item, action);
                    }
                  }}
                >
                  <option value="" disabled>
                    Choose
                  </option>
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="delete">Delete</option>
                </select>
              ),
            },
          ]}
          rows={result.items}
          rowKey={(row) => row.id}
          caption="Admin products list"
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
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
