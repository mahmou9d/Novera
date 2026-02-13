/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {  useQuery, UseQueryResult } from "@tanstack/react-query";
import { productsAPI, ProductsData } from "../api/productsApi";
import { Product } from "../type/type";
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
