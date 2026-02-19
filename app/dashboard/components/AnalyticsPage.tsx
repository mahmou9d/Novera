"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetStatusCount,
  useGetAllReviews,
  useGetProductLow,
  useGetSalesOrders,
} from "@/hooks/useDashboard";

export const AnalyticsPage = () => {
  const [reviewPage, setReviewPage] = useState(1);

  const { data: statusCount } = useGetStatusCount();
  const { data: reviewsData } = useGetAllReviews(reviewPage);
  const { data: lowStockData } = useGetProductLow();
  const { data: salesData } = useGetSalesOrders();

  const reviews = reviewsData?.results || [];
  const hasNextReviews =
    reviewsData?.next !== null && reviewsData?.next !== undefined;
  const hasPrevReviews =
    reviewsData?.previous !== null && reviewsData?.previous !== undefined;

  const totalOrders = statusCount?.orders?.total || 0;
  const totalSales = statusCount?.sales || 0;
  const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

  const analyticsData = [
    {
      label: "Total Revenue",
      value: `$${totalSales.toFixed(2)}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Avg Order Value",
      value: `$${avgOrder.toFixed(2)}`,
      change: "+5.4%",
      trend: "up" as const,
      icon: TrendingUp,
      gradient: "from-[#fda481] to-[#b4182d]",
    },
    {
      label: "Total Reviews",
      value: reviewsData?.count || 0,
      change: "+3.1%",
      trend: "up" as const,
      icon: MessageSquare,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  // Calculate order status distribution
  const orderStats = [
    {
      label: "Pending",
      value: statusCount?.orders?.pending || 0,
      percentage:
        totalOrders > 0
          ? ((statusCount?.orders?.pending || 0) / totalOrders) * 100
          : 0,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Paid",
      value: statusCount?.orders?.paid || 0,
      percentage:
        totalOrders > 0
          ? ((statusCount?.orders?.paid || 0) / totalOrders) * 100
          : 0,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Delivered",
      value: statusCount?.orders?.delivered || 0,
      percentage:
        totalOrders > 0
          ? ((statusCount?.orders?.delivered || 0) / totalOrders) * 100
          : 0,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Cancelled",
      value: statusCount?.orders?.cancelled || 0,
      percentage:
        totalOrders > 0
          ? ((statusCount?.orders?.cancelled || 0) / totalOrders) * 100
          : 0,
      color: "from-red-500 to-red-600",
    },
  ];

  // Calculate average rating from current page
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";
console.log(reviews);
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 text-base">
          Performance insights and metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-2xl`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span
                  className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                    item.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {item.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                  )}
                  {item.change}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">
                {item.label}
              </p>
              <p className="text-3xl font-bold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Second Row: Order Status & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Order Status</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {totalOrders} Total Orders
              </span>
            </div>
          </div>
          <div className="space-y-5">
            {orderStats.map((stat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">
                      {stat.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({stat.value} orders)
                    </span>
                  </div>
                  <span className="text-base font-bold text-[#fda481]">
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-[#0f1117] rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">
                  {averageRating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {reviewsData?.count || 0}{" "}
                {reviewsData?.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* Reviews List */}
          <div
            className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[280px]
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-white/10
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="group relative p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-gradient-to-b from-[#fda481]/50 to-[#b4182d]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#b4182d]/20">
                      {review.customer_name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm leading-tight truncate">
                            {review.customer_name}
                          </p>
                          <p className="text-xs text-[#fda481]/80 truncate mt-0.5">
                            {review.product_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
                          {`"${review.comment}"`}
                        </p>
                      )}

                      <p className="text-xs text-gray-600">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <MessageSquare className="w-7 h-7 text-gray-600" />
                </div>
                <p className="font-semibold text-gray-400 text-sm">
                  No reviews yet
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Reviews will appear here
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(hasNextReviews || hasPrevReviews) && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-300">
                  {reviewPage}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewPage((p) => p - 1)}
                  disabled={!hasPrevReviews}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fda481]/20 hover:border-[#fda481]/30 hover:text-[#fda481] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReviewPage((p) => p + 1)}
                  disabled={!hasNextReviews}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fda481]/20 hover:border-[#fda481]/30 hover:text-[#fda481] transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Third Row: Low Stock & Product Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Low Stock Alert</h2>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                {lowStockData?.variants?.length || 0} Items
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {lowStockData?.variants && lowStockData.variants.length > 0 ? (
              lowStockData.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {variant.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Stock: {variant.stock} units
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-xs font-bold text-red-400">
                      Low Stock
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">All products in stock</p>
                <p className="text-sm text-gray-500 mt-1">
                  No low stock alerts
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Statistics */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            Product Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-white">
                    {statusCount?.products?.count || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Stock</p>
                  <p className="text-2xl font-bold text-white">
                    {statusCount?.products?.total_stock || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {statusCount?.users || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-xl">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg. Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {averageRating} / 5.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
