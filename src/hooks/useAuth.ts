"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { AuthService } from "@/src/services/AuthService";
import type { LoginInput } from "@/src/validators/AuthSchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getAuthService() {
  return AuthService.fromClient(getSupabaseBrowserClient());
}

export function useAuthProfile() {
  return useQuery({
    queryKey: queryKeys.authProfile(),
    queryFn: () => getAuthService().getProfile(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginInput) => getAuthService().login(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.authProfile() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getAuthService().logout(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.authProfile() });
    },
  });
}
