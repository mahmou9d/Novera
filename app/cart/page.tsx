"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
  Tag,
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

interface PromoCode {
  code: string;
  discount: number;
}

interface Notification {
  message: string;
  type: "success" | "error";
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
      colors: ["#000000", "#1a1a1a", "#2d2d2d"],
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
      colors: ["#000000", "#1a1a1a", "#2d2d2d"],
      size: "42mm",
      inStock: true,
      maxQuantity: 3,
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Generate particles once using useState with initializer function
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 6,
      animationDuration: 4 + Math.random() * 4,
    }))
  );

  const updateQuantity = (id: number, delta: number): void => {
    setCartItems(
      cartItems.map((item) => {
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
  };

  const removeItem = (id: number): void => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    showNotification("Item removed from cart", "success");
  };

  const applyPromoCode = (): void => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo({ code: "SAVE10", discount: 10 });
      showNotification("Promo code applied successfully! 10% off", "success");
    } else if (promoCode.toLowerCase() === "welcome20") {
      setAppliedPromo({ code: "WELCOME20", discount: 20 });
      showNotification("Promo code applied successfully! 20% off", "success");
    } else {
      showNotification("Invalid promo code", "error");
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (item: CartItem): void => {
    // Add to cart logic here
    showNotification(`${item.name} added to cart!`, "success");
    setSelectedItem(null);
  };

  const subtotal: number = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping: number = subtotal > 500 ? 0 : 15.99;
  const tax: number = subtotal * 0.08;
  const discount: number = appliedPromo
    ? subtotal * (appliedPromo.discount / 100)
    : 0;
  const total: number = subtotal + shipping + tax - discount;

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

          /* Animated gradient background */
          @keyframes moveGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animated-bg {
            background: linear-gradient(
              135deg,
              var(--color-navy),
              var(--color-slate),
              var(--color-steel),
              #f5f5f5
            );
            background-size: 400% 400%;
            animation: moveGradient 15s ease infinite;
          }

          /* Floating particles */
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
          }

          /* Glow effects */
          .glow-crimson {
            box-shadow: 0 0 30px rgba(217, 58, 73, 0.3),
              0 0 60px rgba(217, 58, 73, 0.1);
          }

          .glow-peach {
            box-shadow: 0 0 30px rgba(253, 180, 168, 0.3),
              0 0 60px rgba(253, 180, 168, 0.1);
          }

          .glow-burgundy {
            box-shadow: 0 0 30px rgba(139, 30, 63, 0.3),
              0 0 60px rgba(139, 30, 63, 0.1);
          }

          .glow-navy {
            box-shadow: 0 0 30px rgba(26, 31, 58, 0.3),
              0 0 60px rgba(26, 31, 58, 0.1);
          }

          /* Card animations */
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-slide-up {
            animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .animate-slide-right {
            animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .animate-scale-in {
            animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Glass morphism */
          .glass {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(253, 180, 168, 0.2);
          }

          .glass-dark {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(139, 149, 165, 0.15);
          }

          /* Neon border effect */
          .neon-border {
            position: relative;
          }

          .neon-border::before {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: inherit;
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
            transition: opacity 0.3s ease;
          }

          .neon-border:hover::before {
            opacity: 1;
          }

          /* Cyber button */
          .cyber-button {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
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
            transition: left 0.5s ease;
          }

          .cyber-button:hover::before {
            left: 100%;
          }

          /* Pulsing dot */
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }

          .pulse-dot::before {
            content: "";
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: inherit;
            animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955)
              infinite;
          }

          /* Stagger animations */
          .cart-item {
            opacity: 0;
            animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .cart-item:nth-child(1) {
            animation-delay: 0.1s;
          }
          .cart-item:nth-child(2) {
            animation-delay: 0.2s;
          }
          .cart-item:nth-child(3) {
            animation-delay: 0.3s;
          }

          /* Smooth transitions */
          * {
            transition: background-color 0.2s ease, transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(139, 149, 165, 0.1);
          }

          ::-webkit-scrollbar-thumb {
            background: var(--color-crimson);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: var(--color-burgundy);
          }

          /* Shimmer effect */
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.1) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>

        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
              }}
            />
          ))}
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
            <div
              className={`glass px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] ${
                notification.type === "error"
                  ? "border-crimson/30"
                  : "border-green-500/30"
              }`}
            >
              {notification.type === "error" ? (
                <AlertCircle
                  className="flex-shrink-0"
                  style={{ color: "var(--color-crimson)" }}
                  size={24}
                />
              ) : (
                <Check className="text-green-600 flex-shrink-0" size={24} />
              )}
              <p
                className="font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
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
                  <div
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse"
                    style={{ background: "var(--color-crimson)" }}
                  ></div>
                  <div
                    className="relative p-4 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                    }}
                  >
                    <ShoppingCart
                      className="w-10 h-10 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  {cartItems.length > 0 && (
                    <div
                      className="absolute -top-2 -right-2 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg pulse-dot"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-peach), var(--color-crimson))",
                      }}
                    >
                      {cartItems.length}
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
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="cart-item glass-dark rounded-3xl overflow-hidden neon-border  transition-all duration-300 shadow-xl"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden group">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background:
                                  "linear-gradient(to top, rgba(217, 58, 73, 0.3), transparent)",
                              }}
                            ></div>

                            {/* Quick View */}
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="absolute top-3 right-3 backdrop-blur-sm p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                              style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "var(--color-slate)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "var(--color-crimson)";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(255, 255, 255, 0.9)";
                                e.currentTarget.style.color =
                                  "var(--color-slate)";
                              }}
                            >
                              <Eye size={18} />
                            </button>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p
                                    className="text-xs font-bold uppercase tracking-wider mb-1"
                                    style={{ color: "var(--color-crimson)" }}
                                  >
                                    {item.brand}
                                  </p>
                                  <h3
                                    className="text-xl font-bold mb-2"
                                    style={{ color: "var(--color-navy)" }}
                                  >
                                    {item.name}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 hover:bg-red-50 rounded-xl transition-all group"
                                >
                                  <Trash2
                                    size={20}
                                    className="transition-colors"
                                    style={{ color: "var(--color-steel)" }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.color =
                                        "var(--color-crimson)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.color =
                                        "var(--color-steel)")
                                    }
                                  />
                                </button>
                              </div>

                              {item.colors && item.colors.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                  {item.colors.map((color, i) => (
                                    <div
                                      key={i}
                                      className="w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-125 cursor-pointer shadow-md"
                                      style={{
                                        backgroundColor: color,
                                        borderColor: "rgba(139, 149, 165, 0.2)",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor =
                                          "var(--color-peach)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor =
                                          "rgba(139, 149, 165, 0.2)")
                                      }
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  className="cyber-button w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all border"
                                  style={{
                                    background:
                                      item.quantity > 1
                                        ? "rgba(253, 180, 168, 0.15)"
                                        : "rgba(139, 149, 165, 0.1)",
                                    borderColor:
                                      item.quantity > 1
                                        ? "var(--color-peach)"
                                        : "rgba(139, 149, 165, 0.2)",
                                    color:
                                      item.quantity > 1
                                        ? "var(--color-crimson)"
                                        : "var(--color-steel)",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (item.quantity > 1) {
                                      e.currentTarget.style.background =
                                        "rgba(253, 180, 168, 0.3)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (item.quantity > 1) {
                                      e.currentTarget.style.background =
                                        "rgba(253, 180, 168, 0.15)";
                                    }
                                  }}
                                >
                                  <Minus size={18} />
                                </button>
                                <span
                                  className="w-12 text-center font-bold text-xl"
                                  style={{ color: "var(--color-crimson)" }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="cyber-button w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all border"
                                  style={{
                                    background:
                                      item.quantity < item.maxQuantity
                                        ? "rgba(253, 180, 168, 0.15)"
                                        : "rgba(139, 149, 165, 0.1)",
                                    borderColor:
                                      item.quantity < item.maxQuantity
                                        ? "var(--color-peach)"
                                        : "rgba(139, 149, 165, 0.2)",
                                    color:
                                      item.quantity < item.maxQuantity
                                        ? "var(--color-crimson)"
                                        : "var(--color-steel)",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (item.quantity < item.maxQuantity) {
                                      e.currentTarget.style.background =
                                        "rgba(253, 180, 168, 0.3)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (item.quantity < item.maxQuantity) {
                                      e.currentTarget.style.background =
                                        "rgba(253, 180, 168, 0.15)";
                                    }
                                  }}
                                >
                                  <Plus size={18} />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p
                                  className="text-3xl font-black"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                  }}
                                >
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p
                                  className="text-sm"
                                  style={{ color: "var(--color-steel)" }}
                                >
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div
                    className="glass-dark rounded-3xl p-6 animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <button
                        className="flex items-center gap-2 font-semibold transition-colors group"
                        style={{ color: "var(--color-slate)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--color-crimson)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--color-slate)")
                        }
                      >
                        <Heart
                          size={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                        Save for Later
                      </button>
                      <button
                        className="flex items-center gap-2 font-semibold transition-colors group"
                        style={{ color: "var(--color-slate)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--color-crimson)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--color-slate)")
                        }
                      >
                        Continue Shopping
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-dark rounded-3xl p-20 text-center animate-scale-in shadow-xl">
                  <div className="relative inline-block mb-8">
                    <div
                      className="absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse"
                      style={{ background: "var(--color-crimson)" }}
                    ></div>
                    <ShoppingCart
                      className="w-32 h-32 mx-auto relative"
                      strokeWidth={1}
                      style={{ color: "var(--color-steel)" }}
                    />
                  </div>
                  <h2
                    className="text-4xl font-bold mb-4"
                    style={{ color: "var(--color-navy)" }}
                  >
                    Your cart is empty
                  </h2>
                  <p
                    className="text-lg mb-10"
                    style={{ color: "var(--color-slate)" }}
                  >
                    Add some items to get started!
                  </p>
                  <button
                    className="cyber-button px-12 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 glow-crimson"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                    }}
                  >
                    <Sparkles size={20} />
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Summary Card */}
                <div
                  className="glass-dark rounded-3xl p-8 animate-slide-right border shadow-xl"
                  style={{ borderColor: "rgba(139, 149, 165, 0.15)" }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--color-slate)" }}
                    >
                      <span>Subtotal</span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--color-slate)" }}
                    >
                      <span>Shipping</span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--color-navy)" }}
                      >
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
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--color-slate)" }}
                    >
                      <span>Tax (8%)</span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    {appliedPromo && (
                      <div
                        className="flex justify-between text-green-600 px-3 py-2 rounded-xl"
                        style={{ background: "rgba(34, 197, 94, 0.1)" }}
                      >
                        <span className="flex items-center gap-2">
                          <Tag size={16} />
                          Discount ({appliedPromo.discount}%)
                        </span>
                        <span className="font-bold">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div
                      className="pt-4 mt-4"
                      style={{
                        borderTop: "2px dashed rgba(139, 149, 165, 0.2)",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xl font-bold"
                          style={{ color: "var(--color-navy)" }}
                        >
                          Total
                        </span>
                        <span
                          className="text-4xl font-black"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="mb-6">
                    <label
                      className="block text-sm font-semibold mb-3"
                      style={{ color: "var(--color-slate)" }}
                    >
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 rounded-xl border-2 transition-all outline-none"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          borderColor: "rgba(139, 149, 165, 0.2)",
                          color: "var(--color-navy)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "var(--color-peach)";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(253, 180, 168, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor =
                            "rgba(139, 149, 165, 0.2)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        onClick={applyPromoCode}
                        className="cyber-button px-6 py-3 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div
                        className="mt-3 flex items-center gap-2 text-sm text-green-600 px-3 py-2 rounded-lg"
                        style={{ background: "rgba(34, 197, 94, 0.1)" }}
                      >
                        <Gift size={16} />
                        <span>
                          Code &quot;{appliedPromo.code}&quot; applied!
                        </span>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="ml-auto transition-colors"
                          style={{ color: "var(--color-steel)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              "var(--color-crimson)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--color-steel)")
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={cartItems.length === 0}
                    className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-2xl hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    style={{
                      background:
                        cartItems.length > 0
                          ? "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))"
                          : "rgba(139, 149, 165, 0.3)",
                      boxShadow:
                        cartItems.length > 0
                          ? "0 20px 40px rgba(217, 58, 73, 0.3)"
                          : "none",
                    }}
                  >
                    <Lock size={20} />
                    Proceed to Checkout
                  </button>

                  {/* Free Shipping Progress */}
                  {shipping > 0 && cartItems.length > 0 && (
                    <div
                      className="mt-6 p-4 rounded-2xl border"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(253, 180, 168, 0.1), rgba(217, 58, 73, 0.05))",
                        borderColor: "var(--color-peach)",
                      }}
                    >
                      <p
                        className="text-sm text-center mb-3"
                        style={{ color: "var(--color-burgundy)" }}
                      >
                        <span className="font-bold">
                          Add ${(500 - subtotal).toFixed(2)} more
                        </span>{" "}
                        for free shipping!
                      </p>
                      <div
                        className="w-full rounded-full h-3 overflow-hidden"
                        style={{ background: "rgba(253, 180, 168, 0.2)" }}
                      >
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${(subtotal / 500) * 100}%`,
                            background:
                              "linear-gradient(90deg, var(--color-peach), var(--color-crimson))",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div
                  className="glass-dark rounded-3xl p-6 animate-slide-right border shadow-xl"
                  style={{
                    animationDelay: "0.2s",
                    borderColor: "rgba(139, 149, 165, 0.15)",
                  }}
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 group  transition-transform">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981, #059669)",
                        }}
                      >
                        <Shield className="text-white" size={26} />
                      </div>
                      <div>
                        <p
                          className="font-bold"
                          style={{ color: "var(--color-navy)" }}
                        >
                          Secure Payment
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-steel)" }}
                        >
                          SSL Encrypted
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group  transition-transform">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg glow-crimson"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                        }}
                      >
                        <Truck className="text-white" size={26} />
                      </div>
                      <div>
                        <p
                          className="font-bold"
                          style={{ color: "var(--color-navy)" }}
                        >
                          Fast Delivery
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-steel)" }}
                        >
                          2-5 Business Days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group  transition-transform">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg glow-peach"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-peach), #f59e0b)",
                        }}
                      >
                        <Gift className="text-white" size={26} />
                      </div>
                      <div>
                        <p
                          className="font-bold"
                          style={{ color: "var(--color-navy)" }}
                        >
                          Easy Returns
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-steel)" }}
                        >
                          30 Day Guarantee
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick View Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl animate-scaleIn"
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
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: "var(--color-slate)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(139, 149, 165, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-crimson)" }}
                  >
                    {selectedItem.brand}
                  </p>
                  <h3
                    className="text-3xl font-bold mb-4"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {selectedItem.name}
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
                      ${selectedItem.price}
                    </span>
                    {selectedItem.originalPrice && (
                      <span
                        className="text-xl line-through"
                        style={{ color: "var(--color-steel)" }}
                      >
                        ${selectedItem.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {selectedItem.rating && (
                      <div className="flex items-center gap-2">
                        <span style={{ color: "var(--color-slate)" }}>
                          Rating:
                        </span>
                        <span className="font-bold text-amber-500">
                          {selectedItem.rating} ★
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-slate)" }}>
                        Availability:
                      </span>
                      <span
                        className={`font-bold ${
                          selectedItem.inStock
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedItem.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-slate)" }}>
                        Colors:
                      </span>
                      <div className="flex gap-2">
                        {selectedItem.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2"
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
                    onClick={() => addToCart(selectedItem)}
                    disabled={!selectedItem.inStock}
                    className={`cyber-button w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                      !selectedItem.inStock && "cursor-not-allowed opacity-50"
                    }`}
                    style={
                      selectedItem.inStock
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
                    onMouseEnter={(e) => {
                      if (selectedItem.inStock) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 15px 30px rgba(217, 58, 73, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedItem.inStock) {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 15px rgba(0, 0, 0, 0.1)";
                      }
                    }}
                  >
                    {selectedItem.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
