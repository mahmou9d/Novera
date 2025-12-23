"use client";

import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Twitter,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
  verified: boolean;
  social: "instagram" | "twitter";
  handle: string;
  date: string;
  image: string;
}

interface Stat {
  number: string;
  label: string;
}

// Constants
const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Michael Anderson",
    role: "Business Executive",
    location: "New York, NY",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 5,
    review:
      "Absolutely transformative pieces. The quality is unmatched, and every item feels like it was made just for me. I've never felt more confident in my wardrobe choices.",
    product: "Italian Wool Suit & Leather Shoes",
    verified: true,
    social: "instagram",
    handle: "@michaelanderson",
    date: "2 weeks ago",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  },
  {
    id: 2,
    name: "James Rodriguez",
    role: "Creative Director",
    location: "Los Angeles, CA",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    rating: 5,
    review:
      "Every piece tells a story. The attention to detail, the fabric choices, the way each garment fits—it's perfection. This isn't just shopping, it's an investment in yourself.",
    product: "Cashmere Overcoat",
    verified: true,
    social: "twitter",
    handle: "@jamesrodriguez",
    date: "1 month ago",
    image: "https://m.media-amazon.com/images/I/51PRNk79NiL._AC_SX679_.jpg",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Entrepreneur",
    location: "London, UK",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    rating: 5,
    review:
      "I've shopped everywhere, but nothing compares to this level of curation. Each piece feels exclusive, timeless, and effortlessly sharp. My wardrobe has never looked better.",
    product: "Linen Summer Suit",
    verified: true,
    social: "instagram",
    handle: "@davidchen",
    date: "3 weeks ago",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Architect",
    location: "San Francisco, CA",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    rating: 5,
    review:
      "The craftsmanship is exceptional. These aren't just clothes—they're works of art. I appreciate the sustainable approach and the timeless designs that transcend trends.",
    product: "Premium Leather Jacket",
    verified: true,
    social: "instagram",
    handle: "@alexthompson",
    date: "1 week ago",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
];

const STATS: Stat[] = [
  { number: "50K+", label: "Happy Customers" },
  { number: "4.9/5", label: "Average Rating" },
  { number: "98%", label: "Would Recommend" },
  { number: "15K+", label: "5-Star Reviews" },
];

// Memoized Stat Card
const StatCard = memo<{ stat: Stat; index: number }>(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}
    className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
      className="font-serif text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2"
    >
      {stat.number}
    </motion.div>
    <div className="font-sans text-sm text-gray-600 uppercase tracking-wider">
      {stat.label}
    </div>
  </motion.div>
));

StatCard.displayName = "StatCard";

// Memoized Review Card
const ReviewCard = memo<{ testimonial: Testimonial; index: number }>(
  ({ testimonial, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="flex gap-1 mb-4"
      >
        {[...Array(testimonial.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1 + 0.3 + i * 0.05,
              type: "spring",
            }}
            whileHover={{ scale: 1.2, rotate: 360 }}
          >
            <Star size={16} className="text-[#FDA481] fill-current" />
          </motion.div>
        ))}
      </motion.div>

      <p className="font-sans text-sm text-gray-700 mb-4 line-clamp-4">
        &quot;{testimonial.review}&quot;
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative w-10 h-10 rounded-full overflow-hidden"
        >
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </motion.div>
        <div>
          <div className="font-sans text-sm font-semibold text-[#181A2F]">
            {testimonial.name}
          </div>
          <div className="font-sans text-xs text-gray-500">
            {testimonial.role}
          </div>
        </div>
      </div>
    </motion.div>
  )
);

ReviewCard.displayName = "ReviewCard";

// Main Component
const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const currentTestimonial = useMemo(
    () => TESTIMONIALS[currentSlide],
    [currentSlide]
  );

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
    setIsAutoPlaying(false);
  }, []);

  const goToSlide = useCallback(
    (idx: number) => {
      setDirection(idx > currentSlide ? 1 : -1);
      setCurrentSlide(idx);
      setIsAutoPlaying(false);
    },
    [currentSlide]
  );

  return (
    <div
      id="testimonials"
      className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FDA481]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-[#B4182D]/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Decorative Stars */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 left-20 text-[#FDA481] pointer-events-none"
      >
        <Star size={24} fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        className="absolute top-60 right-40 text-[#FDA481] pointer-events-none"
      >
        <Star size={16} fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-40 left-60 text-[#FDA481] pointer-events-none"
      >
        <Star size={20} fill="currentColor" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Quote className="text-[#B4182D]" size={20} />
            </motion.div>
            <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              Customer Stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-serif text-5xl lg:text-7xl font-bold text-[#181A2F] mb-6"
          >
            Loved by Thousands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-sans text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Real stories from real customers who found their perfect style
          </motion.p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>

        {/* Main Testimonial Showcase */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: direction * -100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * 100, scale: 0.9 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="aspect-3/4 relative">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.product}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Product Badge */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className="bg-[#FDA481]/10 p-3 rounded-xl"
                        >
                          <ShoppingBag className="text-[#FDA481]" size={24} />
                        </motion.div>
                        <div>
                          <div className="font-sans text-xs text-gray-600 uppercase tracking-wider mb-1">
                            Purchased
                          </div>
                          <div className="font-serif text-lg font-semibold text-[#181A2F]">
                            {currentTestimonial.product}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Quote Mark */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.3, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -left-8 text-[#FDA481]/20 hidden lg:block pointer-events-none"
              >
                <Quote size={120} fill="currentColor" />
              </motion.div>
            </div>

            {/* Content Side */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.5 }}
                className="order-1 lg:order-2"
              >
                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: i * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ scale: 1.3, rotate: 360 }}
                      >
                        <Star
                          size={28}
                          className="text-[#FDA481] fill-current"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review Text */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-serif text-3xl lg:text-4xl font-medium text-[#181A2F] leading-relaxed italic"
                  >
                    &quot;{currentTestimonial.review}&quot;
                  </motion.blockquote>

                  {/* Author Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 pt-6"
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                        <Image
                          src={currentTestimonial.avatar}
                          alt={currentTestimonial.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      {currentTestimonial.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-lg"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>

                    <div className="flex-1">
                      <div className="font-sans text-lg font-bold text-[#181A2F]">
                        {currentTestimonial.name}
                      </div>
                      <div className="font-sans text-sm text-gray-600">
                        {currentTestimonial.role} •{" "}
                        {currentTestimonial.location}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {currentTestimonial.social === "instagram" ? (
                          <Instagram size={14} className="text-gray-400" />
                        ) : (
                          <Twitter size={14} className="text-gray-400" />
                        )}
                        <span className="font-sans text-xs text-gray-500">
                          {currentTestimonial.handle}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-sans text-xs text-gray-500">
                          {currentTestimonial.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation Controls */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between pt-8 border-t border-gray-200"
                  >
                    <div className="flex gap-3">
                      <motion.button
                        onClick={prevSlide}
                        className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] transition-all duration-300 shadow-md"
                        aria-label="Previous testimonial"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "#181A2F",
                          color: "#ffffff",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                      <motion.button
                        onClick={nextSlide}
                        className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] transition-all duration-300 shadow-md"
                        aria-label="Next testimonial"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "#181A2F",
                          color: "#ffffff",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight size={24} />
                      </motion.button>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex gap-2">
                      {TESTIMONIALS.map((_, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentSlide
                              ? "w-8 bg-[#FDA481]"
                              : "w-2 bg-gray-300 hover:bg-gray-400"
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Additional Reviews Grid */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="font-serif text-3xl lg:text-4xl font-bold text-[#181A2F] mb-3">
              More Reviews
            </h3>
            <p className="font-sans text-gray-600">
              See what others are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
              <ReviewCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white px-12 py-6 rounded-full font-sans font-bold text-base uppercase tracking-wider shadow-2xl"
            whileHover={{
              scale: 1.05,
              y: -5,
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Read All Reviews
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Star size={20} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(Testimonials);
