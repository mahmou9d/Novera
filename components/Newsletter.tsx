"use client";

import { useState } from "react";
import { Mail, Gift, Sparkles, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

const BENEFITS = [
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

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#37415C] py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FDA481]/10 rounded-full" />
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#B4182D]/10 rounded-full"
          style={{ animationDelay: "1s" }}
        />

        <div className="absolute top-40 left-40 text-[#FDA481]/10">
          <Sparkles size={80} />
        </div>
        <div className="absolute bottom-40 right-60 text-[#FDA481]/10">
          <Gift size={60} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FDA481]/10 px-4 py-2 rounded-full w-fit mb-6">
                <Gift className="text-[#FDA481]" size={20} />
                <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[#181A2F]">
                  Special Offer
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-4xl lg:text-6xl font-bold text-[#181A2F] mb-4 leading-tight">
                Join Our Style
                <span className="block text-[#FDA481]">Community</span>
              </h2>

              <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
                Be the first to know about new collections, exclusive sales, and
                styling tips. Plus get 15% off your first order!
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {BENEFITS.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="font-sans text-sm text-gray-700 font-medium">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Email Form or Success Message */}
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-14 pr-6 py-5 rounded-full border-2 border-gray-200 focus:border-[#FDA481] focus:outline-none font-sans text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-[#181A2F] to-[#242E49] text-white py-5 rounded-full font-sans font-bold text-base uppercase tracking-wider shadow-2xl flex items-center justify-center gap-3 hover:from-[#242E49] hover:to-[#181A2F]"
                  >
                    Subscribe & Save 15%
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-center gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <Check size={24} />
                  </div>
                  <div>
                    <div className="font-sans text-lg font-bold text-green-900 mb-1">
                      Welcome to the family!
                    </div>
                    <div className="font-sans text-sm text-green-700">
                      Check your email for your exclusive 15% discount code
                    </div>
                  </div>
                </div>
              )}

              <p className="font-sans text-xs text-gray-500 mt-4 text-center">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-64 lg:h-auto">
              <Image
                src="https://m.media-amazon.com/images/I/51PRNk79NiL._AC_SX679_.jpg"
                alt="Fashion Newsletter"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-[#181A2F]/40 to-transparent" />

              {/* Floating Discount Badge */}
              <div className="absolute top-8 right-8 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-[#FDA481] mb-1">
                    15%
                  </div>
                  <div className="font-sans text-sm text-gray-600 uppercase tracking-wider font-semibold">
                    Off First Order
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {STATS.map((stat, idx) => (
                    <div key={idx}>
                      <div className="font-serif text-2xl font-bold text-[#181A2F]">
                        {stat.value}
                      </div>
                      <div className="font-sans text-xs text-gray-600 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
