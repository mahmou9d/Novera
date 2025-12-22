"use client";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState, useCallback, memo, useMemo, useEffect } from "react";
import SearchSeaction from "./SearchSeaction";
import { useLogoutMutation } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Types
interface NavLink {
  label: string;
  sectionId: string;
  isSpecial?: boolean;
  icon?: string;
}

// Constants
const NAV_LINKS: NavLink[] = [
  { label: "Home", sectionId: "hero" },
  { label: "Shop", sectionId: "products" },
  { label: "Featured", sectionId: "featured" },
  { label: "Reviews", sectionId: "testimonials" },
  { label: "Hot Deals", sectionId: "deals", isSpecial: true, icon: "🔥" },
];

// Memoized Nav Link Button
const NavLinkButton = memo<{
  link: NavLink;
  onClick: (sectionId: string) => void;
  isMobile?: boolean;
}>(({ link, onClick, isMobile = false }) => {
  const baseClasses = isMobile
    ? "font-sans text-base font-semibold uppercase tracking-wider py-3 border-b border-white/10 hover:pl-3 text-left transition-all duration-300"
    : "font-sans text-sm font-semibold uppercase tracking-wider py-2 transition-all duration-300 relative group";

  const colorClasses = link.isSpecial
    ? "text-[#FDA481] hover:text-white"
    : "text-white hover:text-[#FDA481]";

  return (
    <>
      <button
        onClick={() => onClick(link.sectionId)}
        className={`relative overflow-hidden ${baseClasses} ${colorClasses} ${
          link.isSpecial && !isMobile ? "font-bold flex items-center gap-2" : ""
        }`}
        onMouseEnter={(e) => {
          const span = e.currentTarget.querySelector("span.underline-animate");
          span?.classList.add("active");
        }}
        onMouseLeave={(e) => {
          const span = e.currentTarget.querySelector("span.underline-animate");
          span?.classList.remove("active");
        }}
      >
        {link.icon && (
          <span className={isMobile ? "" : "text-lg"}>{link.icon}</span>
        )}
        {link.label}
        {!isMobile && <span className="underline-animate" />}
      </button>
    </>
  );
});

NavLinkButton.displayName = "NavLinkButton";

// Memoized Icon Button
const IconButton = memo<{
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  label: string;
  badge?: number;
}>(({ icon, onClick, href, label, badge }) => {
  const classes =
    "text-white hover:text-[#FDA481] transition-all duration-300 transform hover:scale-110 hover:rotate-6 relative group";

  const content = (
    <>
      <span className="transition-transform duration-300  inline-block">
        {icon}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#B4182D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse hover:animate-bounce">
          {badge}
        </span>
      )}
      <span
        className="
    absolute inset-0 rounded-full
    bg-[#FDA481]
    blur-2xl
    opacity-0
    scale-75
    transition-all duration-700 ease-out
    glow
  "
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} aria-label={label}>
      {content}
    </button>
  );
});

IconButton.displayName = "IconButton";

// Main Header Component
const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout] = useLogoutMutation();

  // Check auth status on mount
  useEffect(() => {
    const access = localStorage.getItem("access");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!access);
  }, []);

  // Memoized scroll function
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setIsLoggedIn(false);
      setMobileMenuOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [logout, router]);

  // Memoized menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Memoize cart count (replace with actual Redux selector)
  const cartCount = useMemo(() => 3, []);

  return (
    <>
      <header className="bg-linear-to-r from-[#181A2F] via-[#242E49] to-[#181A2F] shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-5 lg:py-6">
            {/* Logo Section */}
            <div className="shrink-0">
              <Link
                href="/"
                className="font-serif text-3xl lg:text-4xl font-bold text-white hover:text-[#FDA481] transition-colors duration-300 cursor-pointer transform inline-block"
              >
                Novera
              </Link>
            </div>

            {/* Desktop Navigation Links - All Together */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <NavLinkButton
                  key={link.sectionId}
                  link={link}
                  onClick={scrollToSection}
                />
              ))}
            </nav>

            {/* Icons & Login Section */}
            <div className="flex items-center gap-5 lg:gap-6">
              {/* Search */}
              <IconButton
                icon={<Search size={22} strokeWidth={2} />}
                onClick={toggleSearch}
                label="Search"
              />

              {/* Shopping Bag with Badge */}
              <IconButton
                icon={<ShoppingBag size={22} strokeWidth={2} />}
                href="/cart"
                label="Shopping Cart"
                badge={cartCount}
              />

              {/* Wishlist */}
              <IconButton
                icon={<Heart size={22} strokeWidth={2} />}
                href="/wishlist"
                label="Wishlist"
              />

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 hidden lg:block" />

              {/* Desktop Login/Logout Button */}
              {isLoggedIn ? (
                <motion.button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  whileHover={{
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href="/login"
                    className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Login
                  </Link>
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white hover:text-[#FDA481] transition-all duration-300 p-1 transform"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-[#242E49]/98 backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLinkButton
                key={link.sectionId}
                link={link}
                onClick={scrollToSection}
                isMobile
              />
            ))}

            {/* Mobile Login/Logout Button */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 text-center mt-4 shadow-xl hover:scale-105 transform"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 text-center mt-4 shadow-xl hover:scale-105 transform"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Search Modal */}
      <SearchSeaction isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};

export default memo(Header);
