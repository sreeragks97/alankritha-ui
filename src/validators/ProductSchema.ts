import { z } from "zod";

export const productImageSchema = z.object({
  image_url: z
    .string()
    .url("Image URL must be valid")
    .refine((url) => url.startsWith("https://res.cloudinary.com/"), "Product images must use Cloudinary secure URLs"),
  sort_order: z.number().int().min(0).default(0),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and URL-safe"),
  code: z.string().trim().min(2, "Product code is required"),
  description: z.string().trim().nullable().optional(),
  category_id: z.string().uuid("Category is required"),
  price: z.number().min(0, "Price must be zero or more"),
  offer_price: z.number().min(0).nullable().optional(),
  offer_label: z.string().trim().nullable().optional(),
  featured: z.boolean().default(false),
  sold_out: z.boolean().default(false),
  active: z.boolean().default(true),
  images: z.array(productImageSchema).default([]),
});

export const productUpdateSchema = productSchema.partial();

export const productQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  active: z.boolean().optional(),
  activeOnly: z.boolean().default(false),
  featuredOnly: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
