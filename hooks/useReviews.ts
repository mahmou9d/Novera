/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useReviews.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewAPI } from "../api/reviewApi";
import { AddReviewRequest } from "../type/type";
// import { toast } from "react-hot-toast";

// Query Keys
export const reviewKeys = {
    all: ["reviews"] as const,

    lists: () => [...reviewKeys.all, "list"] as const,

    list: (productId: number) =>
        [...reviewKeys.lists(), productId] as const,

    recent: () => [...reviewKeys.all, "recent"] as const,
};



export const useGetReviews = (productId?: number) => {
    return useQuery({
        queryKey: reviewKeys.list(productId as number),

        queryFn: ({ queryKey }) => {
            const productId = queryKey[2]; // ✅ الصح
            return reviewAPI.getReviews(productId);
        },

        enabled: !!productId, // ✅ مهم
        staleTime: 5 * 60 * 1000,
    });
};


export const useAddReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddReviewRequest) =>
            reviewAPI.addReview(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reviewKeys.lists(),
            });
        },

        onError: (error) => {
            console.error("Add review failed:", error);
        },
    });
};
