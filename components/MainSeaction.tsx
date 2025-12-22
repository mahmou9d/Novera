"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Productgrid from "./Productgrid";
import { motion } from "framer-motion";

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
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-white/20 transition-transform duration-300 mx-auto">
    <Sparkles size={16} className="text-[#FDA481]" />
    <span className="text-sm font-medium tracking-wider uppercase">
      Curated Collection
    </span>
  </div>
));

CollectionBadge.displayName = "CollectionBadge";

// Memoized Category Button
const CategoryButton = memo<{
  category: Category;
  isActive: boolean;
  onClick: (id: string) => void;
}>(({ category, isActive, onClick }) => (
  <motion.button
    onClick={() => onClick(category.id)}
    className={`group relative px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-500 ${
      isActive
        ? "bg-white text-[#181A2F] shadow-2xl "
        : "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
    }`}
    whileHover={{
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="relative z-10 flex items-center gap-3">
      {category.name}
      <span
        className={`text-xs px-2 py-0.5 rounded-full transition-transform duration-300 ${
          isActive ? "bg-[#181A2F] text-white" : "bg-white/10"
        }`}
      >
        {category.count}
      </span>
    </span>
    {isActive && (
      <div className="absolute inset-0 bg-linear-to-r from-[#FDA481]/20 to-transparent rounded-full blur-xl" />
    )}
  </motion.button>
));

CategoryButton.displayName = "CategoryButton";

// Memoized Section Header
const SectionHeader = memo<{
  title: string;
  count: number;
}>(({ title, count }) => (
  <div className="flex items-end justify-between mb-12 opacity-0 animate-fade-up stagger-3">
    <div>
      <h2 className="text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2 transition-transform duration-300 inline-block">
        {title}
      </h2>
      <p className="text-gray-600 font-medium text-lg">
        {count} pieces for your wardrobe
      </p>
    </div>
    <button className="hidden lg:flex items-center gap-2 text-[#181A2F] font-medium hover:gap-4 transition-all duration-300 group transform">
      View All
      <ArrowRight
        size={20}
        className="group-hover:translate-x-1 transition-transform duration-300"
      />
    </button>
  </div>
));

SectionHeader.displayName = "SectionHeader";

// Memoized Wave Divider
const WaveDivider = memo(() => (
  <div className="absolute bottom-0 left-0 right-0 -mb-1">
    <svg
      viewBox="0 0 1440 120"
      className="w-full h-auto fill-[#faf9f7]"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
    </svg>
  </div>
));

WaveDivider.displayName = "WaveDivider";

// Memoized Top Wave Divider (Flipped)
const TopWaveDivider = memo(() => (
  <div className="absolute top-0 left-0 right-0 -mt-1 rotate-180">
    <svg
      viewBox="0 0 1440 120"
      className="w-full h-auto fill-[#faf9f7]"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
    </svg>
  </div>
));

WaveDivider.displayName = "WaveDivider";

TopWaveDivider.displayName = "TopWaveDivider";

// Memoized Load More Button
const LoadMoreButton = memo(() => (
  <div className="text-center mt-16 opacity-0 animate-fade-up stagger-6">
    <motion.button
      className="group inline-flex items-center gap-3 bg-[#181A2F] text-white px-12 py-5 rounded-full font-semibold uppercase tracking-wider hover:bg-[#FDA481] transition-all duration-500 shadow-xl hover:shadow-2xl"
      whileHover={{
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      whileTap={{ scale: 0.9 }}
    >
      Discover More
      <TrendingUp
        size={20}
        className="group-hover:rotate-12 transition-transform duration-300"
      />
    </motion.button>
  </div>
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
    <div id="hero" className=" min-h-screen">
      {/* Hero Section with Categories */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#181A2F] via-[#242E49] to-[#1a1a2e] text-white pb-20 lg:pb-28 pt-20 lg:pt-28">
        {/* Top Wave Divider */}
        <TopWaveDivider />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#FDA481]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#B4182D]/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col text-center mb-16 opacity-0 animate-fade-up">
            <CollectionBadge />
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight transition-transform duration-500 inline-block">
              Timeless Elegance,
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FDA481] via-[#FFB88C] to-[#FDA481]">
                Modern Spirit
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Discover pieces that transcend seasons and define your unique
              narrative
            </p>
          </div>

          {/* Categories Navigation */}
          <div className="flex flex-wrap justify-center gap-3 opacity-0 animate-fade-up stagger-2">
            {CATEGORIES.map((cat) => (
              <CategoryButton
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={handleCategoryChange}
              />
            ))}
          </div>
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
        <Productgrid products={filteredProducts} />

        {/* Load More */}
        <LoadMoreButton />
      </div>
    </div>
  );
};

export default memo(MainSection);
