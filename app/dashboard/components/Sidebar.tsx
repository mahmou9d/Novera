"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { MenuItemType } from "@/type/type";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const menuItems: MenuItemType[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "products", icon: Package, label: "Products" },
  { id: "customers", icon: Users, label: "Customers" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  return (
    <motion.aside
      animate={{
        width: sidebarOpen ? "280px" : "80px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[#1a1d29] border-r border-white/5 flex flex-col relative z-10"
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center shadow-xl shadow-[#fda481]/20">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">MyStore</span>
                <p className="text-xs text-gray-500 font-medium">
                  Pro Dashboard
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ x: 4 }}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group ${
              activeMenu === item.id
                ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white shadow-xl shadow-[#fda481]/25"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1 overflow-hidden"
                >
                  <span className="font-semibold text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-[#b4182d] text-white text-xs px-2.5 py-1 rounded-full font-bold ml-3 shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {/* User Profile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-white/5"
          >
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                MF
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">Mohamed Foaud</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
