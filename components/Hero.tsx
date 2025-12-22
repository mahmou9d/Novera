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
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.05 }}
    className="inline-flex items-center gap-2 bg-burgundy backdrop-blur-sm text-peach px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-burgundy"
  >
    <motion.div
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Sparkles size={16} />
    </motion.div>
    <span className="text-sm font-semibold uppercase tracking-wider">
      New Collection 2024
    </span>
  </motion.div>
));

CollectionBadge.displayName = "CollectionBadge";

// Memoized Stat Item
const StatItem = memo<{ stat: Stat; index: number }>(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.05 }}
  >
    <motion.h3
      className="text-2xl lg:text-3xl font-bold text-peach"
      whileHover={{ scale: 1.1 }}
    >
      {stat.value}
    </motion.h3>
    <p className="text-xl font-bold text-black uppercase tracking-wide">
      {stat.label}
    </p>
  </motion.div>
));

StatItem.displayName = "StatItem";

// Memoized CTA Button
const CTAButton = memo<{
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  delay?: number;
}>(({ href, variant, children, delay = 0 }) => {
  const isPrimary = variant === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      whileTap={{ scale: 0.95 }}
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
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={20} />
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
});

CTAButton.displayName = "CTAButton";

// Memoized Floating Badge
const FloatingBadge = memo<{ badge: Badge; index: number }>(
  ({ badge, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        delay: 0.8 + index * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
      className={`absolute ${badge.position} ${badge.className}`}
    >
      {badge.icon && (
        <p className="text-sm font-bold">
          {badge.icon} {badge.title}
        </p>
      )}
      {!badge.icon && (
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs font-semibold uppercase"
        >
          {badge.title}
        </motion.p>
      )}
      <p
        className={badge.icon ? "text-xs text-gray-600" : "text-2xl font-bold"}
      >
        {badge.subtitle}
      </p>
    </motion.div>
  )
);

FloatingBadge.displayName = "FloatingBadge";

// Memoized Hero Image Section
const HeroImage = memo(() => (
  <motion.div
    initial={{ opacity: 0, x: 50, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    className="relative order-first lg:order-last"
  >
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-100 sm:h-125 lg:h-150"
    >
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
      >
        <motion.div>
          <Image
            src="/hero-model.jpg"
            alt="Fashion Model"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="object-cover"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Floating Badges */}
      {FLOATING_BADGES.map((badge, index) => (
        <FloatingBadge key={index} badge={badge} index={index} />
      ))}
    </motion.div>

    {/* Decorative Elements */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{ duration: 4, repeat: Infinity }}
      className="hidden lg:block absolute -top-10 -left-10 w-32 h-32 bg-peach/20 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 bg-crimson/20 rounded-full blur-2xl"
    />
  </motion.div>
));

HeroImage.displayName = "HeroImage";

// Memoized Bottom Wave
const BottomWave = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.8 }}
    className="absolute -bottom-3 left-0 right-0"
  >
    <motion.svg
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      viewBox="0 0 1440 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <path
        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
        fill="white"
      />
    </motion.svg>
  </motion.div>
));

BottomWave.displayName = "BottomWave";

// Main Hero Component
const Hero = () => {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-navy via-slate to-steel overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-peach rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-crimson rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-150 lg:min-h-175 py-12 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <CollectionBadge />

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-crimson leading-tight"
              >
                Elevate Your
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="block text-peach mt-2"
                >
                  Style Today
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0"
              >
                Discover premium fashion that defines your unique personality.
                Shop the latest trends with up to 50% off.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
              <CTAButton href="/shop" variant="primary" delay={0}>
                Shop Now
              </CTAButton>
              <CTAButton href="/collections" variant="secondary" delay={0.1}>
                View Collections
              </CTAButton>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex gap-8 lg:gap-12 justify-center lg:justify-start pt-4 lg:pt-8 border-t border-steel/30"
            >
              {STATS.map((stat, index) => (
                <StatItem key={index} stat={stat} index={index} />
              ))}
            </motion.div>
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
