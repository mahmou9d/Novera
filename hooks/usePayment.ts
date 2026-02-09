/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { paymentAPI, PayPalCapture } from "../api/paymentApi";
import { CheckoutFormData } from "@/components/Checkoutform";
// import { toast } from "react-hot-toast";

// Stripe Checkout Session
export const useCreateStripeSession = () => {
  return useMutation({
    mutationFn: (order_id: number) =>
      paymentAPI.createCheckoutSession(order_id),
    onSuccess: (data) => {
      console.log("Checkout session created:", data);
      // toast.success("جاري تحويلك لصفحة الدفع...");

      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      console.error("Create checkout session failed:", error);
      // const message =
      //   error?.response?.data?.message ||
      //   error?.response?.data?.error ||
      //   "فشل إنشاء جلسة الدفع";
      // toast.error(message);
    },
  });
};

// PayPal Create Order
export const useCreatePayPalOrder = () => {
  return useMutation({
    mutationFn: (order_id: number) => paymentAPI.createPayPalOrder(order_id),
    onSuccess: (data) => {
      console.log("PayPal order created:", data);
      // toast.success("جاري تحويلك لـ PayPal...");

      //   if (data.approval_url) {
      //     window.location.href = data.approval_url;
      //   }
    },
    onError: (error: any) => {
      console.error("Create PayPal order failed:", error);
      // const message =
      //   error?.response?.data?.message ||
      //   "فشل إنشاء طلب PayPal";
      // toast.error(message);
    },
  });
};

// PayPal Capture Order
export const useCapturePayPalOrder = () => {
  return useMutation({
    mutationFn: (payload: PayPalCapture) =>
      paymentAPI.capturePayPalOrder(payload),
    onSuccess: (data) => {
      console.log("PayPal payment captured:", data);
      // toast.success("تم الدفع بنجاح!");
      // يمكنك إعادة التوجيه لصفحة التأكيد
      // window.location.href = `/orders/${data.order_id}`;
    },
    onError: (error: any) => {
      console.error("Capture PayPal order failed:", error);
      // const message =
      //   error?.response?.data?.message ||
      //   "فشل تأكيد الدفع";
      // toast.error(message);
    },
  });
};

// Place Order
export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (orderData: CheckoutFormData) =>
      paymentAPI.placeOrder(orderData),
    onSuccess: (data) => {
      console.log("Order placed successfully:", data);
      // toast.success("تم تقديم الطلب بنجاح!");
    },
    onError: (error: any) => {
      console.error("Place order failed:", error);
      // const message =
      //   error?.response?.data?.message ||
      //   "فشل تقديم الطلب";
      // toast.error(message);
    },
  });
};
