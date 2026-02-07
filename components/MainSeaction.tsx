"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Productgrid from "./Productgrid";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts } from "@/hooks/useProducts";
import Link from "next/link";

const MainSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data, isLoading, isError, error } = useGetProducts();

  const products = useMemo(() => data?.products || [], [data?.products]);

  const categories = useMemo(() => {
    if (!products || products.length === 0) {
      return [{ id: "all", name: "Everything", count: 0 }];
    }

    const categoryCounts: Record<string, number> = {};

    products.forEach((product) => {
      if (product.category_name) {
        categoryCounts[product.category_name] =
          (categoryCounts[product.category_name] || 0) + 1;
      }
    });

    const cats = [{ id: "all", name: "Everything", count: products.length }];

    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([categoryName, count]) => {
        cats.push({
          id: categoryName.toLowerCase(),
          name: categoryName,
          count,
        });
      });

    return cats;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeCategory === "all") return products;
    return products.filter((p) => {
      return p.category_name?.toLowerCase() === activeCategory;
    });
  }, [activeCategory, products]);

  // Current category name
  const currentCategoryName = useMemo(() => {
    if (activeCategory === "all") return "The Collection";
    const category = categories.find((c) => c.id === activeCategory);
    return category?.name || "Collection";
  }, [activeCategory, categories]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-[#FDA481] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            Error loading products: {error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#181A2F] text-white px-6 py-3 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div  className="min-h-screen">
      {/* Hero Section with Categories */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#1a1a2e] text-white pb-20 lg:pb-28 pt-20 lg:pt-28">
        {/* Top Wave Divider */}
        <div className="absolute top-0 left-0 right-0 -mt-1 rotate-180 z-20">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-[#ffffff]"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute hidden lg:block top-0 right-0 w-150 h-150 bg-[#FDA481]/10 rounded-full" />
        <div className="absolute hidden lg:block bottom-0 left-0 w-125 h-125 bg-[#B4182D]/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col text-center mb-16">
            {/* Badge */}
            <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full mb-6 border border-white/20 mx-auto">
              <div>
                <Sparkles size={16} className="text-[#FDA481]" />
              </div>
              <span className="text-sm font-medium tracking-wider uppercase">
                Curated Collection
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Timeless Elegance,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDA481] via-[#FFB88C] to-[#FDA481]">
                Modern Spirit
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Discover pieces that transcend seasons and define your unique
              narrative
            </p>
          </div>

          {/* Categories Navigation */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-500 ${
                  activeCategory === cat.id
                    ? "bg-white text-[#181A2F] shadow-2xl"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {cat.name}
                  <span
                    key={cat.count}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === cat.id
                        ? "bg-[#181A2F] text-white"
                        : "bg-white/10"
                    }`}
                  >
                    {cat.count}
                  </span>
                </span>
                {activeCategory === cat.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDA481]/20 to-transparent rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2
              key={currentCategoryName}
              className="text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2 inline-block"
            >
              {currentCategoryName}
            </h2>
            <p
              key={filteredProducts.length}
              className="text-gray-600 font-medium text-lg"
            >
              <span key={filteredProducts.length}>
                {filteredProducts.length}
              </span>{" "}
              pieces for your wardrobe
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <div key={activeCategory}>
            {filteredProducts.length > 0 ? (
              <Productgrid products={filteredProducts} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No products found in this category
                </p>
              </div>
            )}
          </div>
        </AnimatePresence>

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/shop" className="group inline-flex items-center gap-3 bg-[#181A2F] text-white px-12 py-5 rounded-full font-semibold uppercase tracking-wider shadow-xl">
              Discover More
              <div>
                <TrendingUp size={20} />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSection;
