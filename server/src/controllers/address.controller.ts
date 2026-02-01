import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { addressService } from "../services/address.service";

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
};
