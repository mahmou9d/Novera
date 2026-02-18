"use client";

import { useState, useCallback } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useGetWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { ErrorResponse, TProduct } from "@/type/type";
import Notification from "@/components/Notification";
import IsLoading from "@/components/IsLoading";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const WishlistPage = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { data: wishlistItems = [], isLoading, isError } = useGetWishlist();
  const toggleWishlistMutation = useToggleWishlist();
  const addToCartMutation = useAddToCart();

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  const removeItem = useCallback(
    (id: number): void => {
      toggleWishlistMutation.mutate(id, {
        onSuccess: () => {
          showNotification("Item removed from wishlist");
        },
        onError: (error:AxiosError<ErrorResponse>) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Failed to remove item";
          showNotification(errorMessage, "error");
        },
      });
    },
    [toggleWishlistMutation, showNotification],
  );

  const addToCart = useCallback(
    (item: TProduct): void => {
      addToCartMutation.mutate(
        {
          variant_id: Number(item.id),
          quantity: 1,
          size: "default",
        },
        {
          onSuccess: () => {
            showNotification(`${item.name} added to cart!`);
          },
          onError: (error: AxiosError<ErrorResponse>) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              error?.message ||
              "Failed to add to cart";
            showNotification(errorMessage, "error");
          },
        },
      );
    },
    [addToCartMutation, showNotification],
  );

  if (isLoading) {
    return (
      <>
        <IsLoading />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border-2 border-gray-100 max-w-md">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Error Loading Wishlist
            </h2>
            <p className="text-gray-500 mb-6">
              Failed to load your wishlist. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-xl bg-[#fca481] hover:bg-[#fb8c5f] text-white font-bold "
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Notification Toast */}
        {notification && (
          <Notification
            message={notification?.message}
            type={notification?.type}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                <div className="bg-[#fca481] p-2 rounded-xl relative">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#fca481] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#fca481]">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2 ml-1">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="bg-white rounded-2xl p-5 shadow-sm border-2 border-gray-100 hover:border-[#fca481] cursor-pointer transition-all"
                >
                  <div className="flex gap-5">
                    {/* Image */}
                    <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <Image
                        src={item.thumbnail || "/images/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(Number(item.average_rating))
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {item.average_rating}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-2xl font-black text-gray-900">
                            ${item.lowest_price}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="flex-1 bg-[#fca481] hover:bg-[#fb8c5f] text-white py-2.5 rounded-xl font-bold text-sm  flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(Number(item.id));
                          }}
                          className="px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-500 "
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-gray-100">
              <div className="w-24 h-24 bg-[#fca481]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-[#fca481]" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start adding items you love and we&apos;ll keep them safe here
                for you!
              </p>
              <button
                onClick={() => router.push("/products")}
                className="bg-[#fca481] hover:bg-[#fb8c5f] text-white px-10 py-4 rounded-xl font-bold  inline-flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
