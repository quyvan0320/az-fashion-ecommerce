import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";
import prisma from "../config/prisma";

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
      const days = Number(req.query.days) || 30;
      const data = await adminService.getRevenueAnalytics(days);
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 10;
      const data = await adminService.getTopProducts(limit);
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getLowStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = Number(req.query.threshold) || 10;
      const data = await adminService.getLowStockProducts(threshold);
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getUserStats();
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await adminService.getAllUsers(req.query);
      res.status(201).json({
        success: true,
        data: results.users,
        pagination: results.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const data = await adminService.updateUserRole(id, role);

      res.status(201).json({
        success: true,
        message: "Vai trò được cập nhật thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);

      res.status(201).json({
        success: true,
        message: "Người dùng đã được xóa thành công",
      });
    } catch (error) {
      next(error);
    }
  },
};
