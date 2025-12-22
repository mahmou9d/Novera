"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoized Search Result Item
const SearchResultItem = memo<{
  title: string;
  description: string;
  onClick?: () => void;
  index: number;
}>(({ title, description, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{
      scale: 1.02,
      x: 5,
      backgroundColor: "rgba(249, 250, 251, 1)",
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="p-4 bg-gray-50 rounded-lg cursor-pointer"
  >
    <motion.h3
      className="font-semibold text-gray-800 mb-1"
      whileHover={{ x: 3 }}
    >
      {title}
    </motion.h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
));

SearchResultItem.displayName = "SearchResultItem";

// Memoized Empty State
const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="text-center py-12 text-gray-400"
  >
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-lg"
    >
      Start typing to search...
    </motion.p>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

const SearchSection = ({ isOpen, onClose }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => setSearchQuery(""), 300);
  }, [onClose]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-gray-800"
              >
                Search
              </motion.h2>
              <motion.button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close search"
                whileHover={{
                  rotate: 90,
                  scale: 1.1,
                  backgroundColor: "rgba(243, 244, 246, 1)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: searchQuery ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Search className="w-6 h-6 text-gray-400" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg hover:border-gray-300"
                  autoFocus
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5"
                      aria-label="Clear search"
                      whileHover={{
                        scale: 1.1,
                        rotate: 90,
                        backgroundColor: "rgba(243, 244, 246, 1)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Search Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 pt-0 max-h-96 overflow-y-auto space-y-3"
            >
              <AnimatePresence mode="wait">
                {searchQuery ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-gray-500 mb-4"
                    >
                      Search results for &quot;
                      <motion.span
                        className="font-semibold"
                        animate={{
                          color: ["#6B7280", "#3B82F6", "#6B7280"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {searchQuery}
                      </motion.span>
                      &quot;
                    </motion.p>
                    <div className="space-y-3">
                      <SearchResultItem
                        title="Premium Leather Jacket"
                        description="Timeless design meets exceptional craftsmanship"
                        index={0}
                      />
                      <SearchResultItem
                        title="Cashmere Turtleneck"
                        description="Weightless luxury in pure cashmere"
                        index={1}
                      />
                      <SearchResultItem
                        title="Italian Wool Suit"
                        description="Tailored perfection in premium Italian wool"
                        index={2}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(SearchSection);
