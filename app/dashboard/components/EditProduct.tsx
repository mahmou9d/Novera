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
  Lock,
} from "lucide-react";
import {
  ProductType,
  OrderStatus,
  ProductStatus,
  CustomerStatus,
  Product,
  Variant,
  TProduct,
} from "@/type/type";
import {
  useCreateProduct,
  useAddVariantsProduct,
  useAddImageVariantsProduct,
} from "@/hooks/useDashboard";
import { CreateProduct, AddVariants } from "@/type/type";
import { useGetProducts } from "@/hooks/useProducts";
import Image from "next/image";

interface ProductsPageProps {
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

type TabType = "general" | "variants";

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
  stock?: { [key: number]: string };
  images?: { [key: number]: string }; // 👈 للـ validation على صور الـ variants
}

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

export const EditProduct: React.FC<ProductsPageProps> = ({
  getStatusColor,
  getStatusIcon,
}) => {
  const [currentPage] = useState(1);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<Set<TabType>>(new Set());

  // Mutations
  const createProductMutation = useCreateProduct();
  const addVariantsMutation = useAddVariantsProduct();
  const addImageMutation = useAddImageVariantsProduct();

  // Get products
  const { data } = useGetProducts(currentPage);
  const products = data?.products || [];

  // Form states
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Variants state
  const [colors, setColors] = useState<ColorOption[]>(INITIAL_COLORS);
  const [sizes, setSizes] = useState<SizeOption[]>(INITIAL_SIZES);
  const [generatedVariants, setGeneratedVariants] = useState<Variant[]>([]);

  // Store created product ID and variant IDs
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [createdVariantIds, setCreatedVariantIds] = useState<number[]>([]);

  // Validation functions
  const validateGeneralTab = (): boolean => {
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
    } else if (description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVariantsTab = (): boolean => {
    const errors: FormErrors = { stock: {}, images: {} };

    if (generatedVariants.length === 0) {
      errors.variants = "Please generate at least one variant";
    } else {
      generatedVariants.forEach((variant, index) => {
        // Validate stock
        if (!variant.stock || variant.stock <= 0) {
          if (!errors.stock) errors.stock = {};
          errors.stock[index] = "Stock must be greater than 0";
        }

        // 👇 Validate images
        if (!variant.images || variant.images.length === 0) {
          if (!errors.images) errors.images = {};
          errors.images[index] = "Image is required";
        }
      });

      // Remove empty error objects
      if (errors.stock && Object.keys(errors.stock).length === 0) {
        delete errors.stock;
      }
      if (errors.images && Object.keys(errors.images).length === 0) {
        delete errors.images;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleColorToggle = (index: number) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, selected: !color.selected } : color,
      ),
    );
  };

  const handleSizeToggle = (index: number) => {
    setSizes((prev) =>
      prev.map((size, i) =>
        i === index ? { ...size, selected: !size.selected } : size,
      ),
    );
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
          stock: 1,
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
    setGeneratedVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );

    // Clear errors when user makes changes
    if (field === "stock" && formErrors.stock?.[index]) {
      const newStockErrors = { ...formErrors.stock };
      delete newStockErrors[index];
      setFormErrors({
        ...formErrors,
        stock:
          Object.keys(newStockErrors).length > 0 ? newStockErrors : undefined,
      });
    }
  };

  const handleDeleteVariant = (index: number) => {
    setGeneratedVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setGeneratedVariants((prev) =>
        prev.map((variant, i) =>
          i === index
            ? { ...variant, images: [reader.result as string] }
            : variant,
        ),
      );

      // 👇 Clear image error when user uploads
      if (formErrors.images?.[index]) {
        const newImageErrors = { ...formErrors.images };
        delete newImageErrors[index];
        setFormErrors({
          ...formErrors,
          images:
            Object.keys(newImageErrors).length > 0 ? newImageErrors : undefined,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const base64ToFile = async (
    base64: string,
    filename: string,
  ): Promise<File> => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleNext = async () => {
    if (activeTab === "general") {
      if (!validateGeneralTab()) return;

      setIsLoading(true);
      try {
        const productPayload: CreateProduct = {
          name: productName,
          description: description,
          material_composition: material,
          category: parseInt(category),
        };

        const productResponse =
          await createProductMutation.mutateAsync(productPayload);

        setCreatedProductId(productResponse.product_id);
        setCompletedTabs((prev) => new Set(prev).add("general"));
        setActiveTab("variants");
        setFormErrors({});
      } catch (error: any) {
        console.error("Error creating product:", error);

        if (error?.response?.data) {
          const errors = error.response.data;
          let errorMessage = "Failed to create product:\n";

          Object.keys(errors).forEach((key) => {
            if (Array.isArray(errors[key])) {
              errorMessage += `\n• ${key}: ${errors[key].join(", ")}`;
            } else {
              errorMessage += `\n• ${key}: ${errors[key]}`;
            }
          });

          alert(errorMessage);
        } else {
          alert(error?.message || "Failed to create product");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveProduct = async () => {
    if (!validateVariantsTab()) return;

    if (!createdProductId) {
      alert("Product ID not found. Please start over.");
      return;
    }

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      // Add variants
      const variantsPayload: AddVariants[] = generatedVariants.map(
        (variant) => ({
          id: variant.id,
          color_name: variant.color_name,
          color_hex: variant.color_hex,
          size: variant.size,
          price: variant.price,
          compare_at_price: variant.compare_at_price || "0.00",
          stock: variant.stock,
        }),
      );

      const variantsResponse = await addVariantsMutation.mutateAsync({
        payload: variantsPayload,
        product_id: createdProductId,
      });

      // Store variant IDs from response
      if (variantsResponse) {
        const variantIds = variantsResponse.map(
          (v: any) => v.id || v.variant_id,
        );
        setCreatedVariantIds(variantIds);

        // 👇 Upload variant images
        for (let i = 0; i < generatedVariants.length; i++) {
          const variant = generatedVariants[i];

          if (variant.images && variant.images.length > 0) {
            try {
              const imageFile = await base64ToFile(
                variant.images[0],
                `variant-${variantIds[i]}.jpg`,
              );

              const formData = new FormData();
              formData.append("img", imageFile);

              await addImageMutation.mutateAsync({
                payload: formData,
                variant_id: variantIds[i],
              });

              console.log(`✅ Image uploaded for variant ${variantIds[i]}`);
            } catch (imageError) {
              console.error(
                `❌ Failed to upload image for variant ${variantIds[i]}:`,
                imageError,
              );
            }
          }
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setShowAddProduct(false);
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setCategory("");
    setMaterial("");
    setDescription("");
    setGeneratedVariants([]);
    setFormErrors({});
    setColors(INITIAL_COLORS);
    setSizes(INITIAL_SIZES);
    setActiveTab("general");
    setSaveSuccess(false);
    setCompletedTabs(new Set());
    setCreatedProductId(null);
    setCreatedVariantIds([]);
  };

  const isTabAccessible = (tabId: TabType): boolean => {
    if (tabId === "general") return true;
    if (tabId === "variants") return completedTabs.has("general");
    return false;
  };

  const tabs = [
    { id: "general" as TabType, label: "General Info" },
    { id: "variants" as TabType, label: "Variants & Stock" },
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
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5  flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: TProduct, index: number) => {
          const imageSrc =
            typeof product.thumbnail === "string"
              ? product.thumbnail.replace("http://", "https://")
              : "/placeholder.jpg";
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50  cursor-pointer"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center text-4xl border border-white/10">
                  <Image
                    src={imageSrc}
                    alt={product?.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                {/* <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                  product.status,
                )}`}
              >
                {getStatusIcon(product.status)}
                {product.status}
              </span> */}
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

              {/* <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Stock</p>
                <p className="font-bold text-white text-lg">{product.}</p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Sold</p>
                <p className="font-bold text-white text-lg">{product.sold}</p>
              </div>
            </div> */}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#fda481]/20 hover:shadow-2xl hover:shadow-[#fda481]/30 "
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10  border border-white/10">
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
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
                  onClick={() => {
                    setShowAddProduct(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg "
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
                {tabs.map((tab) => {
                  const isAccessible = isTabAccessible(tab.id);
                  const isCompleted = completedTabs.has(tab.id);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => isAccessible && setActiveTab(tab.id)}
                      disabled={!isAccessible}
                      className={`px-6 py-4 text-sm font-semibold relative flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "text-white"
                          : isAccessible
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {!isAccessible && <Lock className="w-4 h-4" />}
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#fda481] to-[#b4182d]"
                        />
                      )}
                    </button>
                  );
                })}
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
                                <option value="1">T-Shirts</option>
                                <option value="2">Hoodies</option>
                                <option value="3">Pants</option>
                                <option value="4">Accessories</option>
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
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border  ${
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
                                  className={`px-6 py-2 rounded-lg border font-medium  ${
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
                            className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold hover:shadow-xl hover:shadow-[#fda481]/30  flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    IMAGE *
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    VARIANT
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    PRICE
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    COMPARE PRICE
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                                    STOCK *
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
                                      <div>
                                        <label className="cursor-pointer">
                                          <div
                                            className={`w-12 h-12 bg-[#0f1117] border rounded-lg flex items-center justify-center hover:bg-white/5 overflow-hidden ${
                                              formErrors.images?.[index]
                                                ? "border-red-500"
                                                : "border-white/10"
                                            }`}
                                          >
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
                                        {formErrors.images?.[index] && (
                                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            Required
                                          </div>
                                        )}
                                      </div>
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
                                        step="0.01"
                                        min="0"
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
                                        step="0.01"
                                        min="0"
                                        value={variant.compare_at_price}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            index,
                                            "compare_at_price",
                                            e.target.value,
                                          )
                                        }
                                        className="w-24 bg-[#0f1117] border border-white/10 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#fda481]/50"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <div>
                                        <input
                                          type="number"
                                          min="1"
                                          value={variant.stock}
                                          onChange={(e) =>
                                            handleVariantChange(
                                              index,
                                              "stock",
                                              parseInt(e.target.value) || 1,
                                            )
                                          }
                                          className={`w-24 bg-[#0f1117] border rounded px-3 py-1.5 text-white text-sm focus:outline-none ${
                                            formErrors.stock?.[index]
                                              ? "border-red-500 focus:border-red-500"
                                              : "border-white/10 focus:border-[#fda481]/50"
                                          }`}
                                        />
                                        {formErrors.stock?.[index] && (
                                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.stock[index]}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <button
                                        onClick={() =>
                                          handleDeleteVariant(index)
                                        }
                                        className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 "
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-400">
                              * Click the image placeholder to upload
                              variant-specific images
                            </p>
                            <p className="text-sm text-yellow-400 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>
                                Each variant must have an image and stock
                                greater than 0
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
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
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10  disabled:opacity-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  {activeTab === "general" && (
                    <button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#fda481]/30  disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Save & Next
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                  {activeTab === "variants" && (
                    <button
                      onClick={saveProduct}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#fda481]/30  disabled:opacity-50"
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
