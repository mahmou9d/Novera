"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Save,
  Trash2,
} from "lucide-react";
import { Variant, CreateProduct, AddVariants, ColorOption, FormErrors, Props, SizeOption, TabType } from "@/type/type";
import {
  useCreateProduct,
  useAddVariantsProduct,
  useAddImageVariantsProduct,
} from "@/hooks/useProducts";


// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_COLORS: ColorOption[] = [
  { name: "Red", hex: "#EF4444", selected: false },
  { name: "Blue", hex: "#3B82F6", selected: false },
  { name: "Green", hex: "#10B981", selected: false },
  { name: "Black", hex: "#000000", selected: false },
  { name: "White", hex: "#FFFFFF", selected: false },
  { name: "Yellow", hex: "#F59E0B", selected: false },
];

const INITIAL_SIZES: SizeOption[] = [
  { size: "XS", selected: false },
  { size: "S", selected: false },
  { size: "M", selected: false },
  { size: "L", selected: false },
  { size: "XL", selected: false },
  { size: "XXL", selected: false },
];

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

// ─── Component ────────────────────────────────────────────────────────────────
export const CreateProductModal: React.FC<Props> = ({
  open,
  onClose,
  onNotify,
}) => {
  const createProductMutation = useCreateProduct();
  const addVariantsMutation = useAddVariantsProduct();
  const addImageMutation = useAddImageVariantsProduct();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [completedTabs, setCompletedTabs] = useState<Set<TabType>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");

  const [colors, setColors] = useState<ColorOption[]>(INITIAL_COLORS);
  const [sizes, setSizes] = useState<SizeOption[]>(INITIAL_SIZES);
  const [generatedVariants, setGeneratedVariants] = useState<Variant[]>([]);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  const reset = () => {
    setActiveTab("general");
    setCompletedTabs(new Set());
    setSaveSuccess(false);
    setFormErrors({});
    setProductName("");
    setCategory("");
    setMaterial("");
    setDescription("");
    setColors(INITIAL_COLORS);
    setSizes(INITIAL_SIZES);
    setGeneratedVariants([]);
    setCreatedProductId(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateGeneral = (): boolean => {
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

  const validateVariants = (): boolean => {
    const e: FormErrors = { stock: {}, images: {} };
    if (!generatedVariants.length) {
      e.variants = "Please generate at least one variant";
    } else {
      generatedVariants.forEach((v, i) => {
        if (!v.stock || v.stock <= 0) e.stock![i] = "Stock must be > 0";
        if (!v.images || !v.images.length) e.images![i] = "Image is required";
      });
      if (!Object.keys(e.stock!).length) delete e.stock;
      if (!Object.keys(e.images!).length) delete e.images;
    }
    setFormErrors(e);
    return !e.variants && !e.stock && !e.images;
  };

  // ── Variants ──────────────────────────────────────────────────────────────
  const generateVariants = () => {
    const selC = colors.filter((c) => c.selected);
    const selS = sizes.filter((s) => s.selected);
    if (!selC.length || !selS.length) {
      setFormErrors((p) => ({
        ...p,
        variants: "Select at least one color and size",
      }));
      return;
    }
    let id = 1;
    const list: Variant[] = [];
    selC.forEach((c) =>
      selS.forEach((s) =>
        list.push({
          id: id++,
          product_name: productName,
          category_name: category,
          color_name: c.name,
          color_hex: c.hex,
          size: s.size,
          price: "20.00",
          compare_at_price: "25.00",
          is_on_sale: false,
          is_active: false,
          stock: 1,
          images: [],
        }),
      ),
    );
    setGeneratedVariants(list);
    setFormErrors((p) => ({ ...p, variants: undefined }));
  };

  const handleVariantChange = (i: number, field: keyof Variant, val: unknown) =>
    setGeneratedVariants((p) =>
      p.map((v, j) => (j === i ? { ...v, [field]: val } : v)),
    );

  const handleVariantImageUpload = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onloadend = () =>
      setGeneratedVariants((p) =>
        p.map((v, j) => (j === i ? { ...v, images: [r.result as string] } : v)),
      );
    r.readAsDataURL(file);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validateGeneral()) return;
    setIsLoading(true);
    try {
      const payload: CreateProduct = {
        name: productName,
        description,
        material_composition: material,
        category: parseInt(category),
      };
      const res = await createProductMutation.mutateAsync(payload);
      setCreatedProductId(res.product_id);
      setCompletedTabs((p) => new Set(p).add("general"));
      setActiveTab("variants");
      setFormErrors({});
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: Record<string, string[]> };
        message?: string;
      };
      if (e?.response?.data) {
        const msg = Object.entries(e.response.data)
          .map(([k, v]) => `• ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("\n");
        onNotify(`Failed:\n${msg}`, "error");
      } else onNotify(e?.message || "Failed to create product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateVariants() || !createdProductId) {
      if (!createdProductId) onNotify("Product ID not found", "error");
      return;
    }
    setIsLoading(true);
    try {
      const varPayload: AddVariants[] = generatedVariants.map((v) => ({
        id: v.id,
        color_name: v.color_name,
        color_hex: v.color_hex,
        size: v.size,
        price: v.price,
        compare_at_price: v.compare_at_price || "0.00",
        stock: v.stock,
      }));
      const varRes = await addVariantsMutation.mutateAsync({
        payload: varPayload,
        product_id: createdProductId,
      });
      if (varRes) {
        const ids: number[] = varRes.map(
          (v: { id?: number; variant_id?: number }) => v.id ?? v.variant_id!,
        );
        for (let i = 0; i < generatedVariants.length; i++) {
          const img = generatedVariants[i].images?.[0];
          if (img) {
            try {
              const f = await base64ToFile(img, `variant-${ids[i]}.jpg`);
              const fd = new FormData();
              fd.append("img", f);
              await addImageMutation.mutateAsync({
                payload: fd,
                variant_id: ids[i],
              });
            } catch {
              /* non-fatal per variant */
            }
          }
        }
      }
      setSaveSuccess(true);
      onNotify("Product created successfully!", "success");
      setTimeout(handleClose, 1500);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      onNotify(
        e?.response?.data?.message || e?.message || "Failed to save product",
        "error",
      );
    } finally {
      setIsLoading(false);
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
            className="bg-[#0f1117] border-2 border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add New Product
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  DASHBOARD → PRODUCTS → ADD NEW
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
                  Product saved successfully!
                </span>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="border-b border-white/10 px-6 flex gap-1">
              {(["general", "variants"] as TabType[]).map((tab) => {
                const label =
                  tab === "general" ? "General Info" : "Variants & Stock";
                const accessible =
                  tab === "general" || completedTabs.has("general");
                const completed = completedTabs.has(tab);
                return (
                  <button
                    key={tab}
                    onClick={() => accessible && setActiveTab(tab)}
                    disabled={!accessible}
                    className={`px-6 py-4 text-sm font-semibold relative flex items-center gap-2 ${
                      activeTab === tab
                        ? "text-white"
                        : accessible
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {!accessible && <Lock className="w-4 h-4" />}
                    {completed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {label}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="createTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#fda481] to-[#b4182d]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* General */}
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 space-y-4"
                  >
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
                          setFormErrors((p) => ({
                            ...p,
                            productName: undefined,
                          }));
                        }}
                        placeholder="e.g. Classic Cotton T-Shirt"
                        className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                          formErrors.productName
                            ? "border-red-500"
                            : "border-white/10 focus:border-[#fda481]/50"
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
                            setFormErrors((p) => ({
                              ...p,
                              category: undefined,
                            }));
                          }}
                          className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            formErrors.category
                              ? "border-red-500"
                              : "border-white/10 focus:border-[#fda481]/50"
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
                            setFormErrors((p) => ({
                              ...p,
                              material: undefined,
                            }));
                          }}
                          placeholder="e.g. 100% Cotton"
                          className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                            formErrors.material
                              ? "border-red-500"
                              : "border-white/10 focus:border-[#fda481]/50"
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
                          setFormErrors((p) => ({
                            ...p,
                            description: undefined,
                          }));
                        }}
                        placeholder="Write your product description here..."
                        className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none ${
                          formErrors.description
                            ? "border-red-500"
                            : "border-white/10 focus:border-[#fda481]/50"
                        }`}
                      />
                      {formErrors.description && (
                        <FieldError msg={formErrors.description} />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Variants */}
                {activeTab === "variants" && (
                  <motion.div
                    key="variants"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 space-y-4">
                      <h3 className="text-lg font-bold text-white">
                        Generate Variants
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Select Colors:
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((c, i) => (
                            <button
                              key={c.name}
                              onClick={() =>
                                setColors((p) =>
                                  p.map((x, j) =>
                                    j === i
                                      ? { ...x, selected: !x.selected }
                                      : x,
                                  ),
                                )
                              }
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${c.selected ? "bg-white/10 border-[#fda481]" : "bg-[#0f1117] border-white/10 hover:bg-white/5"}`}
                            >
                              <div
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="text-sm text-white font-medium">
                                {c.name}
                              </span>
                              {c.selected && (
                                <X className="w-4 h-4 text-[#fda481]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Select Sizes:
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {sizes.map((s, i) => (
                            <button
                              key={s.size}
                              onClick={() =>
                                setSizes((p) =>
                                  p.map((x, j) =>
                                    j === i
                                      ? { ...x, selected: !x.selected }
                                      : x,
                                  ),
                                )
                              }
                              className={`px-6 py-2 rounded-lg border font-medium ${s.selected ? "bg-white/10 border-[#fda481] text-white" : "bg-[#0f1117] border-white/10 text-gray-400 hover:bg-white/5"}`}
                            >
                              {s.size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={generateVariants}
                        disabled={
                          !colors.some((c) => c.selected) ||
                          !sizes.some((s) => s.selected)
                        }
                        className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                        Generate{" "}
                        {colors.filter((c) => c.selected).length *
                          sizes.filter((s) => s.selected).length}{" "}
                        Combinations
                      </button>
                      {formErrors.variants && (
                        <FieldError msg={formErrors.variants} />
                      )}
                    </div>

                    {generatedVariants.length > 0 && (
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Active Variants ({generatedVariants.length})
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10 text-left text-sm font-semibold text-gray-400">
                                {[
                                  "IMAGE *",
                                  "VARIANT",
                                  "PRICE",
                                  "COMPARE PRICE",
                                  "STOCK *",
                                  "ACTIONS",
                                ].map((h) => (
                                  <th key={h} className="py-3 px-4">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {generatedVariants.map((v, idx) => (
                                <tr
                                  key={v.id}
                                  className="border-b border-white/5 hover:bg-white/5"
                                >
                                  <td className="py-3 px-4">
                                    <label className="cursor-pointer">
                                      <div
                                        className={`w-12 h-12 bg-[#0f1117] border rounded-lg flex items-center justify-center overflow-hidden ${formErrors.images?.[idx] ? "border-red-500" : "border-white/10"}`}
                                      >
                                        {v.images.length ? (
                                          <img
                                            src={v.images[0]}
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
                                        onChange={(e) =>
                                          handleVariantImageUpload(idx, e)
                                        }
                                      />
                                    </label>
                                    {formErrors.images?.[idx] && (
                                      <p className="text-xs text-red-500 mt-1">
                                        Required
                                      </p>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded-full border border-white/20"
                                        style={{
                                          backgroundColor:
                                            v.color_hex || "#666",
                                        }}
                                      />
                                      <span className="text-white font-medium">
                                        {v.color_name} / {v.size}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={v.price}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          idx,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={v.compare_at_price}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          idx,
                                          "compare_at_price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <input
                                      type="number"
                                      min="1"
                                      value={v.stock}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          idx,
                                          "stock",
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      className={`w-24 bg-[#0f1117] border rounded px-3 py-1.5 text-white text-sm focus:outline-none ${formErrors.stock?.[idx] ? "border-red-500" : "border-white/10 focus:border-[#fda481]/50"}`}
                                    />
                                    {formErrors.stock?.[idx] && (
                                      <p className="text-xs text-red-500 mt-1">
                                        {formErrors.stock[idx]}
                                      </p>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() =>
                                        setGeneratedVariants((p) =>
                                          p.filter((_, i) => i !== idx),
                                        )
                                      }
                                      className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
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
                          Each variant must have an image and stock greater than
                          0
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
              {activeTab === "general" ? (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Save & Next <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
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
                      Finish & Save Product
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
