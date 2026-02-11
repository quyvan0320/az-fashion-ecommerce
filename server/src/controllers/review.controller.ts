import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { reviewService } from "../services/review.service";

export const reviewController = {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(","),
          400,
        );
      }

      const userId = req.user!.userId;
      const { productId } = req.params;
      const review = await reviewService.createReview(userId, {
        productId,
        ...req.body,
      });
      res.status(201).json({
        success: true,
        message: "Đánh giá sản phẩm thành công",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const result = await reviewService.getProductReviews(
        productId,
        req.query,
      );
      res.status(201).json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
        summary: result.summary,
      });
    } catch (error) {
      next(error);
    }
  },

  async canReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      const result = await reviewService.canReview(userId, productId);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
