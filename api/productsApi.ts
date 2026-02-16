/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiClient } from "@/lib/apiClient";
import {
  AddImageVariants,
  AddVariants,
  CreateProduct,
  CreateProductResponse,
  Product,
  SubVariant,
  TProduct,
  Variant,
} from "@/type/type";
export interface ProductsData {
  products: TProduct[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface ProductsDataRes {
  results: TProduct[];
  count: number;
  next: string | null;
  previous: string | null;
}
export const productsAPI = {
  // api/productsApi.ts
  getProducts: async (params?: {
    page?: number;
    all?: boolean;
  }): Promise<ProductsData> => {
    const { data } = await apiClient.get<ProductsDataRes>(`/products/`, {
      params: {
        page: params?.page,
        all: params?.all,
      },
    });

    return {
      products: data.results || [],
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getSingleProducts: async (
    id: number,
    all: boolean = false,
  ): Promise<Product> => {
    try {
      if (!id || id <= 0) {
        throw new Error("Invalid product ID");
      }

      const { data } = await apiClient.get<Product>(`/products/${id}/`, {
        params: { ...(all && { all: true }) },
      });

      console.log("Single Product Response:", data);

      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  createProduct: async (
    payload: CreateProduct,
  ): Promise<CreateProductResponse> => {
    const { data } = await apiClient.post<CreateProductResponse>(
      "/dashboard/products/create/",
      payload,
    );
    return data;
  },
  addVariantsProduct: async (
    payload: AddVariants[],
    product_id: number,
  ): Promise<AddVariants[]> => {
    const { data } = await apiClient.post<AddVariants[]>(
      `/dashboard/products/${product_id}/variants/add/`,
      payload,
    );
    return data;
  },
  addImageVariantsProduct: async (
    payload: FormData,
    variant_id: number,
  ): Promise<AddImageVariants> => {
    const { data } = await apiClient.post<AddImageVariants>(
      `/dashboard/variants/${variant_id}/upload-image/`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },
  updateProduct: async (
    id: number,
    payload: {
      name?: string;
      category?: number;
      material_composition?: string;
      description?: string;
      is_active?: boolean;
    },
  ): Promise<any> => {
    const { data } = await apiClient.patch<any>(
      `/dashboard/products/${id}/manage/`,
      payload,
    );
    return data;
  },
  updateProductVariants: async (
    id: number,
    payload: Partial<SubVariant>,
  ): Promise<any> => {
    const { data } = await apiClient.patch<any>(
      `/dashboard/variants/${id}/manage/`,
      payload,
    );
    return data;
  },
  deleteProduct: async (id: number, hard: boolean = false): Promise<any> => {
    const url = hard
      ? `/dashboard/products/${id}/manage/?hard=true`
      : `/dashboard/products/${id}/manage/`;
    const { data } = await apiClient.delete<any>(url);
    return data;
  },

  deleteProductVariants: async (
    id: number,
    hard: boolean = false,
  ): Promise<any> => {
    const url = hard
      ? `/dashboard/variants/${id}/manage/?hard=true`
      : `/dashboard/variants/${id}/manage/`;
    const { data } = await apiClient.delete<any>(url);
    return data;
  },
};
