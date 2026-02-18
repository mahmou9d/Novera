import { LucideIcon } from "lucide-react";
import { JSX } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

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

export interface CartItem {
  id: number;
  variant: Variant;
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
  total_price: string;
}

export interface CheckoutResponse {
  order_id: number;
}
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
export interface SalesOrder {
  month: string;
  orders: number;
  sales: number;
}

// Response Types

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
export interface TProduct {
  id: number;
  name: string;
  category_name: string;
  lowest_price: string;
  thumbnail: string | null;
  average_rating: number | null;
  review_count: number;
  is_active?: boolean;
  created_at: string;
  material_composition?: string;
  description?: string;
  price: string;
  quantity: number;
  subtotal: string;
  category?: string | number;
  variants?: Variant[];
  variant?: Variant;
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
  paid?: string;
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
  product_name?: string;
  category_name: string;
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string;
  compare_at_price: string;
  is_on_sale: boolean;
  is_active: boolean;
  stock: number;
  images: string[];
}
export interface Product {
  id?: number;
  price?: string;
  quantity?: number;
  subtotal?: string;
  name?: string;
  category?: string | number;
  description?: string;
  material_composition?: string;
  variants?: Variant[];
  variant?: Variant;
  is_active?: boolean;
}
// Type للـ Cart Item
export interface CartItem {
  id: number;
  price: string;
  quantity: number;
  subtotal: string;
  variant: Variant;
}

// Type للمنتج

export interface OrderItem {
  variant_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  items: OrderItem[];
  full_name: string;
  full_address: string;
  phone_number: string;
  country: string;
}

export interface RecentOrdersDatares {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface RecentOrdersData {
  orders: Order[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface Order {
  message: string;
  status: OrderStatus;
}
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ProductsStats {
  count: number;
  total_stock: number;
}

export interface OrdersStats {
  total: number;
  pending: number;
  paid: number;
  delivered: number;
  shipped: number;
  cancelled: number;
}

export interface DashboardStats {
  sales: number;
  products: ProductsStats;
  users: number;
  orders: OrdersStats;
}

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type ReviewsResponse = Review[];

export interface SalesOrder {
  name: string;
  orders: number;
  sales: number;
}

export type SalesOrdersResponse = SalesOrder[];

export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
}

export interface LowStockResponse {
  variants: ProductVariant[];
}

export interface TopSellingProduct {
  product__name: string;
  color_name: string;
  total_sold: number;
}

export interface TopSellingResponse {
  topSelling: TopSellingProduct[];
}

export interface CreateProduct {
  name: string;
  description: string;
  material_composition: string;
  category: string;
}
export interface SubVariant {
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string;
  compare_at_price: string;
  stock: number;
  is_active?: boolean;
}
export interface CreateProductResponse {
  message: string;
  product_id: number;
  data: {
    id: string;
    name: string;
    category: string;
    description: string;
    material_composition: string;
    variants: SubVariant[];
  };
}
export interface AddVariants {
  id: number;
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string;
  compare_at_price: string;
  stock: number;
}
export interface AddImageVariants {
  message: string;
  url: string;
}

export interface Role {
  email: string;
  is_admin: boolean;
}
export interface google {
  access: string;
  refresh: string;
  is_new_user: boolean;
  user: {
    id: number;
    email: string;
    first_name: string;
  };
}

export interface CheckoutSessionResponse {
  url: string;
}
export interface LinksPayPal {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: LinksPayPal[];
}

export interface PayPalCapture {
  orderID: string;
  django_order_id: string;
}
export interface PayPalCaptureResponse {
  message: string;
  data: {
    id: string;
    status: string;
  };
}
export interface PlaceOrderResponse {
  order_id: number;
  message?: string;
}

export interface ProductsData {
  products: TProduct[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ProductsDataRes {
  results: TProduct[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface updateProduct {
  name?: string;
  category?: string;
  material_composition?: string;
  description?: string;
  is_active?: boolean;
}

export interface updateProductResponse {
  message: string;
  data: updateProduct;
}

export interface toggleWishlist {
  add: boolean;
  message: string;
}

export interface ErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  status?: string;
}

export interface NotificationState {
  message: string;
  type: "success" | "error";
}

export interface GoogleLoginData {
  access?: string;
  refresh?: string;
}

export interface FieldInputProps {
  label: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  icon: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export interface CheckoutFormData {
  full_name: string;
  full_address: string;
  order_notes?: string;
  phone_number: string;
  country: string;
}
export interface CheckoutFormProps {
  onClose: () => void;
  onSubmit: (formData: CheckoutFormData) => void;
  isSubmitting?: boolean;
  totalAmount: number;
}
export interface ProductPageProps {
  productId: string;
}
export interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
}
export type TabType = "general" | "variants";

export interface ColorOption {
  name: string;
  hex: string;
  selected: boolean;
}
export interface SizeOption {
  size: string;
  selected: boolean;
}

export interface FormErrors {
  productName?: string;
  category?: string;
  material?: string;
  description?: string;
  variants?: string;
  stock?: Record<number, string>;
  images?: Record<number, string>;
}

export interface Props {
  open: boolean;
  onClose: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}

export interface EditProductProps {
  getStatusColor: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => string;
  getStatusIcon: (
    status: OrderStatus | ProductStatus | CustomerStatus,
  ) => JSX.Element;
}

export interface EditProductModalFormErrors {
  productName?: string;
  category?: string;
  material?: string;
  description?: string;
}

export interface EditProductModalProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}
export interface EditVariantModalFormErrors {
  price?: string;
  stockSingle?: string;
  image?: string;
}

export interface EditVariantModalProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}