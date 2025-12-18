"use client";
import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

const ProductGrid = ({ products = [] }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToWishlist = (product) => {
    showNotification(`${product.name} added to wishlist!`);
  };

  const addToCart = (product) => {
    showNotification(`${product.name} added to cart!`);
  };

  return (
    <div className="relative">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap");

        :root {
          --color-navy: #1a1f3a;
          --color-slate: #3d4c63;
          --color-steel: #8b95a5;
          --color-peach: #fdb4a8;
          --color-crimson: #d93a49;
          --color-burgundy: #8b1e3f;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }

        h1,
        h2,
        h3 {
          font-family: "Syne", sans-serif;
        }

        /* Animations */
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

        .product-card {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .product-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .product-card:nth-child(2) {
          animation-delay: 0.15s;
        }
        .product-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .product-card:nth-child(4) {
          animation-delay: 0.25s;
        }
        .product-card:nth-child(5) {
          animation-delay: 0.3s;
        }
        .product-card:nth-child(6) {
          animation-delay: 0.35s;
        }
        .product-card:nth-child(7) {
          animation-delay: 0.4s;
        }
        .product-card:nth-child(8) {
          animation-delay: 0.45s;
        }
        .product-card:nth-child(9) {
          animation-delay: 0.5s;
        }
        .product-card:nth-child(10) {
          animation-delay: 0.55s;
        }
        .product-card:nth-child(11) {
          animation-delay: 0.6s;
        }
        .product-card:nth-child(12) {
          animation-delay: 0.65s;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 149, 165, 0.15);
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
          transition: opacity 0.3s;
        }

        .gradient-border:hover::before {
          opacity: 1;
        }

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
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        .cyber-button:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scaleIn">
          <div className="glass-effect px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-green-200">
            <div className="w-2 h-2 rounded-full animate-pulse bg-green-500"></div>
            <p className="font-semibold" style={{ color: "var(--color-navy)" }}>
              {notification}
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="product-card group gradient-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="bg-white">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(217, 58, 73, 0.6), transparent)",
                  }}
                ></div>

                {/* Tag */}
                {product.tag && (
                  <div
                    className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg"
                    style={{
                      background:
                        product.tag === "Sale"
                          ? "var(--color-crimson)"
                          : product.tag === "New"
                          ? "rgba(255, 255, 255, 0.9)"
                          : product.tag === "Exclusive"
                          ? "var(--color-navy)"
                          : "var(--color-peach)",
                      color:
                        product.tag === "New" ? "var(--color-navy)" : "white",
                    }}
                  >
                    {product.tag}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => addToWishlist(product)}
                    className="backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "var(--color-slate)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-peach)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.color = "var(--color-slate)";
                    }}
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "var(--color-slate)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-peach)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.color = "var(--color-slate)";
                    }}
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                {/* CTA on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button
                    onClick={() => addToCart(product)}
                    className="cyber-button w-full py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 shadow-2xl"
                    style={{
                      background: "white",
                      color: "var(--color-navy)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-peach)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "var(--color-navy)";
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-3 transition-colors duration-300 cursor-pointer"
                  style={{ color: "var(--color-navy)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-crimson)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-navy)")
                  }
                >
                  {product.name}
                </h3>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {product.colors.map((color, i) => (
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

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-navy)" }}
                  >
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span
                        className="text-lg line-through"
                        style={{ color: "var(--color-steel)" }}
                      >
                        ${product.originalPrice}
                      </span>
                      <span
                        className="text-sm font-bold px-2 py-1 rounded"
                        style={{
                          color: "var(--color-crimson)",
                          background: "rgba(217, 58, 73, 0.1)",
                        }}
                      >
                        -
                        {Math.round(
                          (1 - product.price / product.originalPrice) * 100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
