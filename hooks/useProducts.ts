/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { productsAPI, ProductsData } from "../api/productsApi";
import { AddVariants, CreateProduct, Product, SubVariant, Variant } from "../type/type";
// import { toast } from "react-hot-toast";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,
  list: (page?: number, all?: boolean) =>
    [...productKeys.lists(), { page, all }] as const,

  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number, all?: boolean) =>
    [...productKeys.details(), id, ...(all ? [{ all: true }] : [])] as const,

  variant: (id: number) => [...productKeys.all, "variant", id] as const,

  count: () => [...productKeys.all, "count"] as const,
};

export const useGetProducts = (params?: {
  page?: number;
  all?: boolean;
}): UseQueryResult<ProductsData, Error> => {
  return useQuery({
    queryKey: productKeys.list(params?.page, params?.all),
    queryFn: () => productsAPI.getProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetSingleProduct = (
  productId: number,
  all: boolean = false,
): UseQueryResult<Product, Error> => {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(productId, all),
    queryFn: () => productsAPI.getSingleProducts(productId, all),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId && productId > 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProduct) => productsAPI.createProduct(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });

      console.log("Product created:", data);
    },

    onError: (error: any) => {
      console.error("Create product failed:", error);
    },
  });
};

export const useAddVariantsProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      product_id,
    }: {
      payload: AddVariants[];
      product_id: number;
    }) => productsAPI.addVariantsProduct(payload, product_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.product_id),
      });

      console.log("Variants added successfully");
    },

    onError: (error: any) => {
      console.error("Add variants failed:", error);
    },
  });
};

export const useAddImageVariantsProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      variant_id,
    }: {
      payload: FormData;
      variant_id: number;
    }) => productsAPI.addImageVariantsProduct(payload, variant_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variant(variables.variant_id),
      });

      console.log("Variant image uploaded successfully");
    },

    onError: (error: any) => {
      console.error("Upload image failed:", error);
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      product_id,
      payload,
    }: {
      product_id: number;
      payload: {
        name?: string;
        category?: number;
        material_composition?: string;
        description?: string;
        is_active?: boolean;
      };
    }) => productsAPI.updateProduct(product_id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.product_id),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error) => {
      console.error("Update product failed:", error);
    },
  });
};

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variant_id,
      payload,
    }: {
      variant_id: number;
      payload: Partial<SubVariant>;
    }) => productsAPI.updateProductVariants(variant_id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variant(variables.variant_id),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error) => {
      console.error("Update variant failed:", error);
    },
  });
};

// في ملف hooks
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      product_id,
      hard = false,
    }: {
      product_id: number;
      hard?: boolean;
    }) => productsAPI.deleteProduct(product_id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error) => {
      console.error("Delete product failed:", error);
    },
  });
};

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variant_id,
      hard = false,
    }: {
      variant_id: number;
      hard?: boolean;
    }) => productsAPI.deleteProductVariants(variant_id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error) => {
      console.error("Delete variant failed:", error);
    },
  });
};
