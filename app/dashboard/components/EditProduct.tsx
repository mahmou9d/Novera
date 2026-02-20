"use client";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  Package,
  Layers,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Trash2,
  X,
  Image as ImageIcon,
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  TProduct,
  EditProductProps,
  AddVariants,
  ErrorResponse,
} from "@/type/type";
import {
  useGetProducts,
  useUpdateProduct,
  useDeleteProduct,
  useAddVariantsProduct,
  useAddImageVariantsProduct,
} from "@/hooks/useProducts";
import Image from "next/image";
import Notification from "@/components/Notification";
import { CreateProductModal } from "./CreateProductModal";
import { EditProductModal } from "./EditProductModal";
import { EditVariantModal } from "./EditVariantModal";
import { AxiosError } from "axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const base64ToFile = async (b64: string, name: string): Promise<File> => {
  const blob = await (await fetch(b64)).blob();
  return new File([blob], name, { type: blob.type });
};

const FieldError = ({ msg }: { msg: string }) => (
  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
    <AlertCircle className="w-4 h-4" />
    {msg}
  </div>
);

// ─── Add Variant Modal ────────────────────────────────────────────────────────
interface AddVariantModalProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
  onNotify: (msg: string, type?: "success" | "error") => void;
}

interface NewVariantRow {
  id: number;
  color_name: string;
  color_hex: string;
  size: string;
  price: string;
  compare_at_price: string;
  stock: number;
  image: string | null;
}

const emptyRow = (id: number): NewVariantRow => ({
  id,
  color_name: "",
  color_hex: "#000000",
  size: "",
  price: "20.00",
  compare_at_price: "25.00",
  stock: 1,
  image: null,
});

const AddVariantModal: React.FC<AddVariantModalProps> = ({
  open,
  productId,
  onClose,
  onNotify,
}) => {
  const addVariantsMutation = useAddVariantsProduct();
  const addImageMutation = useAddImageVariantsProduct();

  const [rows, setRows] = useState<NewVariantRow[]>([emptyRow(1)]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleClose = () => {
    setRows([emptyRow(1)]);
    setErrors({});
    onClose();
  };

  const addRow = () => setRows((p) => [...p, emptyRow(p[p.length - 1].id + 1)]);
  const removeRow = (idx: number) =>
    setRows((p) => p.filter((_, i) => i !== idx));
  const updateRow = (idx: number, field: keyof NewVariantRow, val: unknown) =>
    setRows((p) => p.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));

  const handleImageUpload = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => updateRow(idx, "image", reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const e: Record<number, string> = {};
    rows.forEach((r, i) => {
      if (!r.image) e[i] = "Image required";
      else if (r.stock <= 0) e[i] = "Stock must be > 0";
    });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!productId || !validate()) return;
    setIsLoading(true);

    const payload: AddVariants[] = rows.map((r) => ({
      id: r.id,
      color_name: r.color_name,
      color_hex: r.color_hex,
      size: r.size,
      price: r.price,
      compare_at_price: r.compare_at_price || "0.00",
      stock: r.stock,
    }));

    addVariantsMutation.mutate(
      { payload, product_id: productId },
      {
        onSuccess: async (res) => {
          if (res) {
            const ids: number[] = res.map(
              (v: { id?: number; variant_id?: number }) =>
                v.id ?? v.variant_id!,
            );
            for (let i = 0; i < rows.length; i++) {
              if (rows[i].image) {
                try {
                  const f = await base64ToFile(
                    rows[i].image!,
                    `variant-${ids[i]}.jpg`,
                  );
                  const fd = new FormData();
                  fd.append("img", f);
                  await addImageMutation.mutateAsync({
                    payload: fd,
                    variant_id: ids[i],
                  });
                } catch {
                  /* non-fatal */
                }
              }
            }
          }
          onNotify("Variants added successfully!", "success");
          setIsLoading(false);
          handleClose();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          onNotify(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to add variants",
            "error",
          );
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1117] border-2 border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Add Variants</h2>
                <p className="text-sm text-gray-400 mt-1">
                  DASHBOARD → PRODUCTS → ADD VARIANTS
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Variant Rows ({rows.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addRow}
                    className="px-4 py-2 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </motion.button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-sm font-semibold text-gray-400">
                        {[
                          "IMAGE *",
                          "COLOR",
                          "HEX",
                          "SIZE",
                          "PRICE",
                          "COMPARE PRICE",
                          "STOCK *",
                          "REMOVE",
                        ].map((h) => (
                          <th key={h} className="py-3 px-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          {/* Image */}
                          <td className="py-3 px-3">
                            <label className="cursor-pointer">
                              <div
                                className={`w-12 h-12 bg-[#0f1117] border rounded-lg flex items-center justify-center overflow-hidden ${errors[idx] ? "border-red-500" : "border-white/10"}`}
                              >
                                {row.image ? (
                                  <img
                                    src={row.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(idx, e)}
                              />
                            </label>
                            {errors[idx] && (
                              <p className="text-xs text-red-500 mt-1">
                                Required
                              </p>
                            )}
                          </td>

                          {/* Color name text input */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.color_name}
                              onChange={(e) =>
                                updateRow(idx, "color_name", e.target.value)
                              }
                              placeholder="e.g. Navy Blue"
                              className="w-28 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                            />
                          </td>

                          {/* Color hex — preview circle + text input */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {/* Native color picker hidden behind circle */}
                              <div className="relative flex-shrink-0">
                                <div
                                  className="w-7 h-7 rounded-full border border-white/20 cursor-pointer overflow-hidden"
                                  style={{ backgroundColor: row.color_hex }}
                                >
                                  <input
                                    type="color"
                                    value={row.color_hex}
                                    onChange={(e) =>
                                      updateRow(idx, "color_hex", e.target.value)
                                    }
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                              </div>
                              <input
                                type="text"
                                value={row.color_hex}
                                onChange={(e) =>
                                  updateRow(idx, "color_hex", e.target.value)
                                }
                                placeholder="#000000"
                                className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                              />
                            </div>
                          </td>

                          {/* Size text input */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.size}
                              onChange={(e) =>
                                updateRow(idx, "size", e.target.value)
                              }
                              placeholder="e.g. M"
                              className="w-20 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                            />
                          </td>

                          {/* Price */}
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={row.price}
                              onChange={(e) =>
                                updateRow(idx, "price", e.target.value)
                              }
                              className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                            />
                          </td>

                          {/* Compare Price */}
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={row.compare_at_price}
                              onChange={(e) =>
                                updateRow(idx, "compare_at_price", e.target.value)
                              }
                              className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                            />
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min="1"
                              value={row.stock}
                              onChange={(e) =>
                                updateRow(idx, "stock", parseInt(e.target.value) || 1)
                              }
                              className="w-20 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                            />
                          </td>

                          {/* Remove */}
                          <td className="py-3 px-3">
                            <button
                              onClick={() => removeRow(idx)}
                              disabled={rows.length === 1}
                              className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-yellow-400 flex items-start gap-2 mt-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Each variant must have an image and stock greater than 0
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 flex items-center justify-between">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Variants
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  productName,
  onConfirm,
  onClose,
  isDeleting,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0f1117] border-2 border-red-500/30 rounded-2xl w-full max-w-md p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{`"${productName}"`}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export const EditProduct: React.FC<EditProductProps> = () => {
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetProducts({ page: currentPage, all: true });
  const products: TProduct[] = data?.products || [];
  const totalCount = data?.count || 0;
  const hasNext = data?.next !== null && data?.next !== undefined;
  const hasPrevious = data?.previous !== null && data?.previous !== undefined;

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>({ message: "", type: "success" });

  const notify = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [],
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const openDeleteConfirm = (product: TProduct) => {
    setSelectedProductId(product.id);
    setSelectedProductName(product.name);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProductId) return;
    setDeletingId(selectedProductId);
    try {
      await deleteProductMutation.mutateAsync({ product_id: selectedProductId });
      notify("Product deleted successfully", "success");
      setShowDeleteConfirm(false);
      setSelectedProductId(null);
      setSelectedProductName("");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      notify(e?.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setDeletingId(null);
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

      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>

        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">{totalCount}</span> total products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const imageSrc =
            typeof product.thumbnail === "string"
              ? product.thumbnail.replace("http://", "https://")
              : "/placeholder.jpg";

          const isActive = product.is_active ?? true;
          const isToggling = togglingId === product.id;
          const isDeleting = deletingId === product.id;

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
              {!isActive && (
                <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-1">
                  <span className="text-xs font-bold text-red-400">INACTIVE</span>
                </div>
              )}

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

              <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-5 font-medium">{product.category_name}</p>

              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-bold text-[#fda481]">${product.lowest_price}</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-base">{product.average_rating}</span>
                </div>
              </div>

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

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setShowAddVariant(true);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
                <button
                  onClick={() => openDeleteConfirm(product)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>

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

      {/* Pagination */}
      {(hasNext || hasPrevious) && (
        <div className="flex items-center justify-between mt-10 bg-[#1a1d29] rounded-2xl border border-white/10 px-6 py-4">
          <p className="text-sm text-gray-400">
            Page <span className="font-semibold text-white">{currentPage}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasPrevious}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fda481]/20 hover:border-[#fda481]/30 hover:text-[#fda481] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400 px-3">Page {currentPage}</span>
            <button
              onClick={() => {
                setCurrentPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasNext}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fda481]/20 hover:border-[#fda481]/30 hover:text-[#fda481] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
        onClose={() => {
          setShowVariants(false);
          setSelectedProductId(null);
        }}
        onNotify={notify}
      />

      <AddVariantModal
        open={showAddVariant}
        productId={selectedProductId}
        onClose={() => {
          setShowAddVariant(false);
          setSelectedProductId(null);
        }}
        onNotify={notify}
      />

      <DeleteConfirmModal
        open={showDeleteConfirm}
        productName={selectedProductName}
        isDeleting={deletingId !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedProductId(null);
          setSelectedProductName("");
        }}
      />
    </section>
  );
};