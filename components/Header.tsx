"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-navy shadow-xl sticky top-0 z-50 border-b border-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-40">
        <div className="flex items-center justify-between py-4 lg:py-5">
          {/* Logo Section */}
          <div className="shrink-0">
            <Link href="/">
              <Image
                src={"/logo.png"}
                alt="Novera Logo"
                width={140}
                height={50}
                className="cursor-pointer w-32 sm:w-36 lg:w-40 h-auto hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            <Link
              href="/"
              className="text-white text-sm xl:text-base font-semibold uppercase tracking-wider hover:text-peach transition-all duration-300 relative group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-peach group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/shop"
              className="text-white text-sm xl:text-base font-semibold uppercase tracking-wider hover:text-peach transition-all duration-300 relative group py-2"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-peach group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/blog"
              className="text-white text-sm xl:text-base font-semibold uppercase tracking-wider hover:text-peach transition-all duration-300 relative group py-2"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-peach group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/hot-deal"
              className="text-crimson text-sm xl:text-base font-bold uppercase tracking-wider hover:text-peach transition-all duration-300 relative group py-2 flex items-center gap-1"
            >
              <span className="text-lg">🔥</span> Hot Deal
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-peach group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Icons & Login Section */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Search */}
            <button
              className="text-white cursor-pointer hover:text-peach transition-all duration-300 hover:scale-110 transform"
              aria-label="Search"
            >
              <Search
                size={20}
                className="sm:w-[22px] sm:h-[22px]"
                strokeWidth={2}
              />
            </button>

            {/* Shopping Bag with Badge */}
            <button
              className="relative cursor-pointer text-white hover:text-peach transition-all duration-300 hover:scale-110 transform"
              aria-label="Shopping Cart"
            >
              <ShoppingBag
                size={20}
                className="sm:w-[22px] sm:h-[22px]"
                strokeWidth={2}
              />
              <span className="absolute -top-2 -right-2 bg-crimson text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                3
              </span>
            </button>

            {/* Wishlist */}
            <button
              className="text-white cursor-pointer hover:text-peach transition-all duration-300 hover:scale-110 transform"
              aria-label="Wishlist"
            >
              <Heart
                size={20}
                className="sm:w-[22px] sm:h-[22px]"
                strokeWidth={2}
              />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-steel/40 hidden lg:block"></div>

            {/* Desktop Login Button */}
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-2 bg-peach text-navy px-6 xl:px-7 py-2.5 xl:py-3 rounded-full font-bold text-xs xl:text-sm uppercase tracking-wider hover:bg-white hover:text-navy transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-peach transition-all duration-300 p-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-slate/95 backdrop-blur-md border-t border-steel/30 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-base font-semibold uppercase tracking-wider hover:text-peach transition-colors py-3 border-b border-steel/30 hover:pl-2"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-base font-semibold uppercase tracking-wider hover:text-peach transition-colors py-3 border-b border-steel/30 hover:pl-2"
          >
            Shop
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-base font-semibold uppercase tracking-wider hover:text-peach transition-colors py-3 border-b border-steel/30 hover:pl-2"
          >
            Blog
          </Link>
          <Link
            href="/hot-deal"
            onClick={() => setMobileMenuOpen(false)}
            className="text-crimson text-base font-bold uppercase tracking-wider hover:text-peach transition-colors py-3 border-b border-steel/30 hover:pl-2 flex items-center gap-2"
          >
            <span>🔥</span> Hot Deal
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-peach text-navy px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 text-center mt-3 shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
