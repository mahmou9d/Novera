"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Plus, Mail, Phone, MapPin } from "lucide-react";
import {
  CustomerType,
  OrderStatus,
  ProductStatus,
  CustomerStatus,
} from "@/type/type";

interface CustomersPageProps {
  customers: CustomerType[];
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Customers Directory
        </h1>
        <p className="text-gray-400 text-base">Manage customer relationships</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold text-lg shadow-xl">
                {customer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg mb-1">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-400 truncate font-medium">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{customer.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Orders</p>
                <p className="font-bold text-white text-lg">
                  {customer.orders}
                </p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Spent</p>
                <p className="font-bold text-[#fda481] text-lg">
                  {customer.totalSpent}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                  customer.status,
                )}`}
              >
                {getStatusIcon(customer.status)}
                {customer.status}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {customer.joinDate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};
