"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { LeadService } from "@/src/services/LeadService";
import type { LeadInput } from "@/src/validators/LeadSchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getLeadService() {
  return LeadService.fromClient(getSupabaseBrowserClient());
}

export function useLeads(options?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.leads(options),
    queryFn: () => getLeadService().getLeads(options),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeadInput) => getLeadService().createLead(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
