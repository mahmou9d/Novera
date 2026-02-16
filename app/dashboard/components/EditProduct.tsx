"use client";
import React, { JSX, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, Trash2, Ban, Package, Layers } from "lucide-react";
import {
  OrderStatus,
  ProductStatus,
  CustomerStatus,
  TProduct,
} from "@/type/type";
import { useGetProducts, useDeleteProduct } from "@/hooks/useProducts";
import Image from "next/image";
import Notification from "@/components/Notification";
import { CreateProductModal } from "./CreateProductModal";
import { EditProductModal } from "./EditProductModal";
import { EditVariantModal } from "./EditVariantModal";

interface Props {
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

export const EditProduct: React.FC<Props> = () => {
  const [notification, setNotification] = useState<{message: string; type: "success" | "error"}|null>({
    message: "",
    type: "success",
  });

  const notify = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      console.log("Showing notification:", message, type);
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [],
  );
  // Modal visibility
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  // Selected data
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const deleteProductMutation = useDeleteProduct();
  const { data } = useGetProducts({ all: true });
  const products: TProduct[] = data?.products || [];

  const handleDeleteProduct = async (product_id: number, hard: boolean) => {
    const msg = hard
      ? "Permanently delete this product? This cannot be undone."
      : "Deactivate this product?";
    if (!confirm(msg)) return;
    setIsLoading(true);
    try {
      await deleteProductMutation.mutateAsync({ product_id, hard });
      notify(
        `Product ${hard ? "deleted" : "deactivated"} successfully`,
        "success",
      );
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      notify(e?.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {notification?.message && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error"}
        />
      )}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Products Catalog</h1>
        <p className="text-gray-400 text-base">Manage your product inventory</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const imageSrc =
            typeof product.thumbnail === "string"
              ? product.thumbnail.replace("http://", "https://")
              : "/placeholder.jpg";
          const isDeactivated = product.is_active === false;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`bg-[#1a1d29] rounded-2xl p-7 border hover:border-[#fda481]/50 cursor-pointer relative ${
                isDeactivated
                  ? "border-red-500/50 opacity-60"
                  : "border-white/10"
              }`}
            >
              {isDeactivated && (
                <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500">
                    DEACTIVATED
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-20 h-20 rounded-2xl overflow-hidden border border-white/10 ${isDeactivated ? "grayscale" : ""}`}
                >
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h3 className="font-bold text-white text-lg mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-5 font-medium">
                {product.category_name}
              </p>

              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-bold text-[#fda481]">
                  {product.lowest_price}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-base">
                    {product.average_rating}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowEdit(true);
                  }}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Package className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowVariants(true);
                  }}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  Variants
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteProduct(product.id, false)}
                  disabled={isLoading || isDeactivated}
                  className="flex-1 p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-500">
                    Deactivate
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id, true)}
                  disabled={isLoading}
                  className="flex-1 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-red-500">
                    Delete
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateProductModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onNotify={notify}
      />

      <EditProductModal
        open={showEdit}
        product={selectedProduct}
        onClose={() => {
          setShowEdit(false);
          setSelectedProduct(null);
        }}
        onNotify={notify}
      />

      <EditVariantModal
        open={showVariants}
        product={selectedProduct}
        onClose={() => {
          setShowVariants(false);
          setSelectedProduct(null);
        }}
        onNotify={notify}
      />
    </section>
  );
};
