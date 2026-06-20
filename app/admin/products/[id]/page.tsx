"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { GenericErrorState } from "@/components/ui/states";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/src/hooks/useCategories";
import { useProductById, useUpdateProduct } from "@/src/hooks/useProducts";
import {
  mapAdminProductToProductUpdateInput,
  mapCategoryToAdminCategory,
  mapProductToAdminProduct,
} from "@/src/utils/adminMappers";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();

  const categoriesQuery = useCategories();
  const productQuery = useProductById(params.id);
  const updateProductMutation = useUpdateProduct();

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).map(mapCategoryToAdminCategory),
    [categoriesQuery.data],
  );
  const product = useMemo(
    () => (productQuery.data ? mapProductToAdminProduct(productQuery.data) : undefined),
    [productQuery.data],
  );

  const loading =
    (categoriesQuery.isLoading && !categoriesQuery.data) ||
    (productQuery.isLoading && !productQuery.data);

  if (categoriesQuery.isError || productQuery.isError) {
    return (
      <GenericErrorState
        onRetry={() => {
          void Promise.all([categoriesQuery.refetch(), productQuery.refetch()]);
        }}
      />
    );
  }

  if (loading) {
    return (
      <PageLoader label="Loading product details">
        <Shimmer className="card-luxury h-[520px] rounded-2xl" />
      </PageLoader>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The selected product could not be loaded."
        actionLabel="Back to products"
        onAction={() => router.push("/admin/products")}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories available"
        description="Create at least one category before editing products."
        actionLabel="Go to categories"
        onAction={() => router.push("/admin/categories")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-luxury rounded-2xl p-5">
        <p className="kicker">Catalog</p>
        <p className="mt-1 font-heading text-3xl">Edit Product</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">ID: {product.id}</p>
      </div>
      <ProductForm
        mode="edit"
        categories={categories}
        initialProduct={product}
        onSubmit={async (payload, action) => {
          try {
            await updateProductMutation.mutateAsync({
              id: product.id,
              payload: mapAdminProductToProductUpdateInput(payload),
            });

            showToast({
              title: action === "publish" ? "Product updated" : "Draft updated",
              description: `${payload.name} has been saved.`,
              tone: "success",
            });

            window.setTimeout(() => {
              router.push("/admin/products");
            }, 500);
          } catch (error) {
            showToast({
              title: "Could not update product",
              description: error instanceof Error ? error.message : "Please try again.",
              tone: "error",
            });
          }
        }}
        onCancel={() => router.push("/admin/products")}
        isSubmitting={updateProductMutation.isPending}
      />
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
