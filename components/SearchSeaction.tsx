"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { X, Search } from "lucide-react";

interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoized Search Result Item
const SearchResultItem = memo<{
  title: string;
  description: string;
  onClick?: () => void;
}>(({ title, description, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer
      transition-all duration-300 ease-in-out
      hover:scale-[1.02] hover:shadow-md animate-fadeIn"
  >
    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
));

SearchResultItem.displayName = "SearchResultItem";

// Memoized Empty State
const EmptyState = memo(() => (
  <div className="text-center py-12 text-gray-400">
    <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
    <p className="text-lg">Start typing to search...</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const SearchSection = ({ isOpen, onClose }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setSearchQuery("");
    }, 200);
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black z-40 overlay-animate"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl z-50 popup-animate`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Search</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg hover:border-gray-300"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-all duration-300"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 pt-0 max-h-96 overflow-y-auto space-y-3">
          {searchQuery ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Search results for &quot;
                <span className="font-semibold">{searchQuery}</span>&quot;
              </p>
              <SearchResultItem
                title="Premium Leather Jacket"
                description="Timeless design meets exceptional craftsmanship"
              />
              <SearchResultItem
                title="Cashmere Turtleneck"
                description="Weightless luxury in pure cashmere"
              />
              <SearchResultItem
                title="Italian Wool Suit"
                description="Tailored perfection in premium Italian wool"
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(SearchSection);
