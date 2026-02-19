"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Productgrid from "./Productgrid";
import { useGetProducts } from "@/hooks/useProducts";
import Link from "next/link";
import { useGetCategory } from "@/hooks/useDashboard";

const MainSection = () => {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const { data, isLoading, isError, error } = useGetProducts();
  const { data: categoryData } = useGetCategory();
  const products = useMemo(() => data?.products || [], [data?.products]);

  const categories = useMemo(() => {
    const all = [{ id: "all", name: "Everything" }];

    if (categoryData) {
      categoryData.forEach((cat: { id: number; name: string }) => {
        all.push({ id: String(cat.id), name: cat.name });
      });
      return all;
    }
    const seen = new Set<string>();
    products.forEach((product) => {
      if (product.category_name && !seen.has(product.category_name)) {
        seen.add(product.category_name);
        all.push({
          id: product.category_name.toLowerCase(),
          name: product.category_name,
        });
      }
    });

    return all;
  }, [categoryData, products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Everything") return products;
    return products.filter((p) => p.category_name === activeCategory);
  }, [activeCategory, products]);
  const someProducts = filteredProducts.slice(0, 8);
  const currentCategoryName =
    activeCategory === "Everything" ? "The Collection" : activeCategory;
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
    <div className="min-h-screen">
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
            {categories.map((cat: { id: string; name: string }) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`group relative px-8 py-4 rounded-full font-medium text-sm tracking-wide ${
                  activeCategory === cat.name
                    ? "bg-white text-[#181A2F] shadow-2xl"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {cat.name}
                </span>
                {activeCategory === cat.name && (
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
              key={someProducts.length}
              className="text-gray-600 font-medium text-lg"
            >
              <span key={someProducts.length}>{someProducts.length}</span>
              pieces for your wardrobe
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <RefreshCw className="animate-spin text-[#fca481]" size={50} />
          </div>
        ) : (
          <div key={activeCategory}>
            {someProducts.length > 0 ? (
              <Productgrid products={someProducts} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No products found in this category
                </p>
              </div>
            )}
          </div>
        )}

        {/* Load More */}
        {someProducts.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-[#181A2F] text-white px-12 py-5 rounded-full font-semibold uppercase tracking-wider shadow-xl"
            >
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
