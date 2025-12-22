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
import { motion, AnimatePresence } from "framer-motion";

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
  index: number;
}>(({ item, onUpdateQuantity, onRemove, onQuickView, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -50, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 100, scale: 0.9 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      layout: { duration: 0.3 },
    }}
    whileHover={{ y: -5 }}
    className="glass-dark rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-[#37415C]/10"
  >
    <div className="p-6">
      <div className="flex gap-6">
        {/* Product Image */}
        <motion.div
          className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="144px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority={false}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-[#B4182D]/30 to-transparent"
          />

          {/* Quick View Button */}
          <motion.button
            onClick={() => onQuickView(item)}
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 backdrop-blur-sm bg-white/90 p-2.5 rounded-full opacity-0 group-hover:opacity-100 shadow-lg hover:bg-[#B4182D] hover:text-white"
            aria-label="Quick view"
            transition={{
              opacity: { duration: 0.3 },
              scale: { type: "spring", stiffness: 400 },
            }}
          >
            <Eye size={18} />
          </motion.button>
        </motion.div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="text-xs font-bold uppercase tracking-wider mb-1 text-[#B4182D]"
                >
                  {item.brand}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ x: 5 }}
                  className="text-xl font-bold mb-2 text-[#181A2F]"
                >
                  {item.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-sm text-[#37415C]"
                >
                  Size: {item.size}
                </motion.p>
              </div>
              <motion.button
                onClick={() => onRemove(item.id)}
                className="p-2 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                aria-label="Remove item"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Trash2
                    size={20}
                    className="text-[#37415C] group-hover:text-[#B4182D] transition-colors duration-300"
                  />
                </motion.div>
              </motion.button>
            </div>

            {/* Color Options */}
            {item.colors?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="flex gap-2 mb-4"
              >
                {item.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.4 + i * 0.05,
                      type: "spring",
                    }}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    className="w-6 h-6 rounded-full border-2 border-[#37415C]/20 hover:border-[#FDA481] cursor-pointer shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="flex items-center justify-between"
          >
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => onUpdateQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                className="w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold border border-[#FDA481] bg-[#FDA481]/15 text-[#B4182D] hover:bg-[#FDA481]/30 disabled:border-[#37415C]/20 disabled:bg-[#37415C]/10 disabled:text-[#37415C]"
                aria-label="Decrease quantity"
                whileHover={
                  item.quantity > 1
                    ? {
                        scale: 1.1,
                        backgroundColor: "rgba(253, 164, 129, 0.3)",
                      }
                    : {}
                }
                whileTap={item.quantity > 1 ? { scale: 0.9 } : {}}
              >
                <Minus size={18} />
              </motion.button>
              <motion.span
                key={item.quantity}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 text-center font-bold text-xl text-[#B4182D]"
              >
                {item.quantity}
              </motion.span>
              <motion.button
                onClick={() => onUpdateQuantity(item.id, 1)}
                disabled={item.quantity >= item.maxQuantity}
                className="w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold border border-[#FDA481] bg-[#FDA481]/15 text-[#B4182D] hover:bg-[#FDA481]/30 disabled:border-[#37415C]/20 disabled:bg-[#37415C]/10 disabled:text-[#37415C]"
                aria-label="Increase quantity"
                whileHover={
                  item.quantity < item.maxQuantity
                    ? {
                        scale: 1.1,
                        backgroundColor: "rgba(253, 164, 129, 0.3)",
                      }
                    : {}
                }
                whileTap={
                  item.quantity < item.maxQuantity ? { scale: 0.9 } : {}
                }
              >
                <Plus size={18} />
              </motion.button>
            </div>

            {/* Price */}
            <div className="text-right">
              <motion.p
                key={item.quantity}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-black bg-gradient-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent"
              >
                ${(item.price * item.quantity).toFixed(2)}
              </motion.p>
              <p className="text-sm text-[#37415C]">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
));

CartItemCard.displayName = "CartItemCard";

// Empty Cart Component
const EmptyCart = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, type: "spring" }}
    className="glass-dark rounded-3xl p-20 text-center shadow-xl"
  >
    <motion.div
      className="relative inline-block mb-8"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-3xl bg-[#B4182D]"
      />
      <motion.div whileHover={{ scale: 1.1, rotate: 10 }}>
        <ShoppingCart
          className="w-32 h-32 mx-auto relative text-[#37415C]"
          strokeWidth={1}
        />
      </motion.div>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-4xl font-bold mb-4 text-[#181A2F]"
    >
      Your cart is empty
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-lg mb-10 text-[#242E49]"
    >
      Add some items to get started!
    </motion.p>
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-12 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl inline-flex items-center gap-3 bg-gradient-to-r from-[#B4182D] to-[#54162B]"
      whileHover={{
        y: -3,
        boxShadow: "0 25px 50px rgba(180, 24, 45, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles size={20} />
      </motion.div>
      Start Shopping
    </motion.button>
  </motion.div>
));

EmptyCart.displayName = "EmptyCart";

// Trust Badge Component
const TrustBadge = memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}>(({ icon, title, description, gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ x: 5 }}
    className="flex items-center gap-4 group cursor-pointer"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${gradient}`}
    >
      {icon}
    </motion.div>
    <div>
      <p className="font-bold text-[#181A2F]">{title}</p>
      <p className="text-sm text-[#37415C]">{description}</p>
    </div>
  </motion.div>
));

TrustBadge.displayName = "TrustBadge";

// Quick View Modal
const QuickViewModal = memo<{
  item: CartItem;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}>(({ item, onClose, onAddToCart }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-[#181A2F]"
        >
          Quick View
        </motion.h2>
        <motion.button
          onClick={onClose}
          className="p-2 rounded-full text-[#242E49] hover:bg-[#37415C]/10"
          aria-label="Close modal"
          whileHover={{
            scale: 1.1,
            rotate: 90,
            backgroundColor: "rgba(55, 65, 92, 0.1)",
          }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative h-96 rounded-2xl overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover shadow-lg transition-transform duration-700 group-hover:scale-110"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#B4182D]"
          >
            {item.brand}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4 text-[#181A2F]"
          >
            {item.name}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-baseline gap-3 mb-6"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-4xl font-bold bg-gradient-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent"
            >
              ${item.price}
            </motion.span>
            {item.originalPrice && (
              <span className="text-xl line-through text-[#37415C]">
                ${item.originalPrice}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-4 mb-8"
          >
            {item.rating && (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2"
              >
                <span className="text-[#242E49]">Rating:</span>
                <span className="font-bold text-amber-500">
                  {item.rating} ★
                </span>
              </motion.div>
            )}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#242E49]">Availability:</span>
              <span
                className={`font-bold ${
                  item.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#242E49]">Size:</span>
              <span className="font-bold text-[#181A2F]">{item.size}</span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#242E49]">Colors:</span>
              <div className="flex gap-2">
                {item.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    className="w-6 h-6 rounded-full border-2 border-[#37415C]/30 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl ${
              !item.inStock && "cursor-not-allowed opacity-50"
            } ${
              item.inStock
                ? "bg-gradient-to-r from-[#B4182D] to-[#54162B] text-white"
                : "bg-[#37415C]/20 text-[#37415C]"
            }`}
            whileHover={
              item.inStock
                ? {
                    y: -3,
                    boxShadow: "0 20px 40px rgba(180, 24, 45, 0.4)",
                  }
                : {}
            }
            whileTap={item.inStock ? { scale: 0.98 } : {}}
          >
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 relative overflow-hidden">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div
                className={`glass-dark px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
                  notification.type === "error"
                    ? "border-[#B4182D]/30"
                    : "border-green-500/30"
                }`}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0],
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {notification.type === "error" ? (
                    <AlertCircle
                      className="shrink-0 text-[#B4182D]"
                      size={24}
                    />
                  ) : (
                    <Check className="text-green-600 shrink-0" size={24} />
                  )}
                </motion.div>
                <p className="font-semibold text-[#181A2F]">
                  {notification.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl blur-2xl bg-[#B4182D]"
                  />
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="relative p-4 rounded-2xl bg-gradient-to-br from-[#B4182D] to-[#54162B]"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ShoppingCart
                        className="w-10 h-10 text-white"
                        strokeWidth={2}
                      />
                    </motion.div>
                  </motion.div>
                  {cartItems.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="absolute -top-2 -right-2 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg bg-gradient-to-br from-[#FDA481] to-[#B4182D]"
                    >
                      <motion.span
                        key={cartItems.length}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {cartItems.length}
                      </motion.span>
                    </motion.div>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl p-2 font-black bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length > 0 ? (
                <>
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-dark rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <motion.button
                        className="flex items-center gap-2 font-semibold text-[#242E49] hover:text-[#B4182D] group"
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring" }}
                        >
                          <Heart size={20} />
                        </motion.div>
                        Save for Later
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 font-semibold text-[#242E49] hover:text-[#B4182D] group"
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue Shopping
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring" }}
                        >
                          <ArrowRight size={20} />
                        </motion.div>
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              ) : (
                <EmptyCart />
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="glass-dark rounded-3xl p-8 border border-[#37415C]/15 shadow-xl"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#B4182D] to-[#54162B] bg-clip-text text-transparent"
                  >
                    Order Summary
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 mb-6"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between text-[#242E49]"
                    >
                      <span>Subtotal</span>
                      <motion.span
                        key={subtotal}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-bold text-[#181A2F]"
                      >
                        ${subtotal.toFixed(2)}
                      </motion.span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between text-[#242E49]"
                    >
                      <span>Shipping</span>
                      <span className="font-bold text-[#181A2F]">
                        {shipping === 0 ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-600 flex items-center gap-1"
                          >
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sparkles size={14} />
                            </motion.div>
                            FREE
                          </motion.span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex justify-between text-[#242E49]"
                    >
                      <span>Tax (8%)</span>
                      <motion.span
                        key={tax}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-bold text-[#181A2F]"
                      >
                        ${tax.toFixed(2)}
                      </motion.span>
                    </motion.div>
                    <div className="pt-4 mt-4 border-t-2 border-dashed border-[#37415C]/20">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xl font-bold text-[#181A2F]">
                          Total
                        </span>
                        <motion.span
                          key={total}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring" }}
                          className="text-4xl font-black bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent"
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Checkout Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    disabled={cartItems.length === 0}
                    className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 ${
                      cartItems.length > 0
                        ? "bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F]"
                        : "bg-[#37415C]/30 opacity-30 cursor-not-allowed"
                    }`}
                    whileHover={
                      cartItems.length > 0
                        ? {
                            y: -3,
                            boxShadow: "0 25px 50px rgba(180, 24, 45, 0.4)",
                          }
                        : {}
                    }
                    whileTap={cartItems.length > 0 ? { scale: 0.98 } : {}}
                  >
                    <motion.div
                      animate={
                        cartItems.length > 0 ? { rotate: [0, -10, 10, 0] } : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock size={20} />
                    </motion.div>
                    Proceed to Checkout
                  </motion.button>

                  {/* Free Shipping Progress */}
                  <AnimatePresence>
                    {shipping > 0 && cartItems.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 rounded-2xl border border-[#FDA481] bg-gradient-to-br from-[#FDA481]/10 to-[#B4182D]/5"
                      >
                        <p className="text-sm text-center mb-3 text-[#54162B]">
                          <span className="font-bold">
                            Add ${(500 - subtotal).toFixed(2)} more
                          </span>{" "}
                          for free shipping!
                        </p>
                        <div className="w-full rounded-full h-3 overflow-hidden bg-[#FDA481]/20">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                (subtotal / 500) * 100,
                                100
                              )}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#FDA481] to-[#B4182D]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-dark rounded-3xl p-6 border border-[#37415C]/15 shadow-xl"
                >
                  <div className="space-y-5">
                    <TrustBadge
                      icon={<Shield className="text-white" size={26} />}
                      title="Secure Payment"
                      description="SSL Encrypted"
                      gradient="bg-gradient-to-br from-green-500 to-green-600"
                      index={0}
                    />
                    <TrustBadge
                      icon={<Truck className="text-white" size={26} />}
                      title="Fast Delivery"
                      description="2-5 Business Days"
                      gradient="bg-gradient-to-br from-[#B4182D] to-[#54162B]"
                      index={1}
                    />
                    <TrustBadge
                      icon={<Gift className="text-white" size={26} />}
                      title="Easy Returns"
                      description="30 Day Guarantee"
                      gradient="bg-gradient-to-br from-[#FDA481] to-amber-500"
                      index={2}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {selectedItem && (
            <QuickViewModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAddToCart={addToCart}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
