"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Clock, Flame, Tag, ArrowRight, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Types
interface Deal {
  id: number;
  name: string;
  discount: number;
  image: string;
  code: string;
  minPurchase: number;
  tag: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

// Constants
const DEALS: Deal[] = [
  {
    id: 1,
    name: "Summer Collection",
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=85",
    code: "SUMMER50",
    minPurchase: 150,
    tag: "Limited Time",
  },
  {
    id: 2,
    name: "New Arrivals",
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=85",
    code: "NEW30",
    minPurchase: 100,
    tag: "Today Only",
  },
  {
    id: 3,
    name: "Bundle Deal",
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=85",
    code: "BUNDLE40",
    minPurchase: 200,
    tag: "Best Value",
  },
];

// Memoized Timer Box
const TimerBox = memo<{ value: number; label: string; delay?: number }>(
  ({ value, label, delay = 0 }) => (
    <div
      className="bg-white rounded-2xl p-6 lg:p-8 text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="font-display text-5xl lg:text-7xl text-[#B4182D] mb-2">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="font-body text-sm lg:text-base text-gray-600 uppercase tracking-wider font-semibold">
        {label}
      </div>
    </div>
  )
);

TimerBox.displayName = "TimerBox";

// Memoized Deal Card
const DealCard = memo<{
  deal: Deal;
}>(({ deal }) => (
  <motion.div
    className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{
      y: -8,
      transition: { duration: 0.3 },
    }}
  >
    {/* Image */}
    <div className="relative h-80 overflow-hidden">
      <Image
        src={deal.image}
        alt={deal.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Animated Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        initial={{ opacity: 0.6 }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />

      {/* Tag with slide animation */}
      <motion.div
        className="absolute top-6 left-6"
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}
      >
        <motion.div
          className="bg-yellow-400 text-[#181A2F] px-4 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
          whileHover={{
            x: 5,
            boxShadow: "0 10px 25px rgba(250, 204, 21, 0.4)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Zap size={14} />
          </motion.div>
          {deal.tag}
        </motion.div>
      </motion.div>

      {/* Discount Badge with bounce */}
      <motion.div
        className="absolute top-6 right-6"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 3 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.3,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        <motion.div
          className="bg-[#B4182D] text-white rounded-2xl p-4 shadow-2xl"
          whileHover={{
            rotate: 12,
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(180, 24, 45, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <motion.div
            className="font-display text-4xl leading-none"
            animate={{
              // scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {deal.discount}%
          </motion.div>
          <div className="font-body text-xs uppercase tracking-wider">Off</div>
        </motion.div>
      </motion.div>

      {/* Bottom Info with fade up */}
      <motion.div
        className="absolute bottom-6 left-6 right-6"
        initial={{  opacity: 0 }}
        whileInView={{  opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.h3
          className="font-display text-3xl text-white mb-2 uppercase"
          transition={{ type: "spring", stiffness: 300 }}
        >
          {deal.name}
        </motion.h3>
      </motion.div>
    </div>

    {/* Card Content */}
    <motion.div
      className="p-6 space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      {/* Minimum Purchase */}
      <motion.div
        className="flex items-center gap-2 text-sm text-gray-600 font-body"

      >
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
          <Tag size={16} />
        </motion.div>
        <span>Min. purchase ${deal.minPurchase}</span>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        className="w-full group/btn bg-gradient-to-r from-[#B4182D] to-[#54162B] text-white py-4 rounded-full font-body font-bold uppercase tracking-wider hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
        whileHover={{
          boxShadow: "0 20px 40px rgba(180, 24, 45, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
      >
        Shop Now
        <ArrowRight
          size={20}
          className="group-hover/btn:translate-x-2 transition-transform duration-300"
        />
      </motion.button>
    </motion.div>
  </motion.div>
));

DealCard.displayName = "DealCard";

// Main Component
const SpecialDeals = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  }, []);

  return (
    <div
      id="deals"
      className="relative bg-linear-to-br from-[#B4182D] via-[#8B0000] to-[#54162B] py-20 lg:py-32 overflow-hidden"
    >
      <style jsx>{`
        @keyframes float-up {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }

        .float-up {
          animation: float-up 6s ease-in-out infinite;
        }

        .shine {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shine 3s infinite;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FDA481]/10 rounded-full blur-3xl float-up" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl float-up"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl float-up"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/20 transition-transform duration-300">
            <Flame className="text-yellow-400" size={24} />
            <span className="font-body text-sm font-bold uppercase tracking-wider text-white">
              Flash Sale Alert
            </span>
          </div>

          <h2 className="font-display text-6xl lg:text-8xl text-white mb-6 uppercase">
            Hot Deals
          </h2>
          <p className="font-body text-xl text-white/90 max-w-2xl mx-auto font-light">
            Exclusive offers you can&apos;t afford to miss
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 shine" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Clock className="text-yellow-400" size={32} />
              <h3 className="font-display text-3xl lg:text-4xl text-white uppercase">
                Hurry! Sale Ends In
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-3xl mx-auto">
              <TimerBox value={timeLeft.hours} label="Hours" delay={0} />
              <TimerBox value={timeLeft.minutes} label="Minutes" delay={0.2} />
              <TimerBox value={timeLeft.seconds} label="Seconds" delay={0.4} />
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {DEALS.map((deal) => (
            <DealCard key={deal.id} deal={deal}/>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <motion.button
            className="group inline-flex items-center gap-4 bg-white text-[#B4182D] px-12 py-6 rounded-full font-body font-bold text-base uppercase tracking-wider hover:bg-yellow-400 hover:text-[#181A2F] transition-all duration-500 shadow-2xl hover:shadow-3xl"            
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
            <TrendingUp
              size={24}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            View All Deals
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default memo(SpecialDeals);
