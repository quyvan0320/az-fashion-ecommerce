import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { cartService } from "../services/cart.service";

export const cartController = {
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
};
