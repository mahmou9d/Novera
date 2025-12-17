"use client";
import React from "react";
import Image from "next/image";
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
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
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
  };

  const socialLinks = [
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

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "Amex", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "Apple Pay", icon: "🍎" },
    { name: "Google Pay", icon: "📱" },
  ];

  const features = [
    { icon: Truck, text: "Free Shipping Over $100" },
    { icon: Shield, text: "Secure Payment" },
    { icon: CreditCard, text: "Easy Returns" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#181A2F] via-[#242E49] to-[#181A2F] text-white">


      {/* Top Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 justify-center md:justify-start"
              >
                <div className="bg-[#FDA481]/10 p-3 rounded-full">
                  <feature.icon className="text-[#FDA481]" size={24} />
                </div>
                <span className="font-sans text-sm font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="font-serif text-4xl font-bold text-white">
                Novera
              </div>
            </Link>
            <p className="font-sans text-gray-400 mb-6 leading-relaxed text-sm">
              Discover timeless elegance and modern style. We curate premium
              fashion pieces that define your unique narrative.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:hello@novera.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FDA481] transition-colors text-sm group"
              >
                <Mail
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>hello@novera.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FDA481] transition-colors text-sm group"
              >
                <Phone
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-gray-400 hover:text-[#FDA481] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-gray-400 hover:text-[#FDA481] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-gray-400 hover:text-[#FDA481] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-gray-400 hover:text-[#FDA481] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="font-sans text-sm text-gray-400 text-center lg:text-left">
              © {currentYear} Novera. All rights reserved. Made with{" "}
              <Heart size={14} className="inline text-[#FDA481] fill-current" />{" "}
              in New York
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-gray-500 uppercase tracking-wider mr-2">
                We Accept:
              </span>
              {paymentMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  title={method.name}
                >
                  <span className="text-xl">{method.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
