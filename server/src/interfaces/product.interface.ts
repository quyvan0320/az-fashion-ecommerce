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
