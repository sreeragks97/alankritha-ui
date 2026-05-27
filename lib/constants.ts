export const BRAND = {
  name: "Alankritha",
  tagline: "Luxury Jewellery Catalogue",
  whatsappNumber: "919876543210",
  instagramHandle: "@alankritha.jewels",
};

export const PRICE_RANGES = [
  { label: "Under Rs.250", min: 0, max: 250 },
  { label: "Rs.250 - Rs.500", min: 250, max: 500 },
  { label: "Rs.500 - Rs.1000", min: 500, max: 1000 },
  { label: "Above Rs.1000", min: 1000, max: 100000 },
];

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

export const PAGE_SIZE = 8;
