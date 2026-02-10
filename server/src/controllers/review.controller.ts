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
};
