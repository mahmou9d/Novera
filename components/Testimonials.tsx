"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useGetReviews } from "@/hooks/useReviews";

const STATS = [
  { number: "50K+", label: "Happy Customers" },
  { number: "4.9/5", label: "Average Rating" },
  { number: "98%", label: "Would Recommend" },
  { number: "15K+", label: "5-Star Reviews" },
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const { data: reviews = [], isLoading, isError } = useGetReviews();
  const featuredReviews = reviews.filter((review) => review.rating >= 4);
  const currentReview = featuredReviews[currentSlide];

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || featuredReviews.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % featuredReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredReviews.length]);

  const nextSlide = () => {
    if (featuredReviews.length === 0) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % featuredReviews.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (featuredReviews.length === 0) return;
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length,
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
    setIsAutoPlaying(false);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#FDA481] mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || reviews.length === 0) {
    return (
      <div className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Star size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reviews available yet</p>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك مراجعات مميزة
  if (featuredReviews.length === 0) {
    return (
      <div className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
              >
                <div className="text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, index) => (
              <div
                key={review.product_id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[#FDA481] fill-current"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-4">
                  &quot;{review.comment}&quot;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {review.customer_name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#181A2F]">
                      {review.customer_name || "Anonymous"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="testimonials"
      className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#FDA481]/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#B4182D]/5 rounded-full pointer-events-none" />

      {/* Decorative Stars */}
      <div className="absolute top-40 left-20 text-[#FDA481] pointer-events-none">
        <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute top-60 right-40 text-[#FDA481] pointer-events-none">
        <Star size={16} fill="currentColor" />
      </div>
      <div className="absolute bottom-40 left-60 text-[#FDA481] pointer-events-none">
        <Star size={20} fill="currentColor" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FDA481]/10 to-[#B4182D]/10 px-6 py-3 rounded-full mb-6">
            <div>
              <Quote className="text-[#B4182D]" size={20} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              Customer Stories
            </span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold text-[#181A2F] mb-6">
            Loved by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Real stories from {reviews.length} real customers who found their
            perfect style
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial Showcase */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <div
                key={currentSlide}
                className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200"
              >
                <div className="aspect-[3/4] relative flex items-center justify-center">
                  {/* Product Badge */}
                  {currentReview?.customer_name && (
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FDA481]/10 p-3 rounded-xl">
                          <ShoppingBag className="text-[#FDA481]" size={24} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                            Reviewed Product
                          </div>
                          <div className="text-lg font-semibold text-[#181A2F]">
                            {currentReview.customer_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative Quote Mark */}
              <div className="absolute -top-8 -left-8 text-[#FDA481]/20 hidden lg:block pointer-events-none">
                <Quote size={120} fill="currentColor" />
              </div>
            </div>

            {/* Content Side */}
            <div key={`content-${currentSlide}`} className="order-1 lg:order-2">
              <div className="space-y-6">
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(currentReview?.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      size={28}
                      className="text-[#FDA481] fill-current"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-3xl lg:text-4xl font-medium text-[#181A2F] leading-relaxed italic">
                  &quot;{currentReview?.comment}&quot;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-[#FDA481] to-[#B4182D] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {currentReview?.customer_name
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-lg">
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
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-bold text-[#181A2F]">
                      {currentReview?.customer_name || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Verified Customer
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] shadow-md"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] shadow-md"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex gap-2">
                    {featuredReviews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 rounded-full ${
                          idx === currentSlide
                            ? "w-8 bg-[#FDA481]"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Reviews Grid */}
        {reviews.length > 3 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#181A2F] mb-3">
                More Reviews
              </h3>
              <p className="text-gray-600">See what others are saying</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review, index) => (
                <div
                  key={review.product_id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-[#FDA481] fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-4">
                    &quot;{review.comment}&quot;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {review.customer_name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#181A2F]">
                        {review.customer_name || "Anonymous"}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white px-12 py-6 rounded-full font-bold text-base uppercase tracking-wider shadow-2xl">
            Read All {reviews.length} Reviews
            <Star size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
