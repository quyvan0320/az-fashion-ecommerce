import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { categoryService } from "../services/category.service";
import { stat } from "node:fs";

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
          400,
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

  // get all categories with pagination and search
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getAll(req.query);
      res.json({
        status: true,
        data: result.categories,
        panigation: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // get category by id
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.getById(id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  // get category by slug
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const category = await categoryService.getBySlug(slug);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  // update category
  async update(req: Request, res: Response, next: NextFunction) {
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
      const { id } = req.params;
      const category = await categoryService.update(id, req.body);
      res.json({
        success: true,
        messge: "Cập nhật danh mục thành công",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  // delete category
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoryService.delete(id);
      res.json({ success: true, message: "Xóa danh mục thành công" });
    } catch (error) {
      next(error);
    }
  },

  // get stats
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await categoryService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },
};
