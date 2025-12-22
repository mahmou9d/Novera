"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/Productgrid";

// Product Type
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tag?: string;
  colors: string[];
}

// Sample Products Data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Leather Jacket",
    price: 485,
    category: "jackets",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    tag: "Exclusive",
    colors: ["#000000", "#1a1a1a", "#2d2d2d"],
  },
  {
    id: 2,
    name: "Linen Summer Suit",
    price: 320,
    originalPrice: 420,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
    tag: "Sale",
    colors: ["#f5f5dc", "#ffffff", "#e8e8e8"],
  },
  {
    id: 3,
    name: "Cashmere Overcoat",
    price: 890,
    category: "luxe",
    image: "https://m.media-amazon.com/images/I/51PRNk79NiL._AC_SX679_.jpg",
    tag: "New",
    colors: ["#8b7355", "#d4a574", "#f5f5dc"],
  },
  {
    id: 4,
    name: "Merino Wool Sweater",
    price: 245,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    colors: ["#2c3e50", "#34495e", "#95a5a6"],
  },
  {
    id: 5,
    name: "Tailored Tuxedo",
    price: 725,
    category: "formal",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    tag: "Trending",
    colors: ["#000000", "#1a1a1a", "#2d2d2d"],
  },
  {
    id: 6,
    name: "Classic Blazer",
    price: 420,
    originalPrice: 590,
    category: "essentials",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    tag: "Sale",
    colors: ["#2f4f4f", "#708090", "#1a1a2e"],
  },
  {
    id: 7,
    name: "Oxford Dress Shirt",
    price: 385,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80",
    tag: "New",
    colors: ["#ffffff", "#87ceeb", "#e6e6fa"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 295,
    category: "new",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    colors: ["#d2b48c", "#8b7355", "#2f4f4f"],
  },
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const categories = [
    { id: "all", name: "All" },
    { id: "jackets", name: "Jackets" },
    { id: "essentials", name: "Essentials" },
    { id: "luxe", name: "Luxe" },
    { id: "formal", name: "Formal" },
    { id: "new", name: "New" },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Shop Collection
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Explore our curated selection</p>
        </motion.div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="sticky top-4 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Search
                </h3>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Filter size={16} />
                  Categories
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([0, parseInt(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                      (priceRange[1] / 1000) * 100
                    }%, #E5E7EB ${
                      (priceRange[1] / 1000) * 100
                    }%, #E5E7EB 100%)`,
                  }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-gray-600 font-medium">$0</span>
                  <span className="text-sm font-bold text-blue-600">
                    ${priceRange[1]}
                  </span>
                </div>
              </div>

              {/* Reset Button */}
              {(selectedCategory !== "all" ||
                priceRange[1] !== 1000 ||
                searchTerm) && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 1000]);
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Reset Filters
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {filteredProducts.length}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Products Found
                  </p>
                  <p className="text-xs text-gray-500">
                    Page {currentPage} of {totalPages || 1}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <ProductGrid products={paginatedProducts} />

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center items-center gap-2 mt-12"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                      <ChevronLeft size={20} />
                    </motion.button>

                    {[...Array(totalPages)].map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </motion.button>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 1000]);
                    setSearchTerm("");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
