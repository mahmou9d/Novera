/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardAPI } from "../api/dashboardApi";
import { AddVariants, CreateProduct, OrderStatus } from "../type/type";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  orders: () => [...dashboardKeys.all, "orders"] as const,
  recentOrders: (page?: number) =>
    [...dashboardKeys.orders(), "recent", page] as const,
  ordersCount: () => [...dashboardKeys.orders(), "count"] as const,

  statusCount: () => [...dashboardKeys.all, "stats", "count"] as const,
  reviewsCount: () => [...dashboardKeys.all, "reviews", "count"] as const,

  users: () => [...dashboardKeys.all, "users"] as const,
  usersCount: () => [...dashboardKeys.users(), "count"] as const,
  admins: () => [...dashboardKeys.users(), "admins"] as const,

  sales: () => [...dashboardKeys.all, "sales"] as const,
  totalSales: () => [...dashboardKeys.sales(), "total"] as const,
  salesOrders: () => [...dashboardKeys.sales(), "orders"] as const,

  products: () => [...dashboardKeys.all, "products"] as const,
  product: (id: number) => [...dashboardKeys.products(), id] as const,

  productVariants: (productId: number) =>
    [...dashboardKeys.product(productId), "variants"] as const,

  productVariant: (variantId: number) =>
    [...dashboardKeys.products(), "variant", variantId] as const,

  topSelling: () => [...dashboardKeys.products(), "top-selling"] as const,

  productLow: () => [...dashboardKeys.products(), "low-stock"] as const,
};

export const useGetRecentOrders = (page: number = 1) => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(page),
    queryFn: () => dashboardAPI.getRecentOrders(page),
    staleTime: 60 * 1000,
  });
};

export const useGetStatusCount = () => {
  return useQuery({
    queryKey: dashboardKeys.statusCount(),
    queryFn: dashboardAPI.getStatusCount,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetReviewsCount = () => {
  return useQuery({
    queryKey: dashboardKeys.reviewsCount(),
    queryFn: dashboardAPI.getReviewsCount,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTopSelling = () => {
  return useQuery({
    queryKey: dashboardKeys.topSelling(),
    queryFn: dashboardAPI.getTopSelling,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetProductLow = () => {
  return useQuery({
    queryKey: dashboardKeys.productLow(),
    queryFn: dashboardAPI.getProductLow,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetSalesOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.salesOrders(),
    queryFn: dashboardAPI.getSalesOrders,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatchOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: OrderStatus }) =>
      dashboardAPI.patchOrders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.ordersCount() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.statusCount() });
    },
    onError: (error: any) => {
      console.error("Patch order failed:", error);
    },
  });
};

export const useMakeAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => dashboardAPI.makeAdmin(email),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admins() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.users() });
      console.log("Success:", data.message);
    },
    onError: (error: any) => {
      console.error("Make admin failed:", error);
    },
  });
};
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProduct) => dashboardAPI.createProduct(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.products(),
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
    }) => dashboardAPI.addVariantsProduct(payload, product_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.product(variables.product_id),
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
    }) => dashboardAPI.addImageVariantsProduct(payload, variant_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.productVariant(variables.variant_id),
      });

      console.log("Variant image uploaded successfully");
    },

    onError: (error: any) => {
      console.error("Upload image failed:", error);
    },
  });
};
