"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  X,
  ShoppingBag,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/Productgrid";
import { useGetProducts } from "@/hooks/useProducts";
import { TProduct } from "@/type/type";
import IsLoading from "@/components/IsLoading";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Server-side pagination
  const { data, isLoading, isError, error } = useGetProducts(currentPage);

  // Memoize products to prevent unnecessary re-renders
  const products = useMemo(() => data?.products || [], [data?.products]);
  const totalCount = useMemo(() => data?.count || 0, [data?.count]);
  const hasNext = useMemo(() => data?.next !== null, [data?.next]);
  const hasPrevious = useMemo(() => data?.previous !== null, [data?.previous]);

  // استخراج الفئات
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [{ id: "all", name: "All" }];

    const allCategories = products.map((p: TProduct) => p.category_name);
    const uniqueCategories = Array.from(new Set(allCategories));

    return [
      { id: "all", name: "All Products" },
      ...uniqueCategories.map((cat) => ({
        id: cat,
        name: cat,
      })),
    ];
  }, [products]);

  // حساب أقصى سعر
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 1000;

    const prices = products
      .map((p: TProduct) => parseFloat(p.lowest_price))
      .filter((price: number) => !isNaN(price));

    if (prices.length === 0) return 1000;

    return Math.ceil(Math.max(...prices) / 100) * 100;
  }, [products]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((product: TProduct) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_name.toLowerCase() === selectedCategory;

      const productPrice = parseFloat(product.lowest_price);
      const matchesPrice =
        !isNaN(productPrice) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Reset price range when products load
  React.useEffect(() => {
    if (products && products.length > 0 && priceRange[1] === 1000) {
      setPriceRange([0, maxPrice]);
    }
  }, [products, maxPrice, priceRange]);

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNext && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" || priceRange[1] !== maxPrice || searchTerm;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-[#fef5f1]">
        <Header />
        <IsLoading />
        <Footer />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-red-50">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center bg-white border-2 border-red-200 rounded-2xl p-10 shadow-xl max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">
                {error?.message || "We couldn't load the products"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl "
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-[#fef5f1]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No Products Yet
              </h3>
              <p className="text-gray-600 text-lg">
                Our collection is coming soon. Stay tuned!
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-white to-[#fef5f1]">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:p-10 xl:px-20 py-8 lg:py-12">
        {/* Enhanced Header with Stats */}
        <div className="mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-[#fca481] to-[#fd9166] rounded-2xl shadow-xl">
                  <LayoutGrid className="text-white" size={28} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-[#fca481] to-gray-900 bg-clip-text text-transparent">
                  Shop Collection
                </h1>
              </div>
              <p className="text-gray-600 text-base lg:text-lg">
                Discover our curated selection of premium products
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3 lg:gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="text-[#fca481]" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Total
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>

              <div className="bg-gradient-to-br from-[#fca481] to-[#fd9166] rounded-xl shadow-lg p-4 min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="text-white" size={18} />
                  <span className="text-xs font-semibold text-white/80 uppercase">
                    Page
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{currentPage}</p>
                <p className="text-xs text-white/80">of {totalPages || 1}</p>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-gray-700 shadow-md mb-5"
          >
            <SlidersHorizontal size={20} />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && (
              <span className="ml-auto bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Bar */}
            <div className="mb-6 lg:mb-8 p-5 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#fca481] to-[#fd9166] rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg">
                  {filteredProducts.length}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {filteredProducts.length === 1 ? "Product" : "Products"}{" "}
                    Found
                  </p>
                  <p className="text-sm text-gray-500">
                    Showing page {currentPage} of {totalPages || 1}
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 bg-[#fef5f1] text-[#fca481] px-4 py-2 rounded-xl border border-[#fca481]/20">
                  <Filter size={16} />
                  <span className="text-sm font-semibold">Filters Active</span>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div>
                  <ProductGrid products={filteredProducts} />
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-10 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!hasPrevious || currentPage === 1}
                      className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:from-[#fca481] hover:to-[#fd9166] hover:text-white hover:border-[#fca481]  shadow-md"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`w-12 h-12 rounded-xl font-bold  shadow-md ${
                              currentPage === pageNum
                                ? "bg-gradient-to-br from-[#fca481] to-[#fd9166] text-white shadow-lg shadow-[#fca481]/30 scale-110"
                                : "bg-white border-2 border-gray-200 hover:border-[#fca481] text-gray-700 hover:bg-[#fef5f1]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={!hasNext || currentPage === totalPages}
                      className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:from-[#fca481] hover:to-[#fd9166] hover:text-white hover:border-[#fca481]  shadow-md"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  No Products Match
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white rounded-xl font-bold shadow-lg hover:shadow-xl  inline-flex items-center gap-2"
                >
                  <X size={20} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>{" "}
          {/* Sidebar Filters */}
            {(showFilters || window.innerWidth >= 1024) && (
              <div className="lg:w-80 flex-shrink-0">
                <div className="sticky top-4 space-y-4">
                  {/* Search */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="text-[#fca481]" size={18} />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Search
                      </h3>
                    </div>
                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Find your product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gradient-to-r from-gray-50 to-[#fef5f1] border-2 border-transparent rounded-xl focus:border-[#fca481] focus:from-white focus:to-white  outline-none text-sm font-medium"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#fca481]"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="text-[#fca481]" size={18} />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Categories
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {categories.map((category, index) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-5 py-3 rounded-xl text-sm font-semibold  text-left relative overflow-hidden group ${
                            selectedCategory === category.id
                              ? "bg-gradient-to-r from-[#fca481] to-[#fd9166] text-white shadow-lg shadow-[#fca481]/30"
                              : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-[#fef5f1] hover:to-[#fef5f1] border border-gray-200"
                          }`}
                        >
                          {selectedCategory === category.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[#fca481] to-[#fd9166]" />
                          )}
                          <span className="relative z-10">
                            {category.name as string}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <SlidersHorizontal className="text-[#fca481]" size={18} />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Price Range
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([0, parseInt(e.target.value)])
                        }
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, #fca481 0%, #fca481 ${
                            (priceRange[1] / maxPrice) * 100
                          }%, #E5E7EB ${(priceRange[1] / maxPrice) * 100}%, #E5E7EB 100%)`,
                        }}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Min</p>
                          <p className="text-sm font-bold text-gray-900">$0</p>
                        </div>
                        <div className="text-gray-400">—</div>
                        <div className="flex-1 bg-gradient-to-r from-[#fca481] to-[#fd9166] rounded-xl px-4 py-2 shadow-md">
                          <p className="text-xs text-white/80 mb-1">Max</p>
                          <p className="text-sm font-bold text-white">
                            ${priceRange[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="w-full px-5 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-700  flex items-center justify-center gap-2 shadow-xl group"
                    >
                      <X
                        size={18}
                        className="group-hover:rotate-90"
                      />
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
