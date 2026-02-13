"use client";

import { apiClient } from "@/lib/apiClient";
import { Product, TProduct } from "@/type/type";
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
  getProducts: async (page: number = 1): Promise<ProductsData> => {
    const { data } = await apiClient.get<ProductsDataRes>(
      `/products/`,
      { params: { page } },
    );
    console.log("Products Response:", data);
    return {
      products: data.results || [],
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },
  getSingleProducts: async (id: number): Promise<Product> => {
    try {
      if (!id || id <= 0) {
        throw new Error("Invalid product ID");
      }

      const { data } = await apiClient.get<Product>(`/products/${id}/`);

      console.log("Single Product Response:", data);

      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};
