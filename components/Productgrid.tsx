"use client";
import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors?: string[];
  tag?: "Sale" | "New" | "Exclusive" | string;
}

interface ProductGridProps {
  products?: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products = [] }) => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string): void => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToWishlist = (product: Product): void => {
    showNotification(`${product.name} added to wishlist!`);
  };

  const addToCart = (product: Product): void => {
    showNotification(`${product.name} added to cart!`);
  };

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scaleIn">
          <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
            <p className="font-semibold text-[var(--color-navy)]">
              {notification}
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card group gradient-border rounded-3xl overflow-hidden shadow-lg card-animate"
          >
            <div className="bg-white">
              {/* Image */}
              <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                <Image
                  width={400}
                  height={600}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover scale-smooth will-change-transform"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(217, 58, 73, 0.6), transparent)",
                  }}
                />

                {/* Tag */}
                {product.tag && (
                  <div
                    className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase backdrop-blur-md"
                    style={{
                      background:
                        product.tag === "Sale"
                          ? "var(--color-crimson)"
                          : product.tag === "New"
                          ? "rgba(255,255,255,0.9)"
                          : "var(--color-navy)",
                      color:
                        product.tag === "New" ? "var(--color-navy)" : "white",
                    }}
                  >
                    {product.tag}
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <motion.button
                    onClick={() => addToWishlist(product)}
                    className="backdrop-blur-sm p-3 inline-flex items-center bg-gradient-to-r bg-white rounded-full font-body font-bold text-base uppercase tracking-wider hover:shadow-2xl transition-all duration-500 animate-bounce-subtle"
                    whileHover={{
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Heart size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="backdrop-blur-sm inline-flex items-center bg-white p-3 rounded-full font-body font-bold text-base uppercase tracking-wider hover:shadow-2xl transition-all duration-500 animate-bounce-subtle"
                    whileHover={{
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <ShoppingBag size={18} />
                  </motion.button>
                </div>

                {/* CTA with Framer Motion */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="w-full py-4 rounded-full font-semibold uppercase tracking-wider text-sm bg-white text-[var(--color-navy)] transition-colors duration-300 hover:bg-[var(--color-peach)] hover:text-white"
                    whileHover={{
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[var(--color-navy)] hover:text-[var(--color-crimson)] transition-colors">
                  {product.name}
                </h3>

                {/* Colors */}
                {product.colors && (
                  <div className="flex gap-2 mb-4">
                    {product.colors.map((color, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full border-2 shadow-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[var(--color-navy)]">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg line-through text-gray-400">
                      ${product.originalPrice}
                    </span>
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
