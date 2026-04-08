export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  _count?: { reviews: number; variants: number };
  averageRating?: number;
  reviewCount?: number;
  variantCount?: number;

  variants?: Variant[];
  reviews?: any;
}

export interface Variant {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  price: number | null;
  sku: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    slug?: string;
    price: string;
    images?: string[];
  };
}

export interface ProductVariantsResponse {
  product: { id: string; name: string; sku: string };
  variants: Variant[];
  totalVariants: number;
  totalStock: number;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: number;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  isActive?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CreateVariantData {
  size?: string;
  color?: string;
  price?: number;
  stock?: number;
}

export interface UpdateVariantData extends Partial<CreateVariantData> {}
