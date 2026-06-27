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

interface MapProductOptions {
  offerBadgeFallback?: string | null;
}

export function mapProductToUiProduct(product: ProductWithRelations, options?: MapProductOptions): UiProduct {
  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const imageUrls = sortedImages.map((item) => item.image_url);
  const categorySlug = product.category?.slug ?? "uncategorized";

  const price = Number(product.price);
  const offer = product.offer_price != null ? Number(product.offer_price) : null;
  const onOffer = offer != null && offer > 0 && offer < price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    code: product.code,
    category: categorySlug,
    price,
    offerPrice: onOffer ? offer : null,
    offerLabel: onOffer
      ? product.offer_label?.trim() || options?.offerBadgeFallback?.trim() || "Special Offer"
      : null,
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
