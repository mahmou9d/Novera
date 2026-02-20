"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Edit2,
  Layers,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import {
  EditVariantModalFormErrors,
  EditVariantModalProps,
  ErrorResponse,
  Variant,
} from "@/type/type";
import {
  useUpdateProductVariant,
  useAddImageVariantsProduct,
  useGetSingleProduct,
  useDeleteProductVariant,
} from "@/hooks/useProducts";
import Image from "next/image";
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

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
interface DeleteVariantConfirmProps {
  open: boolean;
  variantLabel: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteVariantConfirm: React.FC<DeleteVariantConfirmProps> = ({
  open,
  variantLabel,
  isDeleting,
  onConfirm,
  onClose,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
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
          <h2 className="text-xl font-bold text-white mb-2">Delete Variant</h2>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{`"${variantLabel}"`}</span>?
            <br />
            <span className="text-sm text-red-400/80">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-red-500/20 transition-shadow"
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

// ─── Component ────────────────────────────────────────────────────────────────
export const EditVariantModal: React.FC<EditVariantModalProps> = ({
  open,
  productId,
  onClose,
  onNotify,
}) => {
  const updateVariantMutation = useUpdateProductVariant();
  const addImageMutation = useAddImageVariantsProduct();
  const deleteVariantMutation = useDeleteProductVariant();

  const {
    data: product,
    isLoading: isFetching,
    isError,
    error,
  } = useGetSingleProduct(Number(productId), true);

  const [view, setView] = useState<"list" | "edit">("list");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<EditVariantModalFormErrors>({});

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Variant | null>(null);
  const [isDeletingVariant, setIsDeletingVariant] = useState(false);

  // Form fields
  const [variantPrice, setVariantPrice] = useState("");
  const [variantComparePrice, setVariantComparePrice] = useState("");
  const [variantStock, setVariantStock] = useState(1);
  const [variantImage, setVariantImage] = useState("");
  const [variantColorName, setVariantColorName] = useState("");
  const [variantColorHex, setVariantColorHex] = useState("");
  const [variantSize, setVariantSize] = useState("");
  const [variantIsActive, setVariantIsActive] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("list");
      setSaveSuccess(false);
      setFormErrors({});
      setSelectedVariant(null);
      setDeleteTarget(null);
    }
  }, [open]);

  const openEdit = (variant: Variant) => {
    setSelectedVariant(variant);
    setVariantPrice(variant.price);
    setVariantComparePrice(variant.compare_at_price || "");
    setVariantStock(variant.stock);
    setVariantImage(
      variant.images?.[0]
        ? variant.images[0].replace("http://", "https://")
        : "",
    );
    setVariantColorName(variant.color_name);
    setVariantColorHex(variant.color_hex || "");
    setVariantSize(variant.size);
    setVariantIsActive(variant.is_active ?? false);
    setSaveSuccess(false);
    setFormErrors({});
    setView("edit");
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: EditVariantModalFormErrors = {};
    if (!variantPrice || parseFloat(variantPrice) <= 0)
      e.price = "Price must be > 0";
    if (!variantStock || variantStock <= 0) e.stockSingle = "Stock must be > 0";
    if (!variantImage) e.image = "Image is required";
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onloadend = () => {
      setVariantImage(r.result as string);
      setFormErrors((p) => ({ ...p, image: undefined }));
    };
    r.readAsDataURL(file);
  };

  // ── Toggle Active ─────────────────────────────────────────────────────────
  const handleToggleActive = (variant: Variant) => {
    setTogglingId(variant.id);

    updateVariantMutation.mutate(
      {
        variant_id: variant.id,
        payload: { is_active: !variant.is_active },
      },
      {
        onSuccess: () => {
          onNotify(
            `Variant ${!variant.is_active ? "activated" : "deactivated"} successfully`,
            "success",
          );
          setTogglingId(null);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          onNotify(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to update variant",
            "error",
          );
          setTogglingId(null);
        },
      },
    );
  };

  // ── Delete Variant ────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setIsDeletingVariant(true);

    deleteVariantMutation.mutate(
      { variant_id: deleteTarget.id },
      {
        onSuccess: () => {
          onNotify("Variant deleted successfully", "success");
          setDeleteTarget(null);
          setIsDeletingVariant(false);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          onNotify(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to delete variant",
            "error",
          );
          setIsDeletingVariant(false);
        },
      },
    );
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = () => {
    if (!validate() || !selectedVariant) return;
    setIsUpdating(true);

    updateVariantMutation.mutate(
      {
        variant_id: selectedVariant.id,
        payload: {
          color_name: variantColorName,
          color_hex: variantColorHex,
          size: variantSize,
          price: variantPrice,
          compare_at_price: variantComparePrice || "0.00",
          stock: variantStock,
          is_active: variantIsActive,
        },
      },
      {
        onSuccess: async () => {
          if (variantImage && !variantImage.startsWith("http")) {
            try {
              const f = await base64ToFile(
                variantImage,
                `variant-${selectedVariant.id}.jpg`,
              );
              const fd = new FormData();
              fd.append("img", f);
              await addImageMutation.mutateAsync({
                payload: fd,
                variant_id: selectedVariant.id,
              });
            } catch {
              /* non-fatal */
            }
          }
          setSaveSuccess(true);
          onNotify("Variant updated successfully", "success");
          setTimeout(() => setView("list"), 1500);
          setIsUpdating(false);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          onNotify(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to update variant",
            "error",
          );
          setIsUpdating(false);
        },
      },
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1117] border-2 border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="border-b border-white/10 p-6 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-transparent">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {view === "list" ? (
                      <>
                        <Layers className="w-7 h-7 text-purple-500" />
                        Product Variants
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-7 h-7 text-purple-500" />
                        Edit Variant
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {isFetching
                      ? "Loading..."
                      : view === "list"
                        ? `${product?.name ?? ""} — Manage variants`
                        : `${variantColorName} / ${variantSize}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {view === "edit" && (
                    <button
                      onClick={() => setView("list")}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-lg"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Success banner */}
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">
                    Variant updated successfully!
                  </span>
                </motion.div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Loading */}
                {isFetching && (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                    <p className="text-gray-400">Loading variants...</p>
                  </div>
                )}

                {/* Error */}
                {isError && !isFetching && (
                  <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-red-400 font-semibold">
                      Failed to load variants
                    </p>
                    <p className="text-gray-500 text-sm">
                      {(error as { message?: string })?.message ??
                        "Please try again"}
                    </p>
                  </div>
                )}

                {/* Content */}
                {!isFetching && !isError && product && (
                  <AnimatePresence mode="wait">
                    {/* ── List View ─────────────────────────────────────── */}
                    {view === "list" && (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {product.variants?.length === 0 && (
                          <div className="col-span-2 flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
                            <Layers className="w-10 h-10" />
                            <p>No variants found for this product</p>
                          </div>
                        )}

                        {product.variants?.map((variant: Variant) => {
                          const imgSrc = variant.images?.[0]
                            ? variant.images[0].replace("http://", "https://")
                            : "/placeholder.jpg";
                          const isActive = variant.is_active ?? false;
                          const isToggling = togglingId === variant.id;
                          const isThisDeleting =
                            isDeletingVariant &&
                            deleteTarget?.id === variant.id;

                          return (
                            <motion.div
                              key={variant.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`bg-[#1a1d29] rounded-xl p-5 border transition-colors ${
                                isActive
                                  ? "border-white/10 hover:border-purple-500/50"
                                  : "border-red-500/30 opacity-70"
                              }`}
                            >
                              <div className="flex gap-4">
                                {/* Thumbnail */}
                                <div
                                  className={`w-20 h-20 rounded-lg bg-[#0f1117] border border-white/10 overflow-hidden flex-shrink-0 ${!isActive ? "grayscale" : ""}`}
                                >
                                  <Image
                                    src={imgSrc}
                                    alt={`${variant.color_name} ${variant.size}`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Color + Size */}
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                                      style={{
                                        backgroundColor:
                                          variant.color_hex as string,
                                      }}
                                    />
                                    <span className="font-bold text-white truncate">
                                      {variant.color_name} / {variant.size}
                                    </span>
                                  </div>

                                  {/* Price */}
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-base font-bold text-[#fda481]">
                                      ${variant.price}
                                    </span>
                                    {variant.compare_at_price && (
                                      <span className="text-sm text-gray-400 line-through">
                                        ${variant.compare_at_price}
                                      </span>
                                    )}
                                  </div>

                                  {/* Stock */}
                                  <p className="text-sm text-gray-400 mb-3">
                                    Stock:{" "}
                                    <span className="text-white font-semibold">
                                      {variant.stock}
                                    </span>
                                  </p>

                                  {/* Actions row 1: Edit + Toggle */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <button
                                      onClick={() => openEdit(variant)}
                                      disabled={isToggling || isThisDeleting}
                                      className="flex-1 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Edit
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleToggleActive(variant)
                                      }
                                      disabled={isToggling || isThisDeleting}
                                      title={
                                        isActive ? "Deactivate" : "Activate"
                                      }
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-50 ${
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
                                      {isActive ? "Active" : "Inactive"}
                                    </button>
                                  </div>

                                  {/* Actions row 2: Delete */}
                                  <button
                                    onClick={() => setDeleteTarget(variant)}
                                    disabled={isToggling || isThisDeleting}
                                    className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                                  >
                                    {isThisDeleting ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                    {isThisDeleting
                                      ? "Deleting..."
                                      : "Delete Variant"}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* ── Edit View ─────────────────────────────────────── */}
                    {view === "edit" && selectedVariant && (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 space-y-4">
                          <h3 className="text-lg font-bold text-white">
                            Variant Details
                          </h3>

                          {/* Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Variant Image *
                            </label>
                            <div className="flex items-center gap-4">
                              <label className="cursor-pointer">
                                <div
                                  className={`w-32 h-32 bg-[#0f1117] border rounded-xl flex items-center justify-center overflow-hidden transition-colors hover:border-purple-500/50 ${
                                    formErrors.image
                                      ? "border-red-500"
                                      : "border-white/10"
                                  }`}
                                >
                                  {variantImage ? (
                                    <img
                                      src={variantImage}
                                      alt="Variant"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                  )}
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                              <p className="text-sm text-gray-400">
                                Click to upload a new image
                              </p>
                            </div>
                            {formErrors.image && (
                              <FieldError msg={formErrors.image} />
                            )}
                          </div>

                          {/* Price + Compare */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Price *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={variantPrice}
                                onChange={(e) => {
                                  setVariantPrice(e.target.value);
                                  setFormErrors((p) => ({
                                    ...p,
                                    price: undefined,
                                  }));
                                }}
                                placeholder="0.00"
                                className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                                  formErrors.price
                                    ? "border-red-500"
                                    : "border-white/10 focus:border-purple-500/50"
                                }`}
                              />
                              {formErrors.price && (
                                <FieldError msg={formErrors.price} />
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Compare Price
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={variantComparePrice}
                                onChange={(e) =>
                                  setVariantComparePrice(e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>
                          </div>

                          {/* Stock */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Stock *
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={variantStock}
                              onChange={(e) => {
                                setVariantStock(parseInt(e.target.value) || 1);
                                setFormErrors((p) => ({
                                  ...p,
                                  stockSingle: undefined,
                                }));
                              }}
                              className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                                formErrors.stockSingle
                                  ? "border-red-500"
                                  : "border-white/10 focus:border-purple-500/50"
                              }`}
                            />
                            {formErrors.stockSingle && (
                              <FieldError msg={formErrors.stockSingle} />
                            )}
                          </div>

                          {/* Color (editable) + Size (read-only) */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* ── Color — text inputs ── */}
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Color
                              </label>
                              <div className="flex items-center gap-2">
                                {/* Color preview / native picker */}
                                <div className="relative flex-shrink-0">
                                  <div
                                    className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer overflow-hidden"
                                    style={{ backgroundColor: variantColorHex }}
                                  >
                                    <input
                                      type="color"
                                      value={variantColorHex}
                                      onChange={(e) =>
                                        setVariantColorHex(e.target.value)
                                      }
                                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    />
                                  </div>
                                </div>

                                {/* Color name */}
                                <input
                                  type="text"
                                  value={variantColorName}
                                  onChange={(e) =>
                                    setVariantColorName(e.target.value)
                                  }
                                  placeholder="Color name"
                                  className="flex-1 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm"
                                />
                              </div>

                              {/* Hex text input */}
                              <input
                                type="text"
                                value={variantColorHex}
                                onChange={(e) =>
                                  setVariantColorHex(e.target.value)
                                }
                                placeholder="#000000"
                                className="mt-2 w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm font-mono"
                              />
                            </div>

                            {/* Size (editable) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Size
                              </label>
                              <input
                                type="text"
                                value={variantSize}
                                onChange={(e) => setVariantSize(e.target.value)}
                                placeholder="e.g. M, L, XL"
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>
                          </div>

                          {/* Status Toggle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Status
                            </label>
                            <button
                              type="button"
                              onClick={() => setVariantIsActive((p) => !p)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors w-full ${
                                variantIsActive
                                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                                  : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                              }`}
                            >
                              {variantIsActive ? (
                                <ToggleRight className="w-5 h-5" />
                              ) : (
                                <ToggleLeft className="w-5 h-5" />
                              )}
                              <span className="font-semibold">
                                {variantIsActive ? "Active" : "Inactive"}
                              </span>
                              <span className="text-xs ml-auto opacity-60">
                                {variantIsActive
                                  ? "Variant is visible to customers"
                                  : "Variant is hidden from customers"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-6 flex items-center justify-between">
                <button
                  onClick={view === "edit" ? () => setView("list") : onClose}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50"
                >
                  {view === "edit" ? "← Back" : "Close"}
                </button>

                {view === "edit" && (
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update Variant
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm — z-[60] فوق الـ modal */}
      <DeleteVariantConfirm
        open={!!deleteTarget}
        variantLabel={
          deleteTarget
            ? `${deleteTarget.color_name} / ${deleteTarget.size}`
            : ""
        }
        isDeleting={isDeletingVariant}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};