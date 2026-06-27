import { z } from "zod";

const optionalText = z.string().trim().nullable().optional();

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .nullable()
  .optional();

export const siteSettingsSchema = z.object({
  whatsapp_number: optionalText,
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  email: optionalText,
  about_eyebrow: optionalText,
  about_heading: optionalText,
  about_body: optionalText,
  contact_eyebrow: optionalText,
  contact_heading: optionalText,
  contact_body: optionalText,
  contact_phone: optionalText,
  contact_address: optionalText,
  catalogue_heading: optionalText,
  catalogue_subheading: optionalText,
  offer_badge_label: optionalText,
  footer_description: optionalText,
  footer_tagline: optionalText,
  filter_search_enabled: z.boolean().optional(),
  filter_sort_enabled: z.boolean().optional(),
  filter_category_enabled: z.boolean().optional(),
  filter_price_enabled: z.boolean().optional(),
  filter_metal_enabled: z.boolean().optional(),
  filter_occasion_enabled: z.boolean().optional(),
  filter_tag_enabled: z.boolean().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
