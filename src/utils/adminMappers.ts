import type { AdminBanner, AdminCategory, AdminProduct, ProductStatus } from "@/types/admin";
import type { Banner, Category, ProductWithRelations } from "@/src/types/database";
import type { ProductInput, ProductUpdateInput } from "@/src/validators/ProductSchema";

function toAdminStatus(active: boolean): ProductStatus {
  return active ? "active" : "inactive";
}

export function mapCategoryToAdminCategory(category: Category, productCount = 0): AdminCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    bannerImage: category.banner_image_url ?? "",
    productCount,
    status: category.active ? "active" : "inactive",
  };
}

const DEFAULT_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80";

export function mapBannerToAdminBanner(banner: Banner): AdminBanner {
  return {
    id: banner.id,
    title: banner.title ?? "",
    subtitle: banner.subtitle ?? "",
    ctaText: banner.button_text ?? "",
    image: banner.image_url ?? DEFAULT_BANNER_IMAGE,
    isActive: banner.active,
    order: banner.sort_order,
  };
}

export function mapProductToAdminProduct(product: ProductWithRelations): AdminProduct {
  const imageUrls = [...product.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.image_url);

  return {
    id: product.id,
    name: product.name,
    code: product.code,
    slug: product.slug,
    description: product.description ?? "",
    categoryId: product.category_id,
    categoryName: product.category?.name ?? "Uncategorized",
    price: Number(product.price),
    offerPrice: product.offer_price ?? undefined,
    tags: [],
    images: imageUrls,
    status: toAdminStatus(product.active),
    isFeatured: product.featured,
    isSoldOut: product.sold_out,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}

function normalizeOfferPrice(value: number | undefined): number | null {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return null;
  }

  return value;
}

function toActive(status: ProductStatus): boolean {
  return status === "active";
}

export function mapAdminProductToProductInput(product: AdminProduct): ProductInput {
  return {
    name: product.name.trim(),
    code: product.code.trim(),
    slug: product.slug.trim(),
    description: product.description.trim() || null,
    category_id: product.categoryId,
    price: Number(product.price),
    offer_price: normalizeOfferPrice(product.offerPrice),
    featured: product.isFeatured,
    sold_out: product.isSoldOut,
    active: toActive(product.status),
    images: product.images
      .filter((imageUrl) => imageUrl.trim().length > 0)
      .map((imageUrl, index) => ({
        image_url: imageUrl,
        sort_order: index,
      })),
  };
}

export function mapAdminProductToProductUpdateInput(product: AdminProduct): ProductUpdateInput {
  return mapAdminProductToProductInput(product);
}
