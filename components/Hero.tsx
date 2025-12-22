"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Types
interface Stat {
  value: string;
  label: string;
}

interface Badge {
  icon?: string;
  title: string;
  subtitle: string;
  className: string;
  position: string;
  animation?: string;
}

// Constants
const STATS: Stat[] = [
  { value: "500+", label: "Products" },
  { value: "50K+", label: "Customers" },
  { value: "4.9★", label: "Rating" },
];

const FLOATING_BADGES: Badge[] = [
  {
    title: "Sale",
    subtitle: "50% OFF",
    className:
      "bg-crimson text-white px-6 py-3 rounded-2xl shadow-xl transition-transform duration-300",
    position: "top-8 right-8",
    animation: "animate-bounce",
  },
  {
    icon: "🚚",
    title: "Free Shipping",
    subtitle: "On orders over $100",
    className:
      "bg-white/95 backdrop-blur-sm text-navy px-6 py-4 rounded-2xl shadow-xl transition-transform duration-300",
    position: "bottom-8 left-8",
  },
];

// Memoized Badge Component
const CollectionBadge = memo(() => (
  <div className="inline-flex items-center gap-2 bg-burgundy backdrop-blur-sm text-peach px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-burgundy transition-transform duration-300">
    <Sparkles size={16} />
    <span className="text-sm font-semibold uppercase tracking-wider">
      New Collection 2024
    </span>
  </div>
));

CollectionBadge.displayName = "CollectionBadge";

// Memoized Stat Item
const StatItem = memo<{ stat: Stat }>(({ stat }) => (
  <div className="transform transition-transform duration-300">
    <h3 className="text-2xl lg:text-3xl font-bold text-peach">{stat.value}</h3>
    <p className="text-xl font-bold text-black uppercase tracking-wide">
      {stat.label}
    </p>
  </div>
));

StatItem.displayName = "StatItem";

// Memoized CTA Button
const CTAButton = memo<{
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}>(({ href, variant, children }) => {
  const isPrimary = variant === "primary";

  return (
     <motion.button
              whileHover={{
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            whileTap={{ scale: 0.9 }}
          >
    <Link
      href={href}
      className={`
        group px-8 py-4 rounded-full font-bold text-base uppercase tracking-wide 
        transition-all duration-300 shadow-lg flex items-center gap-3 
        w-full sm:w-auto justify-center
        ${
          isPrimary
            ? "bg-peach text-navy hover:bg-white hover:shadow-2xl"
            : "border-2 border-white text-white hover:bg-white hover:text-black"
        }
      `}
    >

      {children}
      {isPrimary && (
        <ArrowRight
          size={20}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      )}
    </Link>
          </motion.button>

  );
});

CTAButton.displayName = "CTAButton";

// Memoized Floating Badge
const FloatingBadge = memo<{ badge: Badge }>(({ badge }) => (
  <div
    className={`absolute ${badge.position} ${badge.className} ${
      badge.animation || ""
    }`}
  >
    {badge.icon && (
      <p className="text-sm font-bold">
        {badge.icon} {badge.title}
      </p>
    )}
    {!badge.icon && (
      <p className="text-xs font-semibold uppercase">{badge.title}</p>
    )}
    <p className={badge.icon ? "text-xs text-gray-600" : "text-2xl font-bold"}>
      {badge.subtitle}
    </p>
  </div>
));

FloatingBadge.displayName = "FloatingBadge";

// Memoized Hero Image Section
const HeroImage = memo(() => (
  <div className="relative order-first lg:order-last">
    <div className="relative w-full h-100 sm:h-125 lg:h-150 transform transition-transform duration-500">
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

      {/* Floating Badges */}
      {FLOATING_BADGES.map((badge, index) => (
        <FloatingBadge key={index} badge={badge} />
      ))}
    </div>

    {/* Decorative Elements */}
    <div className="hidden lg:block absolute -top-10 -left-10 w-32 h-32 bg-peach/20 rounded-full blur-2xl animate-pulse" />
    <div className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 bg-crimson/20 rounded-full blur-2xl animate-pulse" />
  </div>
));

HeroImage.displayName = "HeroImage";

// Memoized Bottom Wave
const BottomWave = memo(() => (
  <div className="absolute -bottom-3 left-0 right-0">
    <svg
      viewBox="0 0 1440 130"
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
));

BottomWave.displayName = "BottomWave";

// Main Hero Component
const Hero = () => {
  return (
    <section
      id="hero"
      className="relative bg-linear-to-br from-navy via-slate to-steel overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-peach rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-crimson rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-150 lg:min-h-175 py-12 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <CollectionBadge />

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-crimson leading-tight transform transition-transform duration-300">
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
              <CTAButton href="/shop" variant="primary">
                Shop Now
              </CTAButton>
              <CTAButton href="/collections" variant="secondary">
                View Collections
              </CTAButton>
            </div>

            {/* Stats */}
            <div className="flex gap-8 lg:gap-12 justify-center lg:justify-start pt-4 lg:pt-8 border-t border-steel/30">
              {STATS.map((stat, index) => (
                <StatItem key={index} stat={stat} />
              ))}
            </div>
          </div>

          {/* Right Image */}
          <HeroImage />
        </div>
      </div>

      {/* Bottom Wave */}
      <BottomWave />
    </section>
  );
};

export default memo(Hero);
