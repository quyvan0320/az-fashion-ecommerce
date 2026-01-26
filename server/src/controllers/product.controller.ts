import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { productService } from "../services/product.service";

export const productController = {
  // create
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

  // get all by panigation and search filter
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(req.query);
      res.status(201).json({
        success: true,
        data: result,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  //get by id
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },
};
