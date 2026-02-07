/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { productsAPI, ProductsData } from "../api/productsApi";
import { Product, TProduct, TProductInput, Variant } from "../type/type";
// import { toast } from "react-hot-toast";

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (filters?: string) => [...productKeys.lists(), filters] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
    count: () => [...productKeys.all, "count"] as const,
};

export const useGetProducts = (
  page: number = 1,
): UseQueryResult<ProductsData, Error> => {
  return useQuery<ProductsData, Error>({
    queryKey: ["products", page],
    queryFn: () => productsAPI.getProducts(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (كانت cacheTime)
  });
};

export const useGetSingleProduct = (
  productId: number,
): UseQueryResult<Product, Error> => {
  return useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => productsAPI.getSingleProducts(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId && productId > 0, // 👈 لا تنفذ إذا productId غير صحيح
  });
};
// export const useGetProductsCount = () => {
//     return useQuery({
//         queryKey: productKeys.count(),
//         queryFn: productsAPI.getProductsCount,
//         staleTime: 5 * 60 * 1000,
//     });
// };

// export const useAddProduct = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (product: TProductInput) => productsAPI.addProduct(product),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: productKeys.lists() });
//             queryClient.invalidateQueries({ queryKey: productKeys.count() });

//             // toast.success("تم إضافة المنتج بنجاح");
//         },
//         onError: (error: any) => {
//             console.error("Add product failed:", error);
//             // const message =
//             //     error?.response?.data?.message ||
//             //     error?.response?.data?.error ||
//             //     "فشل إضافة المنتج";
//             // toast.error(message);
//         },
//     });
// };

// export const useUpdateProduct = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (payload: { id: number; data: TProductInput }) =>
//             productsAPI.updateProduct(payload),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({ queryKey: productKeys.lists() });
//             queryClient.invalidateQueries({
//                 queryKey: productKeys.detail(variables.id),
//             });

//             // toast.success("تم تحديث المنتج بنجاح");
//         },
//         onError: (error: any) => {
//             console.error("Update product failed:", error);
//             // const message =
//             //     error?.response?.data?.message ||
//             //     error?.response?.data?.error ||
//             //     "فشل تحديث المنتج";
//             // toast.error(message);
//         },
//     });
// };

// export const useDeleteProduct = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id: number) => productsAPI.deleteProduct(id),
//         onSuccess: (_, id) => {
//             queryClient.invalidateQueries({ queryKey: productKeys.lists() });
//             queryClient.invalidateQueries({ queryKey: productKeys.count() });
//             queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });

//             // toast.success("تم حذف المنتج بنجاح");
//         },
//         onError: (error: any) => {
//             console.error("Delete product failed:", error);
//             // const message =
//             //     error?.response?.data?.message ||
//             //     error?.response?.data?.error ||
//             //     "فشل حذف المنتج";
//             // toast.error(message);
//         },
//     });
// };