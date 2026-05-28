export type MetalType = "gold" | "silver";

export type OccasionType = "bridal" | "festive" | "daily";

export type { ProductImage } from "@/types/shared";

export interface Product {
  id: string;
  slug: string;
  name: string;
  code: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  tags: string[];
  metalType: MetalType;
  occasion: OccasionType;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}
