"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";


const Hero = () => {
  const stats = [
    { value: "500+", label: "Products" },
    { value: "50K+", label: "Customers" },
    { value: "4.9★", label: "Rating" },
  ];

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-navy via-slate to-steel overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 xl:px-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-150 lg:min-h-175 py-12 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-burgundy text-peach px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-burgundy">
              <div>
                <Sparkles size={16} />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider">
                New Collection 2024
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-6xl  lg:text-6xl xl:text-7xl font-bold text-crimson leading-tight">
                Elevate Your
                <span className="block text-peach mt-2">Style Today</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0">
                Discover premium fashion that defines your unique personality.
                Shop the latest trends with up to 50% off.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center lg:justify-start sm:flex-row gap-4 items-center lg:items-start">
              <div>
                <Link
                  href="/shop"
                  className="group px-8 py-4 rounded-full font-bold text-base uppercase tracking-wide 
                    shadow-lg flex items-center gap-3 
                    w-full sm:w-auto justify-center
                    bg-peach text-navy hover:bg-white hover:shadow-2xl"
                >
                  Shop Now
                  <div>
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </div>

              <div>
                <Link
                  href="#products"
                  className="px-8 py-4 rounded-full font-bold text-base uppercase tracking-wide 
                    shadow-lg flex items-center gap-3 
                    w-full sm:w-auto justify-center
                    border-2 border-white text-white hover:bg-white hover:text-black"
                >
                  View Collections
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 lg:gap-12 justify-center lg:justify-start pt-4 lg:pt-8 border-t border-steel/30">
              {stats.map((stat, index) => (
                <div key={index}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-peach">
                    {stat.value}
                  </h3>
                  <p className="text-xl font-bold text-black uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-first lg:order-last hidden lg:block z-30">
            <div className="relative w-full h-100 sm:h-125 lg:h-150">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-model.jpg"
                  alt="Fashion Model"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge - Sale */}
              <div className="absolute top-8 right-8 bg-crimson text-white px-6 py-3 rounded-2xl shadow-xl">
                <p className="text-xs font-semibold uppercase">Sale</p>
                <p className="text-2xl font-bold">50% OFF</p>
              </div>

              {/* Floating Badge - Free Shipping */}
              <div className="absolute bottom-8 left-8 bg-white/95 text-navy px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-sm font-bold">🚚 Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $100</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block absolute -top-10 -left-10 w-32 h-32 bg-peach/20 rounded-full -z-10" />
            <div className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 bg-crimson/20 rounded-full -z-10" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-3 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
