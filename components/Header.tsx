"use client";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import SearchSeaction from "./SearchSeaction";
import { useLogoutMutation } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };
  const access = localStorage.getItem("access");
  const handleLogout = () => {
    logout()
      .then(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // Remove all cart items & wishlist items on logout
        // Promise.all(
        //   items.map((item) =>
        //     dispatch(RemoveCart({ product_id: item.product_id })).unwrap()
        //   )
        // );
        // Promise.all(
        //   items2.map((item) =>
        //     dispatch(WishlistRemove(item.product_id)).unwrap()
        //   )
        // );
        router.push("/");
      })
      .catch((err) => {});
  };
  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap");

        .font-serif {
          font-family: "Playfair Display", serif;
        }

        .font-sans {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <header className="bg-gradient-to-r from-[#181A2F] via-[#242E49] to-[#181A2F] shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-5 lg:py-6">
            {/* Logo Section */}
            <div className="shrink-0">
              <Link
                href={"/"}
                // onClick={() => scrollToSection("hero")}
                className="font-serif text-3xl lg:text-4xl font-bold text-white hover:text-[#FDA481] transition-colors duration-300 cursor-pointer"
              >
                Novera
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
              <button
                onClick={() => scrollToSection("hero")}
                className="font-sans text-sm font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 relative group py-2"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FDA481] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="font-sans text-sm font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 relative group py-2"
              >
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FDA481] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("featured")}
                className="font-sans text-sm font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 relative group py-2"
              >
                Featured
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FDA481] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="font-sans text-sm font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 relative group py-2"
              >
                Reviews
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FDA481] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("deals")}
                className="font-sans text-sm font-bold uppercase tracking-wider text-[#FDA481] hover:text-white transition-all duration-300 relative group py-2 flex items-center gap-2"
              >
                <span className="text-lg">🔥</span> Hot Deals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Icons & Login Section */}
            <div className="flex items-center gap-5 lg:gap-6">
              {/* Search */}
              <button
                className="text-white cursor-pointer hover:text-[#FDA481] transition-all duration-300 hover:scale-110 transform group"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={22} strokeWidth={2} />
              </button>
              <SearchSeaction
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />
              {/* Shopping Bag with Badge */}
              <Link
                href={"/cart"}
                className="relative cursor-pointer text-white hover:text-[#FDA481] transition-all duration-300 hover:scale-110 transform"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={22} strokeWidth={2} />
                <span className="absolute -top-2 -right-2 bg-[#B4182D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  3
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                href={"wishlist"}
                className="text-white cursor-pointer hover:text-[#FDA481] transition-all duration-300 hover:scale-110 transform"
                aria-label="Wishlist"
              >
                <Heart size={22} strokeWidth={2} />
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 hidden lg:block"></div>

              {/* Desktop Login Button */}
              {access ? (
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:flex items-center gap-2 bg-[#FDA481] text-[#181A2F] px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#181A2F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:text-[#FDA481] transition-all duration-300 p-1"
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
            <button
              onClick={() => scrollToSection("hero")}
              className="font-sans text-base font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 py-3 border-b border-white/10 hover:pl-3 text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="font-sans text-base font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 py-3 border-b border-white/10 hover:pl-3 text-left"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("featured")}
              className="font-sans text-base font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 py-3 border-b border-white/10 hover:pl-3 text-left"
            >
              Featured
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="font-sans text-base font-semibold uppercase tracking-wider text-white hover:text-[#FDA481] transition-all duration-300 py-3 border-b border-white/10 hover:pl-3 text-left"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("deals")}
              className="font-sans text-base font-bold uppercase tracking-wider text-[#FDA481] hover:text-white transition-all duration-300 py-3 border-b border-white/10 hover:pl-3 flex items-center gap-2"
            >
              <span>🔥</span> Hot Deals
            </button>
            {access ? (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 text-center mt-4 shadow-xl"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#FDA481] text-[#181A2F] px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 text-center mt-4 shadow-xl"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
