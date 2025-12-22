"use client";
import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <p className="font-semibold text-[var(--color-navy)]">
                {notification}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ y: -10 }}
            className="group gradient-border rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="bg-white">
              {/* Image */}
              <motion.div
                className="relative aspect-3/4 overflow-hidden bg-gray-100"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                >
                  <Image
                    width={400}
                    height={600}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(217, 58, 73, 0.6), transparent)",
                  }}
                />

                {/* Tag */}
                {product.tag && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
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
                  </motion.div>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    onClick={() => addToWishlist(product)}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: 10,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    className="backdrop-blur-sm p-3 inline-flex items-center bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Heart size={18} />
                    </motion.div>
                  </motion.button>
                  <motion.button
                    onClick={() => addToCart(product)}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1 + 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: -10,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    className="backdrop-blur-sm inline-flex items-center bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ShoppingBag size={18} />
                    </motion.div>
                  </motion.button>
                </div>

                {/* CTA with Framer Motion */}
                <motion.div
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 p-6"
                >
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="w-full py-4 rounded-full font-semibold uppercase tracking-wider text-sm bg-white text-[var(--color-navy)] transition-colors duration-300 hover:bg-[var(--color-peach)] hover:text-white shadow-xl"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="p-6"
              >
                <motion.h3
                  whileHover={{ x: 5, color: "var(--color-crimson)" }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-semibold mb-3 text-[var(--color-navy)] cursor-pointer"
                >
                  {product.name}
                </motion.h3>

                {/* Colors */}
                {product.colors && (
                  <div className="flex gap-2 mb-4">
                    {product.colors.map((color, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: index * 0.1 + 0.4 + i * 0.05,
                          type: "spring",
                          stiffness: 300,
                        }}
                        whileHover={{
                          scale: 1.3,
                          rotate: 360,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                        className="w-6 h-6 rounded-full border-2 shadow-md cursor-pointer"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex items-baseline gap-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl font-bold text-[var(--color-navy)]"
                  >
                    ${product.price}
                  </motion.span>
                  {product.originalPrice && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="text-lg line-through text-gray-400"
                    >
                      ${product.originalPrice}
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
