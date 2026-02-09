/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckoutFormData } from "@/components/Checkoutform";
import { apiClient } from "@/lib/apiClient";
export interface CheckoutSessionResponse {
  url: string;
}
export interface LinksPayPal {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: LinksPayPal[];
}

export interface PayPalCapture {
  orderID: string;
  django_order_id: string;
}
export interface PayPalCaptureResponse {
  message: string;
  data: {
    id: string;
    status: string;
  };
}
export interface PlaceOrderResponse {
  order_id: number;
  message?: string;
}
export const paymentAPI = {
  // Stripe - إنشاء جلسة دفع
  createCheckoutSession: async (
    order_id: number,
  ): Promise<CheckoutSessionResponse> => {
    const { data } = await apiClient.post<CheckoutSessionResponse>(
      "/payment/create-checkout-session/",
      { order_id },
    );
    return data;
  },

  // Stripe - webhook (عادة لا يتم استدعاؤه من الفرونت إند مباشرة)
  // لكن إذا احتجته للتحقق من حالة الدفع
  // stripeWebhook: async (payload: any): Promise<any> => {
  //   const { data } = await apiClient.post<any>(
  //     "/payment/webhook/stripe/",
  //     payload,
  //   );
  //   return data;
  // },

  // PayPal - إنشاء طلب
  createPayPalOrder: async (order_id: number): Promise<PayPalOrderResponse> => {
    const { data } = await apiClient.post<PayPalOrderResponse>(
      "/paypal/create-order/",
      { order_id },
    );
    return data;
  },

  // PayPal - تأكيد الدفع
  capturePayPalOrder: async (
    payload: PayPalCapture,
  ): Promise<PayPalCaptureResponse> => {
    const { data } = await apiClient.post<PayPalCaptureResponse>(
      "/paypal/capture-order/",
      payload,
    );
    return data;
  },

  // Orders - تقديم الطلب
  placeOrder: async (
    orderData: CheckoutFormData,
  ): Promise<PlaceOrderResponse> => {
    const { data } = await apiClient.post<PlaceOrderResponse>(
      "/orders/place/",
      orderData,
    );
    return data;
  },
};
