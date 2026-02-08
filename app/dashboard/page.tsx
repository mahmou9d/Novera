"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardPage } from "./components/DashboardPage";
import { OrdersPage } from "./components/OrdersPage";
import { EditProduct } from "./components/EditProduct";
import { CustomersPage } from "./components/CustomersPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";
import {  productsData, customersData } from "./data/mockData";
import { getStatusColor, getStatusIcon } from "@/utils/helpers";
import { StatType } from "@/type/type";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useGetStatusCount } from "@/hooks/useDashboard";

const CompleteDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const { data } = useGetStatusCount();
  const stats: StatType[] = [
    {
      id: 1,
      title: "Total Revenue",
      value: `$${data?.sales || 0}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-[#fda481] to-[#b4182d]",
    },
    {
      id: 2,
      title: "Total Orders",
      value: `${data?.orders.total || 0}`,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-[#b4182d] to-[#54162b]",
    },
    {
      id: 3,
      title: "New Customers",
      value: `${data?.users || 0}`,
      change: "+15.3%",
      trend: "up",
      icon: Users,
      gradient: "from-[#37415c] to-[#242e49]",
    },
    {
      id: 4,
      title: "Active Products",
      value: `${data?.products?.total_stock || 0}`,
      change: "-2.4%",
      trend: "down",
      icon: Package,
      gradient: "from-[#fda481] to-[#b4182d]",
    },
  ];
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardPage stats={stats} />;
      case "orders":
        return (
          <OrdersPage
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case "products":
        return (
          <EditProduct
            products={productsData}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case "customers":
        return (
          <CustomersPage
            customers={customersData}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex relative overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-[#0f1117]">
        <Header />

        <div className="flex-1 p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CompleteDashboard;
