"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Download, Eye, MoreVertical } from "lucide-react";
import {
  CustomerStatus,
  OrderStatus2,
  OrderType,
  ProductStatus,
} from "@/type/type";

interface OrdersPageProps {
  orders: OrderType[];
  getStatusColor: (
    status: OrderStatus2 | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus2 | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  getStatusColor,
  getStatusIcon,
}) => {
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

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Order
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

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
                  Product
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Amount
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
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-bold text-white">{order.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-white mb-0.5">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-white font-medium">
                      {order.product}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-white">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-[#fda481] text-base">
                      {order.amount}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-400 font-medium">
                    {order.date}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 rounded-xl hover:bg-white/5 text-[#fda481] transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
