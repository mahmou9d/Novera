/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiClient } from "@/lib/axios";
import { TProduct, WishlistResponse } from "../type/type";

export const wishlistAPI = {
    getWishlist: async (): Promise<TProduct[]> => {
        const { data } = await apiClient.get<WishlistResponse>("/wishlist/");
        return data.products || []; 
    },

    toggleWishlist: async (product_id: number): Promise<any> => {
        const { data } = await apiClient.post("/wishlist/toggle/", { product_id });
        return data;
    },
};