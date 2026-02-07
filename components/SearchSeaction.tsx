/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TProduct } from "@/type/type";
import { useGetProducts } from "@/hooks/useProducts";

interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSection = ({ isOpen, onClose }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, isError } = useGetProducts();

  const filteredResults = useMemo(() => {
    if (!data || !searchQuery) return [];
    const products = Array.isArray(data) ? data : data.products || data || [];
    return products.filter(
      (product: TProduct) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, data]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
    setTimeout(() => setSearchQuery(""), 300);
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          <div
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-[#fca481] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Search Products
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#fca481] focus:ring-4 focus:ring-[#fca481]/20 transition-all text-base"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 max-h-96 overflow-y-auto custom-scrollbar">
              {!searchQuery ? (
                // Empty State
                <div
                  className="text-center py-12"
                >
                  <div className="bg-[#fca481]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-[#fca481]" />
                  </div>
                  <p className="text-lg text-gray-600">
                    Start typing to search...
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-[#fca481] animate-pulse mx-auto mb-3" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-medium">
                    Error loading products
                  </p>
                </div>
              ) : filteredResults.length > 0 ? (
                <>
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#fca481]">
                        {filteredResults.length}
                      </span>{" "}
                      {filteredResults.length === 1 ? "result" : "results"} for
                      &quot;{searchQuery}&quot;
                    </p>
                  </div>
                  <div className="space-y-3">
                    {filteredResults.map((product: TProduct, index: number) => (
                      <div
                        key={product.id}
                        className="p-4 bg-white border-2 border-gray-100 hover:border-[#fca481] rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg"
                      >
                        <h3 className="font-bold text-gray-800 mb-2 text-base">
                          {product.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-[#fca481]/10 text-[#fca481] text-sm font-medium rounded-lg">
                          {product.category_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="text-center py-12"
                >
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Try different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchSection;
