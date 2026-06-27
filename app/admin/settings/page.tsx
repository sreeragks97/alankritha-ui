"use client";

import { useState } from "react";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { useToast } from "@/hooks/useToast";
import { useSiteSettings, useUpdateSiteSettings } from "@/src/hooks/useSiteSettings";
import type { SiteSettings } from "@/src/types/database";

interface FormState {
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  email: string;
  about_eyebrow: string;
  about_heading: string;
  about_body: string;
  contact_eyebrow: string;
  contact_heading: string;
  contact_body: string;
  contact_phone: string;
  contact_address: string;
  catalogue_heading: string;
  catalogue_subheading: string;
  offer_badge_label: string;
  footer_description: string;
  footer_tagline: string;
  filter_search_enabled: boolean;
  filter_sort_enabled: boolean;
  filter_category_enabled: boolean;
  filter_price_enabled: boolean;
  filter_metal_enabled: boolean;
  filter_occasion_enabled: boolean;
  filter_tag_enabled: boolean;
}

const FILTER_TOGGLES: Array<{ key: keyof FormState; label: string }> = [
  { key: "filter_search_enabled", label: "Search" },
  { key: "filter_sort_enabled", label: "Sort" },
  { key: "filter_category_enabled", label: "Category" },
  { key: "filter_price_enabled", label: "Price range" },
  { key: "filter_metal_enabled", label: "Metal" },
  { key: "filter_occasion_enabled", label: "Occasion" },
  { key: "filter_tag_enabled", label: "Tag" },
];

const inputClass =
  "min-h-11 w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]";
const textareaClass = "w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]";

function toForm(settings: SiteSettings): FormState {
  return {
    whatsapp_number: settings.whatsapp_number ?? "",
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    email: settings.email ?? "",
    about_eyebrow: settings.about_eyebrow ?? "",
    about_heading: settings.about_heading ?? "",
    about_body: settings.about_body ?? "",
    contact_eyebrow: settings.contact_eyebrow ?? "",
    contact_heading: settings.contact_heading ?? "",
    contact_body: settings.contact_body ?? "",
    contact_phone: settings.contact_phone ?? "",
    contact_address: settings.contact_address ?? "",
    catalogue_heading: settings.catalogue_heading ?? "",
    catalogue_subheading: settings.catalogue_subheading ?? "",
    offer_badge_label: settings.offer_badge_label ?? "",
    footer_description: settings.footer_description ?? "",
    footer_tagline: settings.footer_tagline ?? "",
    filter_search_enabled: settings.filter_search_enabled,
    filter_sort_enabled: settings.filter_sort_enabled,
    filter_category_enabled: settings.filter_category_enabled,
    filter_price_enabled: settings.filter_price_enabled,
    filter_metal_enabled: settings.filter_metal_enabled,
    filter_occasion_enabled: settings.filter_occasion_enabled,
    filter_tag_enabled: settings.filter_tag_enabled,
  };
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const updateSettings = useUpdateSiteSettings();
  const { toasts, showToast, removeToast } = useToast();
  const [form, setForm] = useState<FormState>(() => toForm(initial));

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        updateSettings.mutate(form, {
          onSuccess: () => showToast({ title: "Settings saved", description: "Your changes are now live." }),
          onError: (error) =>
            showToast({
              title: "Could not save settings",
              description: error instanceof Error ? error.message : "Please try again.",
            }),
        });
      }}
    >
      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Contact &amp; Social</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">Shown on the About and Contact pages.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>WhatsApp Number</span>
            <input value={form.whatsapp_number} onChange={(e) => setField("whatsapp_number", e.target.value)} className={inputClass} placeholder="919876543210" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Facebook URL</span>
            <input value={form.facebook_url} onChange={(e) => setField("facebook_url", e.target.value)} className={inputClass} placeholder="https://facebook.com/..." />
          </label>
          <label className="space-y-1 text-sm">
            <span>Instagram URL</span>
            <input value={form.instagram_url} onChange={(e) => setField("instagram_url", e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
          </label>
          <label className="space-y-1 text-sm">
            <span>Contact Phone</span>
            <input type="tel" value={form.contact_phone} onChange={(e) => setField("contact_phone", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Contact Address</span>
            <input value={form.contact_address} onChange={(e) => setField("contact_address", e.target.value)} className={inputClass} />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">About Page</p>
        <div className="mt-4 grid gap-4">
          <label className="space-y-1 text-sm">
            <span>Eyebrow</span>
            <input value={form.about_eyebrow} onChange={(e) => setField("about_eyebrow", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Heading</span>
            <input value={form.about_heading} onChange={(e) => setField("about_heading", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Body</span>
            <textarea value={form.about_body} onChange={(e) => setField("about_body", e.target.value)} className={textareaClass} rows={5} />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Contact Page</p>
        <div className="mt-4 grid gap-4">
          <label className="space-y-1 text-sm">
            <span>Eyebrow</span>
            <input value={form.contact_eyebrow} onChange={(e) => setField("contact_eyebrow", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Heading</span>
            <input value={form.contact_heading} onChange={(e) => setField("contact_heading", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Body</span>
            <textarea value={form.contact_body} onChange={(e) => setField("contact_body", e.target.value)} className={textareaClass} rows={4} />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Footer</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">
          Social links shown in the footer come from the Contact &amp; Social section above.
        </p>
        <div className="mt-4 grid gap-4">
          <label className="space-y-1 text-sm">
            <span>Description</span>
            <textarea value={form.footer_description} onChange={(e) => setField("footer_description", e.target.value)} className={textareaClass} rows={3} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Tagline</span>
            <input value={form.footer_tagline} onChange={(e) => setField("footer_tagline", e.target.value)} className={inputClass} />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Catalogue</p>
        <div className="mt-4 grid gap-4">
          <label className="space-y-1 text-sm">
            <span>Heading</span>
            <input value={form.catalogue_heading} onChange={(e) => setField("catalogue_heading", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Subheading</span>
            <input value={form.catalogue_subheading} onChange={(e) => setField("catalogue_subheading", e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Default Offer Badge Label</span>
            <input value={form.offer_badge_label} onChange={(e) => setField("offer_badge_label", e.target.value)} className={inputClass} placeholder="Special Offer" />
            <span className="block text-xs text-[var(--brand-muted)]">Used on discounted products that don&apos;t set their own offer label.</span>
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Catalogue Filters</p>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">Show or hide each filter control on the catalogue pages.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FILTER_TOGGLES.map((toggle) => (
            <label key={toggle.key} className="flex items-center gap-3 rounded-lg border border-[#e8dcc3] px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form[toggle.key])}
                onChange={(e) => setField(toggle.key, e.target.checked)}
                className="h-4 w-4 accent-[var(--brand-gold)]"
              />
              <span>{toggle.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateSettings.isPending}
          className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)] disabled:opacity-60"
        >
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <ToastNotification items={toasts} onDismiss={removeToast} />
    </form>
  );
}

export default function SettingsPage() {
  const settingsQuery = useSiteSettings();

  if (settingsQuery.isLoading || !settingsQuery.data) {
    return (
      <PageLoader label="Loading settings">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Shimmer key={index} className="card-luxury h-52 rounded-2xl" />
          ))}
        </div>
      </PageLoader>
    );
  }

  return <SettingsForm key={settingsQuery.data.updated_at} initial={settingsQuery.data} />;
}
