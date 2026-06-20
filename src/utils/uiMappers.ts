import type { Banner as UiBanner, Category as UiCategory, Product as UiProduct } from "@/types/product";
import type { Banner, Category, ProductWithRelations } from "@/src/types/database";

export function mapCategoryToUiCategory(category: Category): UiCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "Explore curated jewellery designs.",
    image: category.banner_image_url ?? "",
  };
}

export function mapBannerToUiBanner(banner: Banner): UiBanner {
  return {
    id: banner.id,
    title: banner.title ?? "Signature Collection",
    subtitle: banner.subtitle ?? "Discover handcrafted jewellery stories.",
    image: banner.image_url ?? "",
    ctaText: banner.button_text ?? "View Collection",
    ctaHref: banner.button_link ?? "/category/necklaces",
  };
}

export function mapProductToUiProduct(product: ProductWithRelations): UiProduct {
  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const imageUrls = sortedImages.map((item) => item.image_url);
  const categorySlug = product.category?.slug ?? "uncategorized";

  console.info("[ProductImageDebug] Mapped product images for UI", {
    productId: product.id,
    imageCount: imageUrls.length,
    imageUrls,
  });

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    code: product.code,
    category: categorySlug,
    price: Number(product.offer_price ?? product.price),
    images: imageUrls,
    description: product.description ?? "No description available.",
    tags: [],
    metalType: "gold",
    occasion: "bridal",
    isFeatured: product.featured,
    isNew: false,
    createdAt: product.created_at,
  };
}
