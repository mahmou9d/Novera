// api/dashboardApi.ts
"use client";

import { apiClient } from "@/lib/apiClient";
import {
  OrdersCountResponse,
  UsersCountResponse,
  TotalSalesResponse,
  TopSellingProduct,
  LowStockResponse,
  Counted,
  OrderStatus,
  RecentOrdersData,
  RecentOrdersDatares,
  DashboardStats,
  ReviewsResponse,
  SalesOrdersResponse,
  Order,
  TopSellingResponse,
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

  getStatusCount: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats/");
    return data;
  },

  getReviewsCount: async (): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get<ReviewsResponse>(
      "/dashboard/reviews/",
    );
    return data;
  },
  getSalesOrders: async (): Promise<SalesOrdersResponse> => {
    const { data } = await apiClient.get<SalesOrdersResponse>(
      "/charts/sales-orders/",
    );
    return data;
  },
  getProductLow: async (): Promise<LowStockResponse> => {
    const { data } = await apiClient.get<LowStockResponse>(
      "/charts/products/low/",
    );
    return data || [];
  },
  getTopSelling: async (): Promise<TopSellingResponse> => {
    const { data } = await apiClient.get<TopSellingResponse>(
      "/charts/products/top-selling/",
    );
    return data || [];
  },
  patchOrders: async (payload: {
    id: number;
    status: OrderStatus;
  }): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(
      `/dashboard/order/${payload.id}/`,
      { status: payload.status },
    );
    return data;
  },
  //wait
  getOrdersCount: async (): Promise<Counted> => {
    const { data } =
      await apiClient.get<OrdersCountResponse>("/dashboard/orders/");
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
};
