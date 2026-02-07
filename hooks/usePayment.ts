/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { paymentAPI } from "../api/paymentApi";
// import { toast } from "react-hot-toast";

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: (order_id: number) => paymentAPI.createCheckoutSession(order_id),
        onSuccess: (data) => {
            console.log("Checkout session created:", data);
            // toast.success("جاري تحويلك لصفحة الدفع...");

            // إعادة التوجيه لصفحة الدفع (Stripe/PayPal/etc)
            // if (data.checkout_url) {
            //     window.location.href = data.checkout_url;
            // }
        },
        onError: (error: any) => {
            console.error("Create checkout session failed:", error);
            // const message =
            //     error?.response?.data?.message ||
            //     error?.response?.data?.error ||
            //     "فشل إنشاء جلسة الدفع";
            // toast.error(message);
        },
    });
};