import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { productService } from "../services/product.service";

export const productController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(""),
          400,
        );
      }

      const product = await productService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được tạo thành công",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
};
