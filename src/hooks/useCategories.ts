"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { CategoryService } from "@/src/services/CategoryService";
import type { CategoryInput, CategoryUpdateInput } from "@/src/validators/CategorySchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getCategoryService() {
  return CategoryService.fromClient(getSupabaseBrowserClient());
}

export function useCategories(options?: { activeOnly?: boolean }) {
  return useQuery({
    queryKey: queryKeys.categories(options),
    queryFn: () => getCategoryService().getCategories(options),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryInput) => getCategoryService().createCategory(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryUpdateInput }) =>
      getCategoryService().updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getCategoryService().deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
