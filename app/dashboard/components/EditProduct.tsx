"use client";
import React, { JSX, useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Star,
  Package,
  Layers,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import {
  OrderStatus,
  ProductStatus,
  CustomerStatus,
  TProduct,
} from "@/type/type";
import { useGetProducts, useUpdateProduct } from "@/hooks/useProducts";
import Image from "next/image";
import Notification from "@/components/Notification";
import { CreateProductModal } from "./CreateProductModal";
import { EditProductModal } from "./EditProductModal";
import { EditVariantModal } from "./EditVariantModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const EditProduct: React.FC<Props> = () => {
  
  const updateProductMutation = useUpdateProduct();
  const { data } = useGetProducts({ all: true });
  const products: TProduct[] = data?.products || [];

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" }| null>({
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

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  // Track which product's toggle is loading
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // ── Toggle product active ──────────────────────────────────────────────────
  const handleToggleActive = async (product: TProduct) => {
    setTogglingId(product.id);
    try {
      await updateProductMutation.mutateAsync({
        product_id: product.id,
        payload: { is_active: !product.is_active },
      });
      notify(
        `Product ${!product.is_active ? "activated" : "deactivated"} successfully`,
        "success",
      );
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      notify(e?.response?.data?.message || "Failed to update product", "error");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section>
      {notification?.message && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error"}
        />
      )}

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Products Catalog</h1>
        <p className="text-gray-400 text-base">Manage your product inventory</p>
      </div>

      {/* Add button */}
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

          const isActive = product.is_active ?? true;
          const isToggling = togglingId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`bg-[#1a1d29] rounded-2xl p-7 border transition-colors relative ${
                isActive
                  ? "border-white/10 hover:border-[#fda481]/50"
                  : "border-red-500/30 opacity-60"
              }`}
            >
              {/* Inactive badge */}
              {!isActive && (
                <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-1">
                  <span className="text-xs font-bold text-red-400">
                    INACTIVE
                  </span>
                </div>
              )}

              {/* Thumbnail */}
              <div className="mb-5">
                <div
                  className={`w-20 h-20 rounded-2xl overflow-hidden border border-white/10 ${!isActive ? "grayscale" : ""}`}
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

              {/* Info */}
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

              {/* Edit + Variants */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setShowEdit(true);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-shadow"
                >
                  <Package className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setShowVariants(true);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow"
                >
                  <Layers className="w-4 h-4" />
                  Variants
                </button>
              </div>

              {/* Toggle Active */}
              <button
                onClick={() => handleToggleActive(product)}
                disabled={isToggling}
                className={`w-full py-2.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                  isActive
                    ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                    : "bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                }`}
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isActive ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                {isToggling ? "Updating..." : isActive ? "Active" : "Inactive"}
              </button>
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
        productId={selectedProductId}
        onClose={() => {
          setShowEdit(false);
          setSelectedProductId(null);
        }}
        onNotify={notify}
      />

      <EditVariantModal
        open={showVariants}
  productId={selectedProductId}
  onClose={() => { setShowVariants(false); setSelectedProductId(null); }}
        onNotify={notify}
      />
    </section>
  );
};
