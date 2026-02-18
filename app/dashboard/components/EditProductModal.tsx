"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Package,
  Check,
  ChevronDown,

} from "lucide-react";
import { useUpdateProduct, useGetSingleProduct } from "@/hooks/useProducts";
import { EditProductModalFormErrors, EditProductModalProps } from "@/type/type";


const FieldError = ({ msg }: { msg: string }) => (
  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
    <AlertCircle className="w-4 h-4" />
    {msg}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  productId,
  onClose,
  onNotify,
}) => {
  const updateProductMutation = useUpdateProduct();

  const {
    data: product,
    isLoading: isFetching,
    isError,
    error,
  } = useGetSingleProduct(Number(productId), true);

  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<EditProductModalFormErrors>({});

  // Form fields
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const CATEGORIES = ["Men", "Women", "Unisex", "Children", "Teens"];
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setCategoryOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (product) {
      setProductName(product.name ?? "");
      setCategory(product.category?.toString() ?? "");
      setMaterial(product.material_composition ?? "");
      setDescription(product.description ?? "");
      setIsActive(product.is_active ?? true);
      setSaveSuccess(false);
      setFormErrors({});
    }
  }, [product]);
  console.log(category);
  const handleClose = () => {
    setSaveSuccess(false);
    setFormErrors({});
    onClose();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: EditProductModalFormErrors = {};
    if (!productName.trim()) e.productName = "Product name is required";
    else if (productName.trim().length < 3)
      e.productName = "At least 3 characters";
    if (!category) e.category = "Please select a category";
    if (!material.trim()) e.material = "Material is required";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length < 10)
      e.description = "At least 10 characters";
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!validate() || !productId) return;
    setIsUpdating(true);
    try {
      await updateProductMutation.mutateAsync({
        product_id: productId,
        payload: {
          name: productName,
          description,
          material_composition: material,
          category: category,
          is_active: isActive,
        },
      });
      setSaveSuccess(true);
      onNotify("Product updated successfully", "success");
      setTimeout(handleClose, 1500);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      onNotify(
        e?.response?.data?.message || "Failed to update product",
        "error",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
            className="bg-[#0f1117] border-2 border-blue-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-white/10 p-6 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-transparent">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="w-7 h-7 text-blue-500" />
                  Edit Product
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isFetching ? "Loading..." : (product?.name ?? "")}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Success */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-semibold">
                  Product updated successfully!
                </span>
              </motion.div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ── Loading state ──────────────────────────────────────────── */}
              {isFetching && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-gray-400">Loading product data...</p>
                </div>
              )}

              {/* ── Error state ────────────────────────────────────────────── */}
              {isError && !isFetching && (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                  <p className="text-red-400 font-semibold">
                    Failed to load product
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    {(error as { message?: string })?.message ??
                      "Please try again"}
                  </p>
                </div>
              )}

              {/* ── Form ───────────────────────────────────────────────────── */}
              {!isFetching && !isError && product && (
                <div className="space-y-6">
                  <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">
                      Product Details
                    </h3>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          setFormErrors((p) => ({
                            ...p,
                            productName: undefined,
                          }));
                        }}
                        placeholder="e.g. Classic Cotton T-Shirt"
                        className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                          formErrors.productName
                            ? "border-red-500"
                            : "border-white/10 focus:border-blue-500/50"
                        }`}
                      />
                      {formErrors.productName && (
                        <FieldError msg={formErrors.productName} />
                      )}
                    </div>

                    {/* Category + Material */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Category *
                        </label>
                        <div className="relative" ref={categoryRef}>
                          <input
                            type="text"
                            value={category}
                            onChange={(e) => {
                              setCategory(e.target.value);
                              setCategoryOpen(true);
                              setFormErrors((p) => ({
                                ...p,
                                category: undefined,
                              }));
                            }}
                            onFocus={() => setCategoryOpen(true)}
                            placeholder="Select or type a category..."
                            className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none pr-10 ${
                              formErrors.category
                                ? "border-red-500"
                                : "border-white/10 focus:border-[#fda481]/50"
                            }`}
                          />
                          <ChevronDown
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                          />

                          <AnimatePresence>
                            {categoryOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-[#0f1117] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl"
                              >
                                {CATEGORIES.filter((c) =>
                                  c
                                    .toLowerCase()
                                    .includes(category.toLowerCase()),
                                ).map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                      setCategory(c);
                                      setCategoryOpen(false);
                                      setFormErrors((p) => ({
                                        ...p,
                                        category: undefined,
                                      }));
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center justify-between group ${
                                      category === c
                                        ? "text-[#fda481]"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {c}
                                    {category === c && (
                                      <Check className="w-4 h-4 text-[#fda481]" />
                                    )}
                                  </button>
                                ))}

                                {/* لو كتب حاجة مش في الليست */}
                                {category &&
                                  !CATEGORIES.some(
                                    (c) =>
                                      c.toLowerCase() ===
                                      category.toLowerCase(),
                                  ) && (
                                    <div className="px-4 py-2.5 border-t border-white/10">
                                      <p className="text-xs text-gray-500 mb-1">
                                        Custom
                                      </p>
                                      <p className="text-sm text-[#fda481] font-medium">{`"${category}"`}</p>
                                    </div>
                                  )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {formErrors.category && (
                          <FieldError msg={formErrors.category} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Material *
                        </label>
                        <input
                          type="text"
                          value={material}
                          onChange={(e) => {
                            setMaterial(e.target.value);
                            setFormErrors((p) => ({
                              ...p,
                              material: undefined,
                            }));
                          }}
                          placeholder="e.g. 100% Cotton"
                          className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                            formErrors.material
                              ? "border-red-500"
                              : "border-white/10 focus:border-blue-500/50"
                          }`}
                        />
                        {formErrors.material && (
                          <FieldError msg={formErrors.material} />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={description}
                        rows={5}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setFormErrors((p) => ({
                            ...p,
                            description: undefined,
                          }));
                        }}
                        placeholder="Write your product description here..."
                        className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none ${
                          formErrors.description
                            ? "border-red-500"
                            : "border-white/10 focus:border-blue-500/50"
                        }`}
                      />
                      {formErrors.description && (
                        <FieldError msg={formErrors.description} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 flex items-center justify-between">
              <button
                onClick={handleClose}
                disabled={isUpdating}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || isFetching || !product}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Product
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
