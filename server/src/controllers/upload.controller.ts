import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { uploadService } from "../services/upload.service";

export const uploadController = {
  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Không có tệp nào được tải lên", 400);
      }

      const result = await uploadService.uploadSingle(req.file);
      res.json({
        success: true,
        message: "Hình ảnh được tải lên thành công",
        data: result,
      });
    } catch (error) {}
  },
};
