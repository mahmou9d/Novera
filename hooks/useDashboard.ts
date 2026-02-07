/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardAPI } from "../api/dashboardApi";
import { OrderStatus } from "../type/type";
// import { toast } from "react-hot-toast";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    orders: () => [...dashboardKeys.all, "orders"] as const,
    recentOrders: (page?: number) =>
        [...dashboardKeys.orders(), "recent", page] as const,
    ordersCount: () => [...dashboardKeys.orders(), "count"] as const,
    users: () => [...dashboardKeys.all, "users"] as const,
    usersCount: () => [...dashboardKeys.users(), "count"] as const,
    sales: () => [...dashboardKeys.all, "sales"] as const,
    totalSales: () => [...dashboardKeys.sales(), "total"] as const,
    salesOrders: () => [...dashboardKeys.sales(), "orders"] as const,
    products: () => [...dashboardKeys.all, "products"] as const,
    topSelling: () => [...dashboardKeys.products(), "top-selling"] as const,
};

export const useGetRecentOrders = (page: number = 1) => {
    return useQuery({
        queryKey: dashboardKeys.recentOrders(page),
        queryFn: () => dashboardAPI.getRecentOrders(page),
        staleTime: 60 * 1000,
        // keepPreviousData: true,
    });
};

export const useGetOrdersCount = () => {
    return useQuery({
        queryKey: dashboardKeys.ordersCount(),
        queryFn: dashboardAPI.getOrdersCount,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetUsersCount = () => {
    return useQuery({
        queryKey: dashboardKeys.usersCount(),
        queryFn: dashboardAPI.getUsersCount,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetTotalSales = () => {
    return useQuery({
        queryKey: dashboardKeys.totalSales(),
        queryFn: dashboardAPI.getTotalSales,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetTopSelling = () => {
    return useQuery({
        queryKey: dashboardKeys.topSelling(),
        queryFn: dashboardAPI.getTopSelling,
        staleTime: 10 * 60 * 1000,
    });
};

export const useGetSalesOrders = () => {
    return useQuery({
        queryKey: dashboardKeys.salesOrders(),
        queryFn: dashboardAPI.getSalesOrders,
        staleTime: 5 * 60 * 1000, 
    });
};

export const usePatchOrders = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { id: number; status: OrderStatus }) =>
            dashboardAPI.patchOrders(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.ordersCount() });

            // toast.success("تم تحديث حالة الطلب بنجاح");
        },
        onError: (error: any) => {
            console.error("Patch order failed:", error);
            // const message =
            //     error?.response?.data?.message ||
            //     error?.response?.data?.error ||
            //     "فشل تحديث حالة الطلب";
            // toast.error(message);
        },
    });
};