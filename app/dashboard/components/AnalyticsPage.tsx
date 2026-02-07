"use client";

import React from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

const analyticsData = [
  {
    label: "Page Views",
    value: "45,890",
    change: "+18.2%",
    trend: "up" as const,
  },
  {
    label: "Conversion",
    value: "3.24%",
    change: "+0.8%",
    trend: "up" as const,
  },
  {
    label: "Avg Order",
    value: "$156.90",
    change: "+5.4%",
    trend: "up" as const,
  },
  {
    label: "Bounce Rate",
    value: "42.8%",
    change: "-3.2%",
    trend: "down" as const,
  },
];

export const AnalyticsPage = () => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 text-base">
          Performance insights and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center shadow-2xl">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                  item.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {item.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {item.label}
            </p>
            <p className="text-3xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Traffic Sources</h2>
          <div className="space-y-5">
            {["Direct", "Organic Search", "Social Media", "Referral"].map(
              (source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-white">
                      {source}
                    </span>
                    <span className="text-base font-bold text-[#fda481]">
                      {45 - index * 10}%
                    </span>
                  </div>
                  <div className="h-3 bg-[#0f1117] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${45 - index * 10}%` }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#fda481] to-[#b4182d] rounded-full"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Top Regions</h2>
          <div className="space-y-4">
            {["United States", "United Kingdom", "Canada", "Australia"].map(
              (region, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold shadow-xl">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white">{region}</span>
                  </div>
                  <span className="font-bold text-[#fda481] text-base">
                    {32 - index * 5}%
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
