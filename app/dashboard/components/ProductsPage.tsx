"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Star, Edit, Trash2 } from "lucide-react";
import {
  ProductType,
  OrderStatus2,
  ProductStatus,
  CustomerStatus,
} from "@/type/type";

interface ProductsPageProps {
  products: ProductType[];
  getStatusColor: (
    status: OrderStatus2 | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus2 | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Products Catalog</h1>
        <p className="text-gray-400 text-base">Manage your product inventory</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center text-4xl border border-white/10">
                {product.image}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                  product.status,
                )}`}
              >
                {getStatusIcon(product.status)}
                {product.status}
              </span>
            </div>

            <h3 className="font-bold text-white text-lg mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400 mb-5 font-medium">
              {product.category}
            </p>

            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl font-bold text-[#fda481]">
                {product.price}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white text-base">
                  {product.rating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Stock</p>
                <p className="font-bold text-white text-lg">{product.stock}</p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Sold</p>
                <p className="font-bold text-white text-lg">{product.sold}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#fda481]/20 hover:shadow-2xl hover:shadow-[#fda481]/30 transition-all">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};
