"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { useToast } from "@/hooks/useToast";
import { adminRepository } from "@/lib/admin/repository";
import type { AdminCategory, AdminProduct } from "@/types/admin";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([adminRepository.getCategories().then(setCategories), adminRepository.getProducts().then(setProducts)]).finally(() =>
      setLoading(false),
    );
  }, []);

  const product = useMemo(() => products.find((item) => item.id === params.id), [products, params.id]);

  if (loading) {
    return <div className="card-luxury h-[520px] animate-shimmer rounded-2xl" />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The selected product ID is not available in mock dataset."
        actionLabel="Back to products"
        onAction={() => router.push("/admin/products")}
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
        onSubmit={(payload, action) => {
          showToast({
            title: action === "publish" ? "Product updated" : "Draft updated",
            description: `${payload.name} changes are saved in mock state.`,
            tone: "success",
          });
          window.setTimeout(() => {
            router.push("/admin/products");
          }, 500);
        }}
        onCancel={() => router.push("/admin/products")}
      />
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
