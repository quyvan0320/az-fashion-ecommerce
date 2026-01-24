export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
}

export interface GetCategoriesInput {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string;
}