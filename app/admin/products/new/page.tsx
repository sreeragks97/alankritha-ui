"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { GenericErrorState } from "@/components/ui/states";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/src/hooks/useCategories";
import { useCreateProduct } from "@/src/hooks/useProducts";
import { mapAdminProductToProductInput, mapCategoryToAdminCategory } from "@/src/utils/adminMappers";
import type { AdminProduct } from "@/types/admin";

export default function NewProductPage() {
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();
  const categoriesQuery = useCategories();
  const createProductMutation = useCreateProduct();

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).map(mapCategoryToAdminCategory),
    [categoriesQuery.data],
  );

  const loading = categoriesQuery.isLoading && !categoriesQuery.data;
  const hasError = categoriesQuery.isError;

  const handleSubmit = async (payload: AdminProduct, action: "draft" | "publish") => {
    try {
      await createProductMutation.mutateAsync(mapAdminProductToProductInput(payload));
      showToast({
        title: action === "publish" ? "Product published" : "Draft saved",
        description: `${payload.name || "Untitled product"} has been saved.`,
        tone: "success",
      });

      window.setTimeout(() => {
        router.push("/admin/products");
      }, 500);
    } catch (error) {
      showToast({
        title: "Could not save product",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
    }
  };

  if (hasError) {
    return <GenericErrorState onRetry={() => categoriesQuery.refetch()} />;
  }

  if (!loading && categories.length === 0) {
    return (
      <EmptyState
        title="No categories available"
        description="Create at least one category before adding products."
        actionLabel="Go to categories"
        onAction={() => router.push("/admin/categories")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-luxury rounded-2xl p-5">
        <p className="kicker">Catalog</p>
        <p className="mt-1 font-heading text-3xl">Add Product</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">Create premium catalogue entries with media, SEO, and WhatsApp preview.</p>
      </div>
      {loading ? (
        <PageLoader label="Loading product form">
          <Shimmer className="card-luxury h-[520px] rounded-2xl" />
        </PageLoader>
      ) : null}
      {!loading ? (
        <ProductForm
          mode="create"
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/products")}
          isSubmitting={createProductMutation.isPending}
        />
      ) : null}
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
