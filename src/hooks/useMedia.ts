"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaAsset } from "@/types/admin";
import { queryKeys } from "@/src/hooks/queryKeys";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { MediaService } from "@/src/services/MediaService";

function getMediaService() {
  return MediaService.fromClient(getSupabaseBrowserClient());
}

export function useMediaAssets() {
  return useQuery({
    queryKey: queryKeys.mediaAssets(),
    queryFn: () => getMediaService().getMediaAssets(),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percentage: number) => void }) =>
      getMediaService().uploadImage(file, onProgress),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mediaAssets() });
    },
  });
}

export function mergeMediaAssets(primary: MediaAsset[], secondary: MediaAsset[]): MediaAsset[] {
  const byUrl = new Map<string, MediaAsset>();

  for (const item of [...primary, ...secondary]) {
    const existing = byUrl.get(item.url);
    if (!existing || new Date(item.uploadedAt).getTime() > new Date(existing.uploadedAt).getTime()) {
      byUrl.set(item.url, item);
    }
  }

  return Array.from(byUrl.values()).sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
}
