export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  variant?: {
    id: string;
    color: string;
    size: string;
    stock: number;
    price: number;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface OrderAddress {
  id: string;
  userId: string;
  street: string;
  state: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  total: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  paymentMethod: string | null;
  paymentStatus: string | null;
  trackingNumber: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    phone: string;
  };
  items: OrderItem[];
  address: OrderAddress;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OrderListResponse {
  success: boolean;
  data: OrderDetail[];
  pagination: OrderPagination;
}

export interface OrderStats {
  totalOrders: number;
  orderByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
  };
  totalRevenue: number;
  recentOrders: number;
}

export interface GetOrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  searchType?: string;
}

export interface CreateOrderData {
  addressId: string;
  paymentMethod: string;
  notes?: string;
}
