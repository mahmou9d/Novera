/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Lock,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
  useGetCartItems,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/useCart";
import { CartItem as APICartItem } from "@/type/type";
import IsLoading from "@/components/IsLoading";
import Notification from "@/components/Notification";
import {
  usePlaceOrder,
  useCreatePayPalOrder,
  useCreateStripeSession,
} from "@/hooks/usePayment";
import CheckoutForm, { CheckoutFormData } from "./Checkoutform";
import PaymentMethodModal from "./PaymentMethodModal";
import { useSearchParams } from "next/navigation";

// UI Types
interface CartItemUI {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  images: string[];
  colorName: string;
  colorHex: string | null;
  size: string;
  inStock: boolean;
  maxQuantity: number;
  originalPrice?: number;
}

interface Notification {
  message: string;
  type: "success" | "error";
}

// Helper function
const convertCartItemToUI = (item: APICartItem): CartItemUI => {
  const variant = item.variant || {};
  // const product = item.product || {};

  return {
    id: item.id,
    name: item?.name || "Product Name",
    brand: item?.category_name || "Brand",
    price: parseFloat(variant.price || "0"),
    quantity: item.quantity,
    images:
      variant.images && variant.images.length > 0
        ? variant.images
        : ["/placeholder-product.jpg"],
    colorName: variant.color_name || "N/A",
    colorHex: variant.color_hex || null,
    size: variant.size || "N/A",
    inStock: (variant.stock || 0) > 0,
    maxQuantity: variant.stock || 10,
    originalPrice: variant.compare_at_price
      ? parseFloat(variant.compare_at_price)
      : undefined,
  };
};

// Main Cart Page
const CartPage = () => {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>(
    {},
  );
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  // API Hooks
  const { data: apiCartItems = [], isLoading } = useGetCartItems();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  const placeOrderMutation = usePlaceOrder();
  const createPayPalOrderMutation = useCreatePayPalOrder();
  const createStripeSessionMutation = useCreateStripeSession();

console.log(apiCartItems, "mmmmmmmmmmmmm");
  const { subtotal, shipping, total } = useMemo(() => {
    const sub = apiCartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
    const ship = sub > 500 || sub === 0 ? 0 : 20.0;
    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [apiCartItems]);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

const handleUpdateQuantity = (id: number, delta: number) => {
  const item = apiCartItems.find((i) => i.id === id);
  if (!item) return;
  const newQty = item.quantity + delta;

  // لو بيحاول يزود فوق الـ stock المتاح
  if (delta > 0 && newQty >Number(item.variant?.stock)) {
    showNotification(
      `Maximum available quantity is ${item.variant?.stock}`,
      "error",
    );
    return;
  }

  if (newQty > 0) {
    updateQuantityMutation.mutate(
      { itemId: id, quantity: newQty },
      {
        onSuccess: () => showNotification("Quantity updated successfully"),
        onError: (error: any) => {
          // عرض رسالة الـ API لو في error
          const message =
            error?.response?.data?.message || "Failed to update quantity";
          showNotification(message, "error");
        },
      },
    );
  }
};

  const handleRemove = (id: number) => {
    removeItemMutation.mutate(id, {
      onSuccess: () => showNotification("Item removed from cart"),
      onError: () => showNotification("Error removing item", "error"),
    });
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCartMutation.mutate(undefined, {
        onSuccess: () => showNotification("Cart cleared successfully"),
        onError: () => showNotification("Failed to clear cart", "error"),
      });
    }
  };

  const handleCheckoutSubmit = (formData: CheckoutFormData) => {
    console.log("Checkout form data:", formData);

    placeOrderMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("Order placed successfully:", data);
        showNotification("Order placed successfully!", "success");

        // Store the order ID and show payment method selection
        if (data.order_id) {
          localStorage.setItem("order_id", data.order_id.toString());
          setCurrentOrderId(data.order_id);
          setShowCheckoutForm(false);
          setShowPaymentMethodModal(true);
        }
      },
      onError: (error: any) => {
        console.error("Place order failed:", error);
        const message =
          error?.response?.data?.message || "Failed to place order";
        showNotification(message, "error");
      },
    });
  };

  const handlePayPalPayment = () => {
    if (!currentOrderId) return;

    createPayPalOrderMutation.mutate(currentOrderId, {
      onSuccess: (data) => {
        console.log("PayPal order created:", data);
        showNotification("Redirecting to PayPal...", "success");

        const approveLink = data?.links?.find(
          (link: any) => link.rel === "approve",
        );

        if (approveLink?.href) {
          // ✅ تحويل href إلى URL
          const url = new URL(approveLink.href);

          // ✅ استخراج token
          const token = url.searchParams.get("token");

          if (token) {
            localStorage.setItem("token", token);
          }

          // ✅ التحويل إلى PayPal
          window.location.href = approveLink.href;
        } else if (data?.links?.length > 0) {
          // fallback
          window.location.href = data.links[0].href;
        }
      },

      onError: (error: any) => {
        console.error("PayPal payment failed:", error);

        const message =
          error?.response?.data?.message || "Failed to create PayPal payment";

        showNotification(message, "error");
        setShowPaymentMethodModal(false);
      },
    });
  };

  const handleStripePayment = () => {
    if (!currentOrderId) return;

    createStripeSessionMutation.mutate(currentOrderId, {
      onSuccess: (data) => {
        console.log("Stripe session created:", data);
        showNotification("Redirecting to Stripe...", "success");

        if (data.url) {
          window.location.href = data.url;
        }
      },
      onError: (error: any) => {
        console.error("Stripe payment failed:", error);
        const message =
          error?.response?.data?.message || "Failed to create Stripe payment";
        showNotification(message, "error");
        setShowPaymentMethodModal(false);
      },
    });
  };

  // const nextImage = (itemId: number, totalImages: number) => {
  //   setImageIndexes((prev) => ({
  //     ...prev,
  //     [itemId]: ((prev[itemId] || 0) + 1) % totalImages,
  //   }));
  // };

  // const prevImage = (itemId: number, totalImages: number) => {
  //   setImageIndexes((prev) => ({
  //     ...prev,
  //     [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages,
  //   }));
  // };

  // const setImageIndex = (itemId: number, index: number) => {
  //   setImageIndexes((prev) => ({
  //     ...prev,
  //     [itemId]: index,
  //   }));
  // };

  if (isLoading) return <IsLoading />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Notification Toast */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <CheckoutForm
          onClose={() => setShowCheckoutForm(false)}
          onSubmit={handleCheckoutSubmit}
          isSubmitting={placeOrderMutation.isPending}
          totalAmount={total}
        />
      )}

      {/* Payment Method Selection Modal */}
      {showPaymentMethodModal && (
        <PaymentMethodModal
          onClose={() => setShowPaymentMethodModal(false)}
          onSelectPayPal={handlePayPalPayment}
          onSelectStripe={handleStripePayment}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
              <div className="bg-[#fca481] p-2 rounded-xl">
                <ShoppingCart size={32} className="text-white" />
              </div>
              Your Cart
            </h1>
            <p className="text-gray-600 mt-2 ml-1">
              You have {apiCartItems.length} items in your bag
            </p>
          </div>
          {apiCartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl"
            >
              Clear Cart
            </button>
          )}
        </div>

        {apiCartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Items List */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {apiCartItems.map((item, idx) => {
                  const currentImageIndex = imageIndexes[item.id] || 0;
console.log(item)
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 shadow-sm border-2 border-gray-100 hover:border-[#fca481] mb-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image Gallery */}
                        <div className="relative w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 group">
                          <div
                            key={currentImageIndex}
                            className="relative w-full h-full"
                          >
                            <Image
                              src={
                                String(item?.variant?.images[0]).length === 0
                                  ? "/placeholder.jpg"
                                  : String(item?.variant?.images[0])
                              }
                              alt={`${item.variant?.product_name} - Image ${currentImageIndex + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>

                          {/* Navigation Buttons */}
                          {String(item?.variant?.images[0]).length > 1 && (
                            <>
                              {/* <button
                                onClick={() =>
                                  prevImage(
                                    item.id,
                                    String(item?.variant?.images[0]).length,
                                  )
                                }
                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100  shadow-md"
                              >
                                <ChevronLeft
                                  size={16}
                                  className="text-gray-700"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  nextImage(
                                    item.id,
                                    String(item?.variant?.images[0]).length,
                                  )
                                }
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100  shadow-md"
                              >
                                <ChevronRight
                                  size={16}
                                  className="text-gray-700"
                                />
                              </button> */}

                              {/* Image Indicators */}
                              {/* <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {item?.variant?.images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      setImageIndex(item.id, index)
                                    }
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      index === currentImageIndex
                                        ? "bg-[#fca481] w-3"
                                        : "bg-white/60 hover:bg-white"
                                    }`}
                                  />
                                ))}
                              </div> */}
                            </>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold text-[#fca481] uppercase">
                                {item.variant?.category_name}
                              </span>
                              <h3 className="text-base font-bold text-gray-900 leading-tight mt-1">
                                {item.variant?.product_name}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  Size:{" "}
                                  <b className="text-gray-900">
                                    {item.variant?.size}
                                  </b>
                                </span>
                                <span className="flex items-center gap-1">
                                  Color:
                                  <b className="text-gray-900">
                                    {item.variant?.color_name}
                                  </b>
                                </span>
                              </div>
                              {String(item?.variant?.images).length > 1 && (
                                <span className="text-xs text-gray-400 mt-1 inline-block">
                                  {item.variant?.images.length} photos
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.id, -1)
                                }
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-[#fca481] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600   ${
                                  item.quantity >= Number(item.variant?.stock)
                                    ? ""
                                    : "hover:bg-[#fca481] hover:text-white"
                                }`}
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="text-right">
                              {item.variant?.compare_at_price && (
                                <span className="text-sm text-gray-400 line-through block">
                                  $
                                  {(
                                    Number(item?.variant?.compare_at_price) *
                                    item.quantity
                                  ).toFixed(2)}
                                </span>
                              )}
                              <span className="text-xl font-black text-gray-900">
                                $
                                {(
                                  Number(item?.variant?.price) * item.quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-900">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-[#fca481] font-bold"
                          : "text-gray-900 font-bold"
                      }
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-black text-[#fca481]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-[#fca481] hover:bg-[#fb8c5f] text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 mb-6"
                >
                  <Lock size={20} />
                  Checkout Now
                </button>

                <div className="space-y-3 border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="bg-green-50 p-1.5 rounded-lg">
                      <Shield size={16} className="text-green-600" />
                    </div>
                    Secure SSL encrypted payment
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="bg-[#fca481]/10 p-1.5 rounded-lg">
                      <Truck size={16} className="text-[#fca481]" />
                    </div>
                    Free delivery for orders over $500
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-gray-100">
            <div className="w-24 h-24 bg-[#fca481]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="text-[#fca481]" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <button className="bg-[#fca481] hover:bg-[#fb8c5f] text-white px-10 py-4 rounded-xl font-bold">
              Explore Products
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
