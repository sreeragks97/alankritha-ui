"use client";

import { useMemo, useState } from "react";
import { ImageUploader } from "@/components/admin/product/ImageUploader";
import { toSlug } from "@/utils/slug";
import type { AdminCategory, AdminProduct } from "@/types/admin";

interface ProductFormProps {
  mode: "create" | "edit";
  categories: AdminCategory[];
  initialProduct?: AdminProduct;
  onSubmit: (payload: AdminProduct, action: "draft" | "publish") => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function newDraft(categoryId: string, categoryName: string): AdminProduct {
  const now = new Date().toISOString();
  return {
    id: `prd_${Date.now()}`,
    name: "",
    code: "",
    slug: "",
    description: "",
    categoryId,
    categoryName,
    price: 0,
    offerPrice: 0,
    tags: [],
    images: [],
    status: "draft",
    isFeatured: false,
    isSoldOut: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function ProductForm({ mode, categories, initialProduct, onSubmit, onCancel, isSubmitting = false }: ProductFormProps) {
  const fallbackCategory = categories[0] ?? {
    id: "uncategorized",
    name: "Uncategorized",
    slug: "uncategorized",
    bannerImage: "",
    productCount: 0,
    status: "active" as const,
  };

  const [form, setForm] = useState<AdminProduct>(
    initialProduct ?? newDraft(fallbackCategory.id, fallbackCategory.name),
  );
  const [tagInput, setTagInput] = useState(form.tags.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [metaTitle, setMetaTitle] = useState(initialProduct?.name ?? "");
  const [metaDescription, setMetaDescription] = useState(initialProduct?.description ?? "");

  const whatsappPreview = useMemo(
    () => `Hi, I would like details for ${form.name || "this product"} (${form.code || "CODE"}).`,
    [form.name, form.code],
  );

  const setField = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) => {
    setForm((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
  };

  const updateName = (name: string) => {
    setField("name", name);
    setField("slug", toSlug(name));
    if (!metaTitle) setMetaTitle(name);
  };

  const updateCategory = (categoryId: string) => {
    const picked = categories.find((category) => category.id === categoryId) ?? fallbackCategory;
    setForm((prev) => ({
      ...prev,
      categoryId: picked.id,
      categoryName: picked.name,
      updatedAt: new Date().toISOString(),
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.code.trim()) nextErrors.code = "Product code is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (form.price <= 0) nextErrors.price = "Price must be greater than zero";
    if (form.images.some((imageUrl) => imageUrl.startsWith("blob:"))) {
      nextErrors.images = "Temporary image URLs cannot be saved. Wait for upload completion.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (action: "draft" | "publish") => {
    if (isSubmitting || isUploadingImages) {
      if (isUploadingImages) {
        setErrors((prev) => ({
          ...prev,
          images: "Image uploads are still in progress. Please wait until uploads complete.",
        }));
      }
      return;
    }
    if (!validate()) return;
    const tags = tagInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const nextStatus = action === "draft" ? "draft" : form.status === "draft" ? "active" : form.status;

    const payload: AdminProduct = {
      ...form,
      tags,
      status: nextStatus,
    };

    await onSubmit(payload, action);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void submit("publish");
      }}
    >
      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">1. Basic Information</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Product Name</span>
            <input
              value={form.name}
              onChange={(event) => updateName(event.target.value)}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
            {errors.name ? <span className="text-xs text-[#9d3f2d]">{errors.name}</span> : null}
          </label>

          <label className="space-y-2 text-sm">
            <span>Product Code</span>
            <input
              value={form.code}
              onChange={(event) => setField("code", event.target.value)}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
            {errors.code ? <span className="text-xs text-[#9d3f2d]">{errors.code}</span> : null}
          </label>

          <label className="space-y-2 text-sm md:col-span-2">
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={(event) => setField("slug", toSlug(event.target.value))}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
            {errors.slug ? <span className="text-xs text-[#9d3f2d]">{errors.slug}</span> : null}
          </label>

          <label className="space-y-2 text-sm md:col-span-2">
            <span>Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">2. Pricing</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Price</span>
            <input
              type="number"
              value={form.price}
              onChange={(event) => setField("price", Number(event.target.value))}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
            {errors.price ? <span className="text-xs text-[#9d3f2d]">{errors.price}</span> : null}
          </label>
          <label className="space-y-2 text-sm">
            <span>Offer Price</span>
            <input
              type="number"
              value={form.offerPrice ?? 0}
              onChange={(event) => setField("offerPrice", Number(event.target.value))}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">3. Category and Tags</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Category</span>
            <select
              value={form.categoryId}
              onChange={(event) => updateCategory(event.target.value)}
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span>Tags</span>
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              placeholder="bridal, temple, lightweight"
              className="w-full rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">4. Product Images</p>
        <div className="mt-4">
          <ImageUploader
            images={form.images}
            onChange={(images) => {
              setField("images", images);
              setErrors((prev) => {
                if (!prev.images) return prev;
                const next = { ...prev };
                delete next.images;
                return next;
              });
            }}
            onUploadingChange={setIsUploadingImages}
            disabled={isSubmitting}
          />
          {isUploadingImages ? (
            <p className="mt-2 text-xs text-[var(--brand-muted)]">Uploading images to Cloudinary. Save will be enabled when uploads finish.</p>
          ) : null}
          {errors.images ? <p className="mt-2 text-xs text-[#9d3f2d]">{errors.images}</p> : null}
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">5. Product Status</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#e6d8bc] px-3 py-2">
            <input
              type="checkbox"
              checked={form.status === "active"}
              onChange={(event) => setField("status", event.target.checked ? "active" : "inactive")}
            />
            Active
          </label>
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#e6d8bc] px-3 py-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setField("isFeatured", event.target.checked)}
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#e6d8bc] px-3 py-2">
            <input
              type="checkbox"
              checked={form.isSoldOut}
              onChange={(event) => setField("isSoldOut", event.target.checked)}
            />
            Sold Out
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">6. SEO Preview</p>
        <div className="mt-4 grid gap-4">
          <input
            value={metaTitle}
            onChange={(event) => setMetaTitle(event.target.value)}
            placeholder="Meta title"
            className="rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
          />
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
            placeholder="Meta description"
            className="rounded-xl border border-[#e6d8bc] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
          />
          <div className="rounded-xl border border-[#ece1cd] bg-[#fffbf3] p-3 text-sm">
            <p className="font-semibold text-[var(--brand-gold-deep)]">alankritha.in/products/{form.slug || "product-slug"}</p>
            <p className="mt-1 font-medium text-[var(--brand-ink)]">{metaTitle || "Meta title preview"}</p>
            <p className="mt-1 text-[var(--brand-muted)]">{metaDescription || "Meta description preview"}</p>
          </div>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5 sm:p-6">
        <p className="font-heading text-2xl">7. WhatsApp Preview</p>
        <div className="mt-4 rounded-xl border border-[#e7d9bc] bg-[#f5fffa] p-3 text-sm text-[#1b5f42]">{whatsappPreview}</div>
      </section>

      <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 flex flex-wrap justify-stretch gap-2 rounded-xl border border-[#e8dcc3] bg-[#fffaf2]/95 p-3 backdrop-blur-sm sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isUploadingImages}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#e6d8bc] px-4 py-2 text-sm hover:bg-[#f8f0df] sm:flex-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            void submit("draft");
          }}
          disabled={isSubmitting || isUploadingImages}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dcc39d] px-4 py-2 text-sm font-semibold hover:bg-[#f8f0df] sm:flex-none"
        >
          {isUploadingImages ? "Uploading Images..." : "Save Draft"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImages}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)] sm:flex-none"
        >
          {isUploadingImages ? "Uploading Images..." : isSubmitting ? "Saving..." : mode === "create" ? "Publish" : "Update"}
        </button>
      </div>
    </form>
  );
}
