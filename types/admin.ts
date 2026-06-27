export type ProductStatus = "active" | "inactive" | "draft";
export type LeadStatus = "new" | "contacted" | "quoted" | "closed";

export type { AdminUser, ProductImage } from "@/types/shared";

export interface AdminProduct {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  offerPrice?: number;
  offerLabel?: string;
  tags: string[];
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isSoldOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  productCount: number;
  status: "active" | "inactive";
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  isActive: boolean;
  order: number;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  width: number;
  height: number;
  sizeKb: number;
  type: "image";
  uploadedAt: string;
  publicId?: string;
}

export interface WhatsAppLead {
  id: string;
  customerName: string;
  productName: string;
  productCode: string;
  inquiryDate: string;
  status: LeadStatus;
}

export interface AdminSettings {
  storeName: string;
  supportEmail: string;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  metaTitle: string;
  metaDescription: string;
  homepageHeroTitle: string;
}

export interface ProductQuery {
  search: string;
  category: string;
  status: "all" | ProductStatus;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
}
