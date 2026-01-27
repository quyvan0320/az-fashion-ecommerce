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

  //get by slug
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const product = await productService.getBySlug(slug);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  // get product by category
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const result = await productService.getByCategory(categoryId, req.query);
      res.status(201).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // update
  async update(req: Request, res: Response, next: NextFunction) {
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
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được cập nhật thành công",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được xóa thành công",
      });
    } catch (error) {
      next(error);
    }
  },

  // update stock product
  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number") {
        throw new AppError("Số lượng phải là kiểu số nguyên", 400);
      }
      const product = await productService.updateStock(id, quantity);
      res.status(201).json({
        success: true,
        message: "Kho hàng đã được cập nhật",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // toggle active
  async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await productService.toggleActive(id);
      res.status(201).json({
        success: true,
        message: `Sản phẩm ${product.isActive ? "đã được kích hoạt" : "đã vô hiêu hóa"} thành công`,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
};
