export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  brand?: string;
  categoryId: string;
  images: string[];
  isActive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  brand?: string;
  categoryId?: string;
  images?: string[];
  isActive?: boolean;
}

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isSale?: boolean | string | undefined;
  isAdmin?: boolean | string | undefined;
  isActive?: boolean;
  sortBy?: "price" | "name" | "createdAt" | "stock";
  order?: "asc" | "desc";
}
