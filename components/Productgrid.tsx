/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TProduct } from "@/type/type";
import { useAddToCart } from "@/hooks/useCart";
import { useGetWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import Notification from "./Notification";

interface ProductGridProps {
  products?: TProduct[];
}

const ProductGrid = ({ products = [] }: ProductGridProps) => {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { data: wishlistItems } = useGetWishlist();
  const { mutate: addToCartMutation } = useAddToCart();
  const { mutate: toggleWishlistMutation } = useToggleWishlist();

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  const handleProductClick = (productId: number): void => {
    router.push(`/products/${productId}`);
  };

  const addToWishlist = (e: React.MouseEvent, product: TProduct): void => {
    e.stopPropagation(); // Prevent navigation when clicking wishlist
    toggleWishlistMutation(product.id, {
      onSuccess: () => {
        const isWishlisted = wishlistItems?.some(
          (item) => item.id === product.id,
        );
        {
          isWishlisted
            ? showNotification(`${product.name} removed from wishlist!`)
            : showNotification(`${product.name} added to wishlist!`);
        }
      },
      onError: (error) => {
        console.error("Wishlist error:", error);
        showNotification(`Failed to add ${product.name} to wishlist!`, "error");
      },
    });
  };

  const addToCart = (e: React.MouseEvent, product: TProduct): void => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCartMutation(
      {
        variant_id: product.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          showNotification(`${product.name} added to cart!`);
        },
        onError: (error: any) => {
          console.error("Cart error:", error?.response?.data?.detail);
          showNotification(error?.response?.data?.detail, "error");
        },
      },
    );
  };

  // Handle empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          const imageSrc =
            typeof product.thumbnail === "string"
              ? product.thumbnail.replace("http://", "https://")
              : "/placeholder.jpg";
          const isWishlisted = wishlistItems?.some(
            (item) => item.id === product.id,
          );
          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full h-80 overflow-hidden bg-gray-100">
                <div>
                  <Image
                    src={imageSrc || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100  " />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  {product.category_name}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                  <button
                    onClick={(e) => addToWishlist(e, product)}
                    className="p-3 inline-flex items-center bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100  "
                  >
                    <Heart
                      size={20}
                      className={`  ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-red-500"
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => addToCart(e, product)}
                    className="inline-flex items-center bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100  "
                  >
                    <ShoppingBag size={20} className="text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 ">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = product.average_rating ?? 5;
                      const finalRating = rating === 0 ? 5 : rating;
                      return (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(finalRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    ({product.review_count || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${parseFloat(product.lowest_price || "0").toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">Lowest Price</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
