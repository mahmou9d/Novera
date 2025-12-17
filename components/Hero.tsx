import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-navy via-slate to-steel overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-peach rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-crimson rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-burgundy backdrop-blur-sm text-peach px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-burgundy">
              <Sparkles size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                New Collection 2024
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-crimson leading-tight">
                Elevate Your
                <span className="block text-peach mt-2">Style Today</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0">
                Discover premium fashion that defines your unique personality.
                Shop the latest trends with up to 50% off.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
              <Link
                href="/shop"
                className="group bg-peach text-navy px-8 py-4 rounded-full font-bold text-base uppercase tracking-wide hover:bg-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                Shop Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/collections"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-base uppercase tracking-wide hover:bg-white hover:text-navy transition-all duration-300 w-full sm:w-auto text-center"
              >
                View Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 lg:gap-12 justify-center lg:justify-start pt-4 lg:pt-8 border-t border-steel/30">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-peach">
                  500+
                </h3>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Products
                </p>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-peach">
                  50K+
                </h3>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Customers
                </p>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-peach">
                  4.9★
                </h3>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-model.jpg"
                  alt="Fashion Model"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge - Sale */}
              <div className="absolute top-8 right-8 bg-crimson text-white px-6 py-3 rounded-2xl shadow-xl animate-bounce">
                <p className="text-xs font-semibold uppercase">Sale</p>
                <p className="text-2xl font-bold">50% OFF</p>
              </div>

              {/* Floating Badge - Free Shipping */}
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm text-navy px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-sm font-bold">🚚 Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $100</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block absolute -top-10 -left-10 w-32 h-32 bg-peach/20 rounded-full blur-2xl"></div>
            <div className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 bg-crimson/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
