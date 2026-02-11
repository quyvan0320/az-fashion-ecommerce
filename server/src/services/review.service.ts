import prisma from "../config/prisma";
import {
  CreateReviewInput,
  GetReviewsQuery,
} from "../interfaces/review.interface";
import { AppError } from "../middleware/errorHandler";

export const reviewService = {
  async createReview(userId: string, data: CreateReviewInput) {
    // validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new AppError("Mức đánh giá nằm trong khoản từ 1 đến 5", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // check user already review product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
    });

    if (existingReview) {
      throw new AppError("Bạn đã đánh giá sản phẩm này", 400);
    }

    // check user purchased this product by order delivered
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId,
          status: "DELIVERED",
        },
      },
    });

    if (!hasPurchased) {
      throw new AppError("Bạn chỉ có thể đánh giá lại sản phẩm đã mua", 400);
    }

    // create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            slug: true,
          },
        },
      },
    });

    return review;
  },

  async getProductReviews(productId: string, query: GetReviewsQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { productId };

    if (query.rating) {
      where.rating = query.rating;
    }

    const [reviews, total, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where: { productId }, _avg: { rating: true } }),
    ]);

    // count by rating 1- 5 stars
    const ratingDistribution = await Promise.all(
      [5, 4, 3, 2, 1].map(async (star: number) => ({
        rating: star,
        count: await prisma.review.count({
          where: { productId, rating: star },
        }),
      })),
    );

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      summary: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: total,
        ratingDistribution,
      },
    };
  },
};
