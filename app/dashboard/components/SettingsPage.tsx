"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Bell, CreditCard, Palette, ChevronRight } from "lucide-react";
import { SettingsSectionType } from "@/type/type";

const settingsSections: SettingsSectionType[] = [
  {
    title: "Profile Settings",
    icon: User,
    items: ["Edit Profile", "Change Password", "Privacy Settings"],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: ["Email Notifications", "Push Notifications", "SMS Alerts"],
  },
  {
    title: "Payment Methods",
    icon: CreditCard,
    items: ["Add Payment Method", "Manage Cards", "Billing History"],
  },
  {
    title: "Appearance",
    icon: Palette,
    items: ["Theme", "Language", "Display Settings"],
  },
];

export const SettingsPage = () => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Settings</h1>
        <p className="text-gray-400 text-base">
          Customize your dashboard preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center shadow-2xl">
                <section.icon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
            </div>

            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/5"
                >
                  <span className="font-semibold text-white">{item}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};
