import { apiClient } from "@/lib/apiClient";
import {
  AddToCartRequest,
  CartItem,
  CartResponse, Product, // أضفنا هذا
  UpdateQuantityRequest,
} from "../type/type";

export const cartAPI = {
  // التعديل هنا ليرجع مصفوفة الـ items من داخل كائن الـ response
  getCartItems: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<CartResponse>("/cart/");
    return data.items.map((item) => ({
      ...item,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.subtotal),
    })) as unknown as Product[];
  },

  addToCart: async (payload: AddToCartRequest): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/cart/add/", payload);
    return data;
  },

  updateQuantity: async (payload: UpdateQuantityRequest): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(
      `/cart/update/${payload.itemId}/`,
      { quantity: payload.quantity },
    );
    return data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/remove/${itemId}/`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart/clear/");
  },
  // checkout: async (payload: unknown): Promise<CheckoutResponse> => {
  //     const { data } = await apiClient.post<CheckoutResponse>(
  //         "/order/add/",
  //         payload
  //     );
  //     return data;
  // },
};
