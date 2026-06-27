export const queryKeys = {
  products: (params?: unknown) => ["products", params ?? {}] as const,
  product: (slug: string) => ["product", slug] as const,
  productById: (id: string) => ["product-by-id", id] as const,
  categories: (params?: unknown) => ["categories", params ?? {}] as const,
  banners: (params?: unknown) => ["banners", params ?? {}] as const,
  leads: (params?: unknown) => ["leads", params ?? {}] as const,
  mediaAssets: () => ["media-assets"] as const,
  authProfile: () => ["auth-profile"] as const,
  siteSettings: () => ["site-settings"] as const,
};
