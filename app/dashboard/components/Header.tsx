"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-20 bg-[#1a1d29] border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#0f1117] border border-white/5 rounded-xl focus:outline-none focus:border-[#fda481] focus:ring-2 focus:ring-[#fda481]/20 transition-all text-white placeholder:text-gray-500 text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#b4182d] rounded-full ring-2 ring-[#1a1d29]" />
        </motion.button>
      </div>
    </header>
  );
};
