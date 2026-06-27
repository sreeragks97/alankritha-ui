import type { SupabaseClient } from "@supabase/supabase-js";
import { BRAND } from "@/lib/constants";
import { SiteSettingsRepository } from "@/src/repositories/SiteSettingsRepository";
import type { Database, SiteSettings } from "@/src/types/database";
import { siteSettingsSchema, type SiteSettingsInput } from "@/src/validators/SiteSettingsSchema";

/**
 * Fallback content used when the settings row is missing or a field is blank,
 * so public pages always render meaningful copy. Mirrors the original
 * hard-coded text from the About / Contact / Catalogue pages.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp_number: BRAND.whatsappNumber,
  facebook_url: null,
  instagram_url: null,
  email: null,
  about_eyebrow: "About Alankritha",
  about_heading: "Jewellery Crafted For Timeless Moments",
  about_body:
    "Alankritha curates premium jewellery inspired by Kerala heritage and modern silhouettes. Every catalogue piece is selected for craft, comfort, and ceremonial elegance. This Phase 1 experience is built to help you discover designs and enquire directly via WhatsApp.",
  contact_eyebrow: "Connect",
  contact_heading: "Contact & Enquiry",
  contact_body:
    "Share the product code and your requirement on WhatsApp. Our team will respond with availability and styling guidance.",
  contact_phone: null,
  contact_address: null,
  catalogue_heading: "Jewellery Catalogue",
  catalogue_subheading: "Browse our collection with filters by category, metal, occasion, and price.",
  offer_badge_label: "Special Offer",
  filter_search_enabled: true,
  filter_sort_enabled: true,
  filter_category_enabled: true,
  filter_price_enabled: true,
  filter_metal_enabled: true,
  filter_occasion_enabled: true,
  filter_tag_enabled: true,
  updated_at: new Date(0).toISOString(),
};

/**
 * Returns a settings object where any null/blank field falls back to the
 * default, so consumers never have to handle missing copy.
 */
function withDefaults(settings: SiteSettings | null): SiteSettings {
  if (!settings) {
    return DEFAULT_SITE_SETTINGS;
  }

  const merged = { ...DEFAULT_SITE_SETTINGS };
  for (const key of Object.keys(DEFAULT_SITE_SETTINGS) as Array<keyof SiteSettings>) {
    const value = settings[key];
    if (value !== null && value !== undefined && value !== "") {
      // @ts-expect-error index assignment across a heterogeneous row type
      merged[key] = value;
    }
  }

  return merged;
}

export class SiteSettingsService {
  private readonly repository: SiteSettingsRepository;

  constructor(repository: SiteSettingsRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new SiteSettingsService(new SiteSettingsRepository(client));
  }

  async getSettings(): Promise<SiteSettings> {
    const settings = await this.repository.getSettings();
    return withDefaults(settings);
  }

  async updateSettings(input: SiteSettingsInput): Promise<SiteSettings> {
    const parsed = siteSettingsSchema.parse(input);
    return this.repository.upsertSettings(parsed);
  }
}
