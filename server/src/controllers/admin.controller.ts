import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";

export const adminController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getDashboard();
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

   async getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const days = Number(req.query.days) || 30 
      const data = await adminService.getRevenueAnalytics(days);
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
