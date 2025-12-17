"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Twitter,
  ShoppingBag,
} from "lucide-react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

const testimonials = [
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

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "98%", label: "Would Recommend" },
    { number: "15K+", label: "5-Star Reviews" },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <div className="relative bg-gradient-to-b from-white via-[#faf9f7] to-white py-20 lg:py-32 overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#FDA481]/5 rounded-full blur-3xl float"></div>
      <div
        className="absolute bottom-20 left-10 w-80 h-80 bg-[#B4182D]/5 rounded-full blur-3xl float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Decorative Stars */}
      <div className="absolute top-40 left-20 text-[#FDA481] opacity-20 twinkle">
        <Star size={24} fill="currentColor" />
      </div>
      <div
        className="absolute top-60 right-40 text-[#FDA481] opacity-20 twinkle"
        style={{ animationDelay: "1s" }}
      >
        <Star size={16} fill="currentColor" />
      </div>
      <div
        className="absolute bottom-40 left-60 text-[#FDA481] opacity-20 twinkle"
        style={{ animationDelay: "1.5s" }}
      >
        <Star size={20} fill="currentColor" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FDA481]/10 to-[#B4182D]/10 px-6 py-3 rounded-full mb-6">
            <Quote className="text-[#B4182D]" size={20} />
            <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
              Customer Stories
            </span>
          </div>

          <h2 className="font-serif text-5xl lg:text-7xl font-bold text-[#181A2F] mb-6">
            Loved by Thousands
          </h2>
          <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Real stories from real customers who found their perfect style
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-serif text-4xl lg:text-5xl font-bold text-[#181A2F] mb-2">
                {stat.number}
              </div>
              <div className="font-sans text-sm text-gray-600 uppercase tracking-wider">
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
                className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-slide"
                key={currentSlide}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.product}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Product Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FDA481]/10 p-3 rounded-xl">
                        <ShoppingBag className="text-[#FDA481]" size={24} />
                      </div>
                      <div>
                        <div className="font-sans text-xs text-gray-600 uppercase tracking-wider mb-1">
                          Purchased
                        </div>
                        <div className="font-serif text-lg font-semibold text-[#181A2F]">
                          {currentTestimonial.product}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Quote Mark */}
              <div className="absolute -top-8 -left-8 text-[#FDA481]/20 hidden lg:block">
                <Quote size={120} fill="currentColor" />
              </div>
            </div>

            {/* Content Side */}
            <div
              className="order-1 lg:order-2 animate-fade-slide"
              key={`content-${currentSlide}`}
            >
              <div className="space-y-6">
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={28}
                      className="text-[#FDA481] fill-current"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="font-serif text-3xl lg:text-4xl font-medium text-[#181A2F] leading-relaxed italic">
                  {`"{currentTestimonial.review}"`}
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6">
                  <div className="relative">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    {currentTestimonial.verified && (
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
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-sans text-lg font-bold text-[#181A2F]">
                      {currentTestimonial.name}
                    </div>
                    <div className="font-sans text-sm text-gray-600">
                      {currentTestimonial.role} • {currentTestimonial.location}
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
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="bg-white border-2 border-gray-200 text-[#181A2F] p-3 rounded-full hover:bg-[#181A2F] hover:text-white hover:border-[#181A2F] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlide(idx);
                          setIsAutoPlaying(false);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
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
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl lg:text-4xl font-bold text-[#181A2F] mb-3">
              More Reviews
            </h3>
            <p className="font-sans text-gray-600">
              See what others are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[#FDA481] fill-current"
                    />
                  ))}
                </div>

                <p className="font-sans text-sm text-gray-700 mb-4 line-clamp-4">
                  {`"{testimonial.review}"`}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-sans text-sm font-semibold text-[#181A2F]">
                      {testimonial.name}
                    </div>
                    <div className="font-sans text-xs text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white px-12 py-6 rounded-full font-sans font-bold text-base uppercase tracking-wider hover:shadow-2xl transition-all duration-500 hover:scale-105">
            Read All Reviews
            <Star
              size={20}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
