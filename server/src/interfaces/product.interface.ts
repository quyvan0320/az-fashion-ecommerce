export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  categoryId: string;
  images: string[];
  isActive?: boolean;
}

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: "price" | "name" | "createdAt" | "stock";
  order?: "asc" | "desc";
}
