// api/dashboardApi.ts
"use client";

import { apiClient } from "@/lib/axios";
import {
    OrdersCountResponse,
    UsersCountResponse,
    TotalSalesResponse,
    TopSellingProduct,
    TopSellingResponse,
    SalesOrder,
    Counted,
    OrderStatus,
    RecentOrdersData,
    RecentOrdersDatares,
} from "../type/type";

export const dashboardAPI = {
  getRecentOrders: async (page: number = 1): Promise<RecentOrdersData> => {
    const { data } = await apiClient.get<RecentOrdersDatares>(
      `/dashboard/orders/recent/?page=${page}`,
    );
    return {
      orders: data.results || [],
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getOrdersCount: async (): Promise<Counted> => {
    const { data } =
      await apiClient.get<OrdersCountResponse>("/dashboard/orders/");
    return data;
  },
  getStatusCount: async (): Promise<Counted> => {
    const { data } =
      await apiClient.get<OrdersCountResponse>("/dashboard/status/");
    return data;
  },
  getReviewsCount: async (): Promise<Counted> => {
    const { data } =
      await apiClient.get<OrdersCountResponse>("/dashboard/reviews/");
    return data;
  },
  getUsersCount: async (): Promise<number> => {
    const { data } =
      await apiClient.get<UsersCountResponse>("/dashboard/users/");
    return data.users || 0;
  },

  getTotalSales: async (): Promise<number> => {
    const { data } = await apiClient.get<TotalSalesResponse>(
      "/dashboard/totalsales/",
    );
    return data.total_sales || 0;
  },

  getTopSelling: async (): Promise<TopSellingProduct[]> => {
    const { data } = await apiClient.get<TopSellingResponse>(
      "/charts/products/top-selling/",
    );
    return data.topSelling || [];
  },

  getSalesOrders: async (): Promise<SalesOrder[]> => {
    const { data } = await apiClient.get<SalesOrder[]>("/charts/sales-orders/");
    return data;
  },

  patchOrders: async (payload: {
    id: number;
    status: OrderStatus;
  }): Promise<Counted> => {
    const { data } = await apiClient.patch<Counted>(
      `/dashboard/order/${payload.id}/`,
      { status: payload.status },
    );
    return data;
  },
};