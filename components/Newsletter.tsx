"use client";

import React, { useState, useCallback, memo } from "react";
import { Mail, Gift, Sparkles, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Benefit {
  icon: string;
  text: string;
}

// Constants
const BENEFITS: Benefit[] = [
  { icon: "🎁", text: "15% off your first order" },
  { icon: "⚡", text: "Early access to sales" },
  { icon: "✨", text: "Exclusive member deals" },
  { icon: "📦", text: "Free shipping updates" },
];

const STATS = [
  { value: "50K+", label: "Subscribers" },
  { value: "4.9★", label: "Rating" },
  { value: "100%", label: "Free" },
];

// Memoized Badge Component
const SpecialOfferBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, x: -30, scale: 0.8 }}
    whileInView={{ opacity: 1, x: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, type: "spring" }}
    whileHover={{ scale: 1.05 }}
    className="inline-flex items-center gap-2 bg-[#FDA481]/10 px-4 py-2 rounded-full w-fit mb-6"
  >
    <motion.div
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Gift className="text-[#FDA481]" size={20} />
    </motion.div>
    <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
      Special Offer
    </span>
  </motion.div>
));

SpecialOfferBadge.displayName = "SpecialOfferBadge";

// Memoized Benefit Item
const BenefitItem = memo<{ benefit: Benefit; index: number }>(
  ({ benefit, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
      }}
      className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-gray-100"
    >
      <motion.span
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
        className="text-2xl"
      >
        {benefit.icon}
      </motion.span>
      <span className="font-sans text-sm text-gray-700 font-medium">
        {benefit.text}
      </span>
    </motion.div>
  )
);

BenefitItem.displayName = "BenefitItem";

// Memoized Success Message
const SuccessMessage = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-center gap-4"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="bg-green-500 text-white p-3 rounded-full"
    >
      <Check size={24} />
    </motion.div>
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="font-sans text-lg font-bold text-green-900 mb-1"
      >
        Welcome to the family!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="font-sans text-sm text-green-700"
      >
        Check your email for your exclusive 15% discount code
      </motion.div>
    </div>
  </motion.div>
));

SuccessMessage.displayName = "SuccessMessage";

// Memoized Floating Badge
const FloatingBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    animate={{ opacity: 1, scale: 1, rotate: 3 }}
    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
    whileHover={{
      scale: 1.1,
      rotate: 12,
      boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
    }}
    className="absolute top-8 right-8 bg-white rounded-2xl p-6 shadow-2xl"
  >
    <div className="text-center">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-serif text-5xl font-bold text-[#FDA481] mb-1"
      >
        15%
      </motion.div>
      <div className="font-sans text-sm text-gray-600 uppercase tracking-wider font-semibold">
        Off First Order
      </div>
    </div>
  </motion.div>
));

FloatingBadge.displayName = "FloatingBadge";

// Memoized Stats Section
const StatsSection = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.6 }}
    className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
  >
    <div className="grid grid-cols-3 gap-4 text-center">
      {STATS.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
          whileHover={{ scale: 1.1, y: -3 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
            className="font-serif text-2xl font-bold text-[#181A2F]"
          >
            {stat.value}
          </motion.div>
          <div className="font-sans text-xs text-gray-600 uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

StatsSection.displayName = "StatsSection";

// Main Component
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email) {
        setIsSubscribed(true);
        setTimeout(() => {
          setEmail("");
          setIsSubscribed(false);
        }, 3000);
      }
    },
    [email]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  return (
    <div className="relative bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#37415C] py-20 lg:py-32 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#FDA481]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#B4182D]/10 rounded-full blur-3xl"
        />

        {/* Decorative Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-40 text-[#FDA481]/10"
        >
          <Sparkles size={80} />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 right-60 text-[#FDA481]/10"
        >
          <Gift size={60} />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          whileHover={{ boxShadow: "0 40px 80px rgba(0,0,0,0.3)" }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <SpecialOfferBadge />

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-serif text-4xl lg:text-6xl font-bold text-[#181A2F] mb-4 leading-tight"
              >
                Join Our Style
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="block text-[#FDA481]"
                >
                  Community
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-sans text-lg text-gray-600 mb-8 leading-relaxed"
              >
                Be the first to know about new collections, exclusive sales, and
                styling tips. Plus get 15% off your first order!
              </motion.p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {BENEFITS.map((benefit, idx) => (
                  <BenefitItem key={idx} benefit={benefit} index={idx} />
                ))}
              </div>

              {/* Email Form */}
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, x: 2 }}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      >
                        <Mail size={20} />
                      </motion.div>
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        required
                        className="w-full pl-14 pr-6 py-5 rounded-full border-2 border-gray-200 focus:border-[#FDA481] focus:outline-none font-sans text-base transition-all duration-300"
                      />
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      type="submit"
                      className="group w-full bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white py-5 rounded-full font-sans font-bold text-base uppercase tracking-wider shadow-2xl flex items-center justify-center gap-3"
                      whileHover={{
                        scale: 1.02,
                        y: -3,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Subscribe & Save 15%
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={20} />
                      </motion.div>
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SuccessMessage />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-sans text-xs text-gray-500 mt-4 text-center"
              >
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </motion.p>
            </div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-64 lg:h-auto"
            >
              <Image
                src="https://m.media-amazon.com/images/I/51PRNk79NiL._AC_SX679_.jpg"
                alt="Fashion Newsletter"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={false}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-[#181A2F]/40 to-transparent"
              />

              {/* Floating Badge */}
              <FloatingBadge />

              {/* Stats */}
              <StatsSection />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(Newsletter);
