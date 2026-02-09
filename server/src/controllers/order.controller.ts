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

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const order = await orderService.getOrderById(userId, id);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
  async getOrderByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { orderNumber } = req.params;
      const order = await orderService.getOrderByNumber(userId, orderNumber);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};
