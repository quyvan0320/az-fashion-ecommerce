import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { cartService } from "../services/cart.service";

export const cartController = {
  // add item to cart
  async addItem(req: Request, res: Response, next: NextFunction) {
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

      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }

      const { productId, quantity } = req.body;

      const cartItem = await cartService.addItem(userId, productId, quantity);
      res.status(201).json({
        success: true,
        message: "Mặt hàng đã thêm vào giỏ hàng",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  },

  // get cart from user
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }

      const cartItem = await cartService.getCart(userId);
      res.status(201).json({
        success: true,
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
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

      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }

      const { id } = req.params;

      const { quantity } = req.body;

      const cartItem = await cartService.updateQuantity(userId, id, quantity);
      res.json({
        success: true,
        message: "Giỏ hàng đã được cập nhật",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  },
  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }

      await cartService.removeItem(userId, id);
      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }

      await cartService.clearItem(userId);
      res.status(201).json({
        success: true,
        message: "Giỏ hàng đã được xóa",
      });
    } catch (error) {
      next(error);
    }
  },

  async validateCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }
      const result = await cartService.validateCart(userId);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCartSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError("Người dùng chưa đăng nhập", 401);
      }
      const results = await cartService.getCartSummary(userId);
      res.status(201).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },
};
