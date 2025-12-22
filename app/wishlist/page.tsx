"use client";

import React, { useState, useCallback } from "react";
import { Heart, ShoppingCart, Trash2, Eye, X, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

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

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--color-peach);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            opacity: 0.4;
            will-change: transform;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }

          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .glow-crimson {
            box-shadow: 0 0 30px rgba(217, 58, 73, 0.3),
              0 0 60px rgba(217, 58, 73, 0.1);
          }

          .wishlist-card {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .wishlist-card:nth-child(1) {
            animation-delay: 0.1s;
          }
          .wishlist-card:nth-child(2) {
            animation-delay: 0.2s;
          }
          .wishlist-card:nth-child(3) {
            animation-delay: 0.3s;
          }
          .wishlist-card:nth-child(4) {
            animation-delay: 0.4s;
          }
          .wishlist-card:nth-child(5) {
            animation-delay: 0.5s;
          }
          .wishlist-card:nth-child(6) {
            animation-delay: 0.6s;
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

          .cyber-button {
            position: relative;
            overflow: hidden;
            transition: all 0.7s ease-out;
          }

          .cyber-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            transition: left 0.7s ease-out;
          }

          .cyber-button:hover::before {
            left: 100%;
          }

          .image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
          }
        `}</style>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scaleIn">
            <div className="glass-effect px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-green-200 transition-all duration-700 ease-out">
              <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
              <p
                className="font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                {notification}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12 animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse transition-all duration-1000"
                    style={{ background: "var(--color-crimson)" }}
                  />
                  <div
                    className="relative p-4 rounded-2xl transition-transform duration-700 ease-out hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                    }}
                  >
                    <Heart
                      className="w-10 h-10 text-white transition-transform duration-500"
                      strokeWidth={2}
                    />
                  </div>
                  {wishlistItems.length > 0 && (
                    <div
                      className="absolute -top-2 -right-2 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-peach), var(--color-crimson))",
                      }}
                    >
                      {wishlistItems.length}
                    </div>
                  )}
                </div>
                <div>
                  <h1
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
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              </div>

              {/* Bottom Actions */}
              <div className="glass-effect rounded-3xl p-6 shadow-xl sticky bottom-6 animate-scaleIn">
                <div className="flex gap-4">
                  <button
                    onClick={addAllToCart}
                    className="cyber-button flex-1 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-700 ease-out flex items-center justify-center gap-3 shadow-2xl glow-crimson hover:scale-[1.02] group"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                    }}
                  >
                    <ShoppingCart
                      size={24}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    Add All to Cart ({wishlistItems.length} items)
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="px-8 py-5 rounded-2xl border-2 transition-all duration-700 ease-out font-semibold hover:border-red-500 hover:text-red-500 hover:bg-red-50 hover:scale-105"
                    style={{
                      borderColor: "rgba(139, 149, 165, 0.3)",
                      color: "var(--color-slate)",
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyWishlist />
          )}
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
    <div className="wishlist-card gradient-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out group">
      <div className="bg-white p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="relative w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority={index < 2}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out bg-gradient-to-t from-[#d93a49]/30 to-transparent" />

            {/* Quick View */}
            <button
              onClick={() => onQuickView(item)}
              className="absolute top-3 right-3 backdrop-blur-sm p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out shadow-lg bg-white/90 hover:bg-[#d93a49] hover:text-white hover:scale-110"
              style={{ color: "var(--color-slate)" }}
              aria-label="Quick view"
            >
              <Eye size={18} />
            </button>

            {/* Stock Badge */}
            <div
              className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-500 ${
                item.inStock
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {item.inStock ? "✓ In Stock" : "Out of Stock"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-500"
                style={{ color: "var(--color-crimson)" }}
              >
                {item.brand}
              </p>
              <h3
                className="text-2xl font-bold mb-3 cursor-pointer inline-block"
                style={{ color: "var(--color-navy)" }}
              >
                {item.name}
              </h3>

              {/* Colors */}
              <div className="flex gap-2 mb-4">
                {item.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 transition-all duration-500 ease-out hover:scale-125 cursor-pointer shadow-md"
                    style={{
                      backgroundColor: color,
                      borderColor: "rgba(139, 149, 165, 0.2)",
                    }}
                  />
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg transition-colors duration-300 ${
                        i < Math.floor(item.rating)
                          ? "text-amber-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-slate)" }}
                >
                  {item.rating}
                </span>
              </div>

              <p
                className="text-xs transition-colors duration-300"
                style={{ color: "var(--color-steel)" }}
              >
                Added {item.addedDate}
              </p>
            </div>

            {/* Price & Actions */}
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-navy)" }}
                >
                  ${item.price}
                </span>
                {item.originalPrice && (
                  <>
                    <span
                      className="text-lg line-through"
                      style={{ color: "var(--color-steel)" }}
                    >
                      ${item.originalPrice}
                    </span>
                    <span
                      className="text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg transition-transform duration-500 hover:scale-110"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                      }}
                    >
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.inStock}
                  className={`cyber-button flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-700 ease-out shadow-lg group ${
                    !item.inStock
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-[1.02]"
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
                >
                  <ShoppingCart
                    size={18}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  Add to Cart
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-4 py-3 rounded-xl border-2 transition-all duration-700 ease-out hover:bg-red-50 hover:border-red-500 hover:scale-110"
                  style={{
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                  }}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WishlistCard.displayName = "WishlistCard";

// Empty wishlist component
const EmptyWishlist = React.memo(() => (
  <div className="glass-effect rounded-3xl p-16 text-center shadow-xl animate-scaleIn">
    <div className="relative inline-block mb-8">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse transition-all duration-1000"
        style={{ background: "var(--color-crimson)" }}
      />
      <Heart
        className="w-32 h-32 mx-auto relative transition-transform duration-700 ease-out hover:scale-110"
        strokeWidth={1.5}
        style={{ color: "var(--color-steel)" }}
      />
    </div>
    <h2
      className="text-4xl font-bold mb-4"
      style={{ color: "var(--color-navy)" }}
    >
      Your Wishlist is Empty
    </h2>
    <p
      className="text-lg mb-8 max-w-md mx-auto"
      style={{ color: "var(--color-slate)" }}
    >
      Start adding items you love and we&apos;ll keep them safe here for you!
    </p>
    <button
      className="cyber-button text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-700 ease-out inline-flex items-center gap-3 glow-crimson hover:scale-105 group"
      style={{
        background:
          "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
      }}
    >
      <Sparkles
        size={24}
        className="transition-transform duration-500 group-hover:rotate-12"
      />
      Start Shopping
    </button>
  </div>
));

EmptyWishlist.displayName = "EmptyWishlist";

// Quick view modal component
const QuickViewModal = React.memo<{
  item: WishlistItem;
  onClose: () => void;
  onAddToCart: (item: WishlistItem) => void;
}>(({ item, onClose, onAddToCart }) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl animate-scaleIn transition-all duration-700 ease-out"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          Quick View
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-all duration-500 ease-out hover:bg-slate/10 hover:scale-110 hover:rotate-90"
          style={{ color: "var(--color-slate)" }}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="relative w-full h-96 rounded-2xl overflow-hidden group">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />
        </div>
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-2 transition-colors duration-500"
            style={{ color: "var(--color-crimson)" }}
          >
            {item.brand}
          </p>
          <h3
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--color-navy)" }}
          >
            {item.name}
          </h3>
          <div className="flex items-baseline gap-3 mb-6">
            <span
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
            </span>
            {item.originalPrice && (
              <span
                className="text-xl line-through"
                style={{ color: "var(--color-steel)" }}
              >
                ${item.originalPrice}
              </span>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 transition-all duration-500">
              <span style={{ color: "var(--color-slate)" }}>Rating:</span>
              <span className="font-bold text-amber-500">{item.rating} ★</span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-500">
              <span style={{ color: "var(--color-slate)" }}>Availability:</span>
              <span
                className={`font-bold ${
                  item.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-500">
              <span style={{ color: "var(--color-slate)" }}>Colors:</span>
              <div className="flex gap-2">
                {item.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 transition-all duration-500 ease-out hover:scale-125 cursor-pointer"
                    style={{
                      backgroundColor: color,
                      borderColor: "rgba(139, 149, 165, 0.3)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className={`cyber-button w-full py-4 rounded-xl font-bold text-lg transition-all duration-700 ease-out shadow-xl ${
              !item.inStock
                ? "cursor-not-allowed opacity-50"
                : "hover:scale-[1.02]"
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
          >
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  </div>
));

QuickViewModal.displayName = "QuickViewModal";

export default WishlistPage;
