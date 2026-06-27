"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { SiteSettingsService } from "@/src/services/SiteSettingsService";
import type { SiteSettingsInput } from "@/src/validators/SiteSettingsSchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getSiteSettingsService() {
  return SiteSettingsService.fromClient(getSupabaseBrowserClient());
}

export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.siteSettings(),
    queryFn: () => getSiteSettingsService().getSettings(),
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SiteSettingsInput) => getSiteSettingsService().updateSettings(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings() });
    },
  });
}
