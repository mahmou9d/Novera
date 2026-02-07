"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "../api/cartApi";
import {
    AddToCartRequest,
    UpdateQuantityRequest,
} from "../type/type";

// Query Keys
export const cartKeys = {
    all: ["cart"] as const,
    items: () => [...cartKeys.all, "items"] as const,
};

export const useGetCartItems = () => {
    return useQuery({
        queryKey: cartKeys.items(),
        queryFn: cartAPI.getCartItems,
        staleTime: 1 * 60 * 1000,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddToCartRequest) => cartAPI.addToCart(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        },
        onError: (error) => {
            console.error("Add to cart failed:", error);
        },
    });
};

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateQuantityRequest) =>
            cartAPI.updateQuantity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        },
        onError: (error) => {
            console.error("Update quantity failed:", error);
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: number) => cartAPI.removeItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        },
        onError: (error) => {
            console.error("Remove from cart failed:", error);
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartAPI.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        },
        onError: (error) => {
            console.error("Clear cart failed:", error);
        },
    });
};

// export const useCheckout = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (payload) => cartAPI.checkout(payload),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: cartKeys.items() });
//             // toast.success("تم إتمام الطلب بنجاح");
//         },
//         onError: (error) => {
//             console.error("Checkout failed:", error);
//             // toast.error(error?.response?.data?.message || "فشل إتمام الطلب");
//         },
//     });
// };