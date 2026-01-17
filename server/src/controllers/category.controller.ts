import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { categoryService } from "../services/category.services";

export const categoryController = {
  // create new category
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(","),
          400
        );
      }

      const category = await categoryService.create(req.body);
      res.status(201).json({
        status: true,
        message: "Danh mục đã được tạo thành công",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },
};
