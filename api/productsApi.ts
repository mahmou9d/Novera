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
      `/products/?page=${page}`,
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
      // التحقق من صحة الـ ID
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
  // getProductsCount: async (): Promise<number> => {
  //     const { data } = await apiClient.get<ProductsCountResponse>(
  //         "/dashboard/products/"
  //     );
  //     return data.total_products || 0;
  // },

  // addProduct: async (product: TProductInput): Promise<TProduct> => {
  //     const formData = new FormData();

  //     formData.append("name", product.name);
  //     formData.append("description", product.description);
  //     formData.append("original_price", product.original_price);
  //     formData.append("discount", String(product.discount));
  //     formData.append("stock", String(product.stock));

  //     product.categories.forEach((cat) => {
  //         formData.append("categories", cat);
  //     });

  //     product.tags.forEach((tag) => {
  //         formData.append("tags", tag);
  //     });

  //     product.img.forEach((imageFile) => {
  //         formData.append("img", imageFile);
  //     });

  //     const { data } = await apiClient.post<TProduct>(
  //         "/dashboard/products/add/",
  //         formData,
  //         {
  //             headers: {
  //                 "Content-Type": "multipart/form-data",
  //             },
  //         }
  //     );
  //     return data;
  // },

  // updateProduct: async (payload: {
  //     id: number;
  //     data: TProductInput;
  // }): Promise<TProduct> => {
  //     const { id, data: productData } = payload;
  //     const formData = new FormData();

  //     formData.append("name", productData.name);
  //     formData.append("description", productData.description);
  //     formData.append("original_price", productData.original_price);
  //     formData.append("discount", String(productData.discount));
  //     formData.append("stock", String(productData.stock));

  //     productData.categories.forEach((cat) => {
  //         formData.append("categories", cat);
  //     });

  //     productData.tags.forEach((tag) => {
  //         formData.append("tags", tag);
  //     });

  //     if (productData.img && productData.img.length > 0) {
  //         productData.img.forEach((imageFile) => {
  //             formData.append("img", imageFile);
  //         });
  //     }

  //     const { data } = await apiClient.put<TProduct>(
  //         `/dashboard/products/${id}/`,
  //         formData,
  //         {
  //             headers: {
  //                 "Content-Type": "multipart/form-data",
  //             },
  //         }
  //     );
  //     return data;
  // },

  // deleteProduct: async (id: number): Promise<void> => {
  //     await apiClient.delete(`/dashboard/products/${id}/`);
  // },
};
