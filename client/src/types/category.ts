export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
  products?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    salePrice: number;
    stock: number;
  }[];
}

export interface CategoryStats {
  totalCategories: number;
  categoriesWithProducts: number;
  emptyCategories: number;
  topCategories: { id: string; name: string; productCount: number }[];
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}