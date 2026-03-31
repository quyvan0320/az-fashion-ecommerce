export interface Review {
  id: string;
  userId: string;
  productId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: { id: string; lastName: string; firstName: string };
  product: { id: string; name: string; slug: string; images: string[] };
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}

export interface ProductReviewResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: ReviewSummary;
}

export interface CanReviewResponse {
  canReview: boolean;
  reason?: string;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
}
