export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number;
  images: string[];
  stock: number;
  isActive?: boolean;
  category?: { id: string; name: string; slug: string };
}

export interface CartItemDetail {
  id: string;
  quantity: number;
  product: CartProduct;
  price: number;
  subtotal: number;
}

export interface CartSummary {
  total: number;
  itemCount: number;
  totalQuantity: number;
}

export interface CartResponse {
  items: CartItemDetail[];
  summary: CartSummary;
}

export interface CartFullSummary {
  items: CartItemDetail[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
}
