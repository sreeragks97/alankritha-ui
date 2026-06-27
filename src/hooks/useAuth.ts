"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { AuthService } from "@/src/services/AuthService";
import type { LoginInput } from "@/src/validators/AuthSchema";
import type { EmailInput, PasswordInput, ProfileInput } from "@/src/validators/ProfileSchema";
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

export function useAccount() {
  return useQuery({
    queryKey: queryKeys.authAccount(),
    queryFn: () => getAuthService().getAccount(),
  });
}

function useInvalidateAccount() {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.authAccount() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.authProfile() });
  };
}

export function useUpdateProfile() {
  const invalidate = useInvalidateAccount();

  return useMutation({
    mutationFn: (payload: ProfileInput) => getAuthService().updateProfile(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateEmail() {
  const invalidate = useInvalidateAccount();

  return useMutation({
    mutationFn: (payload: EmailInput) => getAuthService().updateEmail(payload),
    onSuccess: invalidate,
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: PasswordInput) => getAuthService().updatePassword(payload),
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
