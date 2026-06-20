"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { ProductService, type ProductListOptions } from "@/src/services/ProductService";
import type { ProductInput, ProductUpdateInput } from "@/src/validators/ProductSchema";
import { queryKeys } from "@/src/hooks/queryKeys";

function getProductService() {
  return ProductService.fromClient(getSupabaseBrowserClient());
}

export function useProducts(options?: ProductListOptions) {
  return useQuery({
    queryKey: queryKeys.products(options),
    queryFn: () => getProductService().getProducts(options),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => getProductService().getProductBySlug(slug),
    enabled: slug.trim().length > 0,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: queryKeys.productById(id),
    queryFn: () => getProductService().getProductById(id),
    enabled: id.trim().length > 0,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductInput) => getProductService().createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductUpdateInput }) =>
      getProductService().updateProduct(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.productById(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getProductService().deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
