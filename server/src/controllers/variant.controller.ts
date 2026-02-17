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

      const variant = await variantService.createVariant(
        productId as string,
        req.body,
      );

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

      const variant = await variantService.updateVariant(
        id as string,
        req.body,
      );

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

      const variant = await variantService.getProductVariants(
        productId as string,
      );

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },

  async getVariantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const variant = await variantService.getVariantById(id as string);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await variantService.deleteVariant(id as string);

      res.status(201).json({
        success: true,
        message: "Biến thể đã được xóa thành công",
      });
    } catch (error) {
      next(error);
    }
  },
  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number") {
        throw new AppError("Số lượng phải là 1 số nguyên", 400);
      }
      const variant = await variantService.updateStock(id as string, quantity);

      res.status(201).json({
        success: true,
        message: "Kho hàng được câp nhật thành công",
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },

  async findVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { size, color } = req.query;
      const variant = await variantService.findVariant(
        productId as string,
        size as string,
        color as string,
      );

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },
  async getProductSizes(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const variant = await variantService.getProductSizes(productId as string);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductColors(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const variant = await variantService.getProductColors(productId as string);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  },
};
