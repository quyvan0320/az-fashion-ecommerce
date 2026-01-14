import e, { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.services";
import { register } from "node:module";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ status: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(201).json({ status: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.getProfile(req.user!.userId);
      res.status(201).json({ status: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
