"use client";

import React, { JSX, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  ChevronDown,
  Check,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CustomerStatus, Order, OrderItem, OrderStatus, ProductStatus } from "@/type/type";
import { useGetRecentOrders } from "@/hooks/useDashboard";

interface OrdersPageProps {
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

// Status Options with icons and colors
const statusOptions = [
  {
    value: "all",
    label: "All Status",
    icon: Filter,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    count: 0,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    count: 0,
  },
  {
    value: "paid",
    label: "Paid",
    icon: CreditCard,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    count: 0,
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: Truck,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    count: 0,
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    count: 0,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    count: 0,
  },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({
  getStatusColor,
  getStatusIcon,
}) => {
  const { data: recentOrders } = useGetRecentOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order|null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(recentOrders);

  const ordersData = recentOrders?.orders || [];

  // Calculate counts for each status
  const statusOptionsWithCounts = statusOptions.map((option) => ({
    ...option,
    count:
      option.value === "all"
        ? ordersData.length
        : ordersData.filter((o) => o.status === option.value).length,
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter orders
  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOption =
    statusOptionsWithCounts.find((opt) => opt.value === statusFilter) ||
    statusOptionsWithCounts[0];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Orders Management
        </h1>
        <p className="text-gray-400 text-base">
          Manage and track all customer orders
        </p>
      </div>

      {/* Action Buttons & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Custom Status Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-5 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:border-[#fda481]/30 flex items-center gap-3 min-w-[180px]"
            >
              <div
                className={`w-8 h-8 rounded-lg ${selectedOption.bgColor} flex items-center justify-center`}
              >
                <selectedOption.icon
                  className={`w-4 h-4 ${selectedOption.color}`}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-bold text-white text-sm">
                  {selectedOption.label}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2">
                  {statusOptionsWithCounts.map((option, index) => {
                    const isSelected = option.value === statusFilter;
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg  ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fda481]/20 to-[#b4182d]/20 border border-[#fda481]/30"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${option.bgColor} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-5 h-5 ${option.color}`} />
                        </div>

                        <div className="flex-1 text-left">
                          <p
                            className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-300"}`}
                          >
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {option.count}{" "}
                            {option.count === 1 ? "order" : "orders"}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#fda481] flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Stats Footer */}
                <div className="border-t border-white/10 p-4 bg-white/5">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Active</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {
                          ordersData.filter(
                            (o) =>
                              o.status === "paid" || o.status === "shipped",
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Pending</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {
                          ordersData.filter((o) => o.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1d29] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50 "
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white "
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary with Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {statusOptionsWithCounts.map((option) => {
          if (option.value === "all") return null;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`bg-[#1a1d29] rounded-xl p-4 border  ${
                statusFilter === option.value
                  ? "border-[#fda481]/50 shadow-lg shadow-[#fda481]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${option.bgColor} flex items-center justify-center mb-3 mx-auto`}
              >
                <Icon className={`w-5 h-5 ${option.color}`} />
              </div>
              <p className="text-gray-400 text-xs mb-1">{option.label}</p>
              <p
                className={`text-2xl font-bold ${statusFilter === option.value ? "text-[#fda481]" : "text-white"}`}
              >
                {option.count}
              </p>
            </button>
          );
        })}

        {/* Total Revenue Card */}
        <div
          className="bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 rounded-xl p-4 border border-[#fda481]/30"
        >
          <div className="w-10 h-10 rounded-lg bg-[#fda481]/20 flex items-center justify-center mb-3 mx-auto">
            <DollarSign className="w-5 h-5 text-[#fda481]" />
          </div>
          <p className="text-gray-400 text-xs mb-1">Revenue</p>
          <p className="text-2xl font-bold text-[#fda481]">
            ${ordersData.reduce((sum, o) => sum + (o.total_price || 0), 0)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1117] border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-bold text-white text-sm">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          {order.full_name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.country}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#fda481]" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {order.items && order.items.length > 0
                              ? order.items[0].variant_name
                              : "No items"}
                          </p>
                          {order.items && order.items.length > 1 && (
                            <p className="text-xs text-gray-400">
                              +{order.items.length - 1} more
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-white text-lg">
                        ${order.total_price}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                          order?.status,
                        )}`}
                      >
                        {getStatusIcon(order?.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 font-medium text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-2.5 rounded-xl hover:bg-white/5 text-[#fda481] "
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-20" />
                    <p className="text-gray-400 font-semibold text-lg">
                      No orders found
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Orders will appear here when customers make purchases"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {recentOrders?.count || 0}
              </span>{" "}
              orders
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={!recentOrders?.previous}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={!recentOrders?.next}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal - Same as before */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-[#1a1d29] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#1a1d29] border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-400">#{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 "
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status & Date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(
                      selectedOrder?.status,
                    )}`}
                  >
                    {getStatusIcon(selectedOrder?.status)}
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(selectedOrder.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center">
                        <span className="text-white font-bold">
                          {selectedOrder.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {selectedOrder.full_name}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedOrder.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{selectedOrder.full_address}</p>
                        <p className="text-sm">{selectedOrder.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: OrderItem, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center">
                              <Package className="w-6 h-6 text-[#fda481]" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {item.variant_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-white">
                              ${item.subtotal}
                            </p>
                            <p className="text-xs text-gray-400">
                              ${item.price} each
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-4">
                        No items in this order
                      </p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-[#fda481]/10 to-[#b4182d]/10 rounded-xl p-5 border border-[#fda481]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#fda481]" />
                      <span className="text-lg font-semibold text-white">
                        Total Amount
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-[#fda481]">
                      ${selectedOrder.total_price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};
