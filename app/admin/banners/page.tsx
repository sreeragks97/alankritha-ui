"use client";

import { useMemo, useState } from "react";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { OptimizedImage } from "@/components/ui/image";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { EmptyState, GenericErrorState } from "@/components/ui/states";
import { useToast } from "@/hooks/useToast";
import { useBanners, useReorderBanners, useUpdateBanner } from "@/src/hooks/useBanners";
import { mapBannerToAdminBanner } from "@/src/utils/adminMappers";
import type { AdminBanner } from "@/types/admin";

export default function BannersPage() {
  const { toasts, showToast, removeToast } = useToast();
  const bannersQuery = useBanners();
  const updateBannerMutation = useUpdateBanner();
  const reorderBannersMutation = useReorderBanners();

  const [edits, setEdits] = useState<Record<string, Partial<AdminBanner>>>({});

  const banners = useMemo(() => {
    const source = (bannersQuery.data ?? [])
      .map(mapBannerToAdminBanner)
      .map((banner) => ({ ...banner, ...(edits[banner.id] ?? {}) }));

    return source.sort((a, b) => a.order - b.order);
  }, [bannersQuery.data, edits]);

  const loading = bannersQuery.isLoading && !bannersQuery.data;
  const hasLoadError = bannersQuery.isError;

  const persistBanner = async (id: string, patch: Partial<AdminBanner>) => {
    try {
      await updateBannerMutation.mutateAsync({
        id,
        payload: {
          title: patch.title,
          subtitle: patch.subtitle,
          button_text: patch.ctaText,
          image_url: patch.image,
          active: patch.isActive,
          sort_order: patch.order,
        },
      });

      setEdits((prev) => {
        const next = { ...prev };
        const current = { ...(next[id] ?? {}) };

        for (const key of Object.keys(patch) as Array<keyof AdminBanner>) {
          delete current[key];
        }

        if (Object.keys(current).length === 0) {
          delete next[id];
        } else {
          next[id] = current;
        }

        return next;
      });
    } catch (error) {
      showToast({
        title: "Unable to save banner",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
    }
  };

  const updateBanner = (id: string, patch: Partial<AdminBanner>) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        ...patch,
      },
    }));
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= banners.length) return;

    const next = [...banners];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    const reordered = next.map((banner, i) => ({ ...banner, order: i + 1 }));

    setEdits((prev) => {
      const nextEdits = { ...prev };

      for (const banner of reordered) {
        nextEdits[banner.id] = {
          ...(nextEdits[banner.id] ?? {}),
          order: banner.order,
        };
      }

      return nextEdits;
    });

    try {
      await reorderBannersMutation.mutateAsync(
        reordered.map((banner) => ({
          id: banner.id,
          sort_order: banner.order,
        })),
      );
    } catch (error) {
      showToast({
        title: "Unable to reorder banners",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
    }
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

  if (hasLoadError) {
    return <GenericErrorState onRetry={() => bannersQuery.refetch()} />;
  }

  if (banners.length === 0) {
    return (
      <EmptyState
        title="No banners available"
        description="Add active banners from backend data to showcase homepage campaigns."
      />
    );
  }

  return (
    <>
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
                  onBlur={() => void persistBanner(banner.id, { title: banner.title })}
                  className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Subtitle</span>
                <input
                  value={banner.subtitle}
                  onChange={(event) => updateBanner(banner.id, { subtitle: event.target.value })}
                  onBlur={() => void persistBanner(banner.id, { subtitle: banner.subtitle })}
                  className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>CTA Text</span>
                <input
                  value={banner.ctaText}
                  onChange={(event) => updateBanner(banner.id, { ctaText: event.target.value })}
                  onBlur={() => void persistBanner(banner.id, { ctaText: banner.ctaText })}
                  className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                />
              </label>
              <label className="inline-flex items-center gap-2 rounded-lg border border-[#e8dcc3] px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={banner.isActive}
                  onChange={(event) => {
                    const isActive = event.target.checked;
                    updateBanner(banner.id, { isActive });
                    void persistBanner(banner.id, { isActive });
                  }}
                />
                Active Banner
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]" onClick={() => void move(index, -1)}>
                  Move Up
                </button>
                <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]" onClick={() => void move(index, 1)}>
                  Move Down
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-xs hover:bg-[#f8f0df]"
                  onClick={() => {
                    showToast({
                      title: "Upload integration pending",
                      description: "Banner image upload wiring is queued in the next media integration step.",
                      tone: "info",
                    });
                  }}
                >
                  Upload Banner Image
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ToastNotification items={toasts} onDismiss={removeToast} />
    </>
  );
}
