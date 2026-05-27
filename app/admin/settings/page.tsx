"use client";

import { useEffect, useState } from "react";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { useToast } from "@/hooks/useToast";
import { adminRepository } from "@/lib/admin/repository";
import type { AdminSettings } from "@/types/admin";

const fallback: AdminSettings = {
  storeName: "",
  supportEmail: "",
  whatsappNumber: "",
  instagram: "",
  facebook: "",
  metaTitle: "",
  metaDescription: "",
  homepageHeroTitle: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(fallback);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    void adminRepository.getSettings().then(setSettings);
  }, []);

  const setField = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        showToast({ title: "Settings updated", description: "Mock settings saved locally for this session." });
      }}
    >
      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Store Information</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Store Name</span>
            <input value={settings.storeName} onChange={(event) => setField("storeName", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Support Email</span>
            <input value={settings.supportEmail} onChange={(event) => setField("supportEmail", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">WhatsApp and Social Links</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span>WhatsApp Number</span>
            <input value={settings.whatsappNumber} onChange={(event) => setField("whatsappNumber", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Instagram</span>
            <input value={settings.instagram} onChange={(event) => setField("instagram", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Facebook</span>
            <input value={settings.facebook} onChange={(event) => setField("facebook", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">SEO Settings</p>
        <div className="mt-4 grid gap-4">
          <label className="space-y-1 text-sm">
            <span>Meta Title</span>
            <input value={settings.metaTitle} onChange={(event) => setField("metaTitle", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Meta Description</span>
            <textarea value={settings.metaDescription} onChange={(event) => setField("metaDescription", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" rows={3} />
          </label>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Homepage Settings</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Homepage Hero Title</span>
            <input value={settings.homepageHeroTitle} onChange={(event) => setField("homepageHeroTitle", event.target.value)} className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2" />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="rounded-xl bg-[var(--brand-gold)] px-5 py-3 text-sm font-semibold text-white">
          Save Settings
        </button>
      </div>

      <ToastNotification items={toasts} onDismiss={removeToast} />
    </form>
  );
}
