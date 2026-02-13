import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { variantService } from "../services/variant.service";

export const variantController = {
  async createVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(" ,"),
          400,
        );
      }
      const { productId } = req.params;

      const variant = await variantService.createVariant(productId, req.body);

      res.status(201).json({
        success: true,
        message: "Biến thể đã được tạo thành công",
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },
    async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(" ,"),
          400,
        );
      }
      const { id } = req.params;

      const variant = await variantService.updateVariant(id, req.body);

      res.status(201).json({
        success: true,
        message: "Biến thể đã cập nhật thành công",
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },

    async getProductVariants(req: Request, res: Response, next: NextFunction) {
    try {
     
      const { productId } = req.params;

      const variant = await variantService.getProductVariants(productId);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },
};
