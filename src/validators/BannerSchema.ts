import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().nullable().optional(),
  subtitle: z.string().trim().nullable().optional(),
  image_url: z.string().url("Banner image URL must be valid").nullable().optional(),
  button_text: z.string().trim().nullable().optional(),
  button_link: z.string().trim().nullable().optional(),
  active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export const bannerUpdateSchema = bannerSchema.partial();

export type BannerInput = z.infer<typeof bannerSchema>;
export type BannerUpdateInput = z.infer<typeof bannerUpdateSchema>;
