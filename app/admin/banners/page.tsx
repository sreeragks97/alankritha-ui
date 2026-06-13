"use client";

import { useEffect, useState } from "react";
import { OptimizedImage } from "@/components/ui/image";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { adminRepository } from "@/lib/admin/repository";
import type { AdminBanner } from "@/types/admin";

export default function BannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void adminRepository
      .getBanners()
      .then((items) => setBanners(items.sort((a, b) => a.order - b.order)))
      .finally(() => setLoading(false));
  }, []);

  const updateBanner = (id: string, patch: Partial<AdminBanner>) => {
    setBanners((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setBanners(next.map((banner, i) => ({ ...banner, order: i + 1 })));
  };

  if (loading) {
    return (
      <PageLoader label="Loading banners">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Shimmer key={index} className="card-luxury h-96 rounded-2xl" />
          ))}
        </div>
      </PageLoader>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {banners.map((banner, index) => (
        <article key={banner.id} className="card-luxury rounded-2xl p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">Banner {index + 1}</p>
          <div className="relative aspect-[16/6] overflow-hidden rounded-xl bg-[#efe3cb]">
            <OptimizedImage
              src={banner.image}
              alt={banner.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              fallbackLabel={`${banner.title} banner unavailable`}
            />
          </div>
          <div className="mt-4 grid gap-3">
            <label className="space-y-1 text-sm">
              <span>Title</span>
              <input
                value={banner.title}
                onChange={(event) => updateBanner(banner.id, { title: event.target.value })}
                className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Subtitle</span>
              <input
                value={banner.subtitle}
                onChange={(event) => updateBanner(banner.id, { subtitle: event.target.value })}
                className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>CTA Text</span>
              <input
                value={banner.ctaText}
                onChange={(event) => updateBanner(banner.id, { ctaText: event.target.value })}
                className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
              />
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-[#e8dcc3] px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(event) => updateBanner(banner.id, { isActive: event.target.checked })}
              />
              Active Banner
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]" onClick={() => move(index, -1)}>
                Move Up
              </button>
              <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]" onClick={() => move(index, 1)}>
                Move Down
              </button>
              <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]">
                Upload Banner Image
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
