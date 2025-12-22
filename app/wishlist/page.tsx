"use client";

import React, { useState, useCallback } from "react";
import { Heart, ShoppingCart, Trash2, Eye, X, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  colors: string[];
  inStock: boolean;
  rating: number;
  addedDate: string;
}

const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    name: "Minimalist Leather Wallet",
    brand: "CRAFT & CO",
    price: 89.99,
    originalPrice: 129.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    colors: ["#2C1810", "#8B4513", "#4A4A4A"],
    inStock: true,
    rating: 4.8,
    addedDate: "2 days ago",
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    brand: "AUDIO LUXE",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    colors: ["#000000", "#E8E8E8", "#B8860B"],
    inStock: true,
    rating: 4.9,
    addedDate: "5 days ago",
  },
  {
    id: 3,
    name: "Japanese Ceramic Tea Set",
    brand: "ZEN COLLECTION",
    price: 156.0,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    colors: ["#F5F5DC", "#8B7355", "#2F4F4F"],
    inStock: false,
    rating: 4.7,
    addedDate: "1 week ago",
  },
  {
    id: 4,
    name: "Vintage Polaroid Camera",
    brand: "RETRO VISION",
    price: 219.99,
    originalPrice: 279.99,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
    inStock: true,
    rating: 4.6,
    addedDate: "3 days ago",
  },
  {
    id: 5,
    name: "Artisan Leather Journal",
    brand: "PAPER & PEN",
    price: 67.5,
    originalPrice: 95.0,
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    colors: ["#8B4513", "#D2691E", "#2F4F4F"],
    inStock: true,
    rating: 4.9,
    addedDate: "4 days ago",
  },
  {
    id: 6,
    name: "Smart Fitness Watch Pro",
    brand: "TECH SPORT",
    price: 449.99,
    originalPrice: 599.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    colors: ["#000000", "#4169E1", "#DC143C"],
    inStock: true,
    rating: 4.8,
    addedDate: "1 day ago",
  },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(
    INITIAL_WISHLIST_ITEMS
  );
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string): void => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const removeItem = useCallback(
    (id: number): void => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      showNotification("Item removed from wishlist");
    },
    [showNotification]
  );

  const addToCart = useCallback(
    (item: WishlistItem): void => {
      showNotification(`${item.name} added to cart!`);
    },
    [showNotification]
  );

  const addAllToCart = useCallback((): void => {
    showNotification(`${wishlistItems.length} items added to cart!`);
  }, [wishlistItems.length, showNotification]);

  const clearWishlist = useCallback((): void => {
    setWishlistItems([]);
    showNotification("Wishlist cleared");
  }, [showNotification]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 relative overflow-hidden">
        <style jsx>{`
          :root {
            --color-navy: #1a1f3a;
            --color-slate: #3d4c63;
            --color-steel: #8b95a5;
            --color-peach: #fdb4a8;
            --color-crimson: #d93a49;
            --color-burgundy: #8b1e3f;
          }

          .glow-crimson {
            box-shadow: 0 0 30px rgba(217, 58, 73, 0.3),
              0 0 60px rgba(217, 58, 73, 0.1);
          }

          .gradient-border {
            position: relative;
            background: white;
          }

          .gradient-border::before {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: 24px;
            padding: 2px;
            background: linear-gradient(
              135deg,
              var(--color-crimson),
              var(--color-peach),
              var(--color-burgundy)
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.7s ease-out;
          }

          .gradient-border:hover::before {
            opacity: 1;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(139, 149, 165, 0.15);
          }
        `}</style>

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
              <div className="glass-effect px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-green-200">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-navy)" }}
                >
                  {notification}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
                    className="absolute inset-0 rounded-2xl blur-2xl"
                    style={{ background: "var(--color-crimson)" }}
                  />
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative p-4 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-10 h-10 text-white" strokeWidth={2} />
                    </motion.div>
                  </motion.div>
                  {wishlistItems.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                      className="absolute -top-2 -right-2 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-peach), var(--color-crimson))",
                      }}
                    >
                      <motion.span
                        key={wishlistItems.length}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {wishlistItems.length}
                      </motion.span>
                    </motion.div>
                  )}
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl font-black min-h-20 flex items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    My Wishlist
                  </motion.h1>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                <AnimatePresence>
                  {wishlistItems.map((item, index) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      index={index}
                      onRemove={removeItem}
                      onAddToCart={addToCart}
                      onQuickView={setSelectedItem}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="glass-effect rounded-3xl p-6 shadow-xl sticky bottom-6"
              >
                <div className="flex gap-4">
                  <motion.button
                    onClick={addAllToCart}
                    className="flex-1 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl glow-crimson group"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                    }}
                    whileHover={{
                      y: -3,
                      boxShadow: "0 25px 50px rgba(217, 58, 73, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ShoppingCart size={24} />
                    </motion.div>
                    Add All to Cart ({wishlistItems.length} items)
                  </motion.button>

                  <motion.button
                    onClick={clearWishlist}
                    className="px-8 py-5 rounded-2xl border-2 font-semibold"
                    style={{
                      borderColor: "rgba(139, 149, 165, 0.3)",
                      color: "var(--color-slate)",
                    }}
                    whileHover={{
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      backgroundColor: "rgba(239, 68, 68, 0.05)",
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear All
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            <EmptyWishlist />
          )}
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

// Memoized WishlistCard component
const WishlistCard = React.memo<{
  item: WishlistItem;
  index: number;
  onRemove: (id: number) => void;
  onAddToCart: (item: WishlistItem) => void;
  onQuickView: (item: WishlistItem) => void;
}>(({ item, index, onRemove, onAddToCart, onQuickView }) => {
  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: -100 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        layout: { duration: 0.3 },
      }}
      whileHover={{ y: -8 }}
      className="gradient-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl group"
    >
      <div className="bg-white p-6">
        <div className="flex gap-6">
          {/* Image */}
          <motion.div
            className="relative w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100"
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority={index < 2}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-[#d93a49]/30 to-transparent"
            />

            {/* Quick View */}
            <motion.button
              onClick={() => onQuickView(item)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 backdrop-blur-sm p-2.5 rounded-full opacity-0 group-hover:opacity-100 shadow-lg bg-white/90 hover:bg-[#d93a49] hover:text-white"
              style={{ color: "var(--color-slate)" }}
              aria-label="Quick view"
              transition={{
                opacity: { duration: 0.3 },
                scale: { type: "spring", stiffness: 400 },
              }}
            >
              <Eye size={18} />
            </motion.button>

            {/* Stock Badge */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                item.inStock
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {item.inStock ? "✓ In Stock" : "Out of Stock"}
            </motion.div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-crimson)" }}
              >
                {item.brand}
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ x: 5 }}
                className="text-2xl font-bold mb-3 cursor-pointer inline-block"
                style={{ color: "var(--color-navy)" }}
              >
                {item.name}
              </motion.h3>

              {/* Colors */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex gap-2 mb-4"
              >
                {item.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.3 + i * 0.05,
                      type: "spring",
                    }}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    className="w-8 h-8 rounded-full border-2 cursor-pointer shadow-md"
                    style={{
                      backgroundColor: color,
                      borderColor: "rgba(139, 149, 165, 0.2)",
                    }}
                  />
                ))}
              </motion.div>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="flex items-center gap-2 mb-3"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 + i * 0.05 }}
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      className={`text-lg cursor-pointer ${
                        i < Math.floor(item.rating)
                          ? "text-amber-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-slate)" }}
                >
                  {item.rating}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-xs"
                style={{ color: "var(--color-steel)" }}
              >
                Added {item.addedDate}
              </motion.p>
            </div>

            {/* Price & Actions */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                className="flex items-baseline gap-3 mb-4"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-navy)" }}
                >
                  ${item.price}
                </motion.span>
                {item.originalPrice && (
                  <>
                    <span
                      className="text-lg line-through"
                      style={{ color: "var(--color-steel)" }}
                    >
                      ${item.originalPrice}
                    </span>
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                      }}
                    >
                      -{discount}%
                    </motion.span>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                className="flex gap-3"
              >
                <motion.button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-lg group ${
                    !item.inStock ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  style={
                    item.inStock
                      ? {
                          background:
                            "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                          color: "white",
                        }
                      : {
                          background: "rgba(139, 149, 165, 0.2)",
                          color: "var(--color-steel)",
                        }
                  }
                  whileHover={
                    item.inStock
                      ? {
                          y: -2,
                          boxShadow: "0 10px 25px rgba(217, 58, 73, 0.3)",
                        }
                      : {}
                  }
                  whileTap={item.inStock ? { scale: 0.98 } : {}}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ShoppingCart size={18} />
                  </motion.div>
                  Add to Cart
                </motion.button>
                <motion.button
                  onClick={() => onRemove(item.id)}
                  className="px-4 py-3 rounded-xl border-2"
                  style={{
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                  }}
                  whileHover={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderColor: "#ef4444",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Remove item"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Trash2 size={18} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

WishlistCard.displayName = "WishlistCard";

// Empty wishlist component
const EmptyWishlist = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, type: "spring" }}
    className="glass-effect rounded-3xl p-16 text-center shadow-xl"
  >
    <motion.div
      className="relative inline-block mb-8"
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: "var(--color-crimson)" }}
      />
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Heart
          className="w-32 h-32 mx-auto relative"
          strokeWidth={1.5}
          style={{ color: "var(--color-steel)" }}
        />
      </motion.div>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-4xl font-bold mb-4"
      style={{ color: "var(--color-navy)" }}
    >
      Your Wishlist is Empty
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-lg mb-8 max-w-md mx-auto"
      style={{ color: "var(--color-slate)" }}
    >
      Start adding items you love and we&apos;ll keep them safe here for you!
    </motion.p>
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl inline-flex items-center gap-3 glow-crimson group"
      style={{
        background:
          "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 25px 50px rgba(217, 58, 73, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles size={24} />
      </motion.div>
      Start Shopping
    </motion.button>
  </motion.div>
));

EmptyWishlist.displayName = "EmptyWishlist";

// Quick view modal component
const QuickViewModal = React.memo<{
  item: WishlistItem;
  onClose: () => void;
  onAddToCart: (item: WishlistItem) => void;
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
          className="text-3xl font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          Quick View
        </motion.h2>
        <motion.button
          onClick={onClose}
          className="p-2 rounded-full"
          style={{ color: "var(--color-slate)" }}
          whileHover={{
            backgroundColor: "rgba(139, 149, 165, 0.1)",
            rotate: 90,
            scale: 1.1,
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close modal"
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-96 rounded-2xl overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
            className="text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-crimson)" }}
          >
            {item.brand}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--color-navy)" }}
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
              className="text-4xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ${item.price}
            </motion.span>
            {item.originalPrice && (
              <span
                className="text-xl line-through"
                style={{ color: "var(--color-steel)" }}
              >
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
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <span style={{ color: "var(--color-slate)" }}>Rating:</span>
              <span className="font-bold text-amber-500">{item.rating} ★</span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <span style={{ color: "var(--color-slate)" }}>Availability:</span>
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
              <span style={{ color: "var(--color-slate)" }}>Colors:</span>
              <div className="flex gap-2">
                {item.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    className="w-6 h-6 rounded-full border-2 cursor-pointer"
                    style={{
                      backgroundColor: color,
                      borderColor: "rgba(139, 149, 165, 0.3)",
                    }}
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
              !item.inStock ? "cursor-not-allowed opacity-50" : ""
            }`}
            style={
              item.inStock
                ? {
                    background:
                      "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                    color: "white",
                  }
                : {
                    background: "rgba(139, 149, 165, 0.2)",
                    color: "var(--color-steel)",
                  }
            }
            whileHover={
              item.inStock
                ? {
                    y: -3,
                    boxShadow: "0 20px 40px rgba(217, 58, 73, 0.4)",
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

export default WishlistPage;
