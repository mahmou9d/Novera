import { LucideIcon } from "lucide-react";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  password1: string;
  password2: string;
}

export interface SignupResponse {
  message: string;
}
export interface Variant {
  id: number;
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string; // تأتي من الـ API كـ string "30.00"
  compare_at_price: string;
  images: string[];
  is_on_sale: boolean;
  stock: number;
}

export interface CartItem {
  id: number; // معرف الـ item في السلة
  variant: Variant; // تفاصيل المنتج
  quantity: number;
  price: string;
  subtotal: string;
  name?: string;
  category_name?: string;
}

export interface CartResponse {
  id: number;
  created_at: string;
  items: CartItem[];
  total_price: string; // السعر الكلي للسلة
}

export interface CheckoutResponse {
  order_id: number;
}

// export interface AddToCartRequest {
//   product_id: number;
//   quantity: number;
// }

export interface EditCartRequest {
  product_id: number;
  quantity: number;
}

export interface RemoveCartRequest {
  product_id: number;
}
export interface CheckoutSessionRequest {
  order_id: number;
}

export interface CheckoutSessionResponse {
  // checkout_url: any;
  url?: string;
  session_id?: string;
  // عدّل حسب الـ response الفعلي من الـ API
}
export interface TReview {
  product_id: number;
  comment: string;
  rating: number;
  customer_name: string;
}

export interface AddReviewRequest {
  product_id: number;
  comment: string;
  rating: number;
}

type OrderItem = {
  id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: number;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  ;

export type OrderRecent = {
  id: number;
  customer: string;
  full_name: string;
  email: string;
  phone_number: string;
  full_address: string;
  country: string;
  status: OrderStatus;
  order_notes: string;
  total_price: number;
  created: string; // يمكن تحويلها لاحقًا إلى Date إذا أحببت
  items: OrderItem[];
};
export interface RecentOrdersData {
  orders: OrderRecent[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface RecentOrdersDatares {
  results: OrderRecent[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface SalesOrder {
  month: string;
  orders: number;
  sales: number;
}

export interface TopSellingProduct {
  id: number;
  name: string;
  sales: number;
}

// Response Types
export interface OrderRecentResponse {
  orders: OrderRecent[];
}

export interface OrdersCountResponse {
  orders: string;
  shipped: string;
  pending: string;
  delivered: string;
  cancelled?: string;
}

export interface UsersCountResponse {
  users: number;
}

export interface TotalSalesResponse {
  total_sales: number;
}

export interface TopSellingResponse {
  topSelling: TopSellingProduct[];
}
export interface TProduct {
  id: number;
  name: string;
  category_name: string;
  lowest_price: string;
  thumbnail: string | null;
  average_rating: number | null;
  review_count: number;
  created_at: string;
}

export interface TProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TProduct[];
}

export interface WishlistResponse {
  products: TProduct[];
}
export interface TProductInput {
  name: string;
  description: string;
  original_price: string;
  discount: number;
  stock: number;
  categories: string[];
  tags: string[];
  img: File[];
}

export interface ProductsCountResponse {
  total_products: number;
}
export interface Counted {
  orders: string;
  shipped: string;
  pending: string;
  delivered: string;
  cancelled?: string;
  paid?: string
}


export type MenuItemType = {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
};

export type StatType = {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
};

export type OrderStatus2 = "completed" | "pending" | "processing" | "cancelled";

export type OrderType = {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  amount: string;
  status: OrderStatus2;
  date: string;
};

export type ProductStatus = "active" | "low stock" | "out of stock";

export type ProductType = {
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

export type CustomerStatus = "active" | "inactive";

export type CustomerType = {
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

export type SalesDataType = {
  month: string;
  sales: number;
};

export type TopProductType = {
  id: number;
  name: string;
  sales: number;
  revenue: string;
  trend: string;
  rating: number;
};

export type ActivityType = {
  id: number;
  text: string;
  time: string;
  icon: LucideIcon;
};

export type AnalyticsDataType = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type SettingsSectionType = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

// ////////////////////////

export interface AddToCartRequest {
  variant_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateQuantityRequest {
  itemId: number;
  quantity: number;
}

// types/product.ts

// Type واحد للـ Variant
export interface Variant {
  id: number;
  product_name: string;
  category_name: string;
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string;
  compare_at_price: string;
  is_on_sale: boolean;
  stock: number;
  images: string[];
}

// Type للـ Cart Item
export interface CartItem {
  id: number;
  price: string;
  quantity: number;
  subtotal: string;
  variant: Variant; // استخدم نفس الـ Type
}

// Type للمنتج
export interface Product {
  id: number;
  price: string;
  quantity: number;
  subtotal: string;
  name?: string;
  category?: string;
  description?: string;
  material_composition?: string;
  variants: Variant[]; // استخدم نفس الـ Type
}

export interface ReviewsResponse {
  reviews: TReview[];
}