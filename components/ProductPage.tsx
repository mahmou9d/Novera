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
import {
  ErrorResponse,
  NotificationState,
  ProductPageProps,
  TProduct,
} from "@/type/type";
import { AxiosError } from "axios";
import { useAddReview, useGetReviews } from "@/hooks/useReviews"; // غير المسار لو لازم
import { useAuth } from "@/hooks/useAuth";

const ProductPage = ({ productId }: ProductPageProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  // Review state
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch data
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetSingleProduct(Number(productId));
  const { data: wishlistItems } = useGetWishlist();
  const { data: reviews } = useGetReviews(Number(productId));
  // Mutations
  const { mutate: addToCartMutation, isPending: isAddingToCart } =
    useAddToCart();
  const { mutate: toggleWishlistMutation, isPending: isTogglingWishlist } =
    useToggleWishlist();
  const { mutate: addReview, isPending: isSubmittingReview } = useAddReview();

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
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [],
  );

  const addToCart = () => {
    if (!selectedVariant) return;
    addToCartMutation(
      { variant_id: Number(selectedVariant?.id), quantity: quantity },
      {
        onSuccess: () => {
          showNotification(`${product?.name} added to cart!`);
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 3000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
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
        isWishlisted
          ? showNotification(`${product.name} removed from wishlist!`)
          : showNotification(`${product.name} added to wishlist!`);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(error?.response?.data?.error as string, "error");
      },
    });
  };

  const handleReviewSubmit = () => {
    console.log("Number:", Number(productId));
    if (!reviewRating || !reviewText.trim()) return;
    addReview(
      {
        product: Number(product?.id),
        rating: reviewRating,
        comment: reviewText.trim(),
      },
      {
        onSuccess: () => {
          setReviewSubmitted(true);
          setReviewText("");
          setReviewRating(0);
          showNotification("Review submitted successfully!");
          setTimeout(() => setReviewSubmitted(false), 4000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.non_field_errors ||
              "Failed to submit review",
            "error",
          );
        },
      },
    );
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

  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const hasPurchased = true;

  // Loading State
  if (isLoading) return <IsLoading />;

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
              className="bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white px-8 py-3 rounded-full hover:shadow-xl inline-flex items-center gap-2 hover:from-[#fd9166] hover:to-[#fca481]"
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
            className="hover:text-[#fca481]"
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
          {/* Product Images */}
          <div className="space-y-4">
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
                  className={`object-cover ${showImageZoom ? "scale-110" : "scale-100"}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white rounded-xl overflow-hidden aspect-square relative border-2 shadow-md ${
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

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wider shadow-md">
              <Award size={14} />
              {product.category}
            </div>

            {/* Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating — connected to real reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        averageRating && i < Math.round(Number(averageRating))
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-1">
                  {averageRating ?? "0.0"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({reviews?.length || 0}{" "}
                {reviews?.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
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

            {/* Color Selection */}
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
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium shadow-sm ${
                      selectedVariant.size === option.size
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

            {/* Size Selection */}
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
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium shadow-sm min-w-[60px] ${
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

            {/* Stock Status */}
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
                  <Check size={16} /> In Stock
                </>
              ) : selectedVariant.stock > 0 ? (
                <>
                  <Package size={16} /> Only {selectedVariant.stock} left
                </>
              ) : (
                "Out of Stock"
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center gap-0 bg-white border-2 border-[#fca481] border-opacity-30 rounded-xl shadow-sm hover:border-opacity-60">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 rounded-l-xl text-[#fca481]"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 font-bold text-gray-900 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    if (quantity >= Number(selectedVariant.stock)) return;
                    setQuantity(quantity + 1);
                  }}
                  className="p-3 rounded-r-xl text-[#fca481]"
                >
                  <Plus size={16} />
                </button>
              </div>
              {quantity >= Number(selectedVariant.stock) && (
                <span className="text-sm text-orange-500 font-medium">
                  Max stock reached
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={addToCart}
                disabled={selectedVariant.stock === 0 || isAddingToCart}
                className="flex-1 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white py-4 rounded-xl font-semibold hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:from-[#fd9166] hover:to-[#fca481]"
              >
                {addedToCart ? (
                  <>
                    <Check size={20} /> Added to Cart!
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
                className="border-2 border-gray-300 bg-white rounded-xl px-5 hover:border-[#fca481] hover:bg-[#fef5f1] disabled:opacity-50 shadow-md"
              >
                <Heart
                  size={24}
                  className={
                    isInWishlist
                      ? "fill-[#fca481] text-[#fca481] scale-110"
                      : "text-gray-600"
                  }
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-gray-100">
              {[
                { icon: Truck, title: "Free Shipping", sub: "On orders $50+" },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  sub: "Within 30 days",
                },
                { icon: Shield, title: "Secure Pay", sub: "100% Protected" },
              ].map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="text-center p-4 bg-gradient-to-br from-[#fef5f1] to-white rounded-xl border border-[#fca481] border-opacity-20 shadow-sm hover:shadow-md"
                >
                  <Icon className="mx-auto mb-3 text-[#fca481]" size={28} />
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {title}
                  </p>
                  <p className="text-xs text-gray-600">{sub}</p>
                </div>
              ))}
            </div>
            {/* Payment Methods */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                We accept:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Stripe */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                    alt="Stripe"
                    className="h-4 w-auto"
                  />
                </div>
                {/* PayPal */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-4 w-auto"
                  />
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-4 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={20} className="text-[#fca481]" />
                Product Details
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gradient-to-br from-[#fef5f1] to-white p-4 rounded-xl border border-[#fca481] border-opacity-20">
                {product.description}
              </p>
              {product.material_composition && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#fca481] hover:border-opacity-40">
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

      {/* ─── Reviews Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Reviews List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#fca481] fill-[#fca481]" />
                Customer Reviews
              </h2>
              {averageRating && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                  <span className="text-xl font-bold text-amber-600">
                    {averageRating}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(Number(averageRating))
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({reviews?.length})
                  </span>
                </div>
              )}
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#fca481]/20 transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#fca481] to-[#fd9166] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fca481] to-[#fd9166] flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {review.customer_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">
                            {review.customer_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            className={
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed pl-1">
                        {`"${review.comment}"`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 bg-gradient-to-br from-[#fef9f6] to-white rounded-2xl border border-dashed border-[#fca481]/30 text-center">
                <div className="w-16 h-16 bg-[#fef5f1] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <Star size={28} className="text-[#fca481]" />
                </div>
                <p className="font-semibold text-gray-700 text-base">
                  No reviews yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {hasPurchased ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Award size={18} className="text-[#fca481]" />
                    Write a Review
                  </h3>
                  <p className="text-xs text-gray-400 mb-5">
                    Share your experience with this product
                  </p>

                  {/* Star Picker */}
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setReviewRating(star)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={`transition-colors duration-150 ${
                              star <= (hoveredStar || reviewRating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                      {reviewRating > 0 && (
                        <span className="ml-2 text-sm font-medium text-amber-500">
                          {
                            [
                              "",
                              "Poor",
                              "Fair",
                              "Good",
                              "Very Good",
                              "Excellent",
                            ][reviewRating]
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell us what you think about the product..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 text-sm text-gray-800 bg-[#fef9f6] border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-[#fca481] focus:ring-2 focus:ring-[#fca481]/20 placeholder-gray-400 transition-all"
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">
                      {reviewText.length}/500
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleReviewSubmit}
                    disabled={
                      !reviewRating || !reviewText.trim() || isSubmittingReview
                    }
                    className="w-full py-3.5 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-[#fd9166] hover:to-[#fca481] disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : reviewSubmitted ? (
                      <>
                        <Check size={18} /> Review Submitted!
                      </>
                    ) : (
                      <>
                        <Star size={18} /> Submit Review
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#fef9f6] to-white rounded-2xl p-6 border border-dashed border-[#fca481]/30 text-center">
                  <div className="w-14 h-14 bg-[#fef5f1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <ShoppingCart size={24} className="text-[#fca481]" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Purchase to Review
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Only verified buyers can leave reviews for this product.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPage;
