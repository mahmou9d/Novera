"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  Package,
  Star,
  ShoppingCart,
  Users,
  DollarSign,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StatType } from "@/type/type";

interface DashboardPageProps {
  stats: StatType[];
}

const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
];

const topProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    sales: 245,
    revenue: "$31,875",
    trend: "+12%",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    sales: 189,
    revenue: "$66,150",
    trend: "+23%",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Laptop Stand",
    sales: 156,
    revenue: "$7,794",
    trend: "+8%",
    rating: 4.6,
  },
  {
    id: 4,
    name: "USB-C Hub",
    sales: 134,
    revenue: "$10,713",
    trend: "+15%",
    rating: 4.7,
  },
];

const recentActivities = [
  {
    id: 1,
    text: "New order from John Smith",
    time: "2 min ago",
    icon: ShoppingCart,
  },
  { id: 2, text: "New customer registered", time: "15 min ago", icon: Users },
  {
    id: 3,
    text: "Low stock alert: USB-C Hub",
    time: "1 hour ago",
    icon: Package,
  },
  {
    id: 4,
    text: "Payment received: $349.99",
    time: "2 hours ago",
    icon: DollarSign,
  },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ stats }) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 text-base">
          Welcome back! Here&apos;s what&apos;s happening with your store today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div
                className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
                  stat.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Revenue Analytics
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                Monthly performance overview
              </p>
            </div>
            <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="h-80 flex items-end justify-between gap-4">
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map((d) => d.sales));
              const height = (data.sales / maxSales) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-3 group"
                >
                  <div className="relative w-full">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: 0.3 + index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="w-full bg-gradient-to-t from-[#b4182d] via-[#fda481] to-[#fda481] rounded-t-xl transition-all origin-bottom group-hover:shadow-2xl group-hover:shadow-[#fda481]/30 cursor-pointer"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f1117] text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-white/10">
                        ${(data.sales / 1000).toFixed(0)}K
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-sm text-gray-400 font-bold">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-6">Top Products</h2>
          <div className="space-y-5">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fda481]/30 to-[#b4182d]/30 flex items-center justify-center border border-white/10">
                  <Package className="w-6 h-6 text-[#fda481]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {product.sales} sales
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-400 font-bold">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-base mb-1">
                    {product.revenue}
                  </p>
                  <span className="text-xs text-emerald-400 font-bold">
                    {product.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <activity.icon className="w-6 h-6 text-[#fda481]" />
              </div>
              <div className="flex-1">
                <p className="text-base text-white font-semibold mb-1">
                  {activity.text}
                </p>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
