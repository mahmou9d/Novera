"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Productgrid from "./Productgrid";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Category {
  id: string;
  name: string;
  count: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tag?: string;
  colors: string[];
}

// Constants
const CATEGORIES: Category[] = [
  { id: "all", name: "Everything", count: 847 },
  { id: "new", name: "New Drops", count: 124 },
  { id: "dresses", name: "Dresses", count: 234 },
  { id: "essentials", name: "Essentials", count: 189 },
  { id: "luxe", name: "Luxe", count: 67 },
  { id: "sale", name: "On Sale", count: 143 },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Leather Jacket",
    price: 485,
    category: "jackets",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    tag: "Exclusive",
    colors: ["#000000", "#1a1a1a", "#2d2d2d"],
  },
  {
    id: 2,
    name: "Linen Summer Suit",
    price: 320,
    originalPrice: 420,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
    tag: "Sale",
    colors: ["#f5f5dc", "#ffffff", "#e8e8e8"],
  },
  {
    id: 3,
    name: "Cashmere Overcoat",
    price: 890,
    category: "luxe",
    image: "https://m.media-amazon.com/images/I/51PRNk79NiL._AC_SX679_.jpg",
    tag: "New",
    colors: ["#8b7355", "#d4a574", "#f5f5dc"],
  },
  {
    id: 4,
    name: "Merino Wool Sweater",
    price: 245,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    colors: ["#2c3e50", "#34495e", "#95a5a6"],
  },
  {
    id: 5,
    name: "Tailored Tuxedo",
    price: 725,
    category: "formal",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    tag: "Trending",
    colors: ["#000000", "#1a1a1a", "#2d2d2d"],
  },
  {
    id: 6,
    name: "Classic Blazer",
    price: 420,
    originalPrice: 590,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    tag: "Sale",
    colors: ["#2f4f4f", "#708090", "#1a1a2e"],
  },
  {
    id: 7,
    name: "Oxford Dress Shirt",
    price: 385,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80",
    tag: "New",
    colors: ["#ffffff", "#87ceeb", "#e6e6fa"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
];

// Memoized Badge Component
const CollectionBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-white/20 mx-auto"
  >
    <motion.div
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Sparkles size={16} className="text-[#FDA481]" />
    </motion.div>
    <span className="text-sm font-medium tracking-wider uppercase">
      Curated Collection
    </span>
  </motion.div>
));

CollectionBadge.displayName = "CollectionBadge";

// Memoized Category Button
const CategoryButton = memo<{
  category: Category;
  isActive: boolean;
  onClick: (id: string) => void;
  index: number;
}>(({ category, isActive, onClick, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    onClick={() => onClick(category.id)}
    className={`group relative px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-500 ${
      isActive
        ? "bg-white text-[#181A2F] shadow-2xl"
        : "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
    }`}
    whileHover={{
      scale: 1.05,
      y: -2,
    }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="relative z-10 flex items-center gap-3">
      {category.name}
      <motion.span
        key={category.count}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-xs px-2 py-0.5 rounded-full ${
          isActive ? "bg-[#181A2F] text-white" : "bg-white/10"
        }`}
      >
        {category.count}
      </motion.span>
    </span>
    {isActive && (
      <motion.div
        layoutId="activeCategory"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 bg-gradient-to-r from-[#FDA481]/20 to-transparent rounded-full blur-xl"
      />
    )}
  </motion.button>
));

CategoryButton.displayName = "CategoryButton";

// Memoized Section Header
const SectionHeader = memo<{
  title: string;
  count: number;
}>(({ title, count }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex items-end justify-between mb-12"
  >
    <div>
      <motion.h2
        key={title}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2 inline-block"
      >
        {title}
      </motion.h2>
      <motion.p
        key={count}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 font-medium text-lg"
      >
        <motion.span
          key={count}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {count}
        </motion.span>{" "}
        pieces for your wardrobe
      </motion.p>
    </div>
    <motion.button
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="hidden lg:flex items-center gap-2 text-[#181A2F] font-medium group"
    >
      View All
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ArrowRight size={20} />
      </motion.div>
    </motion.button>
  </motion.div>
));

SectionHeader.displayName = "SectionHeader";

// Memoized Wave Divider
const WaveDivider = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className="absolute bottom-0 left-0 right-0 -mb-1"
  >
    <motion.svg
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      viewBox="0 0 1440 120"
      className="w-full h-auto fill-[#faf9f7]"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
    </motion.svg>
  </motion.div>
));

WaveDivider.displayName = "WaveDivider";

// Memoized Top Wave Divider (Flipped)
const TopWaveDivider = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="absolute top-0 left-0 right-0 -mt-1 rotate-180"
  >
    <motion.svg
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      viewBox="0 0 1440 120"
      className="w-full h-auto fill-[#faf9f7]"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
    </motion.svg>
  </motion.div>
));

TopWaveDivider.displayName = "TopWaveDivider";

// Memoized Load More Button
const LoadMoreButton = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mt-16"
  >
    <motion.button
      className="group inline-flex items-center gap-3 bg-[#181A2F] text-white px-12 py-5 rounded-full font-semibold uppercase tracking-wider shadow-xl"
      whileHover={{
        scale: 1.05,
        y: -5,
        backgroundColor: "#FDA481",
        boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      Discover More
      <motion.div
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.6 }}
      >
        <TrendingUp size={20} />
      </motion.div>
    </motion.button>
  </motion.div>
));

LoadMoreButton.displayName = "LoadMoreButton";

// Main Component
const MainSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;

    return PRODUCTS.filter(
      (p) =>
        p.category === activeCategory ||
        (activeCategory === "sale" && p.originalPrice) ||
        (activeCategory === "new" && p.tag === "New")
    );
  }, [activeCategory]);

  // Memoized category change handler
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Memoized current category info
  const currentCategoryName = useMemo(() => {
    if (activeCategory === "all") return "The Collection";
    return (
      CATEGORIES.find((c) => c.id === activeCategory)?.name || "Collection"
    );
  }, [activeCategory]);

  return (
    <div id="hero" className="min-h-screen">
      {/* Hero Section with Categories */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#1a1a2e] text-white pb-20 lg:pb-28 pt-20 lg:pt-28">
        {/* Top Wave Divider */}
        <TopWaveDivider />

        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 right-0 w-150 h-150 bg-[#FDA481]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-125 h-125 bg-[#B4182D]/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col text-center mb-16">
            <CollectionBadge />
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Timeless Elegance,
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDA481] via-[#FFB88C] to-[#FDA481]"
              >
                Modern Spirit
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto font-light"
            >
              Discover pieces that transcend seasons and define your unique
              narrative
            </motion.p>
          </div>

          {/* Categories Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((cat, index) => (
              <CategoryButton
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={handleCategoryChange}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom Wave Divider */}
        <WaveDivider />
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* Section Header */}
        <SectionHeader
          title={currentCategoryName}
          count={filteredProducts.length}
        />

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Productgrid products={filteredProducts} />
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        <LoadMoreButton />
      </div>
    </div>
  );
};

export default memo(MainSection);
