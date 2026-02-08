"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SearchSeaction from "./SearchSeaction";
import { useAuth } from "@/hooks/useAuth";
import { useGetCartItems } from "@/hooks/useCart";

const NAV_LINKS = [
  { label: "Home", sectionId: "hero" },
  { label: "Shop", sectionId: "products" },
  { label: "Featured", sectionId: "featured" },
  { label: "Reviews", sectionId: "testimonials" },
  { label: "Hot Deals", sectionId: "deals", isSpecial: true, icon: "🔥" },
];

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { isAuthenticated, isLoading, logout,isAdmin } = useAuth();
  const { data: cartItems = [] } = useGetCartItems();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
console.log("🔥 BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
  return (
    <>
      <header className="bg-linear-to-r from-[#181A2F] via-[#242E49] to-[#181A2F] shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-5 lg:py-6">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-3xl lg:text-4xl font-bold text-[#FDA481] transition-colors duration-300"
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
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-[#FDA481]"
                aria-label="Search"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              {/* Cart */}
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

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="text-white hover:text-[#FDA481] "
                aria-label="Wishlist"
              >
                <Heart size={22} strokeWidth={2} />
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 hidden lg:block" />

              {/* Desktop Login/Logout */}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex gap-1">
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
                          dashboard
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:text-[#FDA481]"
                aria-label="Menu"
              >
                <div>
                  {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-[#242E49]/98 border-t border-white/10 overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className={`font-sans text-base font-semibold uppercase tracking-wider py-3 border-b border-white/10 hover:pl-3 transition-all text-left ${
                  link.isSpecial
                    ? "text-[#FDA481] hover:text-white"
                    : "text-white hover:text-[#FDA481]"
                }`}
              >
                {link.icon && <span>{link.icon}</span>} {link.label}
              </button>
            ))}

            {/* Mobile Login/Logout */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleLogout}
                      className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white text-center mt-4 shadow-xl"
                    >
                      Logout
                    </button>
                    <Link
                      href="/dashboard"
                      className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white text-center mt-4 shadow-xl"
                    >
                      Dashboard
                    </Link>
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

      <SearchSeaction
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;