"use client";

import { useMutation } from "@tanstack/react-query";
import { paymentAPI } from "../api/paymentApi";
import { CheckoutFormData } from "@/components/Checkoutform";
import { ErrorResponse, PayPalCapture } from "@/type/type";
import { AxiosError } from "axios";

export const useCreateStripeSession = () => {
  return useMutation({
    mutationFn: (order_id: number) =>
      paymentAPI.createCheckoutSession(order_id),
    onSuccess: (data) => {
      console.log("Checkout session created:", data);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      console.error("Create checkout session failed:", error);
    },
  });
};

export const useCreatePayPalOrder = () => {
  return useMutation({
    mutationFn: (order_id: number) => paymentAPI.createPayPalOrder(order_id),
    onSuccess: (data) => {
      console.log("PayPal order created:", data);
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      console.error("Create PayPal order failed:", error);
    },
  });
};

export const useCapturePayPalOrder = () => {
  return useMutation({
    mutationFn: (payload: PayPalCapture) =>
      paymentAPI.capturePayPalOrder(payload),
    onSuccess: (data) => {
      console.log("PayPal payment captured:", data);
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      console.error("Capture PayPal order failed:", error);
    },
  });
};

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (orderData: CheckoutFormData) =>
      paymentAPI.placeOrder(orderData),
    onSuccess: (data) => {
      console.log("Order placed successfully:", data);
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      console.error("Place order failed:", error);
    },
  });
};
