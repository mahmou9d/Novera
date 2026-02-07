"use client";

import { apiClient } from "@/lib/apiClient";
import { CheckoutSessionResponse } from "@/type/type";

export const paymentAPI = {
  createCheckoutSession: async (
    order_id: number,
  ): Promise<CheckoutSessionResponse> => {
    const { data } = await apiClient.post<CheckoutSessionResponse>(
      "/payment/create-checkout-session/",
      { order_id },
    );
    return data;
  },
};
