"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  Star,
  ArrowRight,
  Flame,
  Clock,
  Heart,
  Eye,
} from "lucide-react";

// Types
interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  image: string;
  badge: string;
  timeLeft: string;
}

interface TrendingProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  trending: string;
  orders: string;
  image: string;
  rank: number;
}

type TabType = "featured" | "trending";

export default function FeaturedTrending() {
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const featuredProducts: FeaturedProduct[] = [
    {
      id: 1,
      name: "Italian Wool Suit",
      description: "Tailored perfection in premium Italian wool",
      price: 645,
      rating: 4.9,
      reviews: 287,
      sold: 156,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",
      badge: "Editor's Pick",
      timeLeft: "2d 14h",
    },
    {
      id: 2,
      name: "Premium Leather Jacket",
      description: "Timeless design meets exceptional craftsmanship",
      price: 890,
      rating: 5.0,
      reviews: 423,
      sold: 234,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85",
      badge: "Most Loved",
      timeLeft: "1d 8h",
    },
    {
      id: 3,
      name: "Cashmere Turtleneck",
      description: "Weightless luxury in pure cashmere",
      price: 425,
      rating: 4.8,
      reviews: 512,
      sold: 389,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=85",
      badge: "Bestseller",
      timeLeft: "3d 6h",
    },
  ];

  const trendingProducts: TrendingProduct[] = [
    {
      id: 4,
      name: "Tailored Dress Pants",
      description: "Sharp silhouette for the modern gentleman",
      price: 320,
      trending: "+342%",
      orders: "1.2k orders this week",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=85",
      rank: 1,
    },
    {
      id: 5,
      name: "Organic Cotton Polo",
      description: "Sustainable style that breathes",
      price: 285,
      trending: "+289%",
      orders: "980 orders this week",
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=1200&q=85",
      rank: 2,
    },
    {
      id: 6,
      name: "Leather Bomber Jacket",
      description: "Edge meets sophistication",
      price: 725,
      trending: "+245%",
      orders: "847 orders this week",
      image:
        "https://images.unsplash.com/photo-1520975867597-0af37a22e31e?w=1200&q=85",
      rank: 3,
    },
    {
      id: 7,
      name: "Designer Denim Jeans",
      description: "Premium fit with timeless appeal",
      price: 195,
      trending: "+198%",
      orders: "723 orders this week",
      image:
        "https://images.unsplash.com/photo-1542272454315-7f6d4f2fe0a4?w=1200&q=85",
      rank: 4,
    },
  ];

  const toggleLike = (id: number): void => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div
      id="featured"
      className="bg-gradient-to-b from-[#faf9f7] to-white py-20 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FDA481]/10 to-[#B4182D]/10 px-6 py-3 rounded-full mb-6">
            <Flame className="text-[#B4182D]" size={20} />
            <span className="font-body text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              What&apos;s Hot Right Now
            </span>
          </div>

          <h2 className="font-display text-5xl lg:text-7xl font-bold text-[#181A2F] mb-6">
            Featured & Trending
          </h2>
          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Discover the pieces everyone is talking about
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-2 shadow-xl border border-gray-200">
            <button
              onClick={() => setActiveTab("featured")}
              className={`font-body px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === "featured"
                  ? "bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white shadow-lg"
                  : "text-gray-600 hover:text-[#181A2F]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={18} />
                Featured
              </span>
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`font-body px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === "trending"
                  ? "bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white shadow-lg"
                  : "text-gray-600 hover:text-[#181A2F]"
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp size={18} />
                Trending
              </span>
            </button>
          </div>
        </div>

        {/* Featured Products - Hero Layout */}
        {activeTab === "featured" && (
          <div className="space-y-8">
            {/* Main Featured Product */}
            <div className="group relative bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#37415C] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-[500px] lg:h-[700px] overflow-hidden">
                  <img
                    src={featuredProducts[0].image}
                    alt={featuredProducts[0].name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#181A2F] via-transparent to-transparent opacity-60"></div>

                  {/* Badge */}
                  <div className="absolute top-8 left-8 bg-[#FDA481] text-white px-6 py-3 rounded-full font-body font-bold text-sm uppercase tracking-wider shadow-2xl pulse-glow">
                    {featuredProducts[0].badge}
                  </div>

                  {/* Quick View Button */}
                  <button className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm text-[#181A2F] px-6 py-3 rounded-full font-body font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#FDA481] hover:text-white">
                    <Eye size={18} />
                    Quick View
                  </button>
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center p-8 lg:p-16 text-white">
                  <div className="space-y-6">
                    {/* Time Left Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/20">
                      <Clock size={16} />
                      <span className="font-body text-sm font-medium">
                        Limited Time: {featuredProducts[0].timeLeft}
                      </span>
                    </div>

                    <h3 className="font-display text-5xl lg:text-6xl font-bold leading-tight">
                      {featuredProducts[0].name}
                    </h3>

                    <p className="font-body text-xl text-gray-300 font-light">
                      {featuredProducts[0].description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star
                          className="fill-[#FDA481] text-[#FDA481]"
                          size={20}
                        />
                        <span className="font-body text-lg font-semibold">
                          {featuredProducts[0].rating}
                        </span>
                        <span className="font-body text-sm text-gray-400">
                          ({featuredProducts[0].reviews} reviews)
                        </span>
                      </div>
                      <div className="w-px h-6 bg-white/20"></div>
                      <div className="font-body text-sm text-gray-400">
                        {featuredProducts[0].sold} sold this week
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center gap-6 pt-4">
                      <div>
                        <div className="font-body text-sm text-gray-400 uppercase tracking-wider mb-1">
                          Price
                        </div>
                        <div className="font-display text-4xl font-bold">
                          ${featuredProducts[0].price}
                        </div>
                      </div>

                      <button className="flex-1 group/btn bg-[#FDA481] text-white px-8 py-5 rounded-full font-body font-bold text-base uppercase tracking-wider hover:bg-white hover:text-[#181A2F] transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
                        Add to Cart
                        <ArrowRight
                          className="group-hover/btn:translate-x-2 transition-transform"
                          size={20}
                        />
                      </button>

                      <button
                        onClick={() => toggleLike(featuredProducts[0].id)}
                        className={`p-5 rounded-full border-2 transition-all duration-300 ${
                          likedItems.has(featuredProducts[0].id)
                            ? "bg-[#FDA481] border-[#FDA481] text-white"
                            : "border-white/30 text-white hover:border-[#FDA481] hover:bg-[#FDA481]"
                        }`}
                      >
                        <Heart
                          size={24}
                          className={
                            likedItems.has(featuredProducts[0].id)
                              ? "fill-current"
                              : ""
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Featured Products */}
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProducts.slice(1).map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-white text-[#181A2F] px-5 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-lg">
                      {product.badge}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(product.id)}
                      className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        likedItems.has(product.id)
                          ? "bg-[#FDA481] text-white"
                          : "bg-white/90 text-[#181A2F] hover:bg-[#FDA481] hover:text-white"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={
                          likedItems.has(product.id) ? "fill-current" : ""
                        }
                      />
                    </button>

                    {/* Product Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="font-display text-3xl font-bold mb-2">
                        {product.name}
                      </h4>
                      <p className="font-body text-sm text-gray-200 mb-4">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-3xl font-bold">
                            ${product.price}
                          </div>
                          <div className="font-body flex items-center gap-2 text-sm mt-1">
                            <Star
                              className="fill-[#FDA481] text-[#FDA481]"
                              size={14}
                            />
                            <span>{product.rating}</span>
                            <span className="text-gray-400">
                              ({product.reviews})
                            </span>
                          </div>
                        </div>

                        <button className="bg-white text-[#181A2F] px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-[#FDA481] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products - Grid Layout */}
        {activeTab === "trending" && (
          <div className="grid md:grid-cols-2 gap-8">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex gap-6 p-6">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#FDA481] to-[#B4182D] rounded-2xl flex items-center justify-center font-display text-4xl font-bold text-white shadow-lg float-animation">
                      {product.rank}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp size={12} />
                          {product.trending}
                        </div>
                      </div>
                      <h4 className="font-display text-2xl font-bold text-[#181A2F] mb-1 group-hover:text-[#FDA481] transition-colors">
                        {product.name}
                      </h4>
                      <p className="font-body text-sm text-gray-600 mb-3">
                        {product.description}
                      </p>
                      <div className="font-body text-xs text-gray-500 flex items-center gap-1">
                        <Flame size={14} className="text-[#B4182D]" />
                        {product.orders}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="font-display text-3xl font-bold text-[#181A2F]">
                        ${product.price}
                      </div>
                      <button className="bg-[#181A2F] text-white px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-[#FDA481] transition-all duration-300 flex items-center gap-2 group/btn">
                        Shop
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white px-12 py-6 rounded-full font-body font-bold text-base uppercase tracking-wider hover:shadow-2xl transition-all duration-500 hover:scale-105">
            Explore Full Collection
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
