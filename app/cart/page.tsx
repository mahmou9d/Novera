"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
  Lock,
  Truck,
  Shield,
  X,
  Gift,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

// Types
interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  colors: string[];
  size: string;
  inStock: boolean;
  maxQuantity: number;
  rating?: number;
  originalPrice?: number;
}

interface Notification {
  message: string;
  type: "success" | "error";
}

// Initial cart data
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    brand: "SONIC ELITE",
    price: 299.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    colors: ["#000000", "#1a1a1a", "#2d2d2d"],
    size: "One Size",
    inStock: true,
    maxQuantity: 5,
  },
  {
    id: 2,
    name: "Minimalist Leather Wallet",
    brand: "CRAFT & CO",
    price: 89.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    colors: ["#8B4513", "#654321", "#3E2723"],
    size: "Standard",
    inStock: true,
    maxQuantity: 10,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    brand: "TECH SPORT",
    price: 449.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    colors: ["#000000", "#4169E1", "#DC143C"],
    size: "42mm",
    inStock: true,
    maxQuantity: 3,
  },
];

// Memoized CartItem Component
const CartItemCard = memo<{
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onQuickView: (item: CartItem) => void;
}>(({ item, onUpdateQuantity, onRemove, onQuickView }) => (
  <div className="cart-item glass-dark rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl border border-[#37415C]/10">
    <div className="p-6">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden group">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="144px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#B4182D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(item)}
            className="absolute top-3 right-3 backdrop-blur-sm bg-white/90 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out shadow-lg hover:bg-[#B4182D] hover:text-white hover:scale-110"
            aria-label="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#B4182D]">
                  {item.brand}
                </p>
                <h3 className="text-xl font-bold mb-2 text-[#181A2F]">
                  {item.name}
                </h3>
                <p className="text-sm text-[#37415C]">Size: {item.size}</p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 hover:bg-red-50 rounded-xl transition-all duration-300 group smooth-scale-button"
                aria-label="Remove item"
              >
                <Trash2
                  size={20}
                  className="text-[#37415C] group-hover:text-[#B4182D] transition-colors duration-300"
                />
              </button>
            </div>

            {/* Color Options */}
            {item.colors?.length > 0 && (
              <div className="flex gap-2 mb-4">
                {item.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-[#37415C]/20 hover:border-[#FDA481] cursor-pointer shadow-md smooth-scale-small"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                className="w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold border border-[#FDA481] bg-[#FDA481]/15 text-[#B4182D] hover:bg-[#FDA481]/30 disabled:border-[#37415C]/20 disabled:bg-[#37415C]/10 disabled:text-[#37415C] smooth-scale-button"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-bold text-xl text-[#B4182D]">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                disabled={item.quantity >= item.maxQuantity}
                className="w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold border border-[#FDA481] bg-[#FDA481]/15 text-[#B4182D] hover:bg-[#FDA481]/30 disabled:border-[#37415C]/20 disabled:bg-[#37415C]/10 disabled:text-[#37415C] smooth-scale-button"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-3xl font-black bg-linear-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-sm text-[#37415C]">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

CartItemCard.displayName = "CartItemCard";

// Empty Cart Component
const EmptyCart = memo(() => (
  <div className="glass-dark rounded-3xl p-20 text-center animate-scale-in shadow-xl">
    <div className="relative inline-block mb-8">
      <div className="absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse bg-[#B4182D]" />
      <ShoppingCart
        className="w-32 h-32 mx-auto relative text-[#37415C]"
        strokeWidth={1}
      />
    </div>
    <h2 className="text-4xl font-bold mb-4 text-[#181A2F]">
      Your cart is empty
    </h2>
    <p className="text-lg mb-10 text-[#242E49]">
      Add some items to get started!
    </p>
    <button className="cyber-button px-12 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl inline-flex items-center gap-3 glow-crimson bg-linear-to-r from-[#B4182D] to-[#54162B] smooth-scale">
      <Sparkles size={20} />
      Start Shopping
    </button>
  </div>
));

EmptyCart.displayName = "EmptyCart";

// Trust Badge Component
const TrustBadge = memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}>(({ icon, title, description, gradient }) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg smooth-scale-button ${gradient}`}
    >
      {icon}
    </div>
    <div>
      <p className="font-bold text-[#181A2F]">{title}</p>
      <p className="text-sm text-[#37415C]">{description}</p>
    </div>
  </div>
));

TrustBadge.displayName = "TrustBadge";

// Quick View Modal
const QuickViewModal = memo<{
  item: CartItem;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}>(({ item, onClose, onAddToCart }) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-[#181A2F]">Quick View</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-[#242E49] hover:bg-[#37415C]/10 transition-all duration-300 smooth-scale-button hover:rotate-90"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 rounded-2xl overflow-hidden group">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover shadow-lg smooth-scale-image"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#B4182D]">
            {item.brand}
          </p>
          <h3 className="text-3xl font-bold mb-4 text-[#181A2F]">
            {item.name}
          </h3>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold bg-linear-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent">
              ${item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xl line-through text-[#37415C]">
                ${item.originalPrice}
              </span>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {item.rating && (
              <div className="flex items-center gap-2">
                <span className="text-[#242E49]">Rating:</span>
                <span className="font-bold text-amber-500">
                  {item.rating} ★
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[#242E49]">Availability:</span>
              <span
                className={`font-bold ${
                  item.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#242E49]">Size:</span>
              <span className="font-bold text-[#181A2F]">{item.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#242E49]">Colors:</span>
              <div className="flex gap-2">
                {item.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-[#37415C]/30 cursor-pointer smooth-scale-small"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl ${
              !item.inStock && "cursor-not-allowed opacity-50"
            } ${
              item.inStock
                ? "bg-linear-to-r from-[#B4182D] to-[#54162B] text-white smooth-scale hover:shadow-[0_15px_30px_rgba(180,24,45,0.3)]"
                : "bg-[#37415C]/20 text-[#37415C]"
            }`}
          >
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  </div>
));

QuickViewModal.displayName = "QuickViewModal";

// Main CartPage Component
const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Memoized calculations
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 15.99;
    const tax = subtotal * 0.08;

    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const updateQuantity = useCallback((id: number, delta: number): void => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(
            1,
            Math.min(item.maxQuantity, item.quantity + delta)
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, []);

  const removeItem = useCallback(
    (id: number): void => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      showNotification("Item removed from cart", "success");
    },
    [showNotification]
  );

  const handleQuickView = useCallback((item: CartItem) => {
    setSelectedItem(item);
  }, []);

  const addToCart = useCallback(
    (item: CartItem): void => {
      showNotification(`${item.name} added to cart!`, "success");
      setSelectedItem(null);
    },
    [showNotification]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50 relative overflow-hidden">
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
            <div
              className={`glass-dark px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
                notification.type === "error"
                  ? "border-[#B4182D]/30"
                  : "border-green-500/30"
              }`}
            >
              {notification.type === "error" ? (
                <AlertCircle className="shrink-0 text-[#B4182D]" size={24} />
              ) : (
                <Check className="text-green-600 shrink-0" size={24} />
              )}
              <p className="font-semibold text-[#181A2F]">
                {notification.message}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse bg-[#B4182D]" />
                  <div className="relative p-4 rounded-2xl bg-linear-to-br from-[#B4182D] to-[#54162B]">
                    <ShoppingCart
                      className="w-10 h-10 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  {cartItems.length > 0 && (
                    <div className="absolute -top-2 -right-2 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg pulse-dot bg-linear-to-br from-[#FDA481] to-[#B4182D]">
                      {cartItems.length}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-5xl p-2 font-black bg-linear-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      onQuickView={handleQuickView}
                    />
                  ))}

                  {/* Action Buttons */}
                  <div className="glass-dark rounded-3xl p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <button className="flex items-center gap-2 font-semibold text-[#242E49] hover:text-[#B4182D] transition-all duration-300 group smooth-scale">
                        <Heart
                          size={20}
                          className="transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                        Save for Later
                      </button>
                      <button className="flex items-center gap-2 font-semibold text-[#242E49] hover:text-[#B4182D] transition-all duration-300 group smooth-scale">
                        Continue Shopping
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyCart />
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Summary Card */}
                <div className="glass-dark rounded-3xl p-8 border border-[#37415C]/15 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[#242E49]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#181A2F]">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#242E49]">
                      <span>Shipping</span>
                      <span className="font-bold text-[#181A2F]">
                        {shipping === 0 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Sparkles size={14} />
                            FREE
                          </span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#242E49]">
                      <span>Tax (8%)</span>
                      <span className="font-bold text-[#181A2F]">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-4 mt-4 border-t-2 border-dashed border-[#37415C]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#181A2F]">
                          Total
                        </span>
                        <span className="text-4xl font-black bg-linear-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={cartItems.length === 0}
                    className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 ${
                      cartItems.length > 0
                        ? "bg-linear-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] smooth-scale hover:shadow-[0_20px_40px_rgba(180,24,45,0.3)]"
                        : "bg-[#37415C]/30 opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <Lock size={20} />
                    Proceed to Checkout
                  </button>

                  {/* Free Shipping Progress */}
                  {shipping > 0 && cartItems.length > 0 && (
                    <div className="mt-6 p-4 rounded-2xl border border-[#FDA481] bg-linear-to-br from-[#FDA481]/10 to-[#B4182D]/5">
                      <p className="text-sm text-center mb-3 text-[#54162B]">
                        <span className="font-bold">
                          Add ${(500 - subtotal).toFixed(2)} more
                        </span>{" "}
                        for free shipping!
                      </p>
                      <div className="w-full rounded-full h-3 overflow-hidden bg-[#FDA481]/20">
                        <div
                          className="h-full transition-all duration-500 rounded-full bg-linear-to-r from-[#FDA481] to-[#B4182D]"
                          style={{
                            width: `${Math.min((subtotal / 500) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="glass-dark rounded-3xl p-6 border border-[#37415C]/15 shadow-xl">
                  <div className="space-y-5">
                    <TrustBadge
                      icon={<Shield className="text-white" size={26} />}
                      title="Secure Payment"
                      description="SSL Encrypted"
                      gradient="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <TrustBadge
                      icon={<Truck className="text-white" size={26} />}
                      title="Fast Delivery"
                      description="2-5 Business Days"
                      gradient="bg-gradient-to-br from-[#B4182D] to-[#54162B] glow-crimson"
                    />
                    <TrustBadge
                      icon={<Gift className="text-white" size={26} />}
                      title="Easy Returns"
                      description="30 Day Guarantee"
                      gradient="bg-gradient-to-br from-[#FDA481] to-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        {selectedItem && (
          <QuickViewModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={addToCart}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
