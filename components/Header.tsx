"use client";

import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  PackageSearch,
  Package,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SearchSeaction from "./SearchSeaction";
import { useAuth } from "@/hooks/useAuth";
import { useGetCartItems } from "@/hooks/useCart";
import { useOrderHistory } from "@/hooks/usePayment";

const NAV_LINKS = [
  { label: "Home", sectionId: "hero" },
  { label: "Shop", sectionId: "products" },
  { label: "Featured", sectionId: "featured" },
  { label: "Hot Deals", sectionId: "deals", isSpecial: true, icon: "🔥" },
];

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const { isAuthenticated, isLoading, logout, isAdmin } = useAuth();
  const { data: cartItems = [] } = useGetCartItems();
  const { data: ordersData, isLoading: isOrdersLoading } = useOrderHistory();

  const cartCount = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0,
  );
  const orders = ordersData || [];
console.log(orders);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setMobileMenuOpen(false);
        router.push("/");
      },
    });
  };

  return (
    <>
      <header className="bg-linear-to-r from-[#181A2F] via-[#242E49] to-[#181A2F] shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-5 lg:py-6">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-3xl lg:text-4xl font-bold text-[#FDA481]"
            >
              Novera
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  className={`font-sans text-sm font-semibold uppercase tracking-wider py-2 relative group ${
                    link.isSpecial
                      ? "text-[#FDA481] hover:text-white font-bold flex items-center gap-2"
                      : "text-white hover:text-[#FDA481]"
                  }`}
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FDA481] group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Icons & Actions */}
            <div className="flex items-center gap-5 lg:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-[#FDA481]"
                aria-label="Search"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              <Link
                href="/cart"
                className="text-white hover:text-[#FDA481] relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={22} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B4182D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/wishlist"
                className="text-white hover:text-[#FDA481]"
                aria-label="Wishlist"
              >
                <Heart size={22} strokeWidth={2} />
              </Link>

              <div className="w-px h-6 bg-white/20 hidden lg:block" />

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex gap-1 items-center">
                      {/* ── Orders Icon ── */}
                      <button
                        onClick={() => setIsOrdersOpen(true)}
                        className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 text-white hover:text-[#FDA481] relative"
                        aria-label="My Orders"
                      >
                        <PackageSearch size={20} strokeWidth={2} />
                      </button>

                      <motion.button
                        onClick={handleLogout}
                        className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-5 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Logout
                      </motion.button>

                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-5 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] shadow-xl"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/login"
                        className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] shadow-xl"
                      >
                        Login
                      </Link>
                    </motion.div>
                  )}
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:text-[#FDA481]"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-[#242E49]/98 border-t border-white/10 overflow-hidden ${
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className={`font-sans text-base font-semibold uppercase tracking-wider py-3 border-b border-white/10 hover:pl-3 text-left ${
                  link.isSpecial
                    ? "text-[#FDA481] hover:text-white"
                    : "text-white hover:text-[#FDA481]"
                }`}
              >
                {link.icon && <span>{link.icon}</span>} {link.label}
              </button>
            ))}

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsOrdersOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bg-white/10 text-white px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 text-center mt-4 flex items-center justify-center gap-2"
                    >
                      <PackageSearch size={18} /> Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white text-center mt-4 shadow-xl"
                    >
                      Logout
                    </button>
                    {isAdmin && <Link
                      href="/dashboard"
                      className="col-span-2 bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white text-center shadow-xl"
                    >
                      Dashboard
                    </Link>}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white text-center mt-4 shadow-xl"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Orders Modal ── */}
      <AnimatePresence>
        {isOrdersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOrdersOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <PackageSearch className="text-[#FDA481]" size={24} />
                  <h2 className="text-xl font-bold text-white">My Orders</h2>
                </div>
                <button
                  onClick={() => setIsOrdersOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {isOrdersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2
                      className="animate-spin text-[#FDA481]"
                      size={36}
                    />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <Package size={48} className="text-gray-600" />
                    <p className="text-gray-400 text-lg">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(
                      (order: {
                        id: string;
                        status: string;
                        total_price: number;
                        created_at: string;
                        full_name: string;
                        full_address: string;
                        phone_number: string;
                        country: string;
                        items: {
                          variant_name: string;
                          variant_color: string;
                          variant_size: string;
                          quantity: number;
                          price: string;
                          subtotal: number;
                        }[];
                      }) => (
                        <div
                          key={order.id}
                          className="bg-[#1a1d29] border border-white/10 rounded-xl overflow-hidden"
                        >
                          {/* Order Header */}
                          <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-[#FDA481]/10 rounded-full flex items-center justify-center">
                                <Package size={16} className="text-[#FDA481]" />
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">
                                  Order #{order.id.slice(0, 8)}...
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(
                                    order.created_at,
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                order.status === "paid"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : order.status === "cancelled"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="divide-y divide-white/5">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between px-4 py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">
                                      {item.variant_name}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                      {item.variant_color} · {item.variant_size}{" "}
                                      · x{item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[#FDA481] font-semibold text-sm">
                                  ${item.subtotal.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10">
                            <div className="text-gray-400 text-xs">
                              {order.full_name} · {order.country}
                            </div>
                            <div className="text-white font-bold text-sm">
                              Total: ${order.total_price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchSeaction
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
