/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Upload,
  Star,
  Edit,
  Trash2,
  Save,
  X,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  ProductType,
  OrderStatus2,
  ProductStatus,
  CustomerStatus,
  Product,
  Variant,
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

type TabType = "general" | "variants" | "seo";

interface ColorOption {
  name: string;
  hex: string;
  selected: boolean;
}

interface SizeOption {
  size: string;
  selected: boolean;
}

interface FormErrors {
  productName?: string;
  category?: string;
  material?: string;
  description?: string;
  variants?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export const EditProduct: React.FC<ProductsPageProps> = ({
  products,
  getStatusColor,
  getStatusIcon,
}) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // SEO states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [slug, setSlug] = useState("");

  // Main product images
  const [productImages, setProductImages] = useState<UploadedImage[]>([]);

  // Variants state
  const [colors, setColors] = useState<ColorOption[]>([
    { name: "Red", hex: "#EF4444", selected: false },
    { name: "Blue", hex: "#3B82F6", selected: false },
    { name: "Green", hex: "#10B981", selected: false },
    { name: "Black", hex: "#000000", selected: false },
    { name: "White", hex: "#FFFFFF", selected: false },
    { name: "Yellow", hex: "#F59E0B", selected: false },
  ]);

  const [sizes, setSizes] = useState<SizeOption[]>([
    { size: "XS", selected: false },
    { size: "S", selected: false },
    { size: "M", selected: false },
    { size: "L", selected: false },
    { size: "XL", selected: false },
    { size: "XXL", selected: false },
  ]);

  const [generatedVariants, setGeneratedVariants] = useState<Variant[]>([]);

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!productName.trim()) {
      errors.productName = "Product name is required";
    } else if (productName.trim().length < 3) {
      errors.productName = "Product name must be at least 3 characters";
    }

    if (!category) {
      errors.category = "Please select a category";
    }

    if (!material.trim()) {
      errors.material = "Material is required";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (activeTab === "variants" && generatedVariants.length === 0) {
      errors.variants = "Please generate at least one variant";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle main product image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string,
            id: Math.random().toString(36).substr(2, 9),
          });
          if (newImages.length === files.length) {
            setProductImages([...productImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeProductImage = (id: string) => {
    setProductImages(productImages.filter((img) => img.id !== id));
  };

  const handleColorToggle = (index: number) => {
    const newColors = [...colors];
    newColors[index].selected = !newColors[index].selected;
    setColors(newColors);
  };

  const handleSizeToggle = (index: number) => {
    const newSizes = [...sizes];
    newSizes[index].selected = !newSizes[index].selected;
    setSizes(newSizes);
  };

  const generateVariants = () => {
    const selectedColors = colors.filter((c) => c.selected);
    const selectedSizes = sizes.filter((s) => s.selected);

    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      setFormErrors({
        ...formErrors,
        variants: "Please select at least one color and one size",
      });
      return;
    }

    const newVariants: Variant[] = [];
    let variantId = 1;

    selectedColors.forEach((color) => {
      selectedSizes.forEach((size) => {
        newVariants.push({
          id: variantId++,
          product_name: productName || "Product Name",
          category_name: category || "Category",
          color_name: color.name,
          color_hex: color.hex,
          size: size.size,
          price: "20.00",
          compare_at_price: "25.00",
          is_on_sale: false,
          stock: 0,
          images: [],
        });
      });
    });

    setGeneratedVariants(newVariants);
    setFormErrors({ ...formErrors, variants: undefined });
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: any,
  ) => {
    const newVariants = [...generatedVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setGeneratedVariants(newVariants);
  };

  const handleDeleteVariant = (index: number) => {
    const newVariants = generatedVariants.filter((_, i) => i !== index);
    setGeneratedVariants(newVariants);
  };

  // Handle variant image upload
  const handleVariantImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newVariants = [...generatedVariants];
      newVariants[index].images = [reader.result as string];
      setGeneratedVariants(newVariants);
    };
    reader.readAsDataURL(file);
  };

  // Auto-generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  React.useEffect(() => {
    if (productName) {
      setSlug(generateSlug(productName));
      if (seoTitle === "") {
        setSeoTitle(productName);
      }
    }
  }, [productName]);

  // API Functions
  const saveProduct = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorTab =
        formErrors.productName || formErrors.category
          ? "general"
          : formErrors.variants
            ? "variants"
            : activeTab;
      setActiveTab(firstErrorTab);
      return;
    }

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("category", category);
      formData.append("material", material);
      formData.append("description", description);
      formData.append("seo_title", seoTitle);
      formData.append("seo_description", seoDescription);
      formData.append("seo_keywords", seoKeywords);
      formData.append("slug", slug);

      // Add product images
      productImages.forEach((img, index) => {
        formData.append(`images[]`, img.file);
      });

      // Add variants
      formData.append("variants", JSON.stringify(generatedVariants));

      // API call
      const response = await fetch("/api/products", {
        method: selectedProduct ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const data = await response.json();
      console.log("Product saved:", data);

      setSaveSuccess(true);
      setTimeout(() => {
        setShowAddProduct(false);
        resetForm();
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setCategory("");
    setMaterial("");
    setDescription("");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setSlug("");
    setProductImages([]);
    setGeneratedVariants([]);
    setFormErrors({});
    setColors(colors.map((c) => ({ ...c, selected: false })));
    setSizes(sizes.map((s) => ({ ...s, selected: false })));
    setActiveTab("general");
    setSaveSuccess(false);
  };

  const tabs = [
    { id: "general" as TabType, label: "General Info" },
    { id: "variants" as TabType, label: "Variants & Stock" },
    { id: "seo" as TabType, label: "SEO & Metadata" },
  ];

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
          onClick={() => setShowAddProduct(true)}
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

      {/* Product Grid */}
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
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex-1 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#fda481]/20 hover:shadow-2xl hover:shadow-[#fda481]/30 transition-all"
              >
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

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddProduct(false)}
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
                    {selectedProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    DASHBOARD → PRODUCTS → ADD NEW
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Success Message */}
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
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-semibold relative transition-colors ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#fda481] to-[#b4182d]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "general" && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Product Details
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              value={productName}
                              onChange={(e) => {
                                setProductName(e.target.value);
                                if (formErrors.productName) {
                                  setFormErrors({
                                    ...formErrors,
                                    productName: undefined,
                                  });
                                }
                              }}
                              placeholder="e.g. Classic Cotton T-Shirt"
                              className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                                formErrors.productName
                                  ? "border-red-500 focus:border-red-500"
                                  : "border-white/10 focus:border-[#fda481]/50"
                              }`}
                            />
                            {formErrors.productName && (
                              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {formErrors.productName}
                              </div>
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
                                  if (formErrors.category) {
                                    setFormErrors({
                                      ...formErrors,
                                      category: undefined,
                                    });
                                  }
                                }}
                                className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                                  formErrors.category
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-white/10 focus:border-[#fda481]/50"
                                }`}
                              >
                                <option value="">Select...</option>
                                <option value="T-Shirts">T-Shirts</option>
                                <option value="Hoodies">Hoodies</option>
                                <option value="Pants">Pants</option>
                                <option value="Accessories">Accessories</option>
                              </select>
                              {formErrors.category && (
                                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                  <AlertCircle className="w-4 h-4" />
                                  {formErrors.category}
                                </div>
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
                                  if (formErrors.material) {
                                    setFormErrors({
                                      ...formErrors,
                                      material: undefined,
                                    });
                                  }
                                }}
                                placeholder="e.g. 100% Cotton"
                                className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                                  formErrors.material
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-white/10 focus:border-[#fda481]/50"
                                }`}
                              />
                              {formErrors.material && (
                                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                  <AlertCircle className="w-4 h-4" />
                                  {formErrors.material}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Description *
                            </label>
                            <textarea
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                                if (formErrors.description) {
                                  setFormErrors({
                                    ...formErrors,
                                    description: undefined,
                                  });
                                }
                              }}
                              placeholder="Write your product description here..."
                              rows={6}
                              className={`w-full bg-[#0f1117] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none ${
                                formErrors.description
                                  ? "border-red-500 focus:border-red-500"
                                  : "border-white/10 focus:border-[#fda481]/50"
                              }`}
                            />
                            {formErrors.description && (
                              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {formErrors.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Images Upload */}
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Product Images
                        </h3>

                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#fda481]/50 transition-colors bg-[#0f1117]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 text-gray-400 mb-3" />
                              <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handleProductImageUpload}
                            />
                          </label>

                          {/* Image Previews */}
                          {productImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                              {productImages.map((img) => (
                                <div
                                  key={img.id}
                                  className="relative group aspect-square"
                                >
                                  <img
                                    src={img.preview}
                                    alt="Product"
                                    className="w-full h-full object-cover rounded-lg border border-white/10"
                                  />
                                  <button
                                    onClick={() => removeProductImage(img.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "variants" && (
                    <motion.div
                      key="variants"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Generate Variants Section */}
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          GENERATE VARIANTS
                        </h3>

                        <div className="space-y-4">
                          {/* Select Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3">
                              Select Colors:
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {colors.map((color, index) => (
                                <button
                                  key={color.name}
                                  onClick={() => handleColorToggle(index)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    color.selected
                                      ? "bg-white/10 border-[#fda481]"
                                      : "bg-[#0f1117] border-white/10 hover:bg-white/5"
                                  }`}
                                >
                                  <div
                                    className="w-4 h-4 rounded-full border border-white/20"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span className="text-sm text-white font-medium">
                                    {color.name}
                                  </span>
                                  {color.selected && (
                                    <X className="w-4 h-4 text-[#fda481]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Select Sizes */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3">
                              Select Sizes:
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {sizes.map((size, index) => (
                                <button
                                  key={size.size}
                                  onClick={() => handleSizeToggle(index)}
                                  className={`px-6 py-2 rounded-lg border font-medium transition-all ${
                                    size.selected
                                      ? "bg-white/10 border-[#fda481] text-white"
                                      : "bg-[#0f1117] border-white/10 text-gray-400 hover:bg-white/5"
                                  }`}
                                >
                                  {size.size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Generate Button */}
                          <button
                            onClick={generateVariants}
                            disabled={
                              colors.filter((c) => c.selected).length === 0 ||
                              sizes.filter((s) => s.selected).length === 0
                            }
                            className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold hover:shadow-xl hover:shadow-[#fda481]/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-5 h-5" />
                            Generate{" "}
                            {colors.filter((c) => c.selected).length *
                              sizes.filter((s) => s.selected).length}{" "}
                            Combinations
                          </button>

                          {formErrors.variants && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              {formErrors.variants}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Active Variants */}
                      {generatedVariants.length > 0 && (
                        <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                          <h3 className="text-lg font-bold text-white mb-4">
                            Active Variants ({generatedVariants.length})
                          </h3>

                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    IMAGE
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    VARIANT
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    PRICE
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    STOCK
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    ACTIONS
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {generatedVariants.map((variant, index) => (
                                  <tr
                                    key={variant.id}
                                    className="border-b border-white/5 hover:bg-white/5"
                                  >
                                    <td className="py-3 px-4">
                                      <label className="cursor-pointer">
                                        <div className="w-12 h-12 bg-[#0f1117] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors overflow-hidden">
                                          {variant.images.length > 0 ? (
                                            <img
                                              src={variant.images[0]}
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
                                            handleVariantImageUpload(index, e)
                                          }
                                        />
                                      </label>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full border border-white/20"
                                          style={{
                                            backgroundColor:
                                              variant.color_hex || "#666",
                                          }}
                                        />
                                        <span className="text-white font-medium">
                                          {variant.color_name} / {variant.size}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            index,
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
                                        value={variant.stock}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            index,
                                            "stock",
                                            parseInt(e.target.value) || 0,
                                          )
                                        }
                                        className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <button
                                        onClick={() =>
                                          handleDeleteVariant(index)
                                        }
                                        className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <p className="text-sm text-gray-400 mt-4">
                            * Click the image placeholder to upload
                            variant-specific images
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "seo" && (
                    <motion.div
                      key="seo"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          SEO Settings
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              SEO Title
                            </label>
                            <input
                              type="text"
                              value={seoTitle}
                              onChange={(e) => setSeoTitle(e.target.value)}
                              placeholder="Product SEO Title"
                              maxLength={60}
                              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {seoTitle.length}/60 characters
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Meta Description
                            </label>
                            <textarea
                              value={seoDescription}
                              onChange={(e) =>
                                setSeoDescription(e.target.value)
                              }
                              placeholder="Brief description for search engines..."
                              rows={4}
                              maxLength={160}
                              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {seoDescription.length}/160 characters
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              URL Slug
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-sm">
                                /products/
                              </span>
                              <input
                                type="text"
                                value={slug}
                                onChange={(e) =>
                                  setSlug(generateSlug(e.target.value))
                                }
                                placeholder="product-url-slug"
                                className="flex-1 bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Keywords (comma separated)
                            </label>
                            <input
                              type="text"
                              value={seoKeywords}
                              onChange={(e) => setSeoKeywords(e.target.value)}
                              placeholder="t-shirt, cotton, fashion, clothing"
                              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SEO Preview */}
                      <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Search Engine Preview
                        </h3>

                        <div className="bg-[#0f1117] border border-white/10 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            www.yourstore.com/products/{slug || "product-name"}
                          </div>
                          <div className="text-blue-500 text-lg font-medium mb-1">
                            {seoTitle || productName || "Your Product Title"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {seoDescription ||
                              description.substring(0, 160) ||
                              "Product description will appear here..."}
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
                  onClick={() => {
                    setShowAddProduct(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  {activeTab !== "seo" && (
                    <button
                      onClick={() => {
                        const currentIndex = tabs.findIndex(
                          (t) => t.id === activeTab,
                        );
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1].id);
                        }
                      }}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#fda481]/30 transition-all disabled:opacity-50"
                    >
                      Save & Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  {activeTab === "seo" && (
                    <button
                      onClick={saveProduct}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#fda481]/30 transition-all disabled:opacity-50"
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
