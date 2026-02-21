"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardPage } from "./components/DashboardPage";
import { OrdersPage } from "./components/OrdersPage";
import { EditProduct } from "./components/EditProduct";
import { CustomersPage } from "./components/CustomersPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { getStatusColor, getStatusIcon } from "@/utils/helpers";
import { StatType } from "@/type/type";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useGetStatusCount } from "@/hooks/useDashboard";
import { ProtectedRoute } from "@/utils/Protectedroute";

const CompleteDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
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
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case "customers":
        return <CustomersPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <DashboardPage stats={stats} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1117] flex relative overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <main className="flex-1 flex flex-col relative z-10 bg-[#0f1117] w-full">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 p-4 md:p-8 overflow-auto">
            <div key={activeMenu}>{renderContent()}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CompleteDashboard;
