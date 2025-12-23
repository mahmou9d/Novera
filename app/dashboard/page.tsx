"use client";
import React, { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Menu,
  X,
  Bell,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Star,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  PieChart,
  User,
  CreditCard,
  Palette,
  Shield,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Globe,
  MessageSquare,
  RefreshCw,
  TrendingDown,
  LucideIcon,
} from "lucide-react";

// Types
type MenuItemType = {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
};

type StatType = {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
};

type OrderStatus = "completed" | "pending" | "processing" | "cancelled";

type OrderType = {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  amount: string;
  status: OrderStatus;
  date: string;
};

type ProductStatus = "active" | "low stock" | "out of stock";

type ProductType = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  sold: number;
  rating: number;
  status: ProductStatus;
  image: string;
};

type CustomerStatus = "active" | "inactive";

type CustomerType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: string;
  joinDate: string;
  status: CustomerStatus;
  avatar: string;
};

type SalesDataType = {
  month: string;
  sales: number;
};

type TopProductType = {
  id: number;
  name: string;
  sales: number;
  revenue: string;
  trend: string;
  rating: number;
};

type ActivityType = {
  id: number;
  text: string;
  time: string;
  icon: LucideIcon;
};

type AnalyticsDataType = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

type SettingsSectionType = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

const CompleteDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  const menuItems: MenuItemType[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders", icon: ShoppingCart, label: "Orders", badge: "12" },
    { id: "products", icon: Package, label: "Products" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const stats: StatType[] = [
    {
      id: 1,
      title: "Total Revenue",
      value: "$245,680",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-[#fda481] to-[#b4182d]",
    },
    {
      id: 2,
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-[#b4182d] to-[#54162b]",
    },
    {
      id: 3,
      title: "New Customers",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      gradient: "from-[#37415c] to-[#242e49]",
    },
    {
      id: 4,
      title: "Active Products",
      value: "456",
      change: "-2.4%",
      trend: "down",
      icon: Package,
      gradient: "from-[#fda481] to-[#b4182d]",
    },
  ];

  const ordersData: OrderType[] = [
    {
      id: "#ORD-001",
      customer: "John Smith",
      email: "john@example.com",
      product: "Wireless Headphones",
      quantity: 2,
      amount: "$259.98",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Emma Wilson",
      email: "emma@example.com",
      product: "Smart Watch Pro",
      quantity: 1,
      amount: "$349.99",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "#ORD-003",
      customer: "Michael Brown",
      email: "michael@example.com",
      product: "Laptop Stand",
      quantity: 3,
      amount: "$149.97",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Davis",
      email: "sarah@example.com",
      product: "USB-C Hub",
      quantity: 1,
      amount: "$79.99",
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: "#ORD-005",
      customer: "David Lee",
      email: "david@example.com",
      product: "Mechanical Keyboard",
      quantity: 1,
      amount: "$159.99",
      status: "cancelled",
      date: "2024-01-13",
    },
  ];

  const productsData: ProductType[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Audio",
      price: "$129.99",
      stock: 45,
      sold: 245,
      rating: 4.8,
      status: "active",
      image: "🎧",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      category: "Wearables",
      price: "$349.99",
      stock: 23,
      sold: 189,
      rating: 4.9,
      status: "active",
      image: "⌚",
    },
    {
      id: 3,
      name: "Laptop Stand",
      category: "Accessories",
      price: "$49.99",
      stock: 67,
      sold: 156,
      rating: 4.6,
      status: "active",
      image: "💻",
    },
    {
      id: 4,
      name: "USB-C Hub",
      category: "Accessories",
      price: "$79.99",
      stock: 8,
      sold: 134,
      rating: 4.7,
      status: "low stock",
      image: "🔌",
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      category: "Peripherals",
      price: "$159.99",
      stock: 34,
      sold: 98,
      rating: 4.8,
      status: "active",
      image: "⌨️",
    },
    {
      id: 6,
      name: "Wireless Mouse",
      category: "Peripherals",
      price: "$29.99",
      stock: 0,
      sold: 267,
      rating: 4.5,
      status: "out of stock",
      image: "🖱️",
    },
  ];

  const customersData: CustomerType[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      location: "New York, USA",
      orders: 12,
      totalSpent: "$2,456.00",
      joinDate: "Jan 2023",
      status: "active",
      avatar: "JS",
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "+1 234 567 8901",
      location: "Los Angeles, USA",
      orders: 8,
      totalSpent: "$1,892.00",
      joinDate: "Mar 2023",
      status: "active",
      avatar: "EW",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 234 567 8902",
      location: "Chicago, USA",
      orders: 15,
      totalSpent: "$3,245.00",
      joinDate: "Feb 2023",
      status: "active",
      avatar: "MB",
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah@example.com",
      phone: "+1 234 567 8903",
      location: "Houston, USA",
      orders: 5,
      totalSpent: "$892.00",
      joinDate: "Jun 2023",
      status: "active",
      avatar: "SD",
    },
    {
      id: 5,
      name: "David Lee",
      email: "david@example.com",
      phone: "+1 234 567 8904",
      location: "Miami, USA",
      orders: 3,
      totalSpent: "$456.00",
      joinDate: "Aug 2023",
      status: "inactive",
      avatar: "DL",
    },
  ];

  const getStatusColor = (
    status: OrderStatus | ProductStatus | CustomerStatus
  ): string => {
    switch (status) {
      case "completed":
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
      case "low stock":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "cancelled":
      case "out of stock":
      case "inactive":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (
    status: OrderStatus | ProductStatus | CustomerStatus
  ): JSX.Element => {
    switch (status) {
      case "completed":
      case "active":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "pending":
      case "low stock":
        return <Clock className="w-3.5 h-3.5" />;
      case "processing":
        return <Activity className="w-3.5 h-3.5" />;
      case "cancelled":
      case "out of stock":
      case "inactive":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const renderContent = (): JSX.Element => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardPage stats={stats} />;
      case "orders":
        return (
          <OrdersPage
            orders={ordersData}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case "products":
        return (
          <ProductsPage
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
      {/* Sidebar */}
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
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 bg-[#0f1117]">
        {/* Header */}
        <header className="h-20 bg-[#1a1d29] border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#0f1117] border border-white/5 rounded-xl focus:outline-none focus:border-[#fda481] focus:ring-2 focus:ring-[#fda481]/20 transition-all text-white placeholder:text-gray-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#b4182d] rounded-full ring-2 ring-[#1a1d29]" />
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
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

// Dashboard Page Component
interface DashboardPageProps {
  stats: StatType[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ stats }) => {
  const salesData: SalesDataType[] = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 55000 },
    { month: "Jun", sales: 67000 },
  ];

  const topProducts: TopProductType[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      sales: 245,
      revenue: "$31,875",
      trend: "+12%",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      sales: 189,
      revenue: "$66,150",
      trend: "+23%",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Laptop Stand",
      sales: 156,
      revenue: "$7,794",
      trend: "+8%",
      rating: 4.6,
    },
    {
      id: 4,
      name: "USB-C Hub",
      sales: 134,
      revenue: "$10,713",
      trend: "+15%",
      rating: 4.7,
    },
  ];

  const recentActivities: ActivityType[] = [
    {
      id: 1,
      text: "New order from John Smith",
      time: "2 min ago",
      icon: ShoppingCart,
    },
    { id: 2, text: "New customer registered", time: "15 min ago", icon: Users },
    {
      id: 3,
      text: "Low stock alert: USB-C Hub",
      time: "1 hour ago",
      icon: Package,
    },
    {
      id: 4,
      text: "Payment received: $349.99",
      time: "2 hours ago",
      icon: DollarSign,
    },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 text-base">
          Welcome back! Here&apos;s what&apos;s happening with your store today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div
                className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
                  stat.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Revenue Analytics
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                Monthly performance overview
              </p>
            </div>
            <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="h-80 flex items-end justify-between gap-4">
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map((d) => d.sales));
              const height = (data.sales / maxSales) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-3 group"
                >
                  <div className="relative w-full">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: 0.3 + index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="w-full bg-gradient-to-t from-[#b4182d] via-[#fda481] to-[#fda481] rounded-t-xl transition-all origin-bottom group-hover:shadow-2xl group-hover:shadow-[#fda481]/30 cursor-pointer"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f1117] text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-white/10">
                        ${(data.sales / 1000).toFixed(0)}K
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-sm text-gray-400 font-bold">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-6">Top Products</h2>
          <div className="space-y-5">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fda481]/30 to-[#b4182d]/30 flex items-center justify-center border border-white/10">
                  <Package className="w-6 h-6 text-[#fda481]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {product.sales} sales
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-400 font-bold">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-base mb-1">
                    {product.revenue}
                  </p>
                  <span className="text-xs text-emerald-400 font-bold">
                    {product.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <activity.icon className="w-6 h-6 text-[#fda481]" />
              </div>
              <div className="flex-1">
                <p className="text-base text-white font-semibold mb-1">
                  {activity.text}
                </p>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

// Orders Page Component
interface OrdersPageProps {
  orders: OrderType[];
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => JSX.Element;
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Orders Management
        </h1>
        <p className="text-gray-400 text-base">
          Manage and track all customer orders
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Order
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1117] border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-[#fda481] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-bold text-white">{order.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-white mb-0.5">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-white font-medium">
                      {order.product}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-white">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-[#fda481] text-base">
                      {order.amount}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-400 font-medium">
                    {order.date}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 rounded-xl hover:bg-white/5 text-[#fda481] transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Products Page Component
interface ProductsPageProps {
  products: ProductType[];
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => JSX.Element;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Products Catalog</h1>
        <p className="text-gray-400 text-base">Manage your product inventory</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center text-4xl border border-white/10">
                {product.image}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                  product.status
                )}`}
              >
                {getStatusIcon(product.status)}
                {product.status}
              </span>
            </div>

            <h3 className="font-bold text-white text-lg mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400 mb-5 font-medium">
              {product.category}
            </p>

            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl font-bold text-[#fda481]">
                {product.price}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white text-base">
                  {product.rating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Stock</p>
                <p className="font-bold text-white text-lg">{product.stock}</p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Sold</p>
                <p className="font-bold text-white text-lg">{product.sold}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#fda481]/20 hover:shadow-2xl hover:shadow-[#fda481]/30 transition-all">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

// Customers Page Component
interface CustomersPageProps {
  customers: CustomerType[];
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus
  ) => JSX.Element;
}

const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Customers Directory
        </h1>
        <p className="text-gray-400 text-base">Manage customer relationships</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#fda481]/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
        <button className="px-7 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold text-lg shadow-xl">
                {customer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg mb-1">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-400 truncate font-medium">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{customer.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Orders</p>
                <p className="font-bold text-white text-lg">
                  {customer.orders}
                </p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">Spent</p>
                <p className="font-bold text-[#fda481] text-lg">
                  {customer.totalSpent}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                  customer.status
                )}`}
              >
                {getStatusIcon(customer.status)}
                {customer.status}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {customer.joinDate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

// Analytics Page Component
const AnalyticsPage: React.FC = () => {
  const analyticsData: AnalyticsDataType[] = [
    { label: "Page Views", value: "45,890", change: "+18.2%", trend: "up" },
    { label: "Conversion", value: "3.24%", change: "+0.8%", trend: "up" },
    { label: "Avg Order", value: "$156.90", change: "+5.4%", trend: "up" },
    { label: "Bounce Rate", value: "42.8%", change: "-3.2%", trend: "down" },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 text-base">
          Performance insights and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fda481]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center shadow-2xl">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                  item.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {item.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {item.label}
            </p>
            <p className="text-3xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Traffic Sources</h2>
          <div className="space-y-5">
            {["Direct", "Organic Search", "Social Media", "Referral"].map(
              (source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-white">
                      {source}
                    </span>
                    <span className="text-base font-bold text-[#fda481]">
                      {45 - index * 10}%
                    </span>
                  </div>
                  <div className="h-3 bg-[#0f1117] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${45 - index * 10}%` }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#fda481] to-[#b4182d] rounded-full"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Top Regions</h2>
          <div className="space-y-4">
            {["United States", "United Kingdom", "Canada", "Australia"].map(
              (region, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center text-white font-bold shadow-xl">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white">{region}</span>
                  </div>
                  <span className="font-bold text-[#fda481] text-base">
                    {32 - index * 5}%
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Settings Page Component
const SettingsPage: React.FC = () => {
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

export default CompleteDashboard;
