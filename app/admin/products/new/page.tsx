"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { useToast } from "@/hooks/useToast";
import { adminRepository } from "@/lib/admin/repository";
import type { AdminCategory, AdminProduct } from "@/types/admin";

export default function NewProductPage() {
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    void adminRepository.getCategories().then(setCategories);
  }, []);

  const handleSubmit = (payload: AdminProduct, action: "draft" | "publish") => {
    showToast({
      title: action === "publish" ? "Product published" : "Draft saved",
      description: `${payload.name || "Untitled product"} has been stored in local state mock mode.`,
      tone: "success",
    });
    window.setTimeout(() => {
      router.push("/admin/products");
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Add Product</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">Create premium catalogue entries with media, SEO, and WhatsApp preview.</p>
      </div>
      <ProductForm mode="create" categories={categories} onSubmit={handleSubmit} onCancel={() => router.push("/admin/products")} />
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
