"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { BannerService } from "@/src/services/BannerService";
import type { BannerInput, BannerUpdateInput } from "@/src/validators/BannerSchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getBannerService() {
  return BannerService.fromClient(getSupabaseBrowserClient());
}

export function useBanners(options?: { activeOnly?: boolean }) {
  return useQuery({
    queryKey: queryKeys.banners(options),
    queryFn: () => (options?.activeOnly ? getBannerService().getActiveBanners() : getBannerService().getBanners()),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BannerInput) => getBannerService().createBanner(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BannerUpdateInput }) =>
      getBannerService().updateBanner(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getBannerService().deleteBanner(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: Array<{ id: string; sort_order: number }>) => getBannerService().reorderBanners(order),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}
