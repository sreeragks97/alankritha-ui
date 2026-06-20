import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and URL-safe"),
  description: z.string().trim().nullable().optional(),
  banner_image_url: z.string().url().nullable().optional(),
  active: z.boolean().default(true),
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
