import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middleware/errorHandler";
import { orderService } from "../services/order.service";

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(". "),
          400,
        );
      }

      const userId = req.user!.userId;
      const result = await orderService.create(userId, req.body);

      res.status(201).json({
        success: true,
        message: "Đơn hàng đã tạo thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await orderService.getMyOrders(userId, req.query);

      res.status(201).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
};
