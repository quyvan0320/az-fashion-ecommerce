import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { addressService } from "../services/address.service";
import { validationResult } from "express-validator";

export const addressController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const addresses = await addressService.getAll(userId);
      res.json({ success: true, data: addresses });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(", "),
          400,
        );
      }
      const userId = req.user!.userId;

      const address = await addressService.create(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Địa chỉ được tạo thành công",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        throw new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(", "),
          400,
        );
      }
      const userId = req.user!.userId;
      const { id } = req.params;
      const address = await addressService.update(userId, id, req.body);
      res.status(201).json({
        success: true,
        message: "Địa chỉ đã được cập nhật",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const address = await addressService.getById(userId, id);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },

  async getDefault(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const address = await addressService.getDefault(userId);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },

   async setDefault(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const address = await addressService.setDefault(userId, id);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },
};
