export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    yearRevenue: number;
  };
  orders: {
    pending: number;
    processing: number;
    total: number;
  };
  alerts: {
    lowStockProduct: number;
  };
  recentOrders: RecenOrder[];
}

export interface RecenOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  email: string;
  customer: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
}
export interface TopProductItem {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  totalSold: number;
  orderCount: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  images: string[];
  category: { name: string };
}

export interface AdminUser {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
  _count: { orders: number; reviews: number };
}

export interface UserStats {
  total: number;
  customers: number;
  admins: number;
  recentUsers: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
  }[];
  growthData: {
    month: string;
    count: number;
  }[];
}

export interface getUserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}
