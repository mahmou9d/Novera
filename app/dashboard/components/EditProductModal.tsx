"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Package,
} from "lucide-react";
import { TProduct } from "@/type/type";
import { useUpdateProduct } from "@/hooks/useProducts";

interface FormErrors {
  productName?: string;
  category?: string;
  material?: string;
  description?: string;
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

export const EditProductModal: React.FC<Props> = ({
  open,
  product,
  onClose,
  onNotify,
}) => {
  const updateProductMutation = useUpdateProduct();

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");

  // Sync form when product changes
  useEffect(() => {
    if (product) {
      setProductName(product.name as string);
      setCategory(product.category_name?.toString() || "");
      setMaterial(product.material_composition || "");
      setDescription(product.description || "");
      setSaveSuccess(false);
      setFormErrors({});
    }
  }, [product]);

  const handleClose = () => {
    setSaveSuccess(false);
    setFormErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
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

  const handleUpdate = async () => {
    if (!validate() || !product) return;
    setIsLoading(true);
    try {
      await updateProductMutation.mutateAsync({
        product_id: product.id,
        payload: {
          name: productName,
          description,
          material_composition: material,
          category: parseInt(category),
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
                  Update product information
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

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
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">
                  Product Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      setFormErrors((p) => ({ ...p, productName: undefined }));
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setFormErrors((p) => ({ ...p, category: undefined }));
                      }}
                      className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                        formErrors.category
                          ? "border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    >
                      <option value="">Select...</option>
                      <option value="1">T-Shirts</option>
                      <option value="2">Hoodies</option>
                      <option value="3">Pants</option>
                      <option value="4">Accessories</option>
                    </select>
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
                        setFormErrors((p) => ({ ...p, material: undefined }));
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

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    rows={6}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setFormErrors((p) => ({ ...p, description: undefined }));
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

            {/* Footer */}
            <div className="border-t border-white/10 p-6 flex items-center justify-between">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
              >
                {isLoading ? (
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
