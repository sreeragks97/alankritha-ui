import type { Banner as UiBanner, Category as UiCategory, Product as UiProduct } from "@/types/product";
import type { Banner, Category, ProductWithRelations } from "@/src/types/database";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80";

export function mapCategoryToUiCategory(category: Category): UiCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "Explore curated jewellery designs.",
    image: category.banner_image_url ?? DEFAULT_IMAGE,
  };
}

export function mapBannerToUiBanner(banner: Banner): UiBanner {
  return {
    id: banner.id,
    title: banner.title ?? "Signature Collection",
    subtitle: banner.subtitle ?? "Discover handcrafted jewellery stories.",
    image: banner.image_url ?? DEFAULT_IMAGE,
    ctaText: banner.button_text ?? "View Collection",
    ctaHref: banner.button_link ?? "/category/necklaces",
  };
}

export function mapProductToUiProduct(product: ProductWithRelations): UiProduct {
  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const imageUrls = sortedImages.map((item) => item.image_url);
  const categorySlug = product.category?.slug ?? "uncategorized";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    code: product.code,
    category: categorySlug,
    price: Number(product.offer_price ?? product.price),
    images: imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE],
    description: product.description ?? "No description available.",
    tags: [],
    metalType: "gold",
    occasion: "bridal",
    isFeatured: product.featured,
    isNew: false,
    createdAt: product.created_at,
  };
}
