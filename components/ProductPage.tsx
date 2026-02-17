"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  RotateCcw,
  Check,
  ChevronRight,
  Package,
  Award,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetSingleProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGetWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import IsLoading from "./IsLoading";
import Notification from "./Notification";
import { ErrorResponse, NotificationState, ProductPageProps, TProduct } from "@/type/type";
import { AxiosError } from "axios";



const ProductPage = ({ productId }: ProductPageProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  // Fetch data
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetSingleProduct(Number(productId));
  const { data: wishlistItems } = useGetWishlist();

  // Mutations
  const { mutate: addToCartMutation, isPending: isAddingToCart } =
    useAddToCart();
  const { mutate: toggleWishlistMutation, isPending: isTogglingWishlist } =
    useToggleWishlist();

  // Get selected variant
  const selectedVariant =
    product?.variants?.find((v) => v.id === selectedVariantId) ||
    (product?.variants ?? [])[0];

  // Auto-select first variant
  useEffect(() => {
    if (
      product &&
      !selectedVariantId &&
      (product?.variants?.length as number) > 0
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedVariantId((product?.variants ?? [])[0]?.id as number);
    }
  }, [product, selectedVariantId]);

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
    setSelectedImage(0);
  };
  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      console.log("Showing notification:", message, type);
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [],
  );
  const addToCart = () => {
    if (!selectedVariant) return;
    addToCartMutation(
      {
        variant_id: selectedVariant.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          showNotification(`${product?.name} added to cart!`);
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 3000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          console.error("Cart error:", error?.response?.data?.detail);
          showNotification(
            error?.response?.data?.error ||
              error?.response?.data?.detail ||
              error?.message ||
              "Something went wrong",
            "error",
          );
        },
      },
    );
  };

  const addToWishlist = () => {
    if (!product) return;
    toggleWishlistMutation(Number(product.id), {
      onSuccess: () => {
        const isWishlisted = wishlistItems?.some(
          (item) => item.id === product.id,
        );
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          isWishlisted
            ? showNotification(`${product.name} removed from wishlist!`)
            : showNotification(`${product.name} added to wishlist!`);
        }
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        console.error("Wishlist error:", error?.response?.data.error);
        showNotification(error?.response?.data?.error as string, "error");
      },
    });
  };

  // Get unique colors and sizes
  const availableColors = product
    ? Array.from(
        new Map(product.variants?.map((v) => [v.color_name, v])).values(),
      )
    : [];

  const availableSizes =
    product && selectedVariant
      ? product?.variants?.filter(
          (v) => v.color_name === selectedVariant.color_name,
        )
      : [];

  const discount = selectedVariant?.is_on_sale
    ? Math.round(
        ((parseFloat(selectedVariant.compare_at_price) -
          parseFloat(selectedVariant.price)) /
          parseFloat(selectedVariant.compare_at_price)) *
          100,
      )
    : 0;

  const productImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : ["/placeholder.jpg"];

  const isInWishlist = wishlistItems?.some(
    (item: TProduct) => item.id === product?.id,
  );

  // Loading State
  if (isLoading) {
    return <IsLoading />;
  }

  // Error State
  if (isError || !product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-[#fef5f1]">
        <Header />

        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              {error?.message ||
                "The product you're looking for is unavailable"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white px-8 py-3 rounded-full hover:shadow-xl  inline-flex items-center gap-2 hover:from-[#fd9166] hover:to-[#fca481]"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-[#fef5f1]">
      <Header />
      {/* Notification Toast */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#fca481] "
          >
            Home
          </button>
          <ChevronRight size={16} />
          <span className="text-gray-400">{product.category}</span>
          <ChevronRight size={16} />
          <span className="text-[#fca481] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images - Enhanced */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="bg-white rounded-2xl overflow-hidden aspect-square relative shadow-xl border border-gray-100">
              {selectedVariant.is_on_sale && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold z-10 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} />
                    {discount}% OFF
                  </div>
                </div>
              )}

              <div key={selectedImage} className="relative w-full h-full">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name as string}
                  fill
                  className={`object-cover   ${
                    showImageZoom ? "scale-110" : "scale-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Thumbnails - Enhanced */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white rounded-xl overflow-hidden aspect-square relative border-2  shadow-md ${
                      selectedImage === index
                        ? "border-[#fca481] ring-2 ring-[#fca481] ring-offset-2"
                        : "border-gray-200 hover:border-[#fca481] hover:border-opacity-50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Enhanced */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wider shadow-md">
              <Award size={14} />
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating - Enhanced */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < 4
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-1">
                  4.0
                </span>
              </div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>

            {/* Price - Enhanced */}
            <div className="flex items-baseline gap-4 pb-6 border-b-2 border-gray-100">
              <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ${selectedVariant.price}
              </span>
              {selectedVariant.is_on_sale && (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-gray-400 line-through">
                    ${selectedVariant.compare_at_price}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    Save $
                    {(
                      parseFloat(selectedVariant.compare_at_price) -
                      parseFloat(selectedVariant.price)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Color Selection - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Color
                </label>
                <span className="text-sm text-[#fca481] bg-[#fef5f1] px-3 py-1 rounded-full font-medium border border-[#fca481] border-opacity-20">
                  {selectedVariant.color_name}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVariantChange(option.id)}
                    disabled={option.stock === 0}
                    className={`px-5 py-2.5 rounded-xl border-2  text-sm font-medium shadow-sm ${
                      selectedVariant.id === option.id
                        ? "border-[#fca481] bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white shadow-lg ring-2 ring-[#fca481] ring-opacity-30"
                        : option.stock === 0
                          ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                          : "border-gray-300 hover:border-[#fca481] bg-white hover:shadow-md"
                    }`}
                  >
                    {option.color_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Size
                </label>
                <span className="text-sm text-[#fca481] bg-[#fef5f1] px-3 py-1 rounded-full font-medium border border-[#fca481] border-opacity-20">
                  {selectedVariant.size}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableSizes?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVariantChange(option.id)}
                    disabled={option.stock === 0}
                    className={`px-5 py-2.5 rounded-xl border-2  text-sm font-medium shadow-sm min-w-[60px] ${
                      selectedVariant.id === option.id
                        ? "border-[#fca481] bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white shadow-lg ring-2 ring-[#fca481] ring-opacity-30"
                        : option.stock === 0
                          ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                          : "border-gray-300 hover:border-[#fca481] bg-white hover:shadow-md"
                    }`}
                  >
                    {option.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status - Enhanced */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                selectedVariant.stock > 10
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : selectedVariant.stock > 0
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {selectedVariant.stock > 10 ? (
                <>
                  <Check size={16} />
                  In Stock
                </>
              ) : selectedVariant.stock > 0 ? (
                <>
                  <Package size={16} />
                  Only {selectedVariant.stock} left
                </>
              ) : (
                "Out of Stock"
              )}
            </div>

            {/* Quantity Selector - Enhanced */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center gap-0 bg-white border-2 border-[#fca481] border-opacity-30 rounded-xl shadow-sm hover:border-opacity-60 ">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3   rounded-l-xl text-[#fca481]"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 font-bold text-gray-900 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                  }
                  className={`p-3   rounded-r-xl text-[#fca481] ${
                    quantity >= Number(selectedVariant.stock)
                      ? ""
                      : "hover:bg-[#fca481] hover:text-white"
                  }`}
                  disabled={quantity >= selectedVariant.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={addToCart}
                disabled={selectedVariant.stock === 0 || isAddingToCart}
                className="flex-1 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white py-4 rounded-xl font-semibold hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed  flex items-center justify-center gap-3 shadow-lg hover:from-[#fd9166] hover:to-[#fca481]"
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {isAddingToCart
                      ? "Adding..."
                      : selectedVariant.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </>
                )}
              </button>

              <button
                onClick={addToWishlist}
                disabled={isTogglingWishlist}
                className="border-2 border-gray-300 bg-white rounded-xl px-5 hover:border-[#fca481] hover:bg-[#fef5f1]  disabled:opacity-50 shadow-md"
              >
                <Heart
                  size={24}
                  className={`  ${
                    isInWishlist
                      ? "fill-[#fca481] text-[#fca481] scale-110"
                      : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            {/* Features - Enhanced */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-gray-100">
              <div className="text-center p-4 bg-gradient-to-br from-[#fef5f1] to-white rounded-xl border border-[#fca481] border-opacity-20 shadow-sm hover:shadow-md">
                <Truck className="mx-auto mb-3 text-[#fca481]" size={28} />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-600">On orders $50+</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#fef5f1] to-white rounded-xl border border-[#fca481] border-opacity-20 shadow-sm hover:shadow-md">
                <RotateCcw className="mx-auto mb-3 text-[#fca481]" size={28} />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">Within 30 days</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#fef5f1] to-white rounded-xl border border-[#fca481] border-opacity-20 shadow-sm hover:shadow-md">
                <Shield className="mx-auto mb-3 text-[#fca481]" size={28} />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Secure Pay
                </p>
                <p className="text-xs text-gray-600">100% Protected</p>
              </div>
            </div>

            {/* Description - Enhanced */}
            <div className="space-y-4 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={20} className="text-[#fca481]" />
                Product Details
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gradient-to-br from-[#fef5f1] to-white p-4 rounded-xl border border-[#fca481] border-opacity-20">
                {product.description}
              </p>
              {product.material_composition && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#fca481] hover:border-opacity-40 ">
                  <span className="font-semibold text-gray-900">
                    Material:{" "}
                  </span>
                  <span className="text-gray-700">
                    {product.material_composition}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
