"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import {
  TrendingUp,
  Star,
  ArrowRight,
  Flame,
  Clock,
  Heart,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Create MotionImage component
const MotionImage = motion(Image);

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

// Constants
const FEATURED_PRODUCTS: FeaturedProduct[] = [
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

const TRENDING_PRODUCTS: TrendingProduct[] = [
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

// Memoized Main Featured Product Card
const MainFeaturedCard = memo<{
  product: FeaturedProduct;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}>(({ product, isLiked, onToggleLike }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    whileHover={{ y: -5 }}
    className="group relative bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#37415C] rounded-3xl overflow-hidden shadow-2xl"
  >
    <div className="grid lg:grid-cols-2 gap-0">
      {/* Image Side */}
      <motion.div
        className="relative h-[500px] lg:h-[700px] overflow-hidden"
        whileHover={{ scale: 1.02 }}
      >
        <MotionImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.6 },
          }}
        />
        <motion.div
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-[#181A2F] via-transparent to-transparent"
        />

        {/* Badge */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          whileHover={{ scale: 1.1, x: 5 }}
          className="absolute top-8 left-8 bg-[#FDA481] text-white px-6 py-3 rounded-full font-body font-bold text-sm uppercase tracking-wider shadow-2xl"
        >
          {product.badge}
        </motion.div>

        {/* Quick View Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm text-[#181A2F] px-6 py-3 rounded-full font-body font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#FDA481] hover:text-white"
        >
          <Eye size={18} />
          Quick View
        </motion.button>
      </motion.div>

      {/* Content Side */}
      <div className="flex flex-col justify-center p-8 lg:p-16 text-white">
        <div className="space-y-6">
          {/* Time Left Badge */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock size={16} />
            </motion.div>
            <span className="font-body text-sm font-medium">
              Limited Time: {product.timeLeft}
            </span>
          </motion.div>

          <motion.h3
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl lg:text-6xl font-bold leading-tight"
          >
            {product.name}
          </motion.h3>

          <motion.p
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body text-xl text-gray-300 font-light"
          >
            {product.description}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 py-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="fill-[#FDA481] text-[#FDA481]" size={20} />
              </motion.div>
              <span className="font-body text-lg font-semibold">
                {product.rating}
              </span>
              <span className="font-body text-sm text-gray-400">
                ({product.reviews} reviews)
              </span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="font-body text-sm text-gray-400">
              {product.sold} sold this week
            </div>
          </motion.div>

          {/* Price & CTA */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 pt-4"
          >
            <div>
              <div className="font-body text-sm text-gray-400 uppercase tracking-wider mb-1">
                Price
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="font-display text-4xl font-bold"
              >
                ${product.price}
              </motion.div>
            </div>

            <motion.button
              className="bg-[#FDA481] flex-1 text-white px-8 py-5 rounded-full font-body font-semibold text-base uppercase tracking-wider shadow-xl flex items-center gap-3 group/btn"
              whileHover={{
                y: -3,
                backgroundColor: "#ffffff",
                color: "#181A2F",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Cart
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => onToggleLike(product.id)}
              className={`p-5 rounded-full border-2 transition-all duration-300 ${
                isLiked
                  ? "bg-[#FDA481] border-[#FDA481] text-white"
                  : "border-white/30 text-white hover:border-[#FDA481] hover:bg-[#FDA481]"
              }`}
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={24}
                  className={`transition-all duration-300 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
));

MainFeaturedCard.displayName = "MainFeaturedCard";

// Memoized Secondary Featured Card
const SecondaryFeaturedCard = memo<{
  product: FeaturedProduct;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  index: number;
}>(({ product, isLiked, onToggleLike, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 0.5,
      delay: index * 0.2,
      type: "spring",
      stiffness: 100,
    }}
    whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}
    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg"
  >
    <motion.div
      className="relative h-80 overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <MotionImage
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.6 },
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      {/* Badge */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.2 }}
        whileHover={{ scale: 1.1, y: -3 }}
        className="absolute top-6 left-6 bg-white text-[#181A2F] px-5 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-lg"
      >
        {product.badge}
      </motion.div>

      {/* Like Button */}
      <motion.button
        onClick={() => onToggleLike(product.id)}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.3 }}
        className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isLiked
            ? "bg-[#FDA481] text-white"
            : "bg-white/90 text-[#181A2F] hover:bg-[#FDA481] hover:text-white"
        }`}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.85 }}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isLiked ? "fill-current" : ""
            }`}
          />
        </motion.div>
      </motion.button>

      {/* Product Info Overlay */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.4 }}
        className="absolute bottom-0 left-0 right-0 p-6 text-white"
      >
        <motion.h4
          whileHover={{ x: 5 }}
          className="font-display text-3xl font-bold mb-2"
        >
          {product.name}
        </motion.h4>
        <p className="font-body text-sm text-gray-200 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="font-display text-3xl font-bold"
            >
              ${product.price}
            </motion.div>
            <div className="font-body flex items-center gap-2 text-sm mt-1">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="fill-[#FDA481] text-[#FDA481]" size={14} />
              </motion.div>
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviews})</span>
            </div>
          </div>
          <motion.button
            className="bg-white text-[#181A2F] px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-[#FDA481] hover:text-white flex items-center gap-2 group/btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
));

SecondaryFeaturedCard.displayName = "SecondaryFeaturedCard";

// Memoized Trending Product Card
const TrendingCard = memo<{ product: TrendingProduct; index: number }>(
  ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg"
    >
      <div className="flex gap-6 p-6">
        {/* Rank Badge */}
        <motion.div
          className="shrink-0"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#FDA481] to-[#B4182D] rounded-2xl flex items-center justify-center font-display text-4xl font-bold text-white shadow-lg">
            {product.rank}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0"
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <MotionImage
            src={product.image}
            alt={product.name}
            fill
            sizes="128px"
            className="object-cover"
            whileHover={{
              scale: 1.15,
              transition: { duration: 0.5 },
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <TrendingUp size={12} />
                </motion.div>
                {product.trending}
              </motion.div>
            </motion.div>
            <motion.h4
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ x: 5, color: "#FDA481" }}
              className="font-display text-2xl font-bold text-[#181A2F] mb-1"
            >
              {product.name}
            </motion.h4>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="font-body text-sm text-gray-600 mb-3"
            >
              {product.description}
            </motion.p>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="font-body text-xs text-gray-500 flex items-center gap-1"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame size={14} className="text-[#B4182D]" />
              </motion.div>
              {product.orders}
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="flex items-center justify-between mt-4"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="font-display text-3xl font-bold text-[#181A2F]"
            >
              ${product.price}
            </motion.div>
            <motion.button
              className="bg-[#181A2F] text-white px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-[#FDA481] flex items-center gap-2 group/btn"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FDA481",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Shop
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
);

TrendingCard.displayName = "TrendingCard";

// Memoized Tab Button
const TabButton = memo<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}>(({ active, onClick, icon, label }) => (
  <motion.button
    onClick={onClick}
    className={`font-body px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white shadow-lg"
        : "text-gray-600 hover:text-[#181A2F]"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
  </motion.button>
));

TabButton.displayName = "TabButton";

// Main Component
export default function FeaturedTrending() {
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  // Memoized data splits
  const mainFeatured = useMemo(() => FEATURED_PRODUCTS[0], []);
  const secondaryFeatured = useMemo(() => FEATURED_PRODUCTS.slice(1), []);

  // Callbacks
  const toggleLike = useCallback((id: number): void => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div id="featured" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FDA481]/10 to-[#B4182D]/10 px-6 py-3 rounded-full mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame className="text-[#B4182D]" size={20} />
            </motion.div>
            <span className="font-body text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              What&apos;s Hot Right Now
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-5xl lg:text-7xl font-bold text-[#181A2F] mb-6"
          >
            Featured & Trending
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Discover the pieces everyone is talking about
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white rounded-full p-2 shadow-xl border border-gray-200">
            <TabButton
              active={activeTab === "featured"}
              onClick={() => handleTabChange("featured")}
              icon={<Star size={18} />}
              label="Featured"
            />
            <TabButton
              active={activeTab === "trending"}
              onClick={() => handleTabChange("trending")}
              icon={<TrendingUp size={18} />}
              label="Trending"
            />
          </div>
        </motion.div>

        {/* Featured Products - Hero Layout */}
        <AnimatePresence mode="wait">
          {activeTab === "featured" && (
            <motion.div
              key="featured"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Main Featured Product */}
              <MainFeaturedCard
                product={mainFeatured}
                isLiked={likedItems.has(mainFeatured.id)}
                onToggleLike={toggleLike}
              />

              {/* Secondary Featured Products */}
              <div className="grid md:grid-cols-2 gap-8">
                {secondaryFeatured.map((product, index) => (
                  <SecondaryFeaturedCard
                    key={product.id}
                    product={product}
                    isLiked={likedItems.has(product.id)}
                    onToggleLike={toggleLike}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending Products - Grid Layout */}
          {activeTab === "trending" && (
            <motion.div
              key="trending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {TRENDING_PRODUCTS.map((product, index) => (
                <TrendingCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white px-12 py-6 rounded-full font-body font-bold text-base uppercase tracking-wider shadow-2xl"
            whileHover={{
              scale: 1.05,
              y: -5,
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Full Collection
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={24} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
