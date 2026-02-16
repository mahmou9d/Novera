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
  Ban,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { TProduct, Variant } from "@/type/type";
import {
  useUpdateProductVariant,
  useDeleteProductVariant,
  useAddImageVariantsProduct,
} from "@/hooks/useProducts";
import Image from "next/image";

interface FormErrors {
  price?: string;
  stockSingle?: string;
  image?: string;
}

interface Props {
  open: boolean;
  product: TProduct | null;
  onClose: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}

const FieldError = ({ msg }: { msg: string }) => (
  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
    <AlertCircle className="w-4 h-4" />
    {msg}
  </div>
);

const base64ToFile = async (b64: string, name: string): Promise<File> => {
  const blob = await (await fetch(b64)).blob();
  return new File([blob], name, { type: blob.type });
};

export const EditVariantModal: React.FC<Props> = ({
  open,
  product,
  onClose,
  onNotify,
}) => {
  const updateVariantMutation = useUpdateProductVariant();
  const deleteVariantMutation = useDeleteProductVariant();
  const addImageMutation = useAddImageVariantsProduct();

  // Which sub-view to show
  const [view, setView] = useState<"list" | "edit">("list");

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [variantPrice, setVariantPrice] = useState("");
  const [variantComparePrice, setVariantComparePrice] = useState("");
  const [variantStock, setVariantStock] = useState(1);
  const [variantImage, setVariantImage] = useState("");
  const [variantColorName, setVariantColorName] = useState("");
  const [variantColorHex, setVariantColorHex] = useState("");
  const [variantSize, setVariantSize] = useState("");

  // Reset to list view when modal opens
  useEffect(() => {
    if (open) {
      setView("list");
      setSaveSuccess(false);
      setFormErrors({});
    }
  }, [open]);

  const openEdit = (variant: Variant) => {
    setSelectedVariant(variant);
    setVariantPrice(variant.price);
    setVariantComparePrice(variant.compare_at_price || "");
    setVariantStock(variant.stock);
    setVariantImage(variant.images?.[0] || "");
    setVariantColorName(variant.color_name);
    setVariantColorHex(variant.color_hex || "");
    setVariantSize(variant.size);
    setSaveSuccess(false);
    setFormErrors({});
    setView("edit");
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!variantPrice || parseFloat(variantPrice) <= 0)
      e.price = "Price must be > 0";
    if (!variantStock || variantStock <= 0) e.stockSingle = "Stock must be > 0";
    if (!variantImage) e.image = "Image is required";
    setFormErrors(e);
    return !Object.keys(e).length;
  };

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

  const handleUpdate = async () => {
    if (!validate() || !selectedVariant) return;
    setIsLoading(true);
    try {
      await updateVariantMutation.mutateAsync({
        variant_id: selectedVariant.id,
        payload: {
          color_name: variantColorName,
          color_hex: variantColorHex,
          size: variantSize,
          price: variantPrice,
          compare_at_price: variantComparePrice || "0.00",
          stock: variantStock,
        },
      });
      // Upload image only if it's a new base64 (not an existing URL)
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
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      onNotify(
        e?.response?.data?.message || "Failed to update variant",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (variant_id: number, hard: boolean) => {
    const msg = hard
      ? "Permanently delete this variant? This cannot be undone."
      : "Deactivate this variant?";
    if (!confirm(msg)) return;
    setIsLoading(true);
    try {
      await deleteVariantMutation.mutateAsync({ variant_id, hard });
      onNotify(
        `Variant ${hard ? "deleted" : "deactivated"} successfully`,
        "success",
      );
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      onNotify(
        e?.response?.data?.message || "Failed to delete variant",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && product && (
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
                  {view === "list"
                    ? `${product.name} — Manage variants`
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

            <div className="flex-1 overflow-y-auto p-6">
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
                    {product.variants?.map((variant: Variant) => {
                      const imgSrc = variant.images?.[0]
                        ? variant.images[0].replace("http://", "https://")
                        : "/placeholder.jpg";
                      const isDeactivated = variant?.is_active === false;

                      return (
                        <motion.div
                          key={variant.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-[#1a1d29] rounded-xl p-5 border hover:border-purple-500/50 relative ${
                            isDeactivated
                              ? "border-red-500/50 opacity-60"
                              : "border-white/10"
                          }`}
                        >
                          {isDeactivated && (
                            <div className="absolute top-3 right-3 bg-red-500/20 border border-red-500 rounded px-2 py-1 flex items-center gap-1">
                              <Ban className="w-3 h-3 text-red-500" />
                              <span className="text-xs font-bold text-red-500">
                                DEACTIVATED
                              </span>
                            </div>
                          )}
                          <div className="flex gap-4">
                            <div
                              className={`w-20 h-20 rounded-lg bg-[#0f1117] border border-white/10 overflow-hidden flex-shrink-0 ${isDeactivated ? "grayscale" : ""}`}
                            >
                              <Image
                                src={imgSrc}
                                alt={`${variant.color_name} ${variant.size}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{
                                    backgroundColor:
                                      variant.color_hex as string,
                                  }}
                                />
                                <span className="font-bold text-white">
                                  {variant.color_name} / {variant.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-lg font-bold text-[#fda481]">
                                  ${variant.price}
                                </span>
                                {variant.compare_at_price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ${variant.compare_at_price}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 mb-3">
                                Stock:{" "}
                                <span className="text-white font-semibold">
                                  {variant.stock}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEdit(variant)}
                                  disabled={isLoading}
                                  className="flex-1 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 rounded-lg hover:bg-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(variant.id, false)
                                  }
                                  disabled={isLoading || isDeactivated}
                                  className="p-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-lg hover:bg-yellow-500/20 disabled:opacity-50"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(variant.id, true)}
                                  disabled={isLoading}
                                  className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
                              className={`w-32 h-32 bg-[#0f1117] border rounded-lg flex items-center justify-center overflow-hidden ${
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

                      {/* Color + Size (read-only) */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Color
                          </label>
                          <div className="flex items-center gap-3 bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3">
                            <div
                              className="w-6 h-6 rounded-full border border-white/20"
                              style={{ backgroundColor: variantColorHex }}
                            />
                            <span className="text-white font-medium">
                              {variantColorName}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Size
                          </label>
                          <div className="bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3">
                            <span className="text-white font-medium">
                              {variantSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 flex items-center justify-between">
              <button
                onClick={view === "edit" ? () => setView("list") : onClose}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50"
              >
                {view === "edit" ? "← Back" : "Close"}
              </button>
              {view === "edit" && (
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50"
                >
                  {isLoading ? (
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
  );
};
