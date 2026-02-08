import { OrderStatus, ProductStatus, CustomerStatus } from "@/type/type";
import { CheckCircle, Clock, Activity, XCircle } from "lucide-react";

export const getStatusColor = (
    status: OrderStatus | ProductStatus | CustomerStatus
): string => {
    switch (status) {
      case "paid":
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
      case "low stock":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "cancelled":
      case "out of stock":
      case "inactive":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
};


export const getStatusIcon = (
    status: OrderStatus | ProductStatus | CustomerStatus
) => {
    switch (status) {
      case "paid":
      case "active":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "pending":
      case "low stock":
        return <Clock className="w-3.5 h-3.5" />;
      case "shipped":
        return <Activity className="w-3.5 h-3.5" />;
      case "cancelled":
      case "out of stock":
      case "inactive":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
};