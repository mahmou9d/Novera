"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  Truck,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

// Types
interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
  color: string;
}

interface Feature {
  icon: LucideIcon;
  text: string;
}

// Constants
const FOOTER_LINKS = {
  shop: [
    { name: "New Arrivals", href: "/shop/new" },
    { name: "Dresses", href: "/shop/dresses" },
    { name: "Tops & Blouses", href: "/shop/tops" },
    { name: "Pants & Jeans", href: "/shop/pants" },
    { name: "Accessories", href: "/shop/accessories" },
    { name: "Sale", href: "/shop/sale" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Blog", href: "/blog" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Track Order", href: "/track" },
    { name: "Gift Cards", href: "/gift-cards" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ],
} as const;

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
    color: "hover:text-pink-600",
  },
  {
    icon: Facebook,
    href: "https://facebook.com",
    label: "Facebook",
    color: "hover:text-blue-600",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
    color: "hover:text-sky-500",
  },
  {
    icon: Youtube,
    href: "https://youtube.com",
    label: "Youtube",
    color: "hover:text-red-600",
  },
];

const FEATURES: Feature[] = [
  { icon: Truck, text: "Free Shipping Over $100" },
  { icon: Shield, text: "Secure Payment" },
  { icon: CreditCard, text: "Easy Returns" },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "PayPal", "More"];

// Memoized Feature Bar Item
const FeatureItem = memo<{ feature: Feature }>(({ feature }) => (
  <div className="flex items-center gap-4 justify-center md:justify-start">
    <div className="bg-[#FDA481]/10 p-3 rounded-full">
      <feature.icon className="text-[#FDA481]" size={24} />
    </div>
    <span className="font-sans text-sm font-medium">{feature.text}</span>
  </div>
));

FeatureItem.displayName = "FeatureItem";

// Memoized Footer Link
const FooterLink = memo<{ link: FooterLink }>(({ link }) => (
  <li>
    <Link
      href={link.href}
      className="font-sans text-sm text-gray-400 hover:text-[#FDA481] transition-all duration-300 hover:translate-x-1 inline-block"
    >
      {link.name}
    </Link>
  </li>
));

FooterLink.displayName = "FooterLink";

// Memoized Footer Section
const FooterSection = memo<{ title: string; links: readonly FooterLink[] }>(
  ({ title, links }) => (
    <div>
      <h3 className="font-serif text-xl font-bold mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, idx) => (
          <FooterLink key={idx} link={link} />
        ))}
      </ul>
    </div>
  )
);

FooterSection.displayName = "FooterSection";

// Memoized Social Link
const SocialLinkButton = memo<{ social: SocialLink }>(({ social }) => (
  <a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={social.label}
    className={`bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 ${social.color}`}
  >
    <social.icon size={18} />
  </a>
));

SocialLinkButton.displayName = "SocialLinkButton";

// Memoized Brand Section
const BrandSection = memo(() => (
  <div className="lg:col-span-2">
    <Link href="/" className="inline-block mb-6">
      <div className="font-serif text-4xl font-bold text-white hover:text-[#FDA481] transition-colors duration-300">
        Novera
      </div>
    </Link>
    <p className="font-sans text-gray-400 mb-6 leading-relaxed text-sm">
      Discover timeless elegance and modern style. We curate premium fashion
      pieces that define your unique narrative.
    </p>

    {/* Contact Info */}
    <div className="space-y-3 mb-6">
      <a
        href="mailto:hello@novera.com"
        className="flex items-center gap-3 text-gray-400 hover:text-[#FDA481] transition-colors duration-300 text-sm group"
      >
        <Mail
          size={16}
          className="group-hover:scale-110 transition-transform duration-300"
        />
        <span>hello@novera.com</span>
      </a>
      <a
        href="tel:+1234567890"
        className="flex items-center gap-3 text-gray-400 hover:text-[#FDA481] transition-colors duration-300 text-sm group"
      >
        <Phone
          size={16}
          className="group-hover:scale-110 transition-transform duration-300"
        />
        <span>+1 (234) 567-890</span>
      </a>
      <div className="flex items-start gap-3 text-gray-400 text-sm">
        <MapPin size={16} className="mt-0.5 shrink-0" />
        <span>123 Fashion Ave, New York, NY 10001</span>
      </div>
    </div>

    {/* Social Links */}
    <div className="flex gap-3">
      {SOCIAL_LINKS.map((social, idx) => (
        <SocialLinkButton key={idx} social={social} />
      ))}
    </div>
  </div>
));

BrandSection.displayName = "BrandSection";

// Memoized Payment Methods
const PaymentMethodsBadge = memo(() => (
  <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
      <Shield size={14} className="text-[#FDA481]" />
      <span className="font-sans text-xs text-gray-300 font-medium">
        Secure Payment
      </span>
    </div>
    <div className="flex items-center gap-2 text-xs font-sans text-gray-400">
      {PAYMENT_METHODS.map((method, idx) => (
        <React.Fragment key={method}>
          <span className="font-semibold text-white">{method}</span>
          {idx < PAYMENT_METHODS.length - 1 && <span>•</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
));

PaymentMethodsBadge.displayName = "PaymentMethodsBadge";

// Main Footer Component
const Footer = () => {
  // Memoize current year to avoid recalculation on every render
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-linear-to-br from-[#181A2F] via-[#242E49] to-[#181A2F] text-white">
      {/* Top Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <FeatureItem key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <BrandSection />

          {/* Shop Links */}
          <FooterSection title="Shop" links={FOOTER_LINKS.shop} />

          {/* Company Links */}
          <FooterSection title="Company" links={FOOTER_LINKS.company} />

          {/* Support Links */}
          <FooterSection title="Support" links={FOOTER_LINKS.support} />

          {/* Legal Links */}
          <FooterSection title="Legal" links={FOOTER_LINKS.legal} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="font-sans text-sm text-gray-400 text-center lg:text-left">
              © {currentYear} Novera. All rights reserved. Made with{" "}
              <Heart
                size={14}
                className="inline text-[#FDA481] fill-current animate-pulse"
              />{" "}
              in New York
            </div>

            {/* Payment Methods */}
            <PaymentMethodsBadge />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
