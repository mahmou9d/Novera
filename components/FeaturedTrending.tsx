"use client";

import { useState } from "react";
import { Star, Flame, Sparkles } from "lucide-react";
import Image from "next/image";

// ========================================
// DATA
// ========================================
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Italian Wool Suit",
    category: "Tailored Excellence",
    rating: 4.9,
    reviews: 287,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
    badge: "Editor's Pick",
    color: "from-black/70 via-black/50 to-transparent",
  },
  {
    id: 2,
    name: "Premium Leather Jacket",
    category: "Statement Piece",
    rating: 5.0,
    reviews: 423,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85",
    badge: "Most Loved",
    color: "from-black/70 via-black/50 to-transparent",
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    category: "Luxury Essentials",
    rating: 4.8,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=85",
    badge: "Bestseller",
    color: "from-black/70 via-black/50 to-transparent",
  },
];

const TRENDING_PRODUCTS = [
  {
    id: 4,
    name: "Tailored Dress Pants",
    category: "Modern Classics",
    trending: "+342%",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=85",
    rank: 1,
  },
  {
    id: 5,
    name: "Organic Cotton Polo",
    category: "Sustainable Style",
    trending: "+289%",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=1200&q=85",
    rank: 2,
  },
  {
    id: 6,
    name: "Leather Bomber Jacket",
    category: "Urban Edge",
    trending: "+245%",
    image:
      "https://images.unsplash.com/photo-1520975867597-0af37a22e31e?w=1200&q=85",
    rank: 3,
  },
  {
    id: 7,
    name: "Designer Denim Jeans",
    category: "Premium Denim",
    trending: "+198%",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&q=85",
    rank: 4,
  },
  {
    id: 8,
    name: "Silk Dress Shirt",
    category: "Formal Essentials",
    trending: "+176%",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=85",
    rank: 5,
  },
];

// ========================================
// MAIN COMPONENT
// ========================================
export default function FeaturedTrending() {
  const [activeTab, setActiveTab] = useState("featured");

  const mainProduct = FEATURED_PRODUCTS[0];
  const otherProducts = FEATURED_PRODUCTS.slice(1);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FDA481]/20 to-[#B4182D]/20 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} className="text-[#FDA481]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              Curated Selection
            </span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-[#181A2F] mb-4">
            What&apos;s Hot Right Now
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the pieces everyone is talking about
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider ${
              activeTab === "featured"
                ? "bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white shadow-lg"
                : "text-gray-600 hover:text-[#181A2F] border-2 border-gray-200 hover:border-[#181A2F]"
            }`}
          >
            Featured
          </button>

          <button
            onClick={() => setActiveTab("trending")}
            className={`px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider ${
              activeTab === "trending"
                ? "bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white shadow-lg"
                : "text-gray-600 hover:text-[#181A2F] border-2 border-gray-200 hover:border-[#181A2F]"
            }`}
          >
            Trending
          </button>
        </div>

        {/* Featured Products */}
        {activeTab === "featured" && (
          <div className="space-y-8">
            {/* Main Featured - Full Width */}
            <div
              className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={mainProduct.image}
                alt={mainProduct.name}
                fill
                className="object-cover   "
              />

              <div
                className={`absolute inset-0 bg-gradient-to-r ${mainProduct.color}`}
              />

              <div className="absolute inset-0 p-8 lg:p-12 flex items-end">
                <div className="max-w-2xl text-white">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4 border border-white/30">
                    <Sparkles size={14} className="text-[#FDA481]" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {mainProduct.badge}
                    </span>
                  </div>

                  {/* Category */}
                  <p className="text-sm font-medium mb-2 text-[#FDA481] uppercase tracking-wider">
                    {mainProduct.category}
                  </p>

                  {/* Title */}
                  <h3 className="text-4xl lg:text-5xl font-bold mb-4 group-hover:text-[#FDA481] ">
                    {mainProduct.name}
                  </h3>

                  {/* Info Row */}
                  <div className="flex items-center gap-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <Star
                        size={16}
                        className="fill-[#FDA481] text-[#FDA481]"
                      />
                      <span className="font-semibold text-sm">
                        {mainProduct.rating}
                      </span>
                      <span className="text-xs text-gray-300">
                        ({mainProduct.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Featured - Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {otherProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="relative h-[400px] rounded-3xl overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover  "
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${product.color}`}
                  />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    {/* Top */}
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full w-fit border border-white/30">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {product.badge}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div>
                      <p className="text-xs font-medium mb-1 text-[#FDA481] uppercase tracking-wider">
                        {product.category}
                      </p>

                      <h4 className="text-2xl lg:text-3xl font-bold mb-3 group-hover:text-[#FDA481] ">
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                          <Star
                            size={14}
                            className="fill-[#FDA481] text-[#FDA481]"
                          />
                          <span className="font-semibold text-sm">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products - Masonry Style */}
        {activeTab === "trending" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRENDING_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                className={`relative rounded-3xl overflow-hidden cursor-pointer group ${
                  index === 0
                    ? "md:col-span-2 md:row-span-2 h-[500px]"
                    : "h-[240px]"
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Rank Badge */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FDA481] to-[#B4182D] flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {product.rank}
                    </span>
                  </div>
                </div>

                {/* Trending Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                    <Flame size={14} className="text-[#FDA481]" />
                    <span className="text-xs font-bold text-white">
                      {product.trending}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-medium mb-1 text-[#FDA481] uppercase tracking-wider">
                    {product.category}
                  </p>

                  <h4
                    className={`font-bold mb-2 group-hover:text-[#FDA481]  ${
                      index === 0 ? "text-3xl" : "text-xl"
                    }`}
                  >
                    {product.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
