"use client";

import { useState, useEffect } from "react";
import { Clock, Flame, Tag, ArrowRight, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";

const DEALS = [
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

export default function SpecialDeals() {
  const [timeLeft, setTimeLeft] = useState({
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

  return (
    <div
      id="deals"
      className="relative bg-gradient-to-br from-[#B4182D] via-[#8B0000] to-[#54162B] py-20 lg:py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FDA481]/10 rounded-full " />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/10 rounded-full " />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full mb-6 border border-white/20">
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
        <div className="bg-white/10 border-2 border-white/20 rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Clock className="text-yellow-400" size={32} />
              <h3 className="font-display text-3xl lg:text-4xl text-white uppercase">
                Hurry! Sale Ends In
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-3xl mx-auto">
              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 text-center">
                <div className="font-display text-5xl lg:text-7xl text-[#B4182D] mb-2">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="font-body text-sm lg:text-base text-gray-600 uppercase tracking-wider font-semibold">
                  Hours
                </div>
              </div>

              {/* Minutes */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 text-center">
                <div className="font-display text-5xl lg:text-7xl text-[#B4182D] mb-2">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="font-body text-sm lg:text-base text-gray-600 uppercase tracking-wider font-semibold">
                  Minutes
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 text-center">
                <div className="font-display text-5xl lg:text-7xl text-[#B4182D] mb-2">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="font-body text-sm lg:text-base text-gray-600 uppercase tracking-wider font-semibold">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {DEALS.map((deal) => (
            <div
              key={deal.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Tag */}
                <div className="absolute top-6 left-6">
                  <div className="bg-yellow-400 text-[#181A2F] px-4 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl">
                    <Zap size={14} />
                    {deal.tag}
                  </div>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-[#B4182D] text-white rounded-2xl p-4 shadow-2xl">
                    <div className="font-display text-4xl leading-none">
                      {deal.discount}%
                    </div>
                    <div className="font-body text-xs uppercase tracking-wider">
                      Off
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-3xl text-white mb-2 uppercase">
                    {deal.name}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
                  <Tag size={16} />
                  <span>Min. purchase ${deal.minPurchase}</span>
                </div>

                <button className="w-full bg-gradient-to-r from-[#B4182D] to-[#54162B] text-white py-4 rounded-full font-body font-bold uppercase tracking-wider hover:from-[#8B0000] hover:to-[#3d0f1f] flex items-center justify-center gap-3">
                  Shop Now
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-4 bg-white text-[#B4182D] px-12 py-6 rounded-full font-body font-bold text-base uppercase tracking-wider shadow-2xl hover:bg-gray-100">
            <TrendingUp size={24} />
            View All Deals
            <ArrowRight size={20} className="group-hover:translate-x-1 " />
          </button>
        </div>
      </div>
    </div>
  );
}
