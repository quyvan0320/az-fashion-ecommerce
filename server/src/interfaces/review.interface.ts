export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface GetReviewsQuery {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}
